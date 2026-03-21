import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      {/* This spacer pushes content below the fixed navbar */}
      <div className="h-20"></div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HERO */}
        <div className="border border-white/10 bg-[#111] p-12 mb-6 relative overflow-hidden">
          <div className="absolute right-12 top-12 bottom-12 flex flex-col justify-center gap-3 opacity-10">
            <div className="h-px bg-white w-32"></div>
            <div className="h-px bg-white w-24 ml-auto"></div>
            <div className="h-px bg-white w-32"></div>
          </div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-white/25 mb-5 uppercase">
            Whitepaper v1.0 &middot; 2026 &middot; Solana
          </p>
          <h1 className="font-mono text-6xl font-semibold text-white mb-5 tracking-tight leading-none">
            RISE
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mb-8 font-light tracking-wide">
            A fair-launch token launchpad on Solana. No bundling.
            No sniping. No whale concentration. Equal opportunities
            for every launch — enforced on-chain.
          </p>
          <div className="flex gap-3 flex-wrap mb-10">
            {["SOLANA", "ANTI-BUNDLING", "OPEN SOURCE", "PROGRESSIVE UNLOCK", "MIT LICENSE"].map(tag => (
              <span key={tag} className="font-mono text-[9px] tracking-[0.15em] border border-white/15 px-3 py-1.5 text-white/30">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <Link href="/create" className="font-mono text-[10px] tracking-[0.15em] bg-white text-black px-6 py-3 hover:bg-white/90 transition-colors">
              LAUNCH A TOKEN
            </Link>
            <a href="https://github.com/launchonrise/rise-launchpad" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-[0.15em] border border-white/20 px-6 py-3 text-white/50 hover:text-white hover:border-white/40 transition-colors">
              VIEW GITHUB
            </a>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 mb-6">
          {[
            { label: "TOKENS LAUNCHED", value: "0", live: true },
            { label: "TOTAL VOLUME",    value: "$0" },
            { label: "GRADUATED",       value: "0" },
            { label: "NETWORK",         value: "DEVNET" },
          ].map((stat, i) => (
            <div key={stat.label} className={`bg-[#111] p-6 border border-white/10 ${i > 0 ? "border-l-0" : ""}`}>
              <div className="flex items-center gap-2 mb-3">
                {stat.live && <span className="block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>}
                <p className="font-mono text-[9px] tracking-[0.15em] text-white/25 uppercase">{stat.label}</p>
              </div>
              <p className="font-mono text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* TOKEN FEED */}
        <div className="border border-white/10 bg-[#111] mb-6">
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="font-mono text-[10px] tracking-[0.15em] text-white/60">LIVE TOKENS</p>
              <div className="flex gap-2">
                {["ALL", "NEW", "TRENDING", "GRADUATING"].map((filter, i) => (
                  <button key={filter} className={`font-mono text-[9px] tracking-[0.1em] px-3 py-1 transition-colors ${i === 0 ? "bg-white/10 text-white" : "text-white/25 hover:text-white/50"}`}>
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <p className="font-mono text-[9px] tracking-[0.15em] text-white/20">LAUNCHING SOON</p>
          </div>
          <div className="grid grid-cols-5 px-6 py-3 border-b border-white/5">
            {["TOKEN", "PRICE", "MARKET CAP", "PROGRESS", "VOLUME"].map(col => (
              <p key={col} className="font-mono text-[9px] tracking-[0.1em] text-white/20">{col}</p>
            ))}
          </div>
          <div className="py-20 text-center">
            <div className="flex flex-col items-center gap-2 mb-6 opacity-20">
              <span className="block w-10 h-px bg-white"></span>
              <span className="block w-10 h-px bg-white"></span>
              <span className="block w-10 h-px bg-white"></span>
            </div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/20 mb-2">NO TOKENS YET</p>
            <p className="text-white/15 text-xs mb-6 font-light">Be the first to launch on RISE</p>
            <Link href="/create" className="font-mono text-[9px] tracking-[0.15em] border border-white/15 px-6 py-3 text-white/30 hover:text-white/60 hover:border-white/30 transition-colors">
              CREATE FIRST TOKEN
            </Link>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="border border-white/10 bg-[#111]">
          <div className="border-b border-white/10 px-6 py-4">
            <p className="font-mono text-[10px] tracking-[0.15em] text-white/60">HOW RISE WORKS</p>
          </div>
          <div className="grid grid-cols-3">
            {[
              { num: "01", title: "DEPLOY", desc: "Pay 0.1 SOL to launch your token. Deploy fee filters spam and funds the platform." },
              { num: "02", title: "TRADE",  desc: "Bonding curve pricing. Anti-bundling enforced on-chain. Max 5% wallet cap." },
              { num: "03", title: "GRADUATE", desc: "Hit 85 SOL raised and your token auto-graduates to Raydium with full liquidity." },
            ].map((step, i) => (
              <div key={step.num} className={`p-8 ${i > 0 ? "border-l border-white/10" : ""}`}>
                <p className="font-mono text-[9px] tracking-[0.2em] text-white/20 mb-4">{step.num}</p>
                <p className="font-mono text-sm font-semibold text-white mb-3 tracking-wide">{step.title}</p>
                <p className="text-white/30 text-xs leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="font-mono text-[9px] tracking-[0.15em] text-white/20">RISE &middot; SOLANA LAUNCHPAD &middot; v1.0</p>
          <div className="flex gap-6">
            <a href="https://github.com/launchonrise/rise-launchpad" target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] tracking-[0.15em] text-white/20 hover:text-white/40 transition-colors">GITHUB</a>
            <a href="https://risedocs.pro" target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] tracking-[0.15em] text-white/20 hover:text-white/40 transition-colors">DOCS</a>
          </div>
        </div>
      </div>

    </main>
  );
}
