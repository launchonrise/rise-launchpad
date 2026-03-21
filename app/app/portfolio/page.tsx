"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Portfolio() {
  const [tab, setTab] = useState<"holdings" | "created">("holdings");

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />
      <div className="h-14"></div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="font-mono text-[10px] tracking-widest text-white/30 hover:text-white/60 transition-colors">HOME</Link>
          <span className="text-white/20 font-mono">→</span>
          <p className="font-mono text-[10px] tracking-widest text-white/60">PORTFOLIO</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 mb-6">
          {[
            { label: "TOTAL VALUE",    value: "$0.00" },
            { label: "TOTAL P/L",      value: "$0.00" },
            { label: "TOKENS HELD",    value: "0" },
            { label: "TOKENS CREATED", value: "0" },
          ].map((s, i) => (
            <div key={s.label} className={`bg-[#111] p-6 border border-white/10 ${i > 0 ? "border-l-0" : ""}`}>
              <p className="font-mono text-[9px] tracking-widest text-white/25 mb-2">{s.label}</p>
              <p className="font-mono text-2xl font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border border-white/10 bg-[#111]">
          <div className="border-b border-white/10 flex">
            {(["holdings", "created"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`font-mono text-[10px] tracking-widest px-8 py-4 transition-colors ${tab === t ? "text-white border-b-2 border-white" : "text-white/30 hover:text-white/60"}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-5 px-6 py-3 border-b border-white/5">
            {["TOKEN", "BALANCE", "VALUE", "P/L", "ACTION"].map(col => (
              <p key={col} className="font-mono text-[9px] tracking-widest text-white/20">{col}</p>
            ))}
          </div>

          {/* Empty state */}
          <div className="py-24 text-center">
            <div className="flex flex-col items-center gap-2 mb-6 opacity-20">
              <span className="block w-10 h-px bg-white"></span>
              <span className="block w-10 h-px bg-white"></span>
              <span className="block w-10 h-px bg-white"></span>
            </div>
            <p className="font-mono text-[10px] tracking-widest text-white/20 mb-2">
              {tab === "holdings" ? "NO TOKENS HELD" : "NO TOKENS CREATED"}
            </p>
            <p className="text-white/15 text-xs mb-6 font-light">
              {tab === "holdings" ? "Connect your wallet to see your holdings" : "Launch your first token on RISE"}
            </p>
            <Link
              href={tab === "holdings" ? "/" : "/create"}
              className="font-mono text-[9px] tracking-widest border border-white/15 px-6 py-3 text-white/30 hover:text-white/60 hover:border-white/30 transition-colors"
            >
              {tab === "holdings" ? "BROWSE TOKENS" : "CREATE TOKEN"}
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
