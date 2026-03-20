import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RiseLaunchpad } from "../target/types/rise_launchpad";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from "chai";

describe("rise", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.RiseLaunchpad as Program<RiseLaunchpad>;

  // Fixed keypairs — same every test run
  const treasury = Keypair.generate();
  const creator  = Keypair.generate();
  const buyer    = Keypair.generate();
  const mint     = Keypair.generate();

  // Accounts derived in before()
  let platformConfig:    PublicKey;
  let tokenPool:         PublicKey;
  let poolTokenAccount:  PublicKey;
  let walletBuyRecord:   PublicKey;
  let buyerTokenAccount: PublicKey;
  let treasuryPubkey:    PublicKey;

  // ── SETUP ──────────────────────────────────────────────────
  before(async () => {
    // Derive all PDAs upfront
    [platformConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform_config")],
      program.programId
    );
    [tokenPool] = PublicKey.findProgramAddressSync(
      [Buffer.from("token_pool"), mint.publicKey.toBuffer()],
      program.programId
    );
    [poolTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool_token_account"), mint.publicKey.toBuffer()],
      program.programId
    );
    [walletBuyRecord] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("wallet_buy_record"),
        tokenPool.toBuffer(),
        buyer.publicKey.toBuffer(),
      ],
      program.programId
    );

    // Buyer ATA — standard associated token account
    buyerTokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      buyer.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Fund creator and buyer with minimum needed
    // creator needs: deploy fee (0.1 SOL) + rent for accounts (~0.05 SOL)
    // buyer needs: buy amount (0.05 SOL) + rent for ATA (~0.002 SOL)
    const tx = new Transaction();
    tx.add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey:   creator.publicKey,
        lamports:   0.2 * LAMPORTS_PER_SOL,
      })
    );
    tx.add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey:   buyer.publicKey,
        lamports:   0.1 * LAMPORTS_PER_SOL,
      })
    );
    await provider.sendAndConfirm(tx);
    console.log("Setup complete — wallets funded");
  });

  // ── TEST 1: INITIALIZE ─────────────────────────────────────
  it("Initializes the platform config", async () => {
    // Skip if already initialized from a previous run
    try {
      await program.account.platformConfig.fetch(platformConfig);
      console.log("✓ Platform config already exists");
      return;
    } catch {
      // Does not exist yet — initialize it
    }

    await program.methods
      .initialize({
        deployFee:           new anchor.BN(100_000_000), // 0.1 SOL
        platformFeeBps:      50,                          // 0.5%
        creatorFeeBps:       50,                          // 0.5%
        graduationFee:       new anchor.BN(15_000_000),  // 0.015 SOL
        graduationTargetSol: new anchor.BN(85_000_000_000), // 85 SOL
        maxWalletBps:        500,                         // 5%
      })
      .accountsStrict({
        platformConfig,
        admin:         provider.wallet.publicKey,
        treasury:      treasury.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const config = await program.account.platformConfig.fetch(platformConfig);
    treasuryPubkey = config.treasury;

    assert.equal(config.deployFee.toNumber(), 100_000_000);
    assert.equal(config.platformFeeBps,       50);
    assert.equal(config.creatorFeeBps,        50);
    assert.equal(config.maxWalletBps,         500);
    assert.equal(config.creationPaused,       false);
    console.log("✓ Platform initialized");
    console.log("  Program ID:", program.programId.toString());
  });

  // ── TEST 2: CREATE TOKEN ───────────────────────────────────
  it("Creates a token and pays deploy fee", async () => {
    const config = await program.account.platformConfig.fetch(platformConfig);
    treasuryPubkey = config.treasury;

    const treasuryBefore = await provider.connection
      .getBalance(treasuryPubkey);

    await program.methods
      .createToken({
        name:   "RISE Test",
        symbol: "RISE",
        uri:    "https://rise.so/token.json",
      })
      .accountsStrict({
        platformConfig,
        tokenPool,
        mint:             mint.publicKey,
        poolTokenAccount,
        treasury:         treasuryPubkey,
        creator:          creator.publicKey,
        tokenProgram:     TOKEN_PROGRAM_ID,
        systemProgram:    SystemProgram.programId,
        rent:             anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([creator, mint])
      .rpc();

    const pool = await program.account.tokenPool.fetch(tokenPool);
    const treasuryAfter = await provider.connection
      .getBalance(treasuryPubkey);

    assert.equal(pool.graduated,  false);
    assert.equal(pool.paused,     false);
    assert.isTrue(pool.unlockedSupply.toNumber() > 0);
    assert.isTrue(pool.totalSupply.toNumber() > 0);
    assert.equal(
      treasuryAfter - treasuryBefore,
      100_000_000,
      "Treasury should receive 0.1 SOL deploy fee"
    );
    console.log("✓ Token created");
    console.log("  Total supply:    ", pool.totalSupply.toString());
    console.log("  Unlocked supply: ", pool.unlockedSupply.toString());
    console.log("  Deploy fee paid: 0.1 SOL");
  });

  // ── TEST 3: BUY ────────────────────────────────────────────
  it("Buys tokens from the bonding curve", async () => {
    const config = await program.account.platformConfig.fetch(platformConfig);
    treasuryPubkey = config.treasury;
    const pool = await program.account.tokenPool.fetch(tokenPool);

    // Create buyer ATA using standard token program
    const createAtaTx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        buyer.publicKey,          // payer
        buyerTokenAccount,        // ata address
        buyer.publicKey,          // owner
        mint.publicKey,           // mint
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
    await provider.connection.sendTransaction(createAtaTx, [buyer]);
    // Wait for confirmation
    await new Promise(r => setTimeout(r, 2000));

    const solBefore = await provider.connection.getBalance(buyer.publicKey);

    await program.methods
      .buy(
        new anchor.BN(0.05 * LAMPORTS_PER_SOL), // 0.05 SOL
        new anchor.BN(0)                         // no slippage check
      )
      .accountsStrict({
        platformConfig,
        tokenPool,
        poolTokenAccount,
        buyerTokenAccount,
        walletBuyRecord,
        treasury:      treasuryPubkey,
        creator:       pool.creator,
        buyer:         buyer.publicKey,
        tokenProgram:  TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    const tokenAcct = await getAccount(
      provider.connection,
      buyerTokenAccount
    );
    const record  = await program.account.walletBuyRecord.fetch(walletBuyRecord);
    const poolAfter = await program.account.tokenPool.fetch(tokenPool);

    assert.isTrue(BigInt(tokenAcct.amount) > BigInt(0));
    assert.isTrue(record.tokensHeld.toNumber() > 0);
    assert.isTrue(poolAfter.solRaised.toNumber() > 0);

    console.log("✓ Buy executed");
    console.log("  Tokens received: ", tokenAcct.amount.toString());
    console.log("  SOL raised:      ", poolAfter.solRaised.toString());
    console.log("  Wallet held:     ", record.tokensHeld.toString());
  });

  // ── TEST 4: SELL ───────────────────────────────────────────
  it("Sells tokens back to the bonding curve", async () => {
    const config   = await program.account.platformConfig.fetch(platformConfig);
    const pool     = await program.account.tokenPool.fetch(tokenPool);
    treasuryPubkey = config.treasury;

    const before     = await getAccount(provider.connection, buyerTokenAccount);
    const sellAmount = BigInt(before.amount) / BigInt(2); // sell half

    const solBefore = await provider.connection.getBalance(buyer.publicKey);

    await program.methods
      .sell(
        new anchor.BN(sellAmount.toString()),
        new anchor.BN(0) // no slippage check
      )
      .accountsStrict({
        platformConfig,
        tokenPool,
        poolTokenAccount,
        sellerTokenAccount: buyerTokenAccount,
        walletSellRecord:   walletBuyRecord,
        treasury:           treasuryPubkey,
        creator:            pool.creator,
        seller:             buyer.publicKey,
        tokenProgram:       TOKEN_PROGRAM_ID,
        systemProgram:      SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    const after   = await getAccount(provider.connection, buyerTokenAccount);
    const solAfter = await provider.connection.getBalance(buyer.publicKey);

    assert.isTrue(BigInt(after.amount) < BigInt(before.amount));
    assert.isTrue(solAfter > solBefore, "Seller should receive SOL back");

    console.log("✓ Sell executed");
    console.log("  Tokens before: ", before.amount.toString());
    console.log("  Tokens after:  ", after.amount.toString());
    console.log("  SOL received:  ", (solAfter - solBefore).toString(), "lamports");
  });

  // ── TEST 5: WALLET CAP ─────────────────────────────────────
  it("Rejects a buy that exceeds 5% wallet cap", async () => {
    const config = await program.account.platformConfig.fetch(platformConfig);
    const pool   = await program.account.tokenPool.fetch(tokenPool);
    treasuryPubkey = config.treasury;

    try {
      // Try to buy a huge amount — should exceed 5% cap
      await program.methods
        .buy(
          new anchor.BN(5 * LAMPORTS_PER_SOL),
          new anchor.BN(0)
        )
        .accountsStrict({
          platformConfig,
          tokenPool,
          poolTokenAccount,
          buyerTokenAccount,
          walletBuyRecord,
          treasury:      treasuryPubkey,
          creator:       pool.creator,
          buyer:         buyer.publicKey,
          tokenProgram:  TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([buyer])
        .rpc();

      assert.fail("Should have thrown ExceedsMaxWalletHold");
    } catch (err) {
      assert.include(
        err.toString(),
        "ExceedsMaxWalletHold",
        "Should reject with ExceedsMaxWalletHold"
      );
      console.log("✓ Wallet cap correctly enforced");
    }
  });

  // ── TEST 6: UPDATE CONFIG ──────────────────────────────────
  it("Admin can update platform config", async () => {
    await program.methods
      .updateConfig({
        deployFee:           new anchor.BN(200_000_000), // update to 0.2 SOL
        platformFeeBps:      null,
        creatorFeeBps:       null,
        graduationFee:       null,
        graduationTargetSol: null,
        maxWalletBps:        null,
        creationPaused:      null,
      })
      .accountsStrict({
        platformConfig,
        admin: provider.wallet.publicKey,
      })
      .rpc();

    const config = await program.account.platformConfig.fetch(platformConfig);
    assert.equal(
      config.deployFee.toNumber(),
      200_000_000,
      "Deploy fee should be updated to 0.2 SOL"
    );
    console.log("✓ Config updated");
    console.log("  New deploy fee: 0.2 SOL");
  });
});