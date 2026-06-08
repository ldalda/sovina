export interface Card {
  id: string;
  nome: string;
  closing_day: number | null; // dia de fechamento
  due_day: number | null; // dia de vencimento
  limit_amount: number | null;
  position: number;
}
