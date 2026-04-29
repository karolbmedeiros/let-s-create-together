import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { renderContractPdf, renderContractDocx } from "./contracts.server";

const generateInput = z.object({
  templateId: z.string().min(1).max(100),
  data: z.record(z.string().min(1).max(100), z.string().max(5000)),
});

/**
 * Gera o PDF do contrato e devolve como base64 para download no cliente.
 * (Server functions retornam JSON; codificamos o binário em base64.)
 */
export const generateContractPdf = createServerFn({ method: "POST" })
  .inputValidator((input) => generateInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const bytes = await renderContractPdf(data);
      return {
        ok: true as const,
        filename: `${data.templateId}.pdf`,
        mimeType: "application/pdf",
        base64: bytesToBase64(bytes),
      };
    } catch (err) {
      console.error("generateContractPdf error:", err);
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Falha ao gerar PDF.",
      };
    }
  });

export const generateContractDocx = createServerFn({ method: "POST" })
  .inputValidator((input) => generateInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const bytes = await renderContractDocx(data);
      return {
        ok: true as const,
        filename: `${data.templateId}.docx`,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        base64: bytesToBase64(bytes),
      };
    } catch (err) {
      console.error("generateContractDocx error:", err);
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Falha ao gerar DOCX.",
      };
    }
  });

function bytesToBase64(bytes: Uint8Array): string {
  // Buffer é polyfilled no runtime do Worker (nodejs_compat).
  return Buffer.from(bytes).toString("base64");
}
