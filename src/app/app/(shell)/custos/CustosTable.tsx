"use client";

import { useState, useTransition } from "react";
import { TypeCombobox } from "@/components/TypeCombobox";
import { formatBRL } from "@/lib/format";
import {
  addColumn,
  createCategory,
  createCost,
  deleteColumn,
  deleteCost,
  updateCost,
} from "./actions";
import type {
  CellValue,
  CostNature,
  CustomColumn,
  CustomColumnType,
  FixedCostRow,
} from "./types";

export function CustosTable({
  initialRows,
  initialColumns,
  initialCategories,
}: {
  initialRows: FixedCostRow[];
  initialColumns: CustomColumn[];
  initialCategories: string[];
}) {
  const [rows, setRows] = useState<FixedCostRow[]>(initialRows);
  const [columns, setColumns] = useState<CustomColumn[]>(initialColumns);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);

  const total = rows.reduce((s, r) => s + (r.valor || 0), 0);

  function patchLocal(id: string, patch: Partial<FixedCostRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function save(id: string, patch: Parameters<typeof updateCost>[1]) {
    startTransition(async () => {
      try {
        await updateCost(id, patch);
      } catch {
        /* autosave silencioso; o usuário reedita se falhar */
      }
    });
  }

  function addRow() {
    startTransition(async () => {
      const row = await createCost();
      setRows((rs) => [...rs, row]);
    });
  }
  function removeRow(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
    startTransition(() => void deleteCost(id));
  }

  function addCustomColumn(label: string, type: CustomColumnType) {
    startTransition(async () => {
      const col = await addColumn({ label, type });
      setColumns((cs) => [...cs, col]);
    });
    setAdding(false);
  }
  function removeColumn(id: string) {
    setColumns((cs) => cs.filter((c) => c.id !== id));
    startTransition(() => void deleteColumn(id));
  }

  function setCustom(row: FixedCostRow, key: string, value: CellValue) {
    const custom = { ...row.custom, [key]: value };
    patchLocal(row.id, { custom });
    return custom;
  }

  return (
    <main className="flex-1 px-8 py-10 overflow-auto">
      <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
        Custos Fixos
      </p>
      <h1 className="font-display text-3xl uppercase mb-1">
        Obrigações inegociáveis
      </h1>
      <p className="text-dim text-sm mb-8">
        Edite direto na célula — eu salvo sozinho.{" "}
        <span className="text-subtle">Tipo</span> e{" "}
        <span className="text-subtle">Valor</span> alimentam a sua cota.
      </p>

      <div className="border border-line overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-concreto/30 text-subtle text-xs uppercase tracking-[0.15em]">
              <Th>Despesa</Th>
              <Th>Categoria</Th>
              <Th>Tipo</Th>
              <Th className="text-right">Valor</Th>
              <Th>Venc.</Th>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="text-left font-normal px-3 py-3 border-l border-line whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-2">
                    {col.label}
                    <button
                      type="button"
                      onClick={() => removeColumn(col.id)}
                      aria-label={`Remover coluna ${col.label}`}
                      className="text-subtle hover:text-furia transition-colors"
                    >
                      ×
                    </button>
                  </span>
                </th>
              ))}
              <th className="relative px-2 py-3 border-l border-line w-10">
                {adding ? (
                  <AddColumnForm
                    onConfirm={addCustomColumn}
                    onCancel={() => setAdding(false)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setAdding(true)}
                    aria-label="Adicionar coluna"
                    className="text-solar hover:text-solar/80 transition-colors text-base"
                  >
                    +
                  </button>
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line group">
                {/* Despesa */}
                <Td>
                  <input
                    value={r.label ?? ""}
                    placeholder="Despesa"
                    onChange={(e) => patchLocal(r.id, { label: e.target.value })}
                    onBlur={() => save(r.id, { label: r.label })}
                    className={cellCls}
                  />
                </Td>

                {/* Categoria */}
                <Td className="border-l border-line min-w-44">
                  <TypeCombobox
                    value={r.categoria}
                    options={categories}
                    placeholder="Categoria"
                    onChange={(v) => {
                      patchLocal(r.id, { categoria: v });
                      save(r.id, { categoria: v });
                    }}
                    onCreate={(v) => {
                      setCategories((c) =>
                        c.some((t) => t.toLowerCase() === v.toLowerCase())
                          ? c
                          : [...c, v],
                      );
                      startTransition(() => void createCategory(v));
                    }}
                  />
                </Td>

                {/* Tipo (Fixo / Variável) */}
                <Td className="border-l border-line">
                  <select
                    value={r.tipo}
                    onChange={(e) => {
                      const v = e.target.value as CostNature;
                      patchLocal(r.id, { tipo: v });
                      save(r.id, { tipo: v });
                    }}
                    className={`${cellCls} cursor-pointer ${r.tipo ? "" : "text-subtle"}`}
                  >
                    <option value="">—</option>
                    <option value="Fixo">Fixo</option>
                    <option value="Variável">Variável</option>
                  </select>
                </Td>

                {/* Valor */}
                <Td className="border-l border-line">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={r.valor || ""}
                    placeholder="0,00"
                    onChange={(e) =>
                      patchLocal(r.id, { valor: Number(e.target.value) })
                    }
                    onBlur={() => save(r.id, { valor: r.valor })}
                    className={`${cellCls} text-right ${spin}`}
                  />
                </Td>

                {/* Vencimento */}
                <Td className="border-l border-line">
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={r.due_day ?? ""}
                    placeholder="dia"
                    onChange={(e) =>
                      patchLocal(r.id, {
                        due_day: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    onBlur={() => save(r.id, { due_day: r.due_day })}
                    className={`${cellCls} w-16 ${spin}`}
                  />
                </Td>

                {/* Colunas custom */}
                {columns.map((col) => (
                  <Td key={col.id} className="border-l border-line">
                    <input
                      type={col.type === "number" ? "number" : col.type === "date" ? "date" : "text"}
                      value={(r.custom?.[col.key] as CellValue) ?? ""}
                      onChange={(e) => {
                        const v: CellValue =
                          col.type === "number"
                            ? e.target.value
                              ? Number(e.target.value)
                              : null
                            : e.target.value || null;
                        setCustom(r, col.key, v);
                      }}
                      onBlur={() =>
                        save(r.id, { custom: r.custom })
                      }
                      className={`${cellCls} ${col.type === "number" ? spin : ""}`}
                    />
                  </Td>
                ))}

                {/* Remover linha */}
                <td className="border-l border-line text-center w-10">
                  <button
                    type="button"
                    onClick={() => removeRow(r.id)}
                    aria-label="Remover custo"
                    className="text-subtle opacity-0 group-hover:opacity-100 hover:text-furia transition-all px-2"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr className="border-t border-line">
                <td
                  colSpan={6 + columns.length}
                  className="px-3 py-8 text-center text-subtle text-sm"
                >
                  Nenhum custo ainda. O Sovina espera.
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr className="border-t border-line bg-concreto/20">
              <td className="px-3 py-3 text-subtle text-xs uppercase tracking-[0.15em]">
                Total
              </td>
              <td className="border-l border-line" />
              <td className="border-l border-line" />
              <td className="px-3 py-3 text-right font-display text-xl text-solar tracking-tight border-l border-line">
                {formatBRL(total)}
              </td>
              <td className="border-l border-line" />
              {columns.map((c) => (
                <td key={c.id} className="border-l border-line" />
              ))}
              <td className="border-l border-line" />
            </tr>
          </tfoot>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 text-sm text-solar hover:text-solar/80 transition-colors"
      >
        + Adicionar custo
      </button>
    </main>
  );
}

const cellCls =
  "w-full bg-transparent outline-none px-3 py-3 text-fg placeholder:text-subtle focus:bg-solar/5";
const spin =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`font-normal px-3 py-3 text-left whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`p-0 align-middle ${className}`}>{children}</td>;
}

function AddColumnForm({
  onConfirm,
  onCancel,
}: {
  onConfirm: (label: string, type: CustomColumnType) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<CustomColumnType>("text");

  return (
    <div className="absolute right-0 top-full z-30 mt-1 w-56 bg-concreto border border-line p-3 flex flex-col gap-2 normal-case tracking-normal text-left">
      <input
        autoFocus
        value={label}
        placeholder="Nome da coluna"
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && label.trim()) onConfirm(label.trim(), type);
          if (e.key === "Escape") onCancel();
        }}
        className="bg-abismo border border-line focus:border-solar outline-none px-2 py-1.5 text-fg text-sm"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as CustomColumnType)}
        className="bg-abismo border border-line focus:border-solar outline-none px-2 py-1.5 text-fg text-sm"
      >
        <option value="text">Texto</option>
        <option value="number">Número</option>
        <option value="date">Data</option>
      </select>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => label.trim() && onConfirm(label.trim(), type)}
          className="flex-1 bg-solar text-abismo text-xs font-bold py-1.5 hover:bg-solar/90 transition-colors"
        >
          Criar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 text-xs text-dim hover:text-fg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
