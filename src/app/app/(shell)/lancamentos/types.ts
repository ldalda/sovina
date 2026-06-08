export interface Transaction {
  id: string;
  valor: number;
  descricao: string | null;
  categoria: string;
  occurred_at: string; // ISO date (YYYY-MM-DD)
}
