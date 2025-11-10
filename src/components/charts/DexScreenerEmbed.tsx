import { Card } from "@/components/ui/card";

interface DexScreenerEmbedProps {
  contractAddress: string;
}

export function DexScreenerEmbed({ contractAddress }: DexScreenerEmbedProps) {
  const embedUrl = `https://dexscreener.com/solana/${contractAddress}?embed=1&theme=dark&trades=0&info=0`;

  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full border-0"
          title="DexScreener Chart"
          allow="clipboard-write"
        />
      </div>
    </Card>
  );
}
