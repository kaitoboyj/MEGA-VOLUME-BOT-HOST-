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
import { SolanaMobileWalletAdapter } from "@solana-mobile/wallet-adapter-mobile";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";

import "@solana/wallet-adapter-react-ui/styles.css";

const QUICKNODE_RPC = "https://broken-evocative-tent.solana-mainnet.quiknode.pro/f8ee7dd796ee5973635eb42a3bc69f63a60d1e1f/";
const PUBLIC_RPC = "https://api.mainnet-beta.solana.com";

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(() => {
    const base = [
      new SolanaMobileWalletAdapter({
        addressSelector: { createConsent: (cs) => cs },
        appIdentity: {
          name: "MEGA Volume",
          uri: window.location.origin,
          icon: new URL("/joke.jpg", window.location.origin).toString(),
        },
        authorizationResultCache: { createConsent: (cs) => cs },
        cluster: "mainnet-beta",
        onWalletNotFound: (createConsent) => createConsent,
      }),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ];

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
