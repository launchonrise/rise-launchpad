import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { getProgram } from "@/utils/program";

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) return null;
    return getProgram(wallet, connection);
  }, [wallet, connection]);

  return { program, wallet, connection };
}
