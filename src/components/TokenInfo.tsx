import { TokenInfo as TokenInfoType } from "@/types/token";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Globe, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TokenInfoProps {
  tokenInfo: TokenInfoType;
}

export function TokenInfo({ tokenInfo }: TokenInfoProps) {
  const { toast } = useToast();

  const copyAddress = () => {
    navigator.clipboard.writeText(tokenInfo.address);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard",
    });
  };

  const formatNumber = (num: number | undefined, decimals = 2): string => {
    if (num === undefined || num === null) return "N/A";
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPrice = (price: number): string => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const getPriceChangeColor = (change: number): string => {
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {tokenInfo.logo && (
            <img
              src={tokenInfo.logo}
              alt={tokenInfo.symbol}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold break-words">
              {tokenInfo.name} ({tokenInfo.symbol})
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="uppercase">{tokenInfo.dex}</span>
              <span>•</span>
              <span className="uppercase">{tokenInfo.chain}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-bold">{formatPrice(tokenInfo.price)}</div>
          <div className={`text-base md:text-lg font-semibold ${getPriceChangeColor(tokenInfo.priceChange24h)}`}>
            {tokenInfo.priceChange24h >= 0 ? "↑" : "↓"} {Math.abs(tokenInfo.priceChange24h).toFixed(2)}% (24h)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Market Cap</div>
          <div className="text-lg font-semibold">{formatNumber(tokenInfo.marketCap)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">FDV</div>
          <div className="text-lg font-semibold">{formatNumber(tokenInfo.fdv)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">24h Volume</div>
          <div className="text-lg font-semibold">{formatNumber(tokenInfo.volume24h)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Liquidity</div>
          <div className="text-lg font-semibold">{formatNumber(tokenInfo.liquidity)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
        <div>
          <div className="text-sm text-muted-foreground">24h Buys</div>
          <div className="text-lg font-semibold text-green-500">{tokenInfo.buys24h}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">24h Sells</div>
          <div className="text-lg font-semibold text-red-500">{tokenInfo.sells24h}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-muted-foreground">Contract Address</div>
          <div className="font-mono text-sm truncate">{tokenInfo.address}</div>
        </div>
        <Button variant="outline" size="sm" onClick={copyAddress}>
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 pt-2 border-t">
        {tokenInfo.socialLinks.website && (
          <Button variant="outline" size="sm" asChild>
            <a href={tokenInfo.socialLinks.website} target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4 mr-2" />
              Website
            </a>
          </Button>
        )}
        {tokenInfo.socialLinks.twitter && (
          <Button variant="outline" size="sm" asChild>
            <a href={tokenInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://dexscreener.com/solana/${tokenInfo.pairAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on DexScreener
          </a>
        </Button>
      </div>
    </Card>
  );
}
