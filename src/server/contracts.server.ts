import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
} from "docx";
import { getTemplate } from "@/lib/contracts/templates";

interface RenderInput {
  templateId: string;
  data: Record<string, string>;
}

function renderContract({ templateId, data }: RenderInput) {
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Template "${templateId}" não encontrado.`);
  }
  return { template, content: template.render(data) };
}

/* -------------------------------- PDF -------------------------------- */

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const LINE_HEIGHT = 14;

export async function renderContractPdf(input: RenderInput): Promise<Uint8Array> {
  const { content } = renderContract(input);

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let cursorY = PAGE_HEIGHT - MARGIN;
  const usableWidth = PAGE_WIDTH - MARGIN * 2;

  function ensureSpace(needed: number) {
    if (cursorY - needed < MARGIN) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      cursorY = PAGE_HEIGHT - MARGIN;
    }
  }

  function wrap(text: string, fontSize: number, useBold = false): string[] {
    const f = useBold ? fontBold : font;
    const lines: string[] = [];
    for (const rawLine of text.split("\n")) {
      if (rawLine.trim() === "") {
        lines.push("");
        continue;
      }
      const words = rawLine.split(/\s+/);
      let current = "";
      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        const w = f.widthOfTextAtSize(candidate, fontSize);
        if (w <= usableWidth) {
          current = candidate;
        } else {
          if (current) lines.push(current);
          current = word;
        }
      }
      if (current) lines.push(current);
    }
    return lines;
  }

  function drawLines(lines: string[], fontSize: number, useBold = false) {
    const f = useBold ? fontBold : font;
    for (const line of lines) {
      ensureSpace(LINE_HEIGHT);
      page.drawText(line, {
        x: MARGIN,
        y: cursorY,
        size: fontSize,
        font: f,
        color: rgb(0.1, 0.1, 0.15),
      });
      cursorY -= LINE_HEIGHT;
    }
  }

  // Título centralizado
  ensureSpace(24);
  const titleSize = 14;
  const titleWidth = fontBold.widthOfTextAtSize(content.title, titleSize);
  page.drawText(content.title, {
    x: (PAGE_WIDTH - titleWidth) / 2,
    y: cursorY,
    size: titleSize,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.15),
  });
  cursorY -= 28;

  for (const para of content.paragraphs) {
    if (para.heading) {
      ensureSpace(LINE_HEIGHT + 8);
      cursorY -= 6;
      drawLines(wrap(para.heading, 11, true), 11, true);
      cursorY -= 4;
    }
    drawLines(wrap(para.body, 10), 10);
    cursorY -= 8;
  }

  return pdf.save();
}

/* -------------------------------- DOCX -------------------------------- */

export async function renderContractDocx(input: RenderInput): Promise<Uint8Array> {
  const { content } = renderContract(input);

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: content.title, bold: true, size: 28 })],
    }),
  );

  for (const para of content.paragraphs) {
    if (para.heading) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [new TextRun({ text: para.heading, bold: true, size: 22 })],
        }),
      );
    }
    // Cada quebra de linha vira um parágrafo separado (docx não aceita \n)
    const blocks = para.body.split("\n");
    for (const block of blocks) {
      children.push(
        new Paragraph({
          spacing: { after: 120, line: 320 },
          alignment: AlignmentType.JUSTIFIED,
          children: [new TextRun({ text: block, size: 22 })],
        }),
      );
    }
  }

  const doc = new Document({
    creator: "Contratual",
    title: content.title,
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4 em DXA
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}
