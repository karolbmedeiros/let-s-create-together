export type TemplateCategory = "Residencial" | "Comercial" | "Temporada" | "Outros";

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  fileName: string;
  fileBase64: string;
  extractedText: string;
  uploadedAt: string;
  sizeBytes: number;
}

export interface Replacement {
  original: string;
  replacement: string;
}

export interface GeneratedContract {
  id: string;
  templateId: string;
  templateName: string;
  tenantName: string;
  instructions: string;
  replacements: Replacement[];
  outputFileBase64: string;
  generatedAt: string;
}

export interface GenerationResult {
  contract: GeneratedContract;
  warnings: string[];
}
