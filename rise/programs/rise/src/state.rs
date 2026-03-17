use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct PlatformConfig {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub deploy_fee: u64,
    pub platform_fee_bps: u16,
    pub creator_fee_bps: u16,
    pub graduation_fee: u64,
    pub graduation_target_sol: u64,
    pub max_wallet_bps: u16,
    pub creation_paused: bool,
    pub bump: u8,
}

impl PlatformConfig {
    pub const LEN: usize = 8
        + 32  // admin
        + 32  // treasury
        + 8   // deploy_fee
        + 2   // platform_fee_bps
        + 2   // creator_fee_bps
        + 8   // graduation_fee
        + 8   // graduation_target_sol
        + 2   // max_wallet_bps
        + 1   // creation_paused
        + 1   // bump
        + 64; // padding
}

#[account]
pub struct TokenPool {
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub total_supply: u64,
    pub unlocked_supply: u64,
    pub tokens_sold: u64,
    pub sol_raised: u64,
    pub virtual_sol_reserves: u64,
    pub virtual_token_reserves: u64,
    pub real_sol_reserves: u64,
    pub real_token_reserves: u64,
    pub graduated: bool,
    pub created_at: i64,
    pub unlock_tranche: u8,
    pub paused: bool,
    pub bump: u8,
}

impl TokenPool {
    pub const LEN: usize = 8
        + 32  // creator
        + 32  // mint
        + 8   // total_supply
        + 8   // unlocked_supply
        + 8   // tokens_sold
        + 8   // sol_raised
        + 8   // virtual_sol_reserves
        + 8   // virtual_token_reserves
        + 8   // real_sol_reserves
        + 8   // real_token_reserves
        + 1   // graduated
        + 8   // created_at
        + 1   // unlock_tranche
        + 1   // paused
        + 1   // bump
        + 64; // padding

    pub const TOTAL_SUPPLY: u64 = 1_000_000_000 * 1_000_000;

    pub fn get_unlocked_bps(sol_raised: u64) -> u16 {
        let sol = sol_raised / 1_000_000_000;
        match sol {
            0..=4   => 1500,
            5..=14  => 3000,
            15..=29 => 5000,
            30..=59 => 7000,
            _       => 10000,
        }
    }
}

#[account]
#[derive(Default)]
pub struct WalletBuyRecord {
    pub wallet: Pubkey,
    pub token_pool: Pubkey,
    pub tokens_held: u64,
    pub last_buy_slot: u64,
    pub buys_this_slot: u8,
    pub bump: u8,
}

impl WalletBuyRecord {
    pub const LEN: usize = 8
        + 32  // wallet
        + 32  // token_pool
        + 8   // tokens_held
        + 8   // last_buy_slot
        + 1   // buys_this_slot
        + 1   // bump
        + 32; // padding

    pub const MAX_BUYS_PER_SLOT: u8 = 2;
}