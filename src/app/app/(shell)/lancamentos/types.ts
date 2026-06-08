export interface Transaction {
  id: string;
  valor: number;
  descricao: string | null;
  categoria: string;
  occurred_at: string; // ISO date (YYYY-MM-DD)
  payment_method: string;
  card_id: string | null;
  purchase_id: string | null;
  installment_no: number;
  installments_total: number;
}
