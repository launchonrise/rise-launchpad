use anchor_lang::prelude::*;

pub mod bonding_curve;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod rise_launchpad {
    use super::*;

    /// Initialize the platform config — called once by RISE admin
    pub fn initialize(
        ctx: Context<Initialize>,
        params: InitializeParams,
    ) -> Result<()> {
        instructions::initialize::handler(ctx, params)
    }

    /// Deploy a new token — pays deploy fee, creates bonding curve pool
    pub fn create_token(
        ctx: Context<CreateToken>,
        params: CreateTokenParams,
    ) -> Result<()> {
        instructions::create_token::handler(ctx, params)
    }

    /// Buy tokens from the bonding curve
    pub fn buy(
        ctx: Context<Buy>,
        sol_amount: u64,
        min_tokens_out: u64,
    ) -> Result<()> {
        instructions::buy::handler(ctx, sol_amount, min_tokens_out)
    }

    /// Sell tokens back to the bonding curve
    pub fn sell(
        ctx: Context<Sell>,
        token_amount: u64,
        min_sol_out: u64,
    ) -> Result<()> {
        instructions::sell::handler(ctx, token_amount, min_sol_out)
    }

    /// Graduate token to Raydium once target SOL is raised
    pub fn graduate(ctx: Context<Graduate>) -> Result<()> {
        instructions::graduate::handler(ctx)
    }

    /// Admin: update platform config
    pub fn update_config(
        ctx: Context<UpdateConfig>,
        params: UpdateConfigParams,
    ) -> Result<()> {
        instructions::update_config::handler(ctx, params)
    }
}