import { useEffect } from "react";
import { useContractStore } from "@/lib/store/useContractStore";

/**
 * Reidrata o store Zustand do localStorage no cliente.
 */
export function HydrationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useContractStore.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
