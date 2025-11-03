import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState<string>("");

  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;
    if (typeof ethereum !== "undefined") {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts[0]) {
          const address = accounts[0];
          setWalletAddress(
            `${address.slice(0, 6)}...${address.slice(-4)}`
          );
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature");
    }
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-primary">
              SwapX
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Swap
              </Link>
              <Link
                to="/charity"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/charity" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Charity
              </Link>
            </nav>
          </div>
          <Button onClick={connectWallet} className="gap-2">
            <Wallet className="h-4 w-4" />
            {walletAddress || "Connect Wallet"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
