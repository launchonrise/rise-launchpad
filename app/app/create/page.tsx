
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useProgram } from "@/hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { getTokenPoolPDA, getPoolTokenAccountPDA, getPlatformConfigPDA } from "@/utils/program";

const TREASURY = "8uJBkgcFZucDfD1keQTYzQbttHNH64uJiRhP745SLDTK";

export default function CreateToken() {
  const { program } = useProgram();
  const { publicKey, connected } = useWallet();
  const [form, setForm] = useState({ name: "", symbol: "", description: "", website: "", twitter: "", telegram: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txSig, setTxSig] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!connected || !publicKey) return setError("Connect your wallet first");
    if (!program) return setError("Program not loaded");
    if (!form.name || !form.symbol) return setError("Name and symbol required");
    setLoading(true);
    setError(null);
    setTxSig(null);
    try {
      const mint = Keypair.generate();
      const poolTokenKeypair = Keypair.generate();
      const { PublicKey } = await import("@solana/web3.js");
      const treasury = new PublicKey(TREASURY);
      const platformConfig = getPlatformConfigPDA();
      const tokenPool = getTokenPoolPDA(mint.publicKey);
      const poolTokenAccount = poolTokenKeypair.publicKey;
      const sig = await program.methods
        .createToken({ name: form.name, symbol: form.symbol.toUpperCase(), uri: "https://rise.so/token" })
        .accountsStrict({
          platformConfig, tokenPool, mint: mint.publicKey, poolTokenAccount,
          treasury, creator: publicKey, tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId, rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([mint, poolTokenKeypair])
        .rpc();
      setTxSig(sig);
    } catch (e) {
      setError(e.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />
      <div className="h-14"></div>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="font-mono text-[10px] tracking-widest text-white/30 hover:text-white/60 transition-colors">HOME</Link>
          <span className="text-white/20 font-mono">-</span>
          <p className="font-mono text-[10px] tracking-widest text-white/60">CREATE TOKEN</p>
        </div>

        {txSig && (
          <div className="border border-green-500/30 bg-green-500/5 p-4 mb-6 flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-widest text-green-400">TOKEN LAUNCHED SUCCESSFULLY</p>
            <a href={"https://explorer.solana.com/tx/" + txSig + "?cluster=devnet"} target="_blank" rel="noopener noreferrer"
              className="font-mono text-[9px] text-green-400/60 hover:text-green-400 transition-colors">
              VIEW ON EXPLORER
            </a>
          </div>
        )}

        {error && (
          <div className="border border-red-500/30 bg-red-500/5 p-4 mb-6">
            <p className="font-mono text-[10px] tracking-widest text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="border border-white/10 bg-[#111]">
              <div className="border-b border-white/10 px-6 py-4">
                <p className="font-mono text-[10px] tracking-widest text-white/60">TOKEN DETAILS</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-white/30 block mb-2">TOKEN NAME *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. My Token"
                      className="w-full bg-[#0c0c0c] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-white/30 block mb-2">TICKER SYMBOL *</label>
                    <input name="symbol" value={form.symbol} onChange={handleChange} placeholder="e.g. TOKEN" maxLength={10}
                      className="w-full bg-[#0c0c0c] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-white/30 block mb-2">DESCRIPTION</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your token..." rows={4}
                    className="w-full bg-[#0c0c0c] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none" />
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-[#111]">
              <div className="border-b border-white/10 px-6 py-4">
                <p className="font-mono text-[10px] tracking-widest text-white/60">SOCIAL LINKS</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-white/30 block mb-2">WEBSITE</label>
                  <input name="website" value={form.website} onChange={handleChange} placeholder="https://yourtoken.com"
                    className="w-full bg-[#0c0c0c] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-white/30 block mb-2">TWITTER / X</label>
                    <input name="twitter" value={form.twitter} onChange={handleChange} placeholder="@handle"
                      className="w-full bg-[#0c0c0c] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-white/30 block mb-2">TELEGRAM</label>
                    <input name="telegram" value={form.telegram} onChange={handleChange} placeholder="t.me/group"
                      className="w-full bg-[#0c0c0c] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-white/10 bg-[#111]">
              <div className="border-b border-white/10 px-6 py-4">
                <p className="font-mono text-[10px] tracking-widest text-white/60">TOKEN IMAGE</p>
              </div>
              <div className="p-6">
                <label className="block cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  <div className="border border-dashed border-white/15 aspect-square flex flex-col items-center justify-center hover:border-white/30 transition-colors overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-3 py-12">
                        <p className="font-mono text-[9px] tracking-widest text-white/30">CLICK TO UPLOAD</p>
                        <p className="font-mono text-[8px] text-white/20">PNG, JPG, GIF</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="border border-white/10 bg-[#111]">
              <div className="border-b border-white/10 px-6 py-4">
                <p className="font-mono text-[10px] tracking-widest text-white/60">COST BREAKDOWN</p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: "Deploy fee", value: "0.1 SOL" },
                  { label: "Account rent", value: "~0.02 SOL" },
                  { label: "Total supply", value: "1,000,000,000" },
                  { label: "Your max hold", value: "5% (50M tokens)" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <p className="font-mono text-[9px] tracking-widest text-white/30">{row.label}</p>
                    <p className="font-mono text-[10px] text-white/60">{row.value}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <p className="font-mono text-[9px] tracking-widest text-white/50">TOTAL</p>
                  <p className="font-mono text-sm font-semibold text-white">~0.12 SOL</p>
                </div>
              </div>
            </div>

            {!connected && (
              <div className="border border-white/10 bg-[#111] p-4 text-center">
                <p className="font-mono text-[9px] tracking-widest text-white/30">CONNECT WALLET TO LAUNCH</p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading || !form.name || !form.symbol || !connected}
              className="w-full font-mono text-[10px] tracking-widest bg-white text-black py-4 hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              {loading ? "LAUNCHING..." : "LAUNCH TOKEN"}
            </button>
            <p className="font-mono text-[8px] tracking-widest text-white/20 text-center leading-relaxed">
              By launching you agree that this is a fair launch. No rugging. No insider allocations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
