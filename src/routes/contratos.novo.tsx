import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CONTRACT_TEMPLATES, getTemplate } from "@/lib/contracts/templates";
import {
  generateContractPdf,
  generateContractDocx,
} from "@/server/contracts.functions";

export const Route = createFileRoute("/contratos/novo")({
  head: () => ({
    meta: [
      { title: "Novo contrato — Contratual" },
      {
        name: "description",
        content:
          "Escolha um modelo, preencha os campos e baixe seu contrato em PDF ou DOCX.",
      },
      { property: "og:title", content: "Novo contrato — Contratual" },
      {
        property: "og:description",
        content: "Modelos prontos: Prestação de Serviço, NDA e mais.",
      },
    ],
  }),
  component: NovoContratoPage,
});

type FormValues = Record<string, string>;

function downloadFromBase64(base64: string, mimeType: string, filename: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function NovoContratoPage() {
  const [templateId, setTemplateId] = useState<string>(CONTRACT_TEMPLATES[0].id);
  const [pending, setPending] = useState<"pdf" | "docx" | null>(null);

  const template = useMemo(() => getTemplate(templateId)!, [templateId]);

  const generatePdfFn = useServerFn(generateContractPdf);
  const generateDocxFn = useServerFn(generateContractDocx);

  // Recriar o form quando troca o template (defaultValues + resolver mudam)
  const defaultValues = useMemo<FormValues>(() => {
    const v: FormValues = {};
    for (const f of template.fields) v[f.name] = "";
    return v;
  }, [template]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(template.schema),
    defaultValues,
    mode: "onBlur",
  });

  // Reset quando o template muda
  useMemo(() => reset(defaultValues), [defaultValues, reset]);

  const liveValues = watch();
  const previewContent = useMemo(() => {
    // Substitui campos vazios por placeholder visual no preview
    const filled: Record<string, string> = {};
    for (const f of template.fields) {
      filled[f.name] = liveValues[f.name]?.trim() || `[${f.label}]`;
    }
    return template.render(filled);
  }, [template, liveValues]);

  async function onGenerate(format: "pdf" | "docx", values: FormValues) {
    setPending(format);
    try {
      const fn = format === "pdf" ? generatePdfFn : generateDocxFn;
      const result = await fn({ data: { templateId, data: values } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      downloadFromBase64(result.base64, result.mimeType, result.filename);
      toast.success(`Contrato ${format.toUpperCase()} gerado com sucesso!`);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível gerar o arquivo. Tente novamente.");
    } finally {
      setPending(null);
    }
  }

  function onInvalid(errs: FieldErrors<FormValues>) {
    const first = Object.values(errs)[0];
    toast.error(
      typeof first?.message === "string"
        ? first.message
        : "Verifique os campos do formulário.",
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Novo contrato</h1>
        <p className="mt-2 text-muted-foreground">
          Escolha um modelo, preencha os dados e baixe em PDF ou DOCX.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Formulário */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="space-y-2">
              <Label htmlFor="template">Modelo de contrato</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger id="template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <form
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
              noValidate
            >
              {template.fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: rhf }) =>
                      field.type === "textarea" ? (
                        <Textarea
                          id={field.name}
                          placeholder={field.placeholder}
                          rows={4}
                          {...rhf}
                        />
                      ) : (
                        <Input
                          id={field.name}
                          type={
                            field.type === "number"
                              ? "number"
                              : field.type === "date"
                                ? "date"
                                : "text"
                          }
                          placeholder={field.placeholder}
                          {...rhf}
                        />
                      )
                    }
                  />
                  {errors[field.name]?.message && (
                    <p className="text-xs text-destructive">
                      {String(errors[field.name]?.message)}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                <Button
                  type="button"
                  className="flex-1"
                  disabled={pending !== null}
                  onClick={handleSubmit((v) => onGenerate("pdf", v), onInvalid)}
                >
                  {pending === "pdf" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Download />
                  )}
                  Baixar PDF
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  disabled={pending !== null}
                  onClick={handleSubmit((v) => onGenerate("docx", v), onInvalid)}
                >
                  {pending === "docx" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Download />
                  )}
                  Baixar DOCX
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Pré-visualização</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <article className="space-y-4 rounded-md bg-muted/40 p-6 font-serif text-sm leading-relaxed text-foreground">
              <h2 className="text-center font-display text-base font-bold uppercase tracking-wide">
                {previewContent.title}
              </h2>
              {previewContent.paragraphs.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  {p.heading && (
                    <p className="font-semibold">{p.heading}</p>
                  )}
                  {p.body.split("\n").map((line, i) => (
                    <p key={i} className="whitespace-pre-wrap">
                      {line || "\u00A0"}
                    </p>
                  ))}
                </div>
              ))}
            </article>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
