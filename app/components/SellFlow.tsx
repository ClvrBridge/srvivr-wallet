'use client';

import { useState } from 'react';
import { routeSell, Quote } from '@/lib/clvrbridge';
import QuoteCard from './QuoteCard';

export default function SellFlow() {
  const [cryptoAmount, setCryptoAmount] = useState('0.01');
  const [cryptoCurrency, setCryptoCurrency] = useState('BTC');
  const [fiatCurrency, setFiatCurrency] = useState('USD');
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
      const result = await routeSell(cryptoCurrency, parseFloat(cryptoAmount), fiatCurrency);
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
      <h2 className="text-lg font-semibold mb-4">💸 Sell — Crypto → Fiat</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <input
          type="number"
          value={cryptoAmount}
          onChange={(e) => setCryptoAmount(e.target.value)}
          placeholder="Amount"
          step="0.001"
          className="bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white"
        />
        <select
          value={cryptoCurrency}
          onChange={(e) => setCryptoCurrency(e.target.value)}
          className="bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDC">USDC</option>
          <option value="USDT">USDT</option>
        </select>
        <span className="text-[#94a3b8] text-sm flex items-center justify-center">→</span>
        <select
          value={fiatCurrency}
          onChange={(e) => setFiatCurrency(e.target.value)}
          className="bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      <button
        onClick={handleRoute}
        disabled={loading}
        className="w-full sm:w-auto px-6 py-2 bg-[#22d3ee] text-black font-semibold rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Routing...' : `Route Sell — ${cryptoAmount} ${cryptoCurrency} → ${fiatCurrency}`}
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