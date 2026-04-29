import { useEffect } from "react";
import { useTemplateStore } from "@/lib/store/useTemplateStore";
import { useContractStore } from "@/lib/store/useContractStore";

/**
 * Reidrata os stores Zustand do localStorage no cliente.
 * Necessário porque os stores usam `skipHydration: true` (SSR-safe).
 */
export function HydrationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useTemplateStore.persist.rehydrate();
    void useContractStore.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
