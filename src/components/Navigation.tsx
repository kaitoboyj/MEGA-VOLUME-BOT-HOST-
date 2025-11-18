import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";
import logo from "@/assets/mega-volume-logo.jpg";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 h-auto py-3 md:h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="MEGA boost" className="h-10 w-10 rounded-lg" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              MEGA boost
            </span>
          </Link>
          <div className="flex items-center min-w-0">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
