// Tipos compartilhados entre a página, as actions e a tabela de Custos Fixos.
// Mantidos fora do módulo "use server" (que só pode exportar funções async).

export type CellValue = string | number | null;

// Classificação do custo (coluna fixa "Tipo"): vazio, Fixo ou Variável.
export type CostNature = "" | "Fixo" | "Variável";

export interface FixedCostRow {
  id: string;
  label: string | null;
  categoria: string;
  tipo: CostNature;
  valor: number;
  due_day: number | null;
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
