"use client";

import { useEffect, useState, useTransition } from "react";
import { TypeCombobox } from "@/components/TypeCombobox";
import { formatBRL } from "@/lib/format";
import {
  addColumn,
  createCategory,
  createIncome,
  deleteColumn,
  deleteIncome,
  updateIncome,
} from "./actions";
import type {
  CellValue,
  CustomColumn,
  CustomColumnType,
  IncomeRow,
  IncomeSection,
  IncomeTableKey,
} from "./types";

const ACTIONS_W = 44;

type FixedCol = { key: string; label: string; w: number; align: string };

export function IncomeTable({
  title,
  hint,
  section,
  tableKey,
  labelHeader,
  showTipo,
  tipoOptions = [],
  initialRows,
  initialColumns,
}: {
  title: string;
  hint: string;
  section: IncomeSection;
  tableKey: IncomeTableKey;
  labelHeader: string;
  showTipo: boolean;
  tipoOptions?: string[];
  initialRows: IncomeRow[];
  initialColumns: CustomColumn[];
}) {
  const fixedCols: FixedCol[] = showTipo
    ? [
        { key: "label", label: labelHeader, w: 240, align: "" },
        { key: "tipo", label: "Tipo", w: 200, align: "" },
        { key: "valor", label: "Valor", w: 160, align: "text-right" },
      ]
    : [
        { key: "label", label: labelHeader, w: 320, align: "" },
        { key: "valor", label: "Valor", w: 160, align: "text-right" },
      ];

  const widthsKey = `sovina:renda:${section}:widths`;

  const [rows, setRows] = useState<IncomeRow[]>(initialRows);
  const [columns, setColumns] = useState<CustomColumn[]>(initialColumns);
  const [categories, setCategories] = useState<string[]>(tipoOptions);
  const [, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);

  const [widths, setWidths] = useState<Record<string, number>>(() => {
    const w: Record<string, number> = { actions: ACTIONS_W };
    fixedCols.forEach((c) => (w[c.key] = c.w));
    initialColumns.forEach((c) => (w[c.key] = 160));
    return w;
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(widthsKey);
      if (raw) setWidths((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {
      /* sem persistência */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startResize(key: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = widths[key] ?? 150;
    const onMove = (ev: MouseEvent) =>
      setWidths((prev) => ({
        ...prev,
        [key]: Math.max(60, startW + (ev.clientX - startX)),
      }));
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setWidths((prev) => {
        try {
          localStorage.setItem(widthsKey, JSON.stringify(prev));
        } catch {
          /* ignora */
        }
        return prev;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  const total = rows.reduce((s, r) => s + (r.valor || 0), 0);
  const tableWidth =
    fixedCols.reduce((s, c) => s + (widths[c.key] ?? c.w), 0) +
    columns.reduce((s, c) => s + (widths[c.key] ?? 160), 0) +
    (widths.actions ?? ACTIONS_W);

  function patchLocal(id: string, patch: Partial<IncomeRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function save(id: string, patch: Parameters<typeof updateIncome>[1]) {
    startTransition(async () => {
      try {
        await updateIncome(id, patch);
      } catch {
        /* autosave silencioso */
      }
    });
  }

  function addRow() {
    startTransition(async () => {
      const row = await createIncome(section);
      setRows((rs) => [...rs, row]);
    });
  }
  function removeRow(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
    startTransition(() => void deleteIncome(id));
  }

  function addCustomColumn(label: string, type: CustomColumnType) {
    startTransition(async () => {
      const col = await addColumn(tableKey, { label, type });
      setColumns((cs) => [...cs, col]);
      setWidths((w) => ({ ...w, [col.key]: 160 }));
    });
    setAdding(false);
  }
  function removeColumn(id: string) {
    setColumns((cs) => cs.filter((c) => c.id !== id));
    startTransition(() => void deleteColumn(id));
  }

  return (
    <section className="mb-12">
      <h2 className="font-display text-2xl uppercase tracking-tight mb-1">
        {title}
      </h2>
      <p className="text-dim text-sm mb-4">{hint}</p>

      <div className="border border-line overflow-x-auto">
        <table
          style={{ width: tableWidth }}
          className="table-fixed border-collapse text-sm"
        >
          <colgroup>
            {fixedCols.map((c) => (
              <col key={c.key} style={{ width: widths[c.key] ?? c.w }} />
            ))}
            {columns.map((col) => (
              <col key={col.id} style={{ width: widths[col.key] ?? 160 }} />
            ))}
            <col style={{ width: widths.actions ?? ACTIONS_W }} />
          </colgroup>

          <thead>
            <tr className="bg-concreto/30 text-subtle text-xs uppercase tracking-[0.15em]">
              {fixedCols.map((c, i) => (
                <Th
                  key={c.key}
                  className={`${c.align} ${i > 0 ? "border-l border-line" : ""}`}
                  onResizeStart={(e) => startResize(c.key, e)}
                >
                  {c.label}
                </Th>
              ))}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="relative text-left font-normal px-3 py-3 border-l border-line whitespace-nowrap overflow-hidden"
                >
                  <span className="inline-flex items-center gap-2 pr-2 max-w-full">
                    <span className="truncate">{col.label}</span>
                    <button
                      type="button"
                      onClick={() => removeColumn(col.id)}
                      aria-label={`Remover coluna ${col.label}`}
                      className="text-subtle hover:text-furia transition-colors shrink-0"
                    >
                      ×
                    </button>
                  </span>
                  <ResizeHandle onMouseDown={(e) => startResize(col.key, e)} />
                </th>
              ))}
              <th className="relative px-2 py-3 border-l border-line">
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
                {/* Fonte / Ativo */}
                <Td>
                  <input
                    value={r.label ?? ""}
                    placeholder={labelHeader}
                    onChange={(e) => patchLocal(r.id, { label: e.target.value })}
                    onBlur={() => save(r.id, { label: r.label })}
                    className={cellCls}
                  />
                </Td>

                {/* Tipo (só investimentos) */}
                {showTipo && (
                  <Td className="border-l border-line min-w-44">
                    <TypeCombobox
                      value={r.tipo}
                      options={categories}
                      placeholder="Tipo"
                      onChange={(v) => {
                        patchLocal(r.id, { tipo: v });
                        save(r.id, { tipo: v });
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
                )}

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

                {/* Colunas custom */}
                {columns.map((col) => (
                  <Td key={col.id} className="border-l border-line">
                    <input
                      type={
                        col.type === "number"
                          ? "number"
                          : col.type === "date"
                            ? "date"
                            : "text"
                      }
                      value={(r.custom?.[col.key] as CellValue) ?? ""}
                      onChange={(e) => {
                        const v: CellValue =
                          col.type === "number"
                            ? e.target.value
                              ? Number(e.target.value)
                              : null
                            : e.target.value || null;
                        patchLocal(r.id, {
                          custom: { ...r.custom, [col.key]: v },
                        });
                      }}
                      onBlur={() => save(r.id, { custom: r.custom })}
                      className={`${cellCls} ${col.type === "number" ? spin : ""}`}
                    />
                  </Td>
                ))}

                {/* Remover linha */}
                <td className="border-l border-line text-center w-10">
                  <button
                    type="button"
                    onClick={() => removeRow(r.id)}
                    aria-label="Remover"
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
                  colSpan={fixedCols.length + columns.length + 1}
                  className="px-3 py-8 text-center text-subtle text-sm"
                >
                  Nada por aqui ainda.
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr className="border-t border-line bg-concreto/20">
              <td className="px-3 py-3 text-subtle text-xs uppercase tracking-[0.15em]">
                Total
              </td>
              {showTipo && <td className="border-l border-line" />}
              <td className="px-3 py-3 text-right font-display text-xl text-solar tracking-tight border-l border-line">
                {formatBRL(total)}
              </td>
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
        className="mt-3 text-sm text-solar hover:text-solar/80 transition-colors"
      >
        + Adicionar {showTipo ? "investimento" : "fonte"}
      </button>
    </section>
  );
}

const cellCls =
  "w-full bg-transparent outline-none px-3 py-3 text-fg placeholder:text-subtle focus:bg-solar/5";
const spin =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function Th({
  children,
  className = "",
  onResizeStart,
}: {
  children: React.ReactNode;
  className?: string;
  onResizeStart?: (e: React.MouseEvent) => void;
}) {
  return (
    <th
      className={`relative font-normal px-3 py-3 text-left whitespace-nowrap overflow-hidden ${className}`}
    >
      {children}
      {onResizeStart && <ResizeHandle onMouseDown={onResizeStart} />}
    </th>
  );
}

function ResizeHandle({
  onMouseDown,
}: {
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  return (
    <span
      onMouseDown={onMouseDown}
      className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-solar/40 active:bg-solar z-10"
    />
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
