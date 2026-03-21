"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function TokenPage() {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />
      <div className="h-14"></div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="font-mono text-[10px] tracking-widest text-white/30 hover:text-white/60 transition-colors">HOME</Link>
          <span className="text-white/20 font-mono">→</span>
          <p className="font-mono text-[10px] tracking-widest text-white/60">TOKEN</p>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT — chart + info */}
          <div className="col-span-2 space-y-4">

            {/* Token header */}
            <div className="border border-white/10 bg-[#111] p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="font-mono text-xs text-white/40">IMG</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-mono text-lg font-semibold text-white">Token Name</h1>
                    <span className="font-mono text-xs text-white/30 border border-white/10 px-2 py-0.5">$TICKER</span>
                  </div>
                  <p className="font-mono text-[9px] tracking-widest text-white/25">CREATED BY 0x1234...5678</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl font-semibold text-white mb-1">$0.0000</p>
                <p className="font-mono text-[9px] tracking-widest text-green-400">+0.00%</p>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="border border-white/10 bg-[#111]">
              <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <p className="font-mono text-[10px] tracking-widest text-white/60">PRICE CHART</p>
                <div className="flex gap-2">
                  {["1M", "5M", "1H", "1D"].map((t, i) => (
                    <button key={t} className={`font-mono text-[9px] px-2 py-1 ${i === 0 ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                <p className="font-mono text-[9px] tracking-widest text-white/20">CHART COMING SOON</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4">
              {[
                { label: "MARKET CAP",    value: "$0" },
                { label: "VOLUME 24H",    value: "$0" },
                { label: "SOL RAISED",    value: "0 / 85" },
                { label: "HOLDERS",       value: "0" },
              ].map((s, i) => (
                <div key={s.label} className={`bg-[#111] p-5 border border-white/10 ${i > 0 ? "border-l-0" : ""}`}>
                  <p className="font-mono text-[9px] tracking-widest text-white/25 mb-2">{s.label}</p>
                  <p className="font-mono text-lg font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Graduation progress */}
            <div className="border border-white/10 bg-[#111] p-6">
              <div className="flex justify-between items-center mb-3">
                <p className="font-mono text-[10px] tracking-widest text-white/60">GRADUATION PROGRESS</p>
                <p className="font-mono text-[10px] text-white/40">0 / 85 SOL</p>
              </div>
              <div className="h-1.5 bg-white/5 w-full">
                <div className="h-full bg-white/40 transition-all" style={{ width: "0%" }}></div>
              </div>
              <p className="font-mono text-[8px] tracking-widest text-white/20 mt-3">
                RAISES 85 SOL → AUTO-GRADUATES TO RAYDIUM
              </p>
            </div>

            {/* Description */}
            <div className="border border-white/10 bg-[#111] p-6">
              <p className="font-mono text-[10px] tracking-widest text-white/60 mb-4">ABOUT</p>
              <p className="text-white/30 text-sm leading-relaxed font-light">No description provided.</p>
            </div>

          </div>

          {/* RIGHT — buy/sell */}
          <div className="space-y-4">

            {/* Buy/Sell panel */}
            <div className="border border-white/10 bg-[#111]">
              <div className="grid grid-cols-2">
                <button
                  onClick={() => setTab("buy")}
                  className={`font-mono text-[10px] tracking-widest py-4 transition-colors ${tab === "buy" ? "bg-white text-black" : "text-white/40 hover:text-white/60"}`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setTab("sell")}
                  className={`font-mono text-[10px] tracking-widest py-4 transition-colors border-l border-white/10 ${tab === "sell" ? "bg-white text-black" : "text-white/40 hover:text-white/60"}`}
                >
                  SELL
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-white/30 block mb-2">
                    {tab === "buy" ? "SOL AMOUNT" : "TOKEN AMOUNT"}
                  </label>
                  <div className="relative">
                    <input
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#0c0c0c] border border-white/10 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[9px] text-white/30">
                      {tab === "buy" ? "SOL" : "TOKENS"}
                    </span>
                  </div>
                </div>

                {/* Quick amounts */}
                {tab === "buy" && (
                  <div className="flex gap-2">
                    {["0.1", "0.5", "1", "5"].map(v => (
                      <button
                        key={v}
                        onClick={() => setAmount(v)}
                        className="flex-1 font-mono text-[9px] border border-white/10 py-2 text-white/30 hover:text-white/60 hover:border-white/30 transition-colors"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}

                {/* Estimate */}
                <div className="bg-[#0c0c0c] border border-white/5 p-4 space-y-2">
                  <div className="flex justify-between">
                    <p className="font-mono text-[9px] text-white/25">You receive</p>
                    <p className="font-mono text-[9px] text-white/50">-- tokens</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-mono text-[9px] text-white/25">Price impact</p>
                    <p className="font-mono text-[9px] text-white/50">--%</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-mono text-[9px] text-white/25">Fee (1%)</p>
                    <p className="font-mono text-[9px] text-white/50">-- SOL</p>
                  </div>
                </div>

                <button className="w-full font-mono text-[10px] tracking-widest bg-white text-black py-4 hover:bg-white/90 transition-colors">
                  {tab === "buy" ? "BUY TOKENS" : "SELL TOKENS"}
                </button>
              </div>
            </div>

            {/* Token info */}
            <div className="border border-white/10 bg-[#111]">
              <div className="border-b border-white/10 px-6 py-4">
                <p className="font-mono text-[10px] tracking-widest text-white/60">TOKEN INFO</p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: "Contract",    value: "0x1234...5678" },
                  { label: "Total supply", value: "1,000,000,000" },
                  { label: "Decimals",    value: "6" },
                  { label: "Network",     value: "Solana Devnet" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                    <p className="font-mono text-[9px] text-white/30">{row.label}</p>
                    <p className="font-mono text-[9px] text-white/60">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
