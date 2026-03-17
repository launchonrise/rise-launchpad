use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Graduate<'info> {
    pub system_program: Program<'info, System>,
}

pub fn handler(_ctx: Context<Graduate>) -> Result<()> {
    Ok(())
}