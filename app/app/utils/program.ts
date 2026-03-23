import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "./idl.json";

export const PROGRAM_ID = new PublicKey("J2rhm79GS6JhCNCpmuxBHrVMSNU8fC8XLKQcMeAwqxyU");

export function getProgram(wallet: AnchorWallet, connection: Connection) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Program(idl as Idl, provider);
}

export function getPlatformConfigPDA() {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    PROGRAM_ID
  );
  return pda;
}

export function getTokenPoolPDA(mint: PublicKey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_pool"), mint.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getPoolTokenAccountPDA(mint: PublicKey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("pool_token_account"), mint.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getWalletBuyRecordPDA(tokenPool: PublicKey, wallet: PublicKey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("wallet_buy_record"), tokenPool.toBuffer(), wallet.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}
