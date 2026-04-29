import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";

import { useTemplateStore } from "@/lib/store/useTemplateStore";
import type { TemplateCategory } from "@/types";
import { TemplateUploader } from "@/components/templates/TemplateUploader";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { CategoryFilter } from "@/components/templates/CategoryFilter";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates de Contrato — ContratoGen" },
      {
        name: "description",
        content: "Gerencie seus templates de contrato em formato .docx.",
      },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const templates = useTemplateStore((s) => s.templates);
  const [filter, setFilter] = useState<TemplateCategory | "Todos">("Todos");

  const filtered =
    filter === "Todos" ? templates : templates.filter((t) => t.category === filter);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Uploader */}
        <div className="lg:col-span-1">
          <TemplateUploader />
        </div>

        {/* List */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <CategoryFilter selected={filter} onChange={setFilter} />
            <span className="text-sm text-gray-500">
              {filtered.length} template{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-400">
              <FolderOpen className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p className="text-sm font-medium">Nenhum template encontrado</p>
              <p className="mt-1 text-xs">
                {filter === "Todos"
                  ? "Adicione um template usando o painel ao lado"
                  : `Nenhum template na categoria "${filter}"`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
