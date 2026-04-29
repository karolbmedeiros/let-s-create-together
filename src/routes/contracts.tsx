import { createFileRoute, Link } from "@tanstack/react-router";
import { useContractStore } from "@/lib/store/useContractStore";
import { downloadDocx } from "@/lib/docx/buildContract";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FileText, Calendar, User } from "lucide-react";

export const Route = createFileRoute("/contracts")({
  head: () => ({
    meta: [
      { title: "Contratos Gerados — ContratoGen" },
      { name: "description", content: "Histórico de contratos gerados." },
    ],
  }),
  component: ContractsPage,
});

function ContractsPage() {
  const contracts = useContractStore((s) => s.contracts);
  const removeContract = useContractStore((s) => s.removeContract);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Contratos Gerados</h1>
        <p className="mt-1 text-sm text-gray-500">Histórico dos contratos criados.</p>
      </header>

      {contracts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-600">Nenhum contrato gerado ainda.</p>
          <Link to="/generate" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
            Gerar primeiro contrato →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => {
            const safe = (s: string) => s.replace(/\s+/g, "_").replace(/[^\w-]/g, "");
            const fileName = `contrato_${safe(c.data.locatarioNome) || "locatario"}.docx`;
            return (
              <article key={c.id} className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5">
                <div className="min-w-0 flex-1 space-y-2">
                  <h2 className="truncate text-sm font-semibold text-gray-900">
                    Contrato — {c.data.locatarioNome || "Sem nome"}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Locador: {c.data.locadorNome || "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(c.generatedAt).toLocaleString("pt-BR")}
                    </span>
                    <span>R$ {c.data.valorAluguel || "—"} / {c.data.prazoMeses}m</span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => downloadDocx(c.outputFileBase64, fileName)}>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Baixar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { if (confirm("Excluir este contrato?")) removeContract(c.id); }}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
