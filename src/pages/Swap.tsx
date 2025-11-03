import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, Settings } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";

const tokens = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠" },
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
  { symbol: "USDT", name: "Tether", icon: "₮" },
  { symbol: "DAI", name: "Dai", icon: "◈" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", icon: "₿" },
];

const Swap = () => {
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(`Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Simple mock conversion rate (1:1 for demo)
    if (value && !isNaN(parseFloat(value))) {
      setToAmount((parseFloat(value) * 0.98).toFixed(6));
    } else {
      setToAmount("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Swap</h2>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {/* From Token */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">From</span>
                  <span className="text-sm text-muted-foreground">Balance: 0.00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="border-0 bg-transparent text-2xl font-semibold p-0 h-auto focus-visible:ring-0"
                  />
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-[140px] border-0 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{token.icon}</span>
                            <span>{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Direction Button */}
              <div className="flex justify-center -my-2 relative z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapTokens}
                  className="rounded-full bg-background hover:bg-muted"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              {/* To Token */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">To</span>
                  <span className="text-sm text-muted-foreground">Balance: 0.00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={toAmount}
                    readOnly
                    className="border-0 bg-transparent text-2xl font-semibold p-0 h-auto focus-visible:ring-0"
                  />
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-[140px] border-0 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{token.icon}</span>
                            <span>{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Exchange Rate Info */}
              {fromAmount && toAmount && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  1 {fromToken} ≈ {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}
                </div>
              )}

              {/* Swap Button */}
              <Button onClick={handleSwap} className="w-full mt-4" size="lg">
                Swap
              </Button>
            </div>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Connect your wallet to start swapping</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
