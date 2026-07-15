'use client';

import { useState, useEffect } from 'react';
import { routeBuy, routeSell, routeSwap, Quote } from '@/lib/clvrbridge';

export default function SpreadWatcher() {
  const [buyQuotes, setBuyQuotes] = useState<Quote[]>([]);
  const [sellQuotes, setSellQuotes] = useState<Quote[]>([]);
  const [swapQuotes, setSwapQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');

  const fetchAll = async () => {
    try {
      const [buy, sell, swap] = await Promise.all([
        routeBuy('USD', 35, 'BTC'),
        routeSell('BTC', 0.0012, 'USD'),
        routeSwap('ETH', 'USDC', 0.1),
      ]);
      setBuyQuotes(buy.quotes);
      setSellQuotes(sell.quotes);
      setSwapQuotes(swap.quotes);
      setTimestamp(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Spread watcher error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, []);

  const renderColumn = (title: string, quotes: Quote[], unit: string, decimals: number) => {
    if (loading) return <div className="text-[#64748b] text-sm">Loading...</div>;
    if (!quotes.length) return <div className="text-[#64748b] text-sm">No quotes available</div>;

    const best = quotes[0];
    const worst = quotes[quotes.length - 1];
    const spread = best.toAmount - worst.toAmount;

    return (
      <div>
        <p className="text-sm font-semibold mb-2">{title}</p>
        <div className="space-y-1.5">
          {quotes.map((q, i) => (
            <div
              key={i}
              className={`flex justify-between text-xs px-2 py-1 rounded ${
                i === 0 ? 'border border-[#22c55e]/50 bg-[#22c55e]/5' : 'bg-white/[0.02]'
              }`}
            >
              <span>{i === 0 ? '⭐ ' : ''}{q.provider.split(':')[0]}</span>
              <span className="font-mono">
                {q.toAmount.toFixed(decimals)} {unit}
              </span>
            </div>
          ))}
        </div>
        {spread > 0 && (
          <p className="text-[10px] text-[#22c55e] mt-2">
            +{spread.toFixed(decimals)} {unit} more vs worst
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">📊 Live Spread Watcher</h2>
        <span className="text-xs text-[#64748b]">{timestamp}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4">
          {renderColumn('💰 BUY $35 → BTC', buyQuotes, 'BTC', 8)}
        </div>
        <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4">
          {renderColumn('💸 SELL 0.0012 BTC → USD', sellQuotes, 'USD', 2)}
        </div>
        <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4">
          {renderColumn('🔄 SWAP 0.10 ETH → USDC', swapQuotes, 'USDC', 2)}
        </div>
      </div>

      <p className="text-xs text-[#64748b] mt-4 text-center">
        Auto-refreshes every 60 seconds. Live quotes from CLVRBRIDGE.
      </p>
    </div>
  );
}