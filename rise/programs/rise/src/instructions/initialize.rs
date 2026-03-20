use anchor_lang::prelude::*;
use crate::state::PlatformConfig;
use crate::errors::RiseError;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitializeParams {
    pub deploy_fee: u64,
    pub platform_fee_bps: u16,
    pub creator_fee_bps: u16,
    pub graduation_fee: u64,
    pub graduation_target_sol: u64,
    pub max_wallet_bps: u16,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = PlatformConfig::LEN,
        seeds = [b"platform_config"],
        bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler_impl(ctx: Context<Initialize>, params: InitializeParams) -> Result<()> {
    // Validate fees — total cannot exceed 10%
    require!(
        params.platform_fee_bps + params.creator_fee_bps <= 1000,
        RiseError::InvalidFeeConfig
    );

    // Validate max wallet bps — cannot be 0 or over 100%
    require!(
        params.max_wallet_bps > 0 && params.max_wallet_bps <= 10000,
        RiseError::InvalidFeeConfig
    );

    let config = &mut ctx.accounts.platform_config;

    config.admin                 = ctx.accounts.admin.key();
    config.treasury              = ctx.accounts.treasury.key();
    config.deploy_fee            = params.deploy_fee;
    config.platform_fee_bps      = params.platform_fee_bps;
    config.creator_fee_bps       = params.creator_fee_bps;
    config.graduation_fee        = params.graduation_fee;
    config.graduation_target_sol = params.graduation_target_sol;
    config.max_wallet_bps        = params.max_wallet_bps;
    config.creation_paused       = false;
    config.bump                  = ctx.bumps.platform_config;

    msg!("RISE platform initialized");
    msg!("Admin: {}", config.admin);
    msg!("Treasury: {}", config.treasury);
    msg!("Deploy fee: {} lamports", config.deploy_fee);

    Ok(())
}