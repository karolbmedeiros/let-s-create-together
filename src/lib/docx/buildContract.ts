import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import type { ContractFormData } from "@/types";

function p(text: string, opts: { bold?: boolean; align?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {}) {
  return new Paragraph({
    alignment: opts.align,
    spacing: { after: 120 },
    children: [new TextRun({ text, bold: opts.bold })],
  });
}

function clause(num: number, title: string, body: string) {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      children: [new TextRun({ text: `CLÁUSULA ${num}ª – ${title.toUpperCase()}`, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun(body)],
    }),
  ];
}

function formatDateBR(iso: string): string {
  if (!iso) return "___/___/______";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function addMonths(iso: string, months: number): string {
  if (!iso || !months) return "___/___/______";
  const date = new Date(iso + "T00:00:00");
  if (Number.isNaN(date.getTime())) return "___/___/______";
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString("pt-BR");
}

export async function buildContractDocx(d: ContractFormData): Promise<Uint8Array> {
  const meses = parseInt(d.prazoMeses, 10) || 0;
  const dataFim = addMonths(d.dataInicio, meses);
  const today = new Date().toLocaleDateString("pt-BR");

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 28, bold: true, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 24, bold: true, font: "Arial" },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: "CONTRATO DE LOCAÇÃO RESIDENCIAL", bold: true })],
          }),

          p(
            "Pelo presente instrumento particular, as partes abaixo qualificadas têm entre si justo e contratado o seguinte:",
          ),

          p("LOCADOR(A):", { bold: true }),
          p(`${d.locadorNome || "___"}, portador(a) do documento ${d.locadorDoc || "___"}, residente em ${d.locadorEndereco || "___"}.`),

          p("LOCATÁRIO(A):", { bold: true }),
          p(
            `${d.locatarioNome || "___"}, portador(a) do CPF ${d.locatarioCpf || "___"} e RG ${d.locatarioRg || "___"}, residente em ${d.locatarioEndereco || "___"}.`,
          ),

          ...clause(
            1,
            "Do Objeto",
            `O LOCADOR cede em locação ao LOCATÁRIO o imóvel situado em ${d.imovelEndereco || "___"}${d.imovelDescricao ? `, descrito como: ${d.imovelDescricao}` : ""}.`,
          ),

          ...clause(
            2,
            "Do Prazo",
            `A presente locação tem o prazo de ${d.prazoMeses || "___"} (${meses ? numberToWords(meses) : "___"}) meses, com início em ${formatDateBR(d.dataInicio)} e término em ${dataFim}.`,
          ),

          ...clause(
            3,
            "Do Valor e Forma de Pagamento",
            `O valor mensal do aluguel é de R$ ${d.valorAluguel || "___"}, devendo ser pago até o dia ${d.diaVencimento || "___"} de cada mês, mediante depósito em conta indicada pelo LOCADOR.`,
          ),

          ...clause(
            4,
            "Das Obrigações do Locatário",
            "O LOCATÁRIO obriga-se a conservar o imóvel, restituindo-o no estado em que o recebeu, salvo deteriorações decorrentes do uso normal, bem como a pagar pontualmente todas as despesas ordinárias relativas ao imóvel.",
          ),

          ...clause(
            5,
            "Da Rescisão",
            "O presente contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 (trinta) dias, sem prejuízo das demais cominações previstas em lei.",
          ),

          ...clause(
            6,
            "Do Foro",
            "Fica eleito o foro da comarca do imóvel locado para dirimir quaisquer questões oriundas do presente contrato.",
          ),

          new Paragraph({ spacing: { before: 360, after: 240 }, children: [new TextRun(`E, por estarem assim justos e contratados, assinam o presente em duas vias de igual teor.`)] }),

          new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 480 }, children: [new TextRun(`Local e data: ${today}`)] }),

          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun("_________________________________")] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 }, children: [new TextRun({ text: d.locadorNome || "LOCADOR", bold: true })] }),

          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun("_________________________________")] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: d.locatarioNome || "LOCATÁRIO", bold: true })] }),
        ],
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  return new Uint8Array(buf as unknown as ArrayBufferLike);
}

function numberToWords(n: number): string {
  const map: Record<number, string> = {
    1: "um", 2: "dois", 3: "três", 6: "seis", 12: "doze", 18: "dezoito", 24: "vinte e quatro", 30: "trinta", 36: "trinta e seis", 48: "quarenta e oito", 60: "sessenta",
  };
  return map[n] ?? String(n);
}

export function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function downloadDocx(base64: string, fileName: string) {
  const bytes = base64ToUint8(base64);
  const blob = new Blob([bytes as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
