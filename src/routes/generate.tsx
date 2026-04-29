import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useTemplateStore } from "@/lib/store/useTemplateStore";
import { useContractStore } from "@/lib/store/useContractStore";
import { generateReplacements } from "@/server/ai.functions";
import { applyReplacementsToDocx, downloadDocx } from "@/lib/docx/applyReplacements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Download, AlertTriangle, FileText } from "lucide-react";
import type { Replacement } from "@/types";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Gerar Contrato — ContratoGen" },
      { name: "description", content: "Gere contratos personalizados a partir dos seus templates usando IA." },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const templates = useTemplateStore((s) => s.templates);
  const addContract = useContractStore((s) => s.addContract);
  const generateFn = useServerFn(generateReplacements);

  const [templateId, setTemplateId] = useState<string>("");
  const [tenantName, setTenantName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    replacements: Replacement[];
    notApplied: Replacement[];
    outputBase64: string;
    fileName: string;
  } | null>(null);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === templateId) ?? null,
    [templates, templateId],
  );

  async function handleGenerate() {
    setError("");
    setResult(null);

    if (!selectedTemplate) {
      setError("Selecione um template.");
      return;
    }
    if (!tenantName.trim()) {
      setError("Informe o nome do locatário.");
      return;
    }
    if (!instructions.trim()) {
      setError("Descreva as instruções para a geração.");
      return;
    }

    setLoading(true);
    try {
      const ai = await generateFn({
        data: {
          templateText: selectedTemplate.extractedText,
          tenantName: tenantName.trim(),
          instructions: instructions.trim(),
        },
      });

      if (ai.error) {
        setError(ai.error);
        return;
      }
      if (ai.replacements.length === 0) {
        setError("A IA não identificou substituições. Tente reformular as instruções.");
        return;
      }

      const { outputBase64, notApplied } = applyReplacementsToDocx(
        selectedTemplate.fileBase64,
        ai.replacements,
      );

      const fileName = `${selectedTemplate.name.replace(/\s+/g, "_")}_${tenantName.trim().replace(/\s+/g, "_")}.docx`;

      addContract({
        id: crypto.randomUUID(),
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        tenantName: tenantName.trim(),
        instructions: instructions.trim(),
        replacements: ai.replacements,
        outputFileBase64: outputBase64,
        generatedAt: new Date().toISOString(),
      });

      setResult({
        replacements: ai.replacements,
        notApplied,
        outputBase64,
        fileName,
      });
    } catch (e) {
      console.error(e);
      setError("Erro inesperado ao gerar o contrato.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Gerar Contrato</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecione um template, informe o locatário e descreva as informações para a IA preencher.
        </p>
      </header>

      {templates.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-600">
            Você ainda não tem templates. Adicione um na aba <strong>Templates</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} — {t.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">Nome do locatário</Label>
            <Input
              placeholder="Ex: João da Silva"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              className="text-sm"
              maxLength={200}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">
              Instruções / dados do contrato
            </Label>
            <Textarea
              placeholder="Ex: Valor do aluguel R$ 2.500,00. Início em 01/05/2026, prazo de 12 meses. Imóvel na Rua das Flores, 123, apto 42."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={6}
              maxLength={5000}
              className="text-sm"
            />
            <p className="text-xs text-gray-400">
              Quanto mais específico, melhor o preenchimento. {instructions.length}/5000
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando com IA...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Contrato
              </>
            )}
          </Button>
        </div>
      )}

      {result && (
        <div className="space-y-4 rounded-xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-green-900">
              Contrato gerado com {result.replacements.length} substituições
            </h2>
            <Button
              size="sm"
              onClick={() => downloadDocx(result.outputBase64, result.fileName)}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar .docx
            </Button>
          </div>

          {result.notApplied.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <p className="mb-1 font-semibold">
                {result.notApplied.length} substituição(ões) não encontrada(s) literalmente no .docx:
              </p>
              <ul className="ml-4 list-disc">
                {result.notApplied.slice(0, 5).map((r, i) => (
                  <li key={i}>
                    "{r.original}" → "{r.replacement}"
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto rounded-lg border border-green-200 bg-white p-3 text-xs">
            <p className="mb-2 font-semibold text-gray-700">Substituições aplicadas:</p>
            <ul className="space-y-1.5">
              {result.replacements.map((r, i) => (
                <li key={i} className="border-l-2 border-blue-400 pl-2">
                  <span className="text-gray-500 line-through">{r.original}</span>
                  <span className="mx-2 text-gray-400">→</span>
                  <span className="font-medium text-gray-900">{r.replacement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
