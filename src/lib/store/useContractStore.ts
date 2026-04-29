import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GeneratedContract } from "@/types";

interface ContractStore {
  contracts: GeneratedContract[];
  addContract: (contract: GeneratedContract) => void;
  removeContract: (id: string) => void;
}

export const useContractStore = create<ContractStore>()(
  persist(
    (set) => ({
      contracts: [],
      addContract: (contract) =>
        set((state) => ({ contracts: [contract, ...state.contracts] })),
      removeContract: (id) =>
        set((state) => ({ contracts: state.contracts.filter((c) => c.id !== id) })),
    }),
    {
      name: "contract_generated",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
