use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::{PlatformConfig, TokenPool, WalletBuyRecord};
use crate::errors::RiseError;
use crate::bonding_curve::BondingCurve;

#[derive(Accounts)]
pub struct Sell<'info> {
    #[account(
        seeds = [b"platform_config"],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(
        mut,
        seeds = [b"token_pool", token_pool.mint.as_ref()],
        bump = token_pool.bump,
    )]
    pub token_pool: Account<'info, TokenPool>,

    // Pool's token account — tokens come back here
    #[account(
        mut,
        token::mint = token_pool.mint,
        token::authority = token_pool,
    )]
    pub pool_token_account: Account<'info, TokenAccount>,

    // Seller's token account — tokens leave from here
    #[account(
        mut,
        token::mint = token_pool.mint,
        token::authority = seller,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    // Wallet record — update tokens_held on sell
    #[account(
        mut,
        seeds = [
            b"wallet_buy_record",
            token_pool.key().as_ref(),
            seller.key().as_ref()
        ],
        bump = wallet_sell_record.bump,
    )]
    pub wallet_sell_record: Account<'info, WalletBuyRecord>,

    // Treasury receives platform fee
    /// CHECK: validated against platform_config.treasury
    #[account(
        mut,
        constraint = treasury.key() == platform_config.treasury
    )]
    pub treasury: AccountInfo<'info>,

    // Creator receives creator fee
    /// CHECK: validated against token_pool.creator
    #[account(
        mut,
        constraint = creator.key() == token_pool.creator
    )]
    pub creator: AccountInfo<'info>,

    #[account(mut)]
    pub seller: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler_impl(
    ctx: Context<Sell>,
    token_amount: u64,
    min_sol_out: u64,
) -> Result<()> {
    let config = &ctx.accounts.platform_config;
    let pool   = &mut ctx.accounts.token_pool;
    let record = &mut ctx.accounts.wallet_sell_record;

    // ── SAFETY CHECKS ────────────────────────────────────────────

    // 1. Pool must not be paused
    require!(!pool.paused, RiseError::PoolPaused);

    // 2. Token must not have graduated
    require!(!pool.graduated, RiseError::AlreadyGraduated);

    // 3. Amount must be greater than zero
    require!(token_amount > 0, RiseError::ZeroAmount);

    // 4. Seller must have enough tokens
    require!(
        ctx.accounts.seller_token_account.amount >= token_amount,
        RiseError::InsufficientFunds
    );

    // 5. Wallet record must have enough tokens tracked
    require!(
        record.tokens_held >= token_amount,
        RiseError::InsufficientFunds
    );

    // ── CALCULATE SOL OUT ─────────────────────────────────────────

    let sol_out_gross = BondingCurve::get_sol_out(
        token_amount,
        pool.virtual_sol_reserves,
        pool.virtual_token_reserves,
    )?;

    // ── FEES ──────────────────────────────────────────────────────

    let total_fee_bps = config.platform_fee_bps + config.creator_fee_bps;
    let (sol_after_fee, total_fee) = BondingCurve::apply_fee(
        sol_out_gross,
        total_fee_bps,
    )?;

    // Slippage check — after fees
    require!(sol_after_fee >= min_sol_out, RiseError::SlippageExceeded);

    // Split fee between platform and creator
    let platform_fee = (total_fee as u128)
        .checked_mul(config.platform_fee_bps as u128)
        .ok_or(RiseError::MathOverflow)?
        .checked_div(total_fee_bps as u128)
        .ok_or(RiseError::MathOverflow)? as u64;

    let creator_fee = total_fee
        .checked_sub(platform_fee)
        .ok_or(RiseError::MathUnderflow)?;

    // ── TRANSFER TOKENS FROM SELLER TO POOL ──────────────────────

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from:      ctx.accounts.seller_token_account.to_account_info(),
                to:        ctx.accounts.pool_token_account.to_account_info(),
                authority: ctx.accounts.seller.to_account_info(),
            },
        ),
        token_amount,
    )?;

    // ── TRANSFER SOL FROM POOL TO SELLER ─────────────────────────

    let mint_key = pool.mint;
    let seeds = &[
        b"token_pool",
        mint_key.as_ref(),
        &[pool.bump],
    ];
    let signer_seeds = &[&seeds[..]];

    // SOL to seller
    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: pool.to_account_info(),
                to:   ctx.accounts.seller.to_account_info(),
            },
            signer_seeds,
        ),
        sol_after_fee,
    )?;

    // Platform fee to treasury
    if platform_fee > 0 {
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: pool.to_account_info(),
                    to:   ctx.accounts.treasury.to_account_info(),
                },
                signer_seeds,
            ),
            platform_fee,
        )?;
    }

    // Creator fee to creator
    if creator_fee > 0 {
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: pool.to_account_info(),
                    to:   ctx.accounts.creator.to_account_info(),
                },
                signer_seeds,
            ),
            creator_fee,
        )?;
    }

    // ── UPDATE STATE ──────────────────────────────────────────────

    pool.virtual_sol_reserves = pool.virtual_sol_reserves
        .checked_sub(sol_out_gross)
        .ok_or(RiseError::MathUnderflow)?;
    pool.virtual_token_reserves = pool.virtual_token_reserves
        .checked_add(token_amount)
        .ok_or(RiseError::MathOverflow)?;
    pool.real_sol_reserves = pool.real_sol_reserves
        .checked_sub(sol_out_gross)
        .ok_or(RiseError::MathUnderflow)?;
    pool.real_token_reserves = pool.real_token_reserves
        .checked_add(token_amount)
        .ok_or(RiseError::MathOverflow)?;
    pool.tokens_sold = pool.tokens_sold
        .checked_sub(token_amount)
        .ok_or(RiseError::MathUnderflow)?;
    pool.sol_raised = pool.sol_raised
        .checked_sub(sol_out_gross)
        .ok_or(RiseError::MathUnderflow)?;

    // Update wallet record
    record.tokens_held = record.tokens_held
        .checked_sub(token_amount)
        .ok_or(RiseError::MathUnderflow)?;

    // Recalculate unlocked supply based on new sol_raised
    let new_unlocked_bps = TokenPool::get_unlocked_bps(pool.sol_raised);
    pool.unlocked_supply = (pool.total_supply as u128)
        .checked_mul(new_unlocked_bps as u128)
        .ok_or(RiseError::MathOverflow)?
        .checked_div(10_000)
        .ok_or(RiseError::MathOverflow)? as u64;

    msg!("RISE sell executed");
    msg!("Tokens in: {}", token_amount);
    msg!("SOL out: {}", sol_after_fee);
    msg!("SOL raised total: {}", pool.sol_raised);

    Ok(())
}