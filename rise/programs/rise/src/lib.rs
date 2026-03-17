use anchor_lang::prelude::*;

pub mod bonding_curve;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::initialize::*;
use instructions::create_token::*;
use instructions::buy::*;
use instructions::sell::*;
use instructions::graduate::*;
use instructions::update_config::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod rise_launchpad {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        params: InitializeParams,
    ) -> Result<()> {
        instructions::initialize::handler(ctx, params)
    }

    pub fn create_token(
        ctx: Context<CreateToken>,
        params: CreateTokenParams,
    ) -> Result<()> {
        instructions::create_token::handler(ctx, params)
    }

    pub fn buy(
        ctx: Context<Buy>,
        sol_amount: u64,
        min_tokens_out: u64,
    ) -> Result<()> {
        instructions::buy::handler(ctx, sol_amount, min_tokens_out)
    }

    pub fn sell(
        ctx: Context<Sell>,
        token_amount: u64,
        min_sol_out: u64,
    ) -> Result<()> {
        instructions::sell::handler(ctx, token_amount, min_sol_out)
    }

    pub fn graduate(
        ctx: Context<Graduate>,
    ) -> Result<()> {
        instructions::graduate::handler(ctx)
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        params: UpdateConfigParams,
    ) -> Result<()> {
        instructions::update_config::handler(ctx, params)
    }
}