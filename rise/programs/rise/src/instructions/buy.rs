use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Buy<'info> {
    pub system_program: Program<'info, System>,
}

pub fn handler(_ctx: Context<Buy>, _sol_amount: u64, _min_tokens_out: u64) -> Result<()> {
    Ok(())
}