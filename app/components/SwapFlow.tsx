'use client';

import { useState } from 'react';
import { routeSwap, Quote } from '@/lib/clvrbridge';
import QuoteCard from './QuoteCard';

export default function SwapFlow() {
  const [fromAmount, setFromAmount] = useState('0.1');
  const [fromAsset, setFromAsset] = useState('ETH');
  const [toAsset, setToAsset] = useState('USDC');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [bestQuote, setBestQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleRoute = async () => {
    setLoading(true);
    setError('');
    setQuotes([]);
    setBestQuote(null);

    try {
      const result = await routeSwap(fromAsset, toAsset, parseFloat(fromAmount));
      setQuotes(result.quotes);
      setBestQuote(result.bestQuote);
      setResponseTime(result.responseTimeMs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get quotes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">🔄 Swap — Crypto → Crypto</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <input
          type="number"
          value={fromAmount}
          onChange={(e) => setFromAmount(e.target.value)}
          placeholder="Amount"
          step="0.01"
          className="bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white"
        />
        <select
          value={fromAsset}
          onChange={(e) => setFromAsset(e.target.value)}
          className="bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="ETH">ETH</option>
          <option value="BTC">BTC</option>
          <option value="USDC">USDC</option>
          <option value="USDT">USDT</option>
          <option value="MATIC">MATIC</option>
        </select>
        <span className="text-[#94a3b8] text-sm flex items-center justify-center">→</span>
        <select
          value={toAsset}
          onChange={(e) => setToAsset(e.target.value)}
          className="bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="USDC">USDC</option>
          <option value="USDT">USDT</option>
          <option value="ETH">ETH</option>
          <option value="BTC">BTC</option>
          <option value="DAI">DAI</option>
        </select>
      </div>

      <button
        onClick={handleRoute}
        disabled={loading}
        className="w-full sm:w-auto px-6 py-2 bg-[#22d3ee] text-black font-semibold rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Routing...' : `Route Swap — ${fromAmount} ${fromAsset} → ${toAsset}`}
      </button>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      {responseTime && (
        <p className="text-[#64748b] text-xs mt-2">
          {quotes.length} quotes in {responseTime}ms
        </p>
      )}

      {quotes.length > 0 && (
        <div className="mt-6 space-y-2">
          {quotes.map((q, i) => (
            <QuoteCard key={i} quote={q} isBest={q.provider === bestQuote?.provider} />
          ))}
        </div>
      )}
    </div>
  );
}