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
  // histórico da mesma categoria neste mês (inclui o gasto atual):
  priorCount: number;
  priorTotal: number;
}

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export async function generateVerdict(ctx: VerdictContext): Promise<string> {
  const overMax = ctx.leftTodayMax < 0;
  const overIdeal = ctx.leftTodayIdeal < 0;
  const parcelado = ctx.installments > 1;
  // folga curta: sobra do dia abaixo de 25% da cota ideal (reta final)
  const tight = !overIdeal && ctx.idealDaily > 0 && ctx.leftTodayIdeal < 0.25 * ctx.idealDaily;
  // padrão repetido: 3ª+ ocorrência na mesma categoria neste mês
  const repeated = ctx.priorCount >= 3;

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
    `- Nesta categoria este mês: ${ctx.priorCount} lançamento(s), ${brl(ctx.priorTotal)} no total`,
    "",
    overMax
      ? "STATUS: FUROU O TETO do dia. Julgue sem dó e cite a consequência concreta (a cota encolhe)."
      : overIdeal
        ? "STATUS: passou da cota ideal, ainda dentro do teto. Alerte que é dívida com o futuro."
        : repeated
          ? `STATUS: cabe na cota, MAS é a ${ctx.priorCount}ª vez nesta categoria este mês (${brl(ctx.priorTotal)} acumulados). Se a categoria é evitável (delivery, impulso, conveniência), provoque pelo PADRÃO — cite o acumulado, não o valor isolado. Se é essencial (mercado, contas), só registre o acumulado sem julgar.`
          : tight
            ? "STATUS: dentro da cota, mas a folga do dia está curta. Se o gasto foi evitável, provoque; se essencial, avise que a margem do dia encolheu."
            : "STATUS: dentro da cota e com FOLGA LARGA. Registre SECO e curto — NÃO provoque e NÃO elogie. Apenas confirme o lançamento e diga a sobra do dia. O juiz não late à toa.",
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
