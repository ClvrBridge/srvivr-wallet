export default function ProviderStatus() {
  const providers = [
    { name: 'Kraken', category: 'Exchange', coverage: 'BTC, ETH, 200+ pairs' },
    { name: 'Gemini', category: 'Exchange', coverage: 'BTC, ETH, 100+ pairs' },
    { name: 'Coinbase', category: 'Exchange', coverage: 'US-regulated' },
    { name: 'Binance.US', category: 'Exchange', coverage: 'US exchange' },
    { name: 'Poloniex', category: 'Exchange', coverage: 'OG exchange' },
    { name: 'Transak', category: 'On/Off-Ramp', coverage: 'Global, 75+ countries' },
    { name: 'Coinify', category: 'On/Off-Ramp', coverage: 'EU-focused' },
    { name: 'Bitstamp', category: 'Exchange', coverage: 'EU-regulated' },
    { name: 'Bitfinex', category: 'Exchange', coverage: 'Deep liquidity' },
    { name: 'Gate.io', category: 'Exchange', coverage: '1,400+ pairs' },
    { name: 'HodlHodl', category: 'P2P', coverage: 'Bitcoin, no KYC' },
    { name: 'LocalCoinSwap', category: 'P2P', coverage: 'Multi-coin' },
    { name: 'LI.FI', category: 'DEX Aggregator', coverage: '20+ chains' },
    { name: '0x', category: 'DEX Aggregator', coverage: '70+ sources' },
    { name: 'KyberSwap', category: 'DEX Aggregator', coverage: '12+ chains' },
    { name: 'Velora', category: 'DEX Aggregator', coverage: '12+ chains' },
    { name: 'CowSwap', category: 'DEX', coverage: 'MEV-protected' },
    { name: 'DODO', category: 'DEX', coverage: 'Multi-chain' },
    { name: 'WOOFi', category: 'DEX', coverage: '9+ chains' },
    { name: 'QuickSwap', category: 'DEX', coverage: 'Polygon' },
    { name: 'PancakeSwap', category: 'DEX', coverage: 'BNB Chain' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#64748b] text-xs uppercase">
            <th className="pb-2">Provider</th>
            <th className="pb-2">Category</th>
            <th className="pb-2">Coverage</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p.name} className="border-t border-[#1e293b]">
              <td className="py-2 font-medium text-white">{p.name}</td>
              <td className="py-2 text-[#94a3b8]">{p.category}</td>
              <td className="py-2 text-[#94a3b8]">{p.coverage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}