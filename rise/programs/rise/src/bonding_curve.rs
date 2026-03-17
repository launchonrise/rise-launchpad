use crate::errors::RiseError;
use anchor_lang::prelude::*;

pub struct BondingCurve;

impl BondingCurve {
    // Initial virtual reserves — sets the starting price
    // Same as pump.fun: 30 SOL virtual, 1.073B virtual tokens
    pub const INITIAL_VIRTUAL_SOL: u64 = 30_000_000_000;
    pub const INITIAL_VIRTUAL_TOKENS: u64 = 1_073_000_000_000_000;

    /// How many tokens you get for a given SOL amount
    pub fn get_tokens_out(
        sol_in: u64,
        virtual_sol_reserves: u64,
        virtual_token_reserves: u64,
    ) -> Result<u64> {
        let k = (virtual_sol_reserves as u128)
            .checked_mul(virtual_token_reserves as u128)
            .ok_or(RiseError::MathOverflow)?;

        let new_sol_reserves = (virtual_sol_reserves as u128)
            .checked_add(sol_in as u128)
            .ok_or(RiseError::MathOverflow)?;

        let new_token_reserves = k
            .checked_div(new_sol_reserves)
            .ok_or(RiseError::MathOverflow)?;

        let tokens_out = (virtual_token_reserves as u128)
            .checked_sub(new_token_reserves)
            .ok_or(RiseError::MathUnderflow)?;

        Ok(tokens_out as u64)
    }

    /// How much SOL you get for selling a given token amount
    pub fn get_sol_out(
        tokens_in: u64,
        virtual_sol_reserves: u64,
        virtual_token_reserves: u64,
    ) -> Result<u64> {
        let k = (virtual_sol_reserves as u128)
            .checked_mul(virtual_token_reserves as u128)
            .ok_or(RiseError::MathOverflow)?;

        let new_token_reserves = (virtual_token_reserves as u128)
            .checked_add(tokens_in as u128)
            .ok_or(RiseError::MathOverflow)?;

        let new_sol_reserves = k
            .checked_div(new_token_reserves)
            .ok_or(RiseError::MathOverflow)?;

        let sol_out = (virtual_sol_reserves as u128)
            .checked_sub(new_sol_reserves)
            .ok_or(RiseError::MathUnderflow)?;

        Ok(sol_out as u64)
    }

    /// Current token price in lamports per token
    pub fn get_price(
        virtual_sol_reserves: u64,
        virtual_token_reserves: u64,
    ) -> Result<u64> {
        if virtual_token_reserves == 0 {
            return err!(RiseError::MathOverflow);
        }
        Ok(virtual_sol_reserves
            .checked_div(virtual_token_reserves)
            .ok_or(RiseError::MathOverflow)?)
    }

    /// Apply a fee in basis points
    /// Returns (amount_after_fee, fee_amount)
    pub fn apply_fee(amount: u64, fee_bps: u16) -> Result<(u64, u64)> {
        let fee = (amount as u128)
            .checked_mul(fee_bps as u128)
            .ok_or(RiseError::MathOverflow)?
            .checked_div(10_000)
            .ok_or(RiseError::MathOverflow)? as u64;

        let after_fee = amount
            .checked_sub(fee)
            .ok_or(RiseError::MathUnderflow)?;

        Ok((after_fee, fee))
    }
}