import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  templateText: z.string().min(1).max(200_000),
  tenantName: z.string().trim().min(1).max(200),
  instructions: z.string().trim().min(1).max(5_000),
});

const replacementSchema = z.object({
  replacements: z.array(
    z.object({
      original: z.string().min(1),
      replacement: z.string(),
    }),
  ),
});

export type AiReplacementsResult = {
  replacements: { original: string; replacement: string }[];
  error: string | null;
};

const SYSTEM_PROMPT = `Você é um assistente jurídico especializado em contratos de aluguel imobiliário.
Sua tarefa é identificar trechos do contrato que devem ser substituídos com base nas instruções do usuário e no nome do locatário.

REGRAS IMPORTANTES:
1. Identifique placeholders como [NOME], [DATA], [VALOR], "XXXX", "_____", ou trechos genéricos como "o LOCATÁRIO".
2. NUNCA invente dados que não foram fornecidos pelo usuário.
3. Cada "original" deve ser um trecho EXATO do contrato (copie literalmente).
4. Cada "replacement" deve ser o texto a substituir, baseado nas instruções.
5. Se uma informação não foi fornecida, NÃO inclua a substituição.
6. Retorne apenas substituições com alta confiança.`;

export const generateReplacements = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<AiReplacementsResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { replacements: [], error: "LOVABLE_API_KEY não configurada." };
    }

    const userPrompt = `CONTRATO (template):
"""
${data.templateText}
"""

NOME DO LOCATÁRIO: ${data.tenantName}

INSTRUÇÕES DO USUÁRIO:
${data.instructions}

Retorne as substituições necessárias usando a ferramenta apply_replacements.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "apply_replacements",
                description: "Aplica substituições de texto no contrato",
                parameters: {
                  type: "object",
                  properties: {
                    replacements: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          original: { type: "string", description: "Trecho exato a ser substituído" },
                          replacement: { type: "string", description: "Texto que substituirá o original" },
                        },
                        required: ["original", "replacement"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["replacements"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "apply_replacements" } },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("AI gateway error", res.status, text);
        if (res.status === 429) {
          return { replacements: [], error: "Limite de requisições excedido. Tente novamente em alguns instantes." };
        }
        if (res.status === 402) {
          return { replacements: [], error: "Créditos da IA esgotados. Adicione créditos no workspace Lovable." };
        }
        return { replacements: [], error: `Erro na IA (${res.status}).` };
      }

      const json = (await res.json()) as {
        choices?: Array<{
          message?: {
            tool_calls?: Array<{ function?: { arguments?: string } }>;
            content?: string;
          };
        }>;
      };

      const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
      const args = toolCall?.function?.arguments;
      if (!args) {
        return { replacements: [], error: "A IA não retornou substituições." };
      }

      const parsed = replacementSchema.parse(JSON.parse(args));
      return { replacements: parsed.replacements, error: null };
    } catch (err) {
      console.error("generateReplacements failed:", err);
      return { replacements: [], error: "Falha ao consultar a IA. Tente novamente." };
    }
  });
