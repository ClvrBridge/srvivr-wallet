'use client';

import { useState, useEffect } from 'react';

const API_URL = 'https://clvrbridge.onrender.com';
const API_KEY = 'clvr_demo_pub_72518131de7d606461ef651bde001fd2';

async function routeQuote(type: string, params: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
    body: JSON.stringify({ type, ...params, country: 'US', walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' })
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

const FIAT_LIST = ['USD','EUR','GBP','CAD','AUD','JPY','CHF','INR','BRL','NGN','TRY','ZAR','KES','MXN','ARS','SGD','PHP','KRW'];
const CRYPTO_LIST = ['BTC','ETH','USDC','USDT','SOL','DOGE','XRP','ADA','LINK','XLM','ZEC','XMR','DAI','MATIC','DOT','LTC','TRX','BCH','HYPE','BNB'];
const SWAP_LIST = ['ETH','WBTC','LINK','SOL','DOGE','XRP','ADA','XLM','ZEC','XMR','USDC','USDT','DAI','MATIC','DOT','LTC','TRX','BCH','HYPE','BNB'];

export default function Home() {
  const [tab, setTab] = useState<'buy' | 'sell' | 'swap' | 'spread'>('buy');
  const [buyAmount, setBuyAmount] = useState('500');
  const [buyFiat, setBuyFiat] = useState('USD');
  const [buyCrypto, setBuyCrypto] = useState('BTC');
  const [buyResults, setBuyResults] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);

  const [sellAmount, setSellAmount] = useState('0.01');
  const [sellCrypto, setSellCrypto] = useState('BTC');
  const [sellFiat, setSellFiat] = useState('USD');
  const [sellResults, setSellResults] = useState('');
  const [sellLoading, setSellLoading] = useState(false);

  const [swapAmount, setSwapAmount] = useState('0.1');
  const [swapFrom, setSwapFrom] = useState('ETH');
  const [swapTo, setSwapTo] = useState('USDC');
  const [swapResults, setSwapResults] = useState('');
  const [swapLoading, setSwapLoading] = useState(false);

  const [spreadData, setSpreadData] = useState('');
  const [spreadLoading, setSpreadLoading] = useState(true);

  function buildQuoteList(quotes: any[], bestQuote: any, responseTime: number) {
    if (!quotes?.length) return '<p class="response-info">No quotes available</p>';
    let html = '<div class="quote-list">';
    quotes.forEach(q => {
      const isBest = q.provider === bestQuote.provider;
      const decimals = ['USDC','USDT','DAI','USDS'].includes(q.toCurrency) ? 2 : 8;
      html += `<div class="quote-row ${isBest ? 'quote-best' : ''}">
        <span>${isBest ? '⭐ ' : ''}${q.provider.split(':')[0]}</span>
        <span>${q.toAmount.toFixed(decimals)} ${q.toCurrency}</span>
      </div>`;
    });
    html += '</div>';
    html += `<div class="response-info">${quotes.length} quotes in ${responseTime}ms · Best: ${bestQuote.provider.split(':')[0]}</div>`;
    return html;
  }

  function buildMiniList(quotes: any[], unit: string, decimals: number) {
    if (!quotes?.length) return '<div class="response-info">No quotes</div>';
    return quotes.slice(0, 5).map(q => `
      <div class="quote-row"><span>${q.provider.split(':')[0]}</span><span>${q.toAmount.toFixed(decimals)} ${unit}</span></div>
    `).join('');
  }

  async function executeBuy() {
    setBuyLoading(true); setBuyResults('');
    try {
      const data = await routeQuote('BUY', { fiatCurrency: buyFiat, fiatAmount: parseFloat(buyAmount), cryptoCurrency: buyCrypto });
      setBuyResults(buildQuoteList(data.quotes, data.bestQuote, data.responseTimeMs));
    } catch { setBuyResults('<p class="response-info" style="color:#f85149;">Failed</p>'); }
    finally { setBuyLoading(false); }
  }

  async function executeSell() {
    setSellLoading(true); setSellResults('');
    try {
      const data = await routeQuote('SELL', { cryptoCurrency: sellCrypto, cryptoAmount: parseFloat(sellAmount), fiatCurrency: sellFiat });
      setSellResults(buildQuoteList(data.quotes, data.bestQuote, data.responseTimeMs));
    } catch { setSellResults('<p class="response-info" style="color:#f85149;">Failed</p>'); }
    finally { setSellLoading(false); }
  }

  async function executeSwap() {
    setSwapLoading(true); setSwapResults('');
    try {
      const data = await routeQuote('SWAP', { fromAsset: swapFrom, toAsset: swapTo, fromAmount: parseFloat(swapAmount), network: 'ethereum' });
      setSwapResults(buildQuoteList(data.quotes, data.bestQuote, data.responseTimeMs));
    } catch { setSwapResults('<p class="response-info" style="color:#f85149;">Failed</p>'); }
    finally { setSwapLoading(false); }
  }

  async function loadSpreads() {
    setSpreadLoading(true);
    try {
      const [buy, sell, swap] = await Promise.all([
        routeQuote('BUY', { fiatCurrency: 'USD', fiatAmount: 35, cryptoCurrency: 'BTC' }),
        routeQuote('SELL', { cryptoCurrency: 'BTC', cryptoAmount: 0.0012, fiatCurrency: 'USD' }),
        routeQuote('SWAP', { fromAsset: 'ETH', toAsset: 'USDC', fromAmount: 0.1, network: 'ethereum' })
      ]);
      setSpreadData(`
        <div class="spread-grid">
          <div class="spread-col"><div class="spread-title">💰 BUY $35 → BTC</div>${buildMiniList(buy.quotes, 'BTC', 8)}</div>
          <div class="spread-col"><div class="spread-title">💸 SELL 0.0012 BTC → USD</div>${buildMiniList(sell.quotes, 'USD', 2)}</div>
          <div class="spread-col"><div class="spread-title">🔄 SWAP 0.1 ETH → USDC</div>${buildMiniList(swap.quotes, 'USDC', 2)}</div>
        </div>
      `);
    } catch { setSpreadData('<p class="response-info" style="color:#f85149;">Failed to load spreads</p>'); }
    finally { setSpreadLoading(false); }
  }

  useEffect(() => { if (tab === 'spread') loadSpreads(); }, [tab]);

  return (
    <div className="phone-app">
      <div className="phone-status"><span>9:41</span><span>📶 🔋</span></div>
      <div className="wallet-header">
        <div className="wallet-logo"><span className="wallet-icon">S</span>Srvivr</div>
        <div className="wallet-balance"><div className="balance-amount">$12,847.32</div><div className="balance-label">Portfolio</div></div>
      </div>

      <div className="phone-tabs">
        {(['buy','sell','swap','spread'] as const).map(t => (
          <button key={t} className={`phone-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'buy' ? '💰 Buy' : t === 'sell' ? '💸 Sell' : t === 'swap' ? '🔄 Swap' : '📊 Spread'}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'buy' && (
          <>
            <div className="trade-form">
              <input type="text" className="trade-input" value={buyAmount} onChange={e => setBuyAmount(e.target.value)} />
              <div className="trade-row">
                <select className="trade-select" value={buyFiat} onChange={e => setBuyFiat(e.target.value)}>{FIAT_LIST.map(f => <option key={f}>{f}</option>)}</select>
                <span className="trade-arrow">→</span>
                <select className="trade-select" value={buyCrypto} onChange={e => setBuyCrypto(e.target.value)}>{CRYPTO_LIST.map(c => <option key={c}>{c}</option>)}</select>
              </div>
              <button className="trade-btn" onClick={executeBuy} disabled={buyLoading}>
                {buyLoading ? 'Routing...' : `Route Buy — ${buyAmount} ${buyFiat} → ${buyCrypto}`}
              </button>
            </div>
            {buyResults && <div dangerouslySetInnerHTML={{ __html: buyResults }} />}
          </>
        )}

        {tab === 'sell' && (
          <>
            <div className="trade-form">
              <input type="text" className="trade-input" value={sellAmount} onChange={e => setSellAmount(e.target.value)} />
              <div className="trade-row">
                <select className="trade-select" value={sellCrypto} onChange={e => setSellCrypto(e.target.value)}>{CRYPTO_LIST.map(c => <option key={c}>{c}</option>)}</select>
                <span className="trade-arrow">→</span>
                <select className="trade-select" value={sellFiat} onChange={e => setSellFiat(e.target.value)}>{FIAT_LIST.map(f => <option key={f}>{f}</option>)}</select>
              </div>
              <button className="trade-btn" onClick={executeSell} disabled={sellLoading}>
                {sellLoading ? 'Routing...' : `Route Sell — ${sellAmount} ${sellCrypto} → ${sellFiat}`}
              </button>
            </div>
            {sellResults && <div dangerouslySetInnerHTML={{ __html: sellResults }} />}
          </>
        )}

        {tab === 'swap' && (
          <>
            <div className="trade-form">
              <input type="text" className="trade-input" value={swapAmount} onChange={e => setSwapAmount(e.target.value)} />
              <div className="trade-row">
                <select className="trade-select" value={swapFrom} onChange={e => setSwapFrom(e.target.value)}>{SWAP_LIST.map(s => <option key={s}>{s}</option>)}</select>
                <span className="trade-arrow">→</span>
                <select className="trade-select" value={swapTo} onChange={e => setSwapTo(e.target.value)}>{SWAP_LIST.map(s => <option key={s}>{s}</option>)}</select>
              </div>
              <button className="trade-btn" onClick={executeSwap} disabled={swapLoading}>
                {swapLoading ? 'Routing...' : `Route Swap — ${swapAmount} ${swapFrom} → ${swapTo}`}
              </button>
            </div>
            {swapResults && <div dangerouslySetInnerHTML={{ __html: swapResults }} />}
          </>
        )}

        {tab === 'spread' && (
          spreadLoading ? <p className="response-info">Loading live spreads...</p> : <div dangerouslySetInnerHTML={{ __html: spreadData }} />
        )}
      </div>
    </div>
  );
}
