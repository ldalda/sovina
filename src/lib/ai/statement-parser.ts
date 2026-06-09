import "server-only";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

// Claude Haiku 4.5 lê o PDF da fatura nativamente e devolve os lançamentos
// estruturados. A reconciliação (evitar duplicatas) é determinística, no
// código — a IA só extrai.
const StatementSchema = z.object({
  items: z.array(
    z.object({
      date: z
        .string()
        .describe("data da compra no formato YYYY-MM-DD"),
      description: z
        .string()
        .describe("nome do estabelecimento / descrição da compra"),
      amount: z
        .number()
        .describe("valor da compra (ou da parcela) em reais, positivo"),
      installmentCurrent: z
        .number()
        .nullable()
        .describe("número da parcela atual (ex: 3 em '3/12'); null se à vista"),
      installmentTotal: z
        .number()
        .nullable()
        .describe("total de parcelas (ex: 12 em '3/12'); null se à vista"),
    }),
  ),
});

export type StatementLine = z.infer<typeof StatementSchema>["items"][number];

export async function parseStatementPdf(pdf: Uint8Array): Promise<StatementLine[]> {
  const { object } = await generateObject({
    model: anthropic("claude-haiku-4-5-20251001"),
    schema: StatementSchema,
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: pdf, mediaType: "application/pdf" },
          {
            type: "text",
            text: [
              "Esta é uma fatura de cartão de crédito brasileira.",
              "Extraia TODOS os lançamentos/compras listados, um por item.",
              "Para cada um: a data da compra (YYYY-MM-DD), a descrição do",
              "estabelecimento, e o valor em reais (use ponto decimal).",
              "Se a linha indicar parcela (ex: 'PARC 03/12' ou '3/12'),",
              "preencha installmentCurrent=3 e installmentTotal=12, e amount = o",
              "valor DA PARCELA. Ignore: pagamentos da fatura anterior, estornos,",
              "encargos/juros, IOF, anuidade e totais. Não invente lançamentos.",
            ].join(" "),
          },
        ],
      },
    ],
  });
  return object.items;
}
