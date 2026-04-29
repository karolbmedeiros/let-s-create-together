import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileText,
  ClipboardList,
  Download,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTRACT_TEMPLATES } from "@/lib/contracts/templates";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Contratual — Gere contratos profissionais em minutos" },
      {
        name: "description",
        content:
          "Modelos prontos de contratos. Preencha um formulário simples e baixe em PDF ou DOCX, sem complicação.",
      },
      { property: "og:title", content: "Contratual — Contratos em minutos" },
      {
        property: "og:description",
        content:
          "Prestação de Serviço, NDA e mais. Gere e baixe em PDF ou DOCX em poucos cliques.",
      },
    ],
  }),
  component: HomePage,
});

const STEPS = [
  {
    icon: ClipboardList,
    title: "Escolha um modelo",
    body: "Selecione entre os modelos disponíveis o que melhor se encaixa no seu caso.",
  },
  {
    icon: Sparkles,
    title: "Preencha os dados",
    body: "Um formulário guiado garante que nada essencial fique de fora.",
  },
  {
    icon: Download,
    title: "Baixe e assine",
    body: "Exporte em PDF ou DOCX, revise e leve para a assinatura.",
  },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundImage: "var(--gradient-subtle)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Modelos revisados e prontos para uso
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Contratos profissionais{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                em minutos
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Escolha um modelo, preencha um formulário simples e baixe seu
              contrato em PDF ou DOCX. Sem fricção, sem advogado de plantão.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="shadow-lg">
                <Link to="/contratos/novo">
                  Criar meu contrato
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#modelos">Ver modelos</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Como funciona
          </h2>
          <p className="mt-3 text-muted-foreground">
            Três passos para um contrato pronto.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Card key={step.title} className="border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Passo {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Modelos */}
      <section
        id="modelos"
        className="border-t border-border bg-card/30 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Modelos disponíveis
            </h2>
            <p className="mt-3 text-muted-foreground">
              Comece pelo que mais combina com sua necessidade.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {CONTRACT_TEMPLATES.map((t) => (
              <Card
                key={t.id}
                className="group border shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="flex h-full flex-col pt-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{t.label}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {t.description}
                  </p>
                  <div className="mt-6">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/contratos/novo">
                        Usar este modelo
                        <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Card
          className="overflow-hidden border-0 shadow-xl"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <CardContent className="p-10 text-center text-primary-foreground sm:p-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Pronto para gerar seu primeiro contrato?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base opacity-90">
              Leva menos de 5 minutos. Sem cadastro, sem complicação.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" variant="secondary" className="shadow-lg">
                <Link to="/contratos/novo">
                  Começar agora
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
