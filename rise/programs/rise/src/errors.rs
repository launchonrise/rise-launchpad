use anchor_lang::prelude::*;

#[error_code]
pub enum RiseError {
    #[msg("Purchase would exceed 5% max wallet hold")]
    ExceedsMaxWalletHold,

    #[msg("Purchase would exceed 5% dev wallet cap")]
    ExceedsDevWalletCap,

    #[msg("Exceeds available unlocked supply for current market cap")]
    ExceedsUnlockedSupply,

    #[msg("Amount is zero")]
    ZeroAmount,

    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,

    #[msg("Insufficient funds")]
    InsufficientFunds,

    #[msg("Buy cooldown active — too many buys in this block")]
    CooldownActive,

    #[msg("Launch cooldown active — max 1% per wallet for first 60 seconds")]
    LaunchCooldownActive,

    #[msg("Token has already graduated to DEX")]
    AlreadyGraduated,

    #[msg("Token has not reached graduation threshold")]
    NotReadyToGraduate,

    #[msg("Token pool is paused")]
    PoolPaused,

    #[msg("Insufficient deploy fee")]
    InsufficientDeployFee,

    #[msg("Unauthorized — only admin can call this")]
    Unauthorized,

    #[msg("Invalid fee configuration — fees cannot exceed 10%")]
    InvalidFeeConfig,

    #[msg("Math overflow")]
    MathOverflow,

    #[msg("Math underflow")]
    MathUnderflow,
}