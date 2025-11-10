import { DexScreenerResponse } from "@/types/token";

const BASE_URL = "https://api.dexscreener.com";

export async function getTokenData(
  tokenAddress: string
): Promise<DexScreenerResponse> {
  const response = await fetch(
    `${BASE_URL}/latest/dex/tokens/${tokenAddress}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch token data: ${response.statusText}`);
  }

  return response.json();
}

export async function searchTokenPairs(query: string) {
  const response = await fetch(`${BASE_URL}/latest/dex/search?q=${query}`);

  if (!response.ok) {
    throw new Error(`Failed to search: ${response.statusText}`);
  }

  return response.json();
}
