// Formatação pt-BR. Moeda sempre com R$ e centavos (estilo do Sovina).

export function formatBRL(n: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(n) ? n : 0);
}
