// Forma de pagamento — dimensão transversal dos gastos.
// O cartão é um MEIO de pagamento, não uma categoria. Cada gasto guarda
// (payment_method, card_id); na UI usamos um único valor selecionável:
//   'cash' | 'pix' | 'debit' | 'card:<id>'

export type PaymentMethod = "cash" | "pix" | "debit" | "credit";

export interface PaymentCard {
  id: string;
  nome: string;
}

const METHOD_LABELS: Record<string, string> = {
  cash: "Dinheiro",
  pix: "Pix",
  debit: "Débito",
  credit: "Cartão",
};

/** (method, cardId) → valor selecionável da UI */
export function encodePayment(method: string, cardId: string | null): string {
  return method === "credit" && cardId ? `card:${cardId}` : method;
}

/** valor da UI → (method, card_id) pra persistir */
export function decodePayment(value: string): {
  payment_method: PaymentMethod;
  card_id: string | null;
} {
  if (value.startsWith("card:")) {
    return { payment_method: "credit", card_id: value.slice(5) };
  }
  return { payment_method: value as PaymentMethod, card_id: null };
}

/** opções pro SelectMenu: formas genéricas + cada cartão cadastrado */
export function paymentOptions(
  cards: PaymentCard[],
): { value: string; label: string }[] {
  return [
    { value: "cash", label: "Dinheiro" },
    { value: "pix", label: "Pix" },
    { value: "debit", label: "Débito" },
    ...cards.map((c) => ({ value: `card:${c.id}`, label: c.nome })),
  ];
}

/** rótulo de exibição de uma forma de pagamento */
export function paymentLabel(
  method: string,
  cardId: string | null,
  cards: PaymentCard[],
): string {
  if (method === "credit") {
    return cards.find((c) => c.id === cardId)?.nome ?? "Cartão";
  }
  return METHOD_LABELS[method] ?? method;
}
