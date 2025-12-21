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
    <Card className="p-4 md:p-6 space-y-4 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          {tokenInfo.logo && (
            <img
              src={tokenInfo.logo}
              alt={tokenInfo.symbol}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg md:text-2xl font-bold truncate">
              {tokenInfo.name} ({tokenInfo.symbol})
            </h2>
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground truncate">
              <span className="uppercase">{tokenInfo.dex}</span>
              <span>•</span>
              <span className="uppercase">{tokenInfo.chain}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between md:flex-col md:text-right items-center md:items-end border-t md:border-t-0 pt-2 md:pt-0 gap-4">
          <div className="text-xl md:text-3xl font-bold truncate">{formatPrice(tokenInfo.price)}</div>
          <div className={`text-sm md:text-lg font-semibold whitespace-nowrap ${getPriceChangeColor(tokenInfo.priceChange24h)}`}>
            {tokenInfo.priceChange24h >= 0 ? "↑" : "↓"} {Math.abs(tokenInfo.priceChange24h).toFixed(2)}% (24h)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground truncate">Market Cap</div>
          <div className="text-lg font-semibold truncate">{formatNumber(tokenInfo.marketCap)}</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground truncate">FDV</div>
          <div className="text-lg font-semibold truncate">{formatNumber(tokenInfo.fdv)}</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground truncate">24h Volume</div>
          <div className="text-lg font-semibold truncate">{formatNumber(tokenInfo.volume24h)}</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground truncate">Liquidity</div>
          <div className="text-lg font-semibold truncate">{formatNumber(tokenInfo.liquidity)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground truncate">24h Buys</div>
          <div className="text-lg font-semibold text-green-500 truncate">{tokenInfo.buys24h}</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground truncate">24h Sells</div>
          <div className="text-lg font-semibold text-red-500 truncate">{tokenInfo.sells24h}</div>
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
