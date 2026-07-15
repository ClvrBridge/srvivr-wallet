import { Quote } from '@/lib/clvrbridge';

export default function QuoteCard({ quote, isBest }: { quote: Quote; isBest: boolean }) {
  const decimals = ['USDC', 'USDT', 'DAI'].includes(quote.toCurrency) ? 2 : 8;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm ${
        isBest
          ? 'border border-[#22c55e]/50 bg-[#22c55e]/5'
          : 'bg-white/[0.02] border border-transparent'
      }`}
    >
      <div className="flex items-center gap-2">
        {isBest && <span className="text-xs">⭐</span>}
        <span className="font-semibold text-white">{quote.provider}</span>
        <span className="text-[#64748b] text-xs">
          {quote.successRate ? `${(quote.successRate * 100).toFixed(0)}%` : ''}
        </span>
      </div>
      <div className="text-right">
        <div className="font-bold text-white">
          {quote.toAmount.toFixed(decimals)}{' '}
          <span className="text-[#94a3b8] text-xs">{quote.toCurrency}</span>
        </div>
        <div className="text-[#64748b] text-xs">
          {quote.estimatedTimeMs}ms · {quote.executionType}
        </div>
      </div>
    </div>
  );
}