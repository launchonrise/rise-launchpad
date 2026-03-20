use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{Token, TokenAccount};
use crate::state::{PlatformConfig, TokenPool};
use crate::errors::RiseError;

#[derive(Accounts)]
pub struct Graduate<'info> {
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

    // Pool's token account
    #[account(
        mut,
        token::mint = token_pool.mint,
        token::authority = token_pool,
    )]
    pub pool_token_account: Account<'info, TokenAccount>,

    // Treasury receives graduation fee
    /// CHECK: validated against platform_config.treasury
    #[account(
        mut,
        constraint = treasury.key() == platform_config.treasury
    )]
    pub treasury: AccountInfo<'info>,

    // Anyone can call graduate once the threshold is hit
    #[account(mut)]
    pub caller: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler_impl(ctx: Context<Graduate>) -> Result<()> {
    let config = &ctx.accounts.platform_config;
    let pool   = &mut ctx.accounts.token_pool;

    // ── SAFETY CHECKS ────────────────────────────────────────────

    // 1. Must not already be graduated
    require!(!pool.graduated, RiseError::AlreadyGraduated);

    // 2. Must not be paused
    require!(!pool.paused, RiseError::PoolPaused);

    // 3. Must have reached graduation target
    require!(
        pool.sol_raised >= config.graduation_target_sol,
        RiseError::NotReadyToGraduate
    );

    // 4. Pool must have enough SOL for graduation fee
    require!(
        pool.real_sol_reserves >= config.graduation_fee,
        RiseError::InsufficientFunds
    );

    // ── PAY GRADUATION FEE ────────────────────────────────────────

    let mint_key = pool.mint;
    let seeds = &[
        b"token_pool",
        mint_key.as_ref(),
        &[pool.bump],
    ];
    let signer_seeds = &[&seeds[..]];

    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: pool.to_account_info(),
                to:   ctx.accounts.treasury.to_account_info(),
            },
            signer_seeds,
        ),
        config.graduation_fee,
    )?;

    // ── MARK AS GRADUATED ─────────────────────────────────────────

    // Mark graduated — this stops all further buys and sells
    // on the bonding curve immediately
    pool.graduated       = true;
    pool.unlocked_supply = pool.total_supply;

    // Update real reserves after graduation fee
    pool.real_sol_reserves = pool.real_sol_reserves
        .checked_sub(config.graduation_fee)
        .ok_or(RiseError::MathUnderflow)?;

    msg!("RISE token graduated!");
    msg!("Mint: {}", pool.mint);
    msg!("SOL raised: {}", pool.sol_raised);
    msg!("Tokens sold: {}", pool.tokens_sold);
    msg!("Remaining tokens: {}", ctx.accounts.pool_token_account.amount);
    msg!("SOL for Raydium pool: {}", pool.real_sol_reserves);
    msg!("--- READY FOR RAYDIUM MIGRATION ---");
    msg!("Next step: call Raydium AMM to create liquidity pool");
    msg!("SOL: {}", pool.real_sol_reserves);
    msg!("Tokens: {}", ctx.accounts.pool_token_account.amount);

    Ok(())
}