import { z } from "zod";

/**
 * Tipos de contrato disponíveis na iteração 1.
 * Cada template define seus campos, schema de validação e função de renderização.
 */

export type FieldType = "text" | "textarea" | "number" | "date";

export interface TemplateField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
}

export interface ContractParagraph {
  /** Título opcional do parágrafo (renderizado em negrito) */
  heading?: string;
  /** Texto do parágrafo, já com placeholders substituídos */
  body: string;
}

export interface ContractTemplate {
  id: string;
  label: string;
  description: string;
  fields: TemplateField[];
  schema: z.ZodObject<z.ZodRawShape>;
  /** Retorna título + parágrafos prontos para o renderer (PDF/DOCX) */
  render: (data: Record<string, string>) => {
    title: string;
    paragraphs: ContractParagraph[];
  };
}

const cnpjRegex = /^[\d./-]{14,18}$/;
const cpfRegex = /^[\d./-]{11,14}$/;

/* ----------------------------- Prestação de Serviço ----------------------------- */

const prestacaoServicoSchema = z.object({
  contratante: z.string().trim().min(2, "Informe o nome do contratante").max(150),
  documentoContratante: z
    .string()
    .trim()
    .min(11, "Informe um CNPJ ou CPF válido")
    .max(20)
    .refine((v) => cnpjRegex.test(v) || cpfRegex.test(v), "CNPJ/CPF inválido"),
  enderecoContratante: z.string().trim().min(5, "Informe o endereço").max(250),

  contratado: z.string().trim().min(2, "Informe o nome do contratado").max(150),
  documentoContratado: z
    .string()
    .trim()
    .min(11, "Informe um CNPJ ou CPF válido")
    .max(20)
    .refine((v) => cnpjRegex.test(v) || cpfRegex.test(v), "CNPJ/CPF inválido"),
  enderecoContratado: z.string().trim().min(5, "Informe o endereço").max(250),

  objeto: z
    .string()
    .trim()
    .min(10, "Descreva o objeto do contrato com pelo menos 10 caracteres")
    .max(2000),
  valor: z.string().trim().min(1, "Informe o valor").max(50),
  formaPagamento: z.string().trim().min(2, "Informe a forma de pagamento").max(200),
  prazoMeses: z.string().trim().min(1, "Informe o prazo").max(10),
  cidade: z.string().trim().min(2, "Informe a cidade").max(100),
  data: z.string().trim().min(8, "Informe a data").max(20),
});

const prestacaoServico: ContractTemplate = {
  id: "prestacao-servico",
  label: "Prestação de Serviço",
  description: "Contrato padrão para prestação de serviços entre duas partes.",
  schema: prestacaoServicoSchema,
  fields: [
    { name: "contratante", label: "Nome do contratante", type: "text", placeholder: "Empresa X Ltda." },
    { name: "documentoContratante", label: "CNPJ/CPF do contratante", type: "text", placeholder: "00.000.000/0000-00" },
    { name: "enderecoContratante", label: "Endereço do contratante", type: "text" },

    { name: "contratado", label: "Nome do contratado", type: "text", placeholder: "Fulano de Tal" },
    { name: "documentoContratado", label: "CNPJ/CPF do contratado", type: "text" },
    { name: "enderecoContratado", label: "Endereço do contratado", type: "text" },

    {
      name: "objeto",
      label: "Objeto do contrato",
      type: "textarea",
      placeholder: "Descrição detalhada dos serviços a serem prestados.",
    },
    { name: "valor", label: "Valor total (R$)", type: "text", placeholder: "10.000,00" },
    { name: "formaPagamento", label: "Forma de pagamento", type: "text", placeholder: "Em 3 parcelas mensais via PIX" },
    { name: "prazoMeses", label: "Prazo (meses)", type: "number", placeholder: "6" },
    { name: "cidade", label: "Cidade", type: "text", placeholder: "São Paulo" },
    { name: "data", label: "Data de assinatura", type: "date" },
  ],
  render: (d) => ({
    title: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS",
    paragraphs: [
      {
        heading: "DAS PARTES",
        body: `CONTRATANTE: ${d.contratante}, inscrito(a) sob o nº ${d.documentoContratante}, com endereço em ${d.enderecoContratante}.\n\nCONTRATADO: ${d.contratado}, inscrito(a) sob o nº ${d.documentoContratado}, com endereço em ${d.enderecoContratado}.`,
      },
      {
        heading: "CLÁUSULA 1ª — DO OBJETO",
        body: `O presente contrato tem por objeto a prestação dos seguintes serviços pelo CONTRATADO ao CONTRATANTE:\n\n${d.objeto}`,
      },
      {
        heading: "CLÁUSULA 2ª — DO VALOR E FORMA DE PAGAMENTO",
        body: `Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO o valor total de R$ ${d.valor}, na seguinte forma: ${d.formaPagamento}.`,
      },
      {
        heading: "CLÁUSULA 3ª — DO PRAZO",
        body: `O presente contrato terá vigência de ${d.prazoMeses} (${d.prazoMeses}) meses, contados da data de sua assinatura, podendo ser prorrogado mediante acordo entre as partes.`,
      },
      {
        heading: "CLÁUSULA 4ª — DAS OBRIGAÇÕES",
        body: "O CONTRATADO obriga-se a executar os serviços com diligência, qualidade técnica e dentro dos prazos acordados. O CONTRATANTE obriga-se a fornecer todas as informações e condições necessárias à execução dos serviços e a efetuar o pagamento na forma pactuada.",
      },
      {
        heading: "CLÁUSULA 5ª — DO FORO",
        body: `Fica eleito o foro da comarca de ${d.cidade} para dirimir quaisquer questões oriundas do presente contrato.`,
      },
      {
        body: `E, por estarem assim justos e contratados, firmam o presente instrumento.\n\n${d.cidade}, ${d.data}.`,
      },
      {
        body: "_______________________________\nCONTRATANTE\n\n_______________________________\nCONTRATADO",
      },
    ],
  }),
};

