import PizZip from "pizzip";
import { base64ToUint8Array, arrayBufferToBase64 } from "./extractText";
import type { Replacement } from "@/types";

/**
 * Aplica substituições no XML interno do .docx, preservando formatação
 * para todos os trechos cujo "original" exista literalmente em document.xml.
 *
 * Retorna o novo .docx em base64 e a lista de substituições que NÃO foram
 * encontradas (warnings).
 */
export function applyReplacementsToDocx(
  templateBase64: string,
  replacements: Replacement[],
): { outputBase64: string; notApplied: Replacement[] } {
  const bytes = base64ToUint8Array(templateBase64);
  const zip = new PizZip(bytes);

  const documentXml = zip.file("word/document.xml")?.asText();
  if (!documentXml) {
    throw new Error("Arquivo .docx inválido (document.xml ausente).");
  }

  let xml = documentXml;
  const notApplied: Replacement[] = [];

  for (const rep of replacements) {
    const original = rep.original;
    if (!original) continue;
    const escapedReplacement = escapeXml(rep.replacement);
    if (xml.includes(original)) {
      xml = xml.split(original).join(escapedReplacement);
    } else {
      notApplied.push(rep);
    }
  }

  zip.file("word/document.xml", xml);
  const out = zip.generate({ type: "uint8array" });
  return {
    outputBase64: arrayBufferToBase64(out.buffer as ArrayBuffer),
    notApplied,
  };
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function downloadDocx(base64: string, fileName: string) {
  const bytes = base64ToUint8Array(base64);
  // Workaround TS: usar BlobPart casting
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
