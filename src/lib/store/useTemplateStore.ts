import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Template } from "@/types";

interface TemplateStore {
  templates: Template[];
  addTemplate: (template: Template) => void;
  removeTemplate: (id: string) => void;
  getTemplateById: (id: string) => Template | undefined;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],
      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),
      removeTemplate: (id) =>
        set((state) => ({ templates: state.templates.filter((t) => t.id !== id) })),
      getTemplateById: (id) => get().templates.find((t) => t.id === id),
    }),
    {
      name: "contract_templates",
      storage: createJSONStorage(() => localStorage),
      // Só hidrata no cliente (TanStack Start faz SSR)
      skipHydration: true,
    },
  ),
);