/* ----------------------------- NDA / Confidencialidade ----------------------------- */

const ndaSchema = z.object({
  parteReveladora: z.string().trim().min(2, "Informe a parte reveladora").max(150),
  documentoReveladora: z.string().trim().min(11).max(20),
  parteReceptora: z.string().trim().min(2, "Informe a parte receptora").max(150),
  documentoReceptora: z.string().trim().min(11).max(20),
  finalidade: z.string().trim().min(10, "Descreva a finalidade").max(1000),
  vigenciaAnos: z.string().trim().min(1, "Informe a vigência em anos").max(5),
  cidade: z.string().trim().min(2).max(100),
  data: z.string().trim().min(8).max(20),
});

const nda: ContractTemplate = {
  id: "nda",
  label: "Termo de Confidencialidade (NDA)",
  description: "Acordo bilateral de não divulgação de informações confidenciais.",
  schema: ndaSchema,
  fields: [
    { name: "parteReveladora", label: "Parte reveladora", type: "text" },
    { name: "documentoReveladora", label: "CNPJ/CPF da parte reveladora", type: "text" },
    { name: "parteReceptora", label: "Parte receptora", type: "text" },
    { name: "documentoReceptora", label: "CNPJ/CPF da parte receptora", type: "text" },
    {
      name: "finalidade",
      label: "Finalidade da troca de informações",
      type: "textarea",
      placeholder: "Avaliação de uma possível parceria comercial...",
    },
    { name: "vigenciaAnos", label: "Vigência (anos)", type: "number", placeholder: "2" },
    { name: "cidade", label: "Cidade", type: "text" },
    { name: "data", label: "Data", type: "date" },
  ],
  render: (d) => ({
    title: "TERMO DE CONFIDENCIALIDADE — NDA",
    paragraphs: [
      {
        heading: "DAS PARTES",
        body: `PARTE REVELADORA: ${d.parteReveladora}, inscrita sob o nº ${d.documentoReveladora}.\n\nPARTE RECEPTORA: ${d.parteReceptora}, inscrita sob o nº ${d.documentoReceptora}.`,
      },
      {
        heading: "CLÁUSULA 1ª — DA FINALIDADE",
        body: `As partes celebram o presente termo com a finalidade de: ${d.finalidade}`,
      },
      {
        heading: "CLÁUSULA 2ª — DA CONFIDENCIALIDADE",
        body: "A PARTE RECEPTORA compromete-se a manter sob sigilo absoluto todas as informações confidenciais recebidas da PARTE REVELADORA, abstendo-se de divulgá-las, reproduzi-las ou utilizá-las para qualquer finalidade diversa da prevista neste termo.",
      },
      {
        heading: "CLÁUSULA 3ª — DA VIGÊNCIA",
        body: `O dever de confidencialidade vigorará pelo prazo de ${d.vigenciaAnos} (${d.vigenciaAnos}) anos, contados da assinatura deste termo, mesmo após o encerramento de qualquer relação entre as partes.`,
      },
      {
        heading: "CLÁUSULA 4ª — DAS PENALIDADES",
        body: "O descumprimento de qualquer cláusula deste termo sujeitará a parte infratora ao pagamento das perdas e danos apurados, sem prejuízo das demais sanções cabíveis.",
      },
      {
        heading: "CLÁUSULA 5ª — DO FORO",
        body: `Fica eleito o foro da comarca de ${d.cidade} para dirimir quaisquer controvérsias.`,
      },
      {
        body: `${d.cidade}, ${d.data}.`,
      },
      {
        body: "_______________________________\nPARTE REVELADORA\n\n_______________________________\nPARTE RECEPTORA",
      },
    ],
  }),
};

export const CONTRACT_TEMPLATES: ContractTemplate[] = [prestacaoServico, nda];

export function getTemplate(id: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES.find((t) => t.id === id);
}
