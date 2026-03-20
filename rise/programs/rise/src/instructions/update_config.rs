use anchor_lang::prelude::*;
use crate::state::PlatformConfig;
use crate::errors::RiseError;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdateConfigParams {
    pub deploy_fee: Option<u64>,
    pub platform_fee_bps: Option<u16>,
    pub creator_fee_bps: Option<u16>,
    pub graduation_fee: Option<u64>,
    pub graduation_target_sol: Option<u64>,
    pub max_wallet_bps: Option<u16>,
    pub creation_paused: Option<bool>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"platform_config"],
        bump = platform_config.bump,
        has_one = admin @ RiseError::Unauthorized
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    pub admin: Signer<'info>,
}

pub fn handler_impl(ctx: Context<UpdateConfig>, params: UpdateConfigParams) -> Result<()> {
    let config = &mut ctx.accounts.platform_config;

    if let Some(deploy_fee) = params.deploy_fee {
        config.deploy_fee = deploy_fee;
    }
    if let Some(platform_fee_bps) = params.platform_fee_bps {
        config.platform_fee_bps = platform_fee_bps;
    }
    if let Some(creator_fee_bps) = params.creator_fee_bps {
        config.creator_fee_bps = creator_fee_bps;
    }
    if let Some(graduation_fee) = params.graduation_fee {
        config.graduation_fee = graduation_fee;
    }
    if let Some(graduation_target_sol) = params.graduation_target_sol {
        config.graduation_target_sol = graduation_target_sol;
    }
    if let Some(max_wallet_bps) = params.max_wallet_bps {
        require!(
            max_wallet_bps > 0 && max_wallet_bps <= 10000,
            RiseError::InvalidFeeConfig
        );
        config.max_wallet_bps = max_wallet_bps;
    }
    if let Some(creation_paused) = params.creation_paused {
        config.creation_paused = creation_paused;
    }

    msg!("RISE platform config updated");
    Ok(())
}