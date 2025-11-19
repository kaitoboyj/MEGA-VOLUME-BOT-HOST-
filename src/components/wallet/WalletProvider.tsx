import { useMemo, ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";

import "@solana/wallet-adapter-react-ui/styles.css";

const QUICKNODE_RPC = "https://fragrant-red-waterfall.solana-mainnet.quiknode.pro/5c9236679b5bdd256642d8d3d3193e6d6809db04/";

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(() => {
    const base = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

    const projectId = import.meta.env.VITE_WC_PROJECT_ID as string | undefined;
    if (projectId) {
      const iconUrl = new URL("/joke.jpg", window.location.origin).toString();
      base.push(
        new WalletConnectWalletAdapter({
          network: "mainnet",
          options: {
            projectId,
            metadata: {
              name: "MEGA Volume",
              description: "Boost volume, transactions, and ads",
              url: window.location.origin,
              icons: [iconUrl],
            },
          },
        })
      );
    }
    return base;
  }, []);

  return (
    <ConnectionProvider endpoint={QUICKNODE_RPC}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
