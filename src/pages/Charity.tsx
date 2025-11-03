import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";

const tokens = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠" },
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
  { symbol: "USDT", name: "Tether", icon: "₮" },
  { symbol: "DAI", name: "Dai", icon: "◈" },
];

const charities = [
  {
    name: "UNICEF",
    description: "Help children in need around the world",
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    icon: "🧒",
  },
  {
    name: "Red Cross",
    description: "Support disaster relief and humanitarian aid",
    wallet: "0x8B99F3660622e21f2910ECCA7fBe51d654a1517D",
    icon: "🏥",
  },
  {
    name: "Ocean Cleanup",
    description: "Combat ocean plastic pollution",
    wallet: "0x9F8cCdafCc39F3c7D6EBf637c9151673CBc36b88",
    icon: "🌊",
  },
  {
    name: "WWF",
    description: "Protect endangered species and habitats",
    wallet: "0x41c70eaC181eFB2Aa4fD8c0f19B4d9f4F1A8e2B4",
    icon: "🐼",
  },
];

const Charity = () => {
  const [selectedCharity, setSelectedCharity] = useState(charities[0]);
  const [donationAmount, setDonationAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("USDC");

  const handleDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    toast.success(
      `Thank you for donating ${donationAmount} ${selectedToken} to ${selectedCharity.name}!`,
      {
        description: "Your transaction is being processed",
      }
    );
    setDonationAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Heart className="h-10 w-10 text-primary" />
              Donate to Charity
            </h1>
            <p className="text-lg text-muted-foreground">
              Support causes that matter with cryptocurrency donations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {charities.map((charity) => (
              <Card
                key={charity.name}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedCharity.name === charity.name
                    ? "border-primary ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => setSelectedCharity(charity)}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{charity.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{charity.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {charity.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{charity.wallet.slice(0, 10)}...{charity.wallet.slice(-8)}</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Selected Charity
                </label>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <span className="text-2xl">{selectedCharity.icon}</span>
                  <span className="font-semibold">{selectedCharity.name}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Donation Amount
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="text-lg"
                  />
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger className="w-[140px]">
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

              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setDonationAmount(amount.toString())}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Donation Address</h4>
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {selectedCharity.wallet}
                </p>
              </div>

              <Button onClick={handleDonate} className="w-full" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Button>
            </div>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>All donations are final and cannot be refunded</p>
            <p className="mt-2">Connect your wallet to start donating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charity;
