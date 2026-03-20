#![allow(ambiguous_glob_reexports)]
use anchor_lang::prelude::*;

pub mod bonding_curve;
pub mod errors;
pub mod state;
pub mod instructions;

pub use instructions::initialize::*;
pub use instructions::create_token::*;
pub use instructions::buy::*;
pub use instructions::sell::*;
pub use instructions::graduate::*;
pub use instructions::update_config::*;

declare_id!("J2rhm79GS6JhCNCpmuxBHrVMSNU8fC8XLKQcMeAwqxyU");

#[program]
pub mod rise_launchpad {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        params: InitializeParams,
    ) -> Result<()> {
        instructions::initialize::handler_impl(ctx, params)
    }

    pub fn create_token(
        ctx: Context<CreateToken>,
        params: CreateTokenParams,
    ) -> Result<()> {
        instructions::create_token::handler_impl(ctx, params)
    }

    pub fn buy(
        ctx: Context<Buy>,
        sol_amount: u64,
        min_tokens_out: u64,
    ) -> Result<()> {
        instructions::buy::handler_impl(ctx, sol_amount, min_tokens_out)
    }

    pub fn sell(
        ctx: Context<Sell>,
        token_amount: u64,
        min_sol_out: u64,
    ) -> Result<()> {
        instructions::sell::handler_impl(ctx, token_amount, min_sol_out)
    }

    pub fn graduate(
        ctx: Context<Graduate>,
    ) -> Result<()> {
        instructions::graduate::handler_impl(ctx)
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        params: UpdateConfigParams,
    ) -> Result<()> {
        instructions::update_config::handler_impl(ctx, params)
    }
}