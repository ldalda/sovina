// Tipos compartilhados da página de Fontes de Renda.

export type CellValue = string | number | null;
export type IncomeSection = "receivable" | "investment";
export type IncomeTableKey = "income_receivable" | "income_investment";

export interface IncomeRow {
  id: string;
  label: string | null;
  tipo: string;
  valor: number;
  custom: Record<string, CellValue>;
  position: number;
}

export type CustomColumnType = "text" | "number" | "date";

export interface CustomColumn {
  id: string;
  key: string;
  label: string;
  type: CustomColumnType;
  position: number;
}
