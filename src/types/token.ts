export interface TokenPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap?: number;
  pairCreatedAt: number;
  info?: {
    imageUrl?: string;
    header?: string;
    websites?: Array<{ label?: string; url: string }>;
    socials?: Array<{ type: string; url: string }>;
  };
}

export interface DexScreenerResponse {
  schemaVersion: string;
  pairs: TokenPair[] | null;
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  buys: number;
  sells: number;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  logo: string;
  address: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap?: number;
  liquidity: number;
  fdv: number;
  dex: string;
  chain: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  pairAddress: string;
  createdAt: number;
  buys24h: number;
  sells24h: number;
}
