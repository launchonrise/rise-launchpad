import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">

        {/* Hero */}
        <div className="border border-white/10 bg-[#111] p-10 mb-8">
          <p className="font-mono text-xs tracking-[0.2em] text-white/30 mb-4">
            WHITEPAPER V1.0 · 2026
          </p>
          <h1 className="font-mono text-5xl font-semibold text-white mb-4 tracking-tight">
            RISE
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-lg mb-6 font-light">
            A fair-launch token launchpad on Solana. No bundling. No sniping.
            No whale concentration. Just equal opportunities for every launch.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['SOLANA', 'ANTI-BUNDLING', 'OPEN SOURCE', 'PROGRESSIVE UNLOCK'].map(tag => (
              <span
                key={tag}
                className="font-mono text-[10px] tracking-widest border border-white/20 px-3 py-1 text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-8">
          {[
            { label: 'TOKENS LAUNCHED', value: '--' },
            { label: 'TOTAL VOLUME',    value: '--' },
            { label: 'GRADUATED',       value: '--' },
            { label: 'STATUS',          value: 'DEVNET' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0c0c0c] p-6">
              <p className="font-mono text-[10px] tracking-widest text-white/30 mb-2">
                {stat.label}
              </p>
              <p className="font-mono text-2xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Token feed */}
        <div className="border border-white/10">
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <p className="font-mono text-xs tracking-widest text-white/50">
              LIVE TOKENS
            </p>
            <p className="font-mono text-xs tracking-widest text-white/20">
              LAUNCHING SOON
            </p>
          </div>

          {/* Empty state */}
          <div className="p-20 text-center">
            <div className="flex flex-col items-center gap-3 mb-8">
              <span className="block w-8 h-0.5 bg-white/10"></span>
              <span className="block w-8 h-0.5 bg-white/20"></span>
              <span className="block w-8 h-0.5 bg-white/40"></span>
            </div>
            <p className="font-mono text-xs tracking-widest text-white/30 mb-2">
              NO TOKENS YET
            </p>
            <p className="text-white/20 text-sm mb-6">
              Be the first to launch on RISE
            </p>
            <Link
              href="/create"
              className="font-mono text-xs tracking-widest border border-white/20 px-6 py-3 text-white/60 hover:text-white hover:border-white/40 transition-colors inline-block"
            >
              LAUNCH A TOKEN
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}