use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreateTokenParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}

#[derive(Accounts)]
pub struct CreateToken<'info> {
    pub system_program: Program<'info, System>,
}

pub fn handler(_ctx: Context<CreateToken>, _params: CreateTokenParams) -> Result<()> {
    Ok(())
}