// lib/clvrbridge.ts
// CLVRBRIDGE SDK wrapper for Srvivr Wallet
// Routes every trade through 21 providers to find the best price

const API_URL = process.env.NEXT_PUBLIC_CLVRBRIDGE_API_URL || 'https://clvrbridge.onrender.com';
const API_KEY = process.env.NEXT_PUBLIC_CLVRBRIDGE_API_KEY || '';

export interface Quote {
  provider: string;
  type: 'BUY' | 'SELL' | 'SWAP';
  priority: number;
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  fee: number;
  estimatedTimeMs: number;
  successRate: number;
  executionType: string;
}

export interface RouteResponse {
  requestId: string;
  responseTimeMs: number;
  quotes: Quote[];
  bestQuote: Quote;
  status: string;
}

export async function routeBuy(
  fiatCurrency: string,
  fiatAmount: number,
  cryptoCurrency: string
): Promise<RouteResponse> {
  return route('BUY', { fiatCurrency, fiatAmount, cryptoCurrency });
}

export async function routeSell(
  cryptoCurrency: string,
  cryptoAmount: number,
  fiatCurrency: string
): Promise<RouteResponse> {
  return route('SELL', { cryptoCurrency, cryptoAmount, fiatCurrency });
}

export async function routeSwap(
  fromAsset: string,
  toAsset: string,
  fromAmount: number,
  network: string = 'ethereum'
): Promise<RouteResponse> {
  return route('SWAP', { fromAsset, toAsset, fromAmount, network });
}

async function route(type: string, params: Record<string, unknown>): Promise<RouteResponse> {
  const res = await fetch(`${API_URL}/api/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      type,
      ...params,
      country: 'US',
      walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    }),
  });

  if (!res.ok) {
    throw new Error(`CLVRBRIDGE API error: ${res.status}`);
  }

  return res.json();
}