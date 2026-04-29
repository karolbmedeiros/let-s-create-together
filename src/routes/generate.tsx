import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useContractStore } from "@/lib/store/useContractStore";
import { buildContractDocx, uint8ToBase64, downloadDocx } from "@/lib/docx/buildContract";
import type { ContractFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, FileText, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Gerar Contrato — ContratoGen" },
      { name: "description", content: "Preencha o formulário e gere um contrato de locação." },
    ],
  }),
  component: GeneratePage,
});

const EMPTY: ContractFormData = {
  locadorNome: "",
  locadorDoc: "",
  locadorEndereco: "",
  locatarioNome: "",
  locatarioCpf: "",
  locatarioRg: "",
  locatarioEndereco: "",
  imovelEndereco: "",
  imovelDescricao: "",
  valorAluguel: "",
  prazoMeses: "12",
  dataInicio: "",
  diaVencimento: "5",
};

function GeneratePage() {
  const addContract = useContractStore((s) => s.addContract);
  const [form, setForm] = useState<ContractFormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState<{ base64: string; fileName: string } | null>(null);

  function set<K extends keyof ContractFormData>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGenerated(null);

    const required: (keyof ContractFormData)[] = [
      "locadorNome", "locatarioNome", "imovelEndereco", "valorAluguel", "prazoMeses", "dataInicio", "diaVencimento",
    ];
    const missing = required.filter((k) => !form[k].trim());
    if (missing.length > 0) {
      setError("Preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const bytes = await buildContractDocx(form);
      const base64 = uint8ToBase64(bytes);
      const safe = (s: string) => s.replace(/\s+/g, "_").replace(/[^\w-]/g, "");
      const fileName = `contrato_${safe(form.locatarioNome) || "locatario"}.docx`;

      addContract({
        id: crypto.randomUUID(),
        data: form,
        outputFileBase64: base64,
        generatedAt: new Date().toISOString(),
      });

      setGenerated({ base64, fileName });
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar o contrato. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Gerar Contrato</h1>
        <p className="mt-1 text-sm text-gray-500">
          Preencha o formulário abaixo. Um contrato de locação residencial será gerado em .docx.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Dados do Locador">
          <Field label="Nome completo *">
            <Input value={form.locadorNome} onChange={(e) => set("locadorNome", e.target.value)} maxLength={200} />
          </Field>
          <Field label="CPF / CNPJ">
            <Input value={form.locadorDoc} onChange={(e) => set("locadorDoc", e.target.value)} maxLength={20} />
          </Field>
          <Field label="Endereço" full>
            <Input value={form.locadorEndereco} onChange={(e) => set("locadorEndereco", e.target.value)} maxLength={300} />
          </Field>
        </Section>

        <Section title="Dados do Locatário">
          <Field label="Nome completo *">
            <Input value={form.locatarioNome} onChange={(e) => set("locatarioNome", e.target.value)} maxLength={200} />
          </Field>
          <Field label="CPF">
            <Input value={form.locatarioCpf} onChange={(e) => set("locatarioCpf", e.target.value)} maxLength={20} />
          </Field>
          <Field label="RG">
            <Input value={form.locatarioRg} onChange={(e) => set("locatarioRg", e.target.value)} maxLength={20} />
          </Field>
          <Field label="Endereço atual" full>
            <Input value={form.locatarioEndereco} onChange={(e) => set("locatarioEndereco", e.target.value)} maxLength={300} />
          </Field>
        </Section>

        <Section title="Imóvel">
          <Field label="Endereço completo *" full>
            <Input value={form.imovelEndereco} onChange={(e) => set("imovelEndereco", e.target.value)} maxLength={300} />
          </Field>
          <Field label="Descrição (cômodos, área, etc.)" full>
            <Textarea value={form.imovelDescricao} onChange={(e) => set("imovelDescricao", e.target.value)} rows={3} maxLength={1000} />
          </Field>
        </Section>

        <Section title="Contrato">
          <Field label="Valor mensal do aluguel (R$) *">
            <Input value={form.valorAluguel} onChange={(e) => set("valorAluguel", e.target.value)} maxLength={20} placeholder="2.500,00" />
          </Field>
          <Field label="Prazo (meses) *">
            <Input type="number" min={1} max={120} value={form.prazoMeses} onChange={(e) => set("prazoMeses", e.target.value)} />
          </Field>
          <Field label="Data de início *">
            <Input type="date" value={form.dataInicio} onChange={(e) => set("dataInicio", e.target.value)} />
          </Field>
          <Field label="Dia de vencimento *">
            <Input type="number" min={1} max={31} value={form.diaVencimento} onChange={(e) => set("diaVencimento", e.target.value)} />
          </Field>
        </Section>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 text-white hover:bg-blue-700">
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Gerando...</>
          ) : (
            <><FileText className="mr-2 h-4 w-4" />Gerar Contrato</>
          )}
        </Button>
      </form>

      {generated && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-5">
          <div>
            <h2 className="text-sm font-semibold text-green-900">Contrato gerado!</h2>
            <p className="text-xs text-green-700">Arquivo: {generated.fileName}</p>
          </div>
          <Button onClick={() => downloadDocx(generated.base64, generated.fileName)} className="bg-green-600 text-white hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" />
            Baixar .docx
          </Button>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-gray-200 bg-white p-6">
      <legend className="px-2 text-sm font-semibold text-gray-900">{title}</legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  );
}
