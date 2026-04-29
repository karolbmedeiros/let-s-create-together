
# Iteração 1 — Setup base + Home + Geração de Contratos

> **Pendente:** o repositório `karolbmedeiros/let-s-create-together` retornou 404 (provavelmente nome/owner diferente ou privado). Este plano assume um projeto Next.js padrão com Tailwind + shadcn. Quando você me passar o link correto, eu ajusto:
> - cores, fontes e tokens do design system
> - conteúdo da home (textos, hero, CTAs)
> - campos exatos do formulário de contrato
> - template do contrato (formato, cláusulas, variáveis)

## Escopo desta iteração

1. **Fundação do projeto** (estrutura, layout global, navegação)
2. **Home page** (landing) em `/`
3. **Página de geração de contratos** em `/contratos/novo`
4. **Geração do arquivo** (PDF e/ou DOCX) via server function
5. **Sem auth e sem banco de dados** nesta iteração — fica para a próxima

---

## 1. Fundação

### Layout global (`src/routes/__root.tsx`)
- Wrapper `<html>`/`<body>` com fontes do Google Fonts
- Header compartilhado com logo + navegação (Home, Contratos)
- Footer simples
- Metadados padrão (title, description, og:*)

### Design system (`src/styles.css`)
- Manter Tailwind v4 + shadcn já instalados
- Portar tokens de cor do projeto Next (paleta atual) para variáveis `oklch`
- Configurar fonte principal e fonte de display

### Componentes shadcn já disponíveis (não precisam ser reinstalados)
Button, Card, Form, Input, Label, Select, Textarea, Dialog, Toast (sonner), Separator, etc.

---

## 2. Home page (`src/routes/index.tsx`)

Conteúdo placeholder até você me passar o conteúdo real:
- Hero com título, subtítulo, CTA → `/contratos/novo`
- Seção de "como funciona" (3 passos)
- Seção de tipos de contrato disponíveis (cards)
- CTA final
- `head()` com title/description/og próprios

---

## 3. Página de geração de contratos (`src/routes/contratos.novo.tsx`)

### Fluxo
```text
1. Usuário escolhe tipo de contrato (Select)
2. Formulário renderiza campos do template escolhido
3. Usuário preenche → preview ao lado (opcional)
4. Botão "Gerar PDF" / "Gerar DOCX"
5. Server function recebe os dados, preenche o template, devolve o arquivo
6. Browser baixa o arquivo
```

### Componentes
- `ContractTypeSelector` — Select com tipos disponíveis
- `ContractForm` — react-hook-form + zod, campos dinâmicos por tipo
- `ContractPreview` — renderiza o texto preenchido (HTML) ao lado
- `GenerateButtons` — "Baixar PDF" e "Baixar DOCX"

### Templates (placeholder)
Crio 1–2 templates de exemplo em `src/lib/contracts/templates.ts`:
- Contrato de prestação de serviço
- Contrato de confidencialidade (NDA)

Cada template define:
```typescript
{
  id: "prestacao-servico",
  label: "Prestação de Serviço",
  fields: [
    { name: "contratante", label: "Nome do contratante", type: "text", required: true },
    { name: "cnpjContratante", label: "CNPJ", type: "text", required: true },
    { name: "valor", label: "Valor (R$)", type: "number", required: true },
    { name: "prazoMeses", label: "Prazo (meses)", type: "number", required: true },
    // ...
  ],
  render: (data) => `... texto do contrato com ${data.contratante} ...`
}
```

> Quando você me passar o(s) template(s) reais do seu projeto Next, substituo esses exemplos.

---

## 4. Geração de arquivos (server functions)

Por que server function: a geração de PDF/DOCX usa libs com dependências pesadas — melhor não carregar no bundle do cliente.

### `src/server/contracts.functions.ts`
Duas server functions:

```typescript
generatePdfContract({ templateId, data }) → Response (application/pdf)
generateDocxContract({ templateId, data }) → Response (application/vnd...docx)
```

Validação com Zod (`inputValidator`).

### Bibliotecas (compatíveis com Cloudflare Worker)
- **PDF:** `@react-pdf/renderer` ou `pdf-lib` (puro JS, edge-compatible)
- **DOCX:** `docx` (puro JS, edge-compatible)

> ⚠️ **Não usar** `puppeteer`, `playwright`, `wkhtmltopdf`, `sharp` — não funcionam no runtime do Worker. Já validado no contexto de runtime.

### Fluxo de download
Server function devolve o buffer com headers corretos (`Content-Disposition: attachment; filename=...`) e o cliente faz `window.location = url` ou cria um `<a download>` com blob.

---

## 5. Estrutura de arquivos a criar

```text
src/
├── routes/
│   ├── __root.tsx                 (atualizar: header/footer/fontes)
│   ├── index.tsx                  (substituir placeholder pela home real)
│   └── contratos.novo.tsx         (NOVO: página de geração)
├── components/
│   ├── layout/
│   │   ├── Header.tsx             (NOVO)
│   │   └── Footer.tsx             (NOVO)
│   └── contracts/
│       ├── ContractTypeSelector.tsx
│       ├── ContractForm.tsx
│       ├── ContractPreview.tsx
│       └── GenerateButtons.tsx
├── lib/
│   └── contracts/
│       ├── templates.ts           (definição dos templates)
│       └── schemas.ts             (Zod schemas por template)
├── server/
│   ├── contracts.functions.ts     (server fns generate PDF/DOCX)
│   └── contracts.server.ts        (helpers: render PDF/DOCX)
└── styles.css                     (atualizar tokens)
```

Dependências novas a instalar: `@react-pdf/renderer` (ou `pdf-lib`), `docx`, `react-hook-form`, `zod`, `@hookform/resolvers`.

---

## 6. O que NÃO entra nesta iteração

- Auth (login/signup)
- Banco de dados / salvar contratos gerados
- Histórico de contratos do usuário
- Edição rica do texto do contrato
- Múltiplos idiomas
- Outras páginas do site (about, pricing, etc.)

Fica tudo para iterações seguintes, depois que validarmos o padrão base.

---

## Próximo passo antes de implementar

Preciso de:
1. **Link correto do repo** (ou os arquivos por upload)
2. Confirmação dos **tipos de contrato** que devem aparecer na iteração 1 (sugiro 1 ou 2 templates para começar)
3. **Formato preferido**: PDF, DOCX, ou ambos?

Assim que confirmar, executo o plano direto no projeto.
