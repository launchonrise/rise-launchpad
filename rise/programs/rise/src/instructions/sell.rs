use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Sell<'info> {
    pub system_program: Program<'info, System>,
}

pub fn handler(_ctx: Context<Sell>, _token_amount: u64, _min_sol_out: u64) -> Result<()> {
    Ok(())
}