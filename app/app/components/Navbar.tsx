"use client";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0c0c0c]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-mono font-semibold text-white tracking-widest text-sm">RISE</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/" className="font-mono text-xs tracking-widest text-white/50 hover:text-white transition-colors">TOKENS</Link>
          <Link href="/create" className="font-mono text-xs tracking-widest text-white/50 hover:text-white transition-colors">LAUNCH</Link>
          <Link href="/portfolio" className="font-mono text-xs tracking-widest text-white/50 hover:text-white transition-colors">PORTFOLIO</Link>
          <a href="https://github.com/launchonrise/rise-launchpad" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest text-white/50 hover:text-white transition-colors">GITHUB</a>
        </div>
        <WalletMultiButton style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0px", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.1em", padding: "8px 16px", height: "auto", color: "rgba(255,255,255,0.8)" }} />
      </div>
    </nav>
  );
}
