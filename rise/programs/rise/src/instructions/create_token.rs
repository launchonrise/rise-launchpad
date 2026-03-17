use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use crate::state::{PlatformConfig, TokenPool};
use crate::errors::RiseError;
use crate::bonding_curve::BondingCurve;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreateTokenParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}

#[derive(Accounts)]
#[instruction(params: CreateTokenParams)]
pub struct CreateToken<'info> {
    // The platform config — reads deploy fee and checks creation not paused
    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    // The token pool account — stores all bonding curve state
    #[account(
        init,
        payer = creator,
        space = TokenPool::LEN,
        seeds = [b"token_pool", mint.key().as_ref()],
        bump
    )]
    pub token_pool: Account<'info, TokenPool>,

    // The SPL token mint — one per token launch
    #[account(
        init,
        payer = creator,
        mint::decimals = 6,
        mint::authority = token_pool,
    )]
    pub mint: Account<'info, Mint>,

    // Token pool's own token account — holds the bonding curve supply
    #[account(
        init,
        payer = creator,
        token::mint = mint,
        token::authority = token_pool,
    )]
    pub pool_token_account: Account<'info, TokenAccount>,

    // Treasury receives the deploy fee
    /// CHECK: validated against platform_config.treasury
    #[account(
        mut,
        constraint = treasury.key() == platform_config.treasury
    )]
    pub treasury: AccountInfo<'info>,

    // Creator pays deploy fee + account rent
    #[account(mut)]
    pub creator: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<CreateToken>, _params: CreateTokenParams) -> Result<()> {
    let config = &ctx.accounts.platform_config;

    // Check creation is not paused
    require!(!config.creation_paused, RiseError::PoolPaused);

    // Check creator has enough SOL for deploy fee
    require!(
        ctx.accounts.creator.lamports() >= config.deploy_fee,
        RiseError::InsufficientDeployFee
    );

    // Transfer deploy fee to treasury
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.creator.to_account_info(),
                to:   ctx.accounts.treasury.to_account_info(),
            },
        ),
        config.deploy_fee,
    )?;

    // Mint full supply to the pool token account
    let total_supply = TokenPool::TOTAL_SUPPLY;
    let mint_key = ctx.accounts.mint.key();
    let seeds = &[
        b"token_pool",
        mint_key.as_ref(),
        &[ctx.bumps.token_pool],
    ];
    let signer_seeds = &[&seeds[..]];

    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint:      ctx.accounts.mint.to_account_info(),
                to:        ctx.accounts.pool_token_account.to_account_info(),
                authority: ctx.accounts.token_pool.to_account_info(),
            },
            signer_seeds,
        ),
        total_supply,
    )?;

    // Initialize the token pool
    let pool = &mut ctx.accounts.token_pool;
    let clock = Clock::get()?;

    pool.creator                = ctx.accounts.creator.key();
    pool.mint                   = ctx.accounts.mint.key();
    pool.total_supply           = total_supply;
    pool.unlocked_supply        = (total_supply as u128)
                                    .checked_mul(1500)
                                    .ok_or(RiseError::MathOverflow)?
                                    .checked_div(10000)
                                    .ok_or(RiseError::MathOverflow)? as u64;
    pool.tokens_sold            = 0;
    pool.sol_raised             = 0;
    pool.virtual_sol_reserves   = BondingCurve::INITIAL_VIRTUAL_SOL;
    pool.virtual_token_reserves = BondingCurve::INITIAL_VIRTUAL_TOKENS;
    pool.real_sol_reserves      = 0;
    pool.real_token_reserves    = total_supply;
    pool.graduated              = false;
    pool.created_at             = clock.unix_timestamp;
    pool.unlock_tranche         = 0;
    pool.paused                 = false;
    pool.bump                   = ctx.bumps.token_pool;

    msg!("RISE token created");
    msg!("Mint: {}", pool.mint);
    msg!("Creator: {}", pool.creator);
    msg!("Total supply: {}", pool.total_supply);
    msg!("Unlocked at launch: {}", pool.unlocked_supply);

    Ok(())
}