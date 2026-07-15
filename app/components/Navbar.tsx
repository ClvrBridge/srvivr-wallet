'use client';

export default function Navbar() {
  return (
    <nav className="border-b border-[#1e293b] bg-[#111827] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-[#22d3ee]">Srvivr</span>
          <span className="text-[#22c55e] text-xs font-semibold uppercase tracking-wider">Wallet</span>
          <span className="text-[#64748b] text-xs hidden sm:inline">by CLVRBRIDGE</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://github.com/clvrbridge/srvivr-wallet"
            target="_blank"
            rel="noopener"
            className="text-[#94a3b8] hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://clvrbridge.com"
            target="_blank"
            rel="noopener"
            className="text-[#94a3b8] hover:text-white transition-colors"
          >
            clvrbridge.com
          </a>
        </div>
      </div>
    </nav>
  );
}