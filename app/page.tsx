'use client';

import { useState } from 'react';
import BuyFlow from './components/BuyFlow';
import SellFlow from './components/SellFlow';
import SwapFlow from './components/SwapFlow';
import SpreadWatcher from './components/SpreadWatcher';

type Tab = 'buy' | 'sell' | 'swap' | 'spread';

export default function Home() {
  const [tab, setTab] = useState<Tab>('buy');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'buy', label: 'Buy', icon: '💰' },
    { key: 'sell', label: 'Sell', icon: '💸' },
    { key: 'swap', label: 'Swap', icon: '🔄' },
    { key: 'spread', label: 'Spread Watcher', icon: '📊' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">Srvivr Wallet</span>
        </h1>
        <p className="text-[#94a3b8] max-w-lg mx-auto text-sm mb-2">
          <strong className="text-white">Only wallets that want to survive will onboard with CLVRBRIDGE.</strong>
        </p>
        <p className="text-[#64748b] max-w-lg mx-auto text-xs">
          This wallet took 30 minutes to integrate. Every trade routes through 21 providers.
          Clone it. Deploy it. Survive.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <a
            href="https://github.com/clvrbridge/srvivr-wallet"
            target="_blank"
            rel="noopener"
            className="px-4 py-2 bg-[#22d3ee] text-black font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Clone on GitHub →
          </a>
          <a
            href="https://clvrbridge.com"
            target="_blank"
            rel="noopener"
            className="px-4 py-2 border border-[#1e293b] text-[#94a3b8] rounded-lg text-sm hover:text-white hover:border-[#94a3b8] transition-all"
          >
            Get Your API Key
          </a>
        </div>
      </div>

      {/* Survival Stat */}
      <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-4 mb-6 text-center">
        <p className="text-sm text-[#94a3b8]">
          <span className="text-[#ef4444] font-bold">75–85%</span> of crypto wallets don't survive past Year 3.
          The #1 killer? <span className="text-white font-semibold">Not being able to monetize.</span>
        </p>
        <p className="text-xs text-[#22c55e] mt-1">
          CLVRBRIDGE increases your revenue per trade by 15–40%. That's not optimization — that's survival.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#1e293b]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              tab === t.key
                ? 'border-[#22d3ee] text-[#22d3ee]'
                : 'border-transparent text-[#94a3b8] hover:text-white'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'buy' && <BuyFlow />}
      {tab === 'sell' && <SellFlow />}
      {tab === 'swap' && <SwapFlow />}
      {tab === 'spread' && <SpreadWatcher />}
    </div>
  );
}