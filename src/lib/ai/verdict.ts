import "server-only";
import { generateText } from "ai";
import { personaModel } from "./router";
import { SOVINA_SYSTEM_PROMPT } from "./persona";

// Modo Roast — o veredito do Sovina sobre um gasto recém-registrado, gerado
// pela persona (Claude Haiku). Recebe um snapshot do gasto e da cota APÓS o
// lançamento. Lança em qualquer erro: o chamador (server action) decide o
// fallback determinístico. Aqui a IA só fala.

export interface VerdictContext {
  valor: number; // valor total da compra
  descricao: string;
  categoria: string;
  pagamento: string; // rótulo legível do meio de pagamento
  installments: number; // 1 = à vista
  perInstallment: number; // valor de cada parcela (se parcelado)
  // cota recomputada já contando este gasto:
  idealDaily: number;
  maxDaily: number;
  leftTodayIdeal: number;
  leftTodayMax: number;
  spentToday: number;
  monthBalance: number;
  monthlyCommitments: number;
}

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export async function generateVerdict(ctx: VerdictContext): Promise<string> {
  const overMax = ctx.leftTodayMax < 0;
  const overIdeal = ctx.leftTodayIdeal < 0;
  const parcelado = ctx.installments > 1;

  const prompt = [
    "O usuário acabou de registrar um gasto. Emita o veredito.",
    "",
    "GASTO:",
    `- Valor: ${brl(ctx.valor)}${
      parcelado ? ` em ${ctx.installments}x de ${brl(ctx.perInstallment)}` : " à vista"
    }`,
    `- Descrição: ${ctx.descricao || "(sem descrição)"}`,
    `- Categoria: ${ctx.categoria || "(sem categoria)"}`,
    `- Pagamento: ${ctx.pagamento}`,
    "",
    "SITUAÇÃO APÓS O GASTO:",
    `- Cota ideal do dia: ${brl(ctx.idealDaily)} | Teto do dia: ${brl(ctx.maxDaily)}`,
    `- Gasto hoje: ${brl(ctx.spentToday)}`,
    `- Sobra hoje na cota ideal: ${brl(ctx.leftTodayIdeal)}`,
    `- Sobra hoje até o teto: ${brl(ctx.leftTodayMax)}`,
    `- Saldo do mês: ${brl(ctx.monthBalance)}`,
    ctx.monthlyCommitments > 0
      ? `- Parcelas comprometidas no mês: ${brl(ctx.monthlyCommitments)}`
      : "",
    "",
    overMax
      ? "STATUS: FUROU O TETO do dia. Julgue sem dó e cite a consequência concreta (a cota encolhe)."
      : overIdeal
        ? "STATUS: passou da cota ideal, ainda dentro do teto. Alerte que é dívida com o futuro."
        : "STATUS: dentro da cota. Aprove com sobriedade — sem festejar.",
    parcelado
      ? "É PARCELADO: lembre que cada mês vai cobrar a parte; a deste mês já saiu da cota."
      : "",
    "",
    "Responda em 1 a 2 frases curtas. Cite os números em reais. Sem emojis. Não cumprimente — vá direto ao veredito.",
  ]
    .filter(Boolean)
    .join("\n");

  const { text } = await generateText({
    model: personaModel,
    system: SOVINA_SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
    maxOutputTokens: 220,
  });

  return text.trim();
}
