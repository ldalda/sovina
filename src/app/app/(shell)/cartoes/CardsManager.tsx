"use client";

import { useState, useTransition } from "react";
import { createCard, deleteCard, updateCard } from "./actions";
import type { Card } from "./types";

export function CardsManager({ initialCards }: { initialCards: Card[] }) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [, startTransition] = useTransition();

  function patchLocal(id: string, patch: Partial<Card>) {
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function save(id: string, patch: Parameters<typeof updateCard>[1]) {
    startTransition(async () => {
      try {
        await updateCard(id, patch);
      } catch {
        /* autosave silencioso */
      }
    });
  }
  function add() {
    startTransition(async () => {
      const card = await createCard();
      setCards((cs) => [...cs, card]);
    });
  }
  function remove(id: string) {
    setCards((cs) => cs.filter((c) => c.id !== id));
    startTransition(() => void deleteCard(id));
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-col gap-3">
        {cards.map((c) => (
          <div
            key={c.id}
            className="group border border-line bg-concreto/20 p-5 relative"
          >
            <button
              type="button"
              onClick={() => remove(c.id)}
              aria-label="Remover cartão"
              className="absolute top-3 right-3 text-subtle opacity-0 group-hover:opacity-100 hover:text-furia transition-all"
            >
              ×
            </button>

            <input
              value={c.nome}
              placeholder="Nome do cartão (ex: Nubank)"
              onChange={(e) => patchLocal(c.id, { nome: e.target.value })}
              onBlur={() => save(c.id, { nome: c.nome })}
              className="w-full bg-transparent outline-none font-display text-2xl tracking-tight text-fg placeholder:text-subtle mb-4 pr-6"
            />

            <div className="grid grid-cols-3 gap-4">
              <Field label="Fechamento (dia)">
                <DayInput
                  value={c.closing_day}
                  onChange={(v) => patchLocal(c.id, { closing_day: v })}
                  onCommit={() => save(c.id, { closing_day: c.closing_day })}
                />
              </Field>
              <Field label="Vencimento (dia)">
                <DayInput
                  value={c.due_day}
                  onChange={(v) => patchLocal(c.id, { due_day: v })}
                  onCommit={() => save(c.id, { due_day: c.due_day })}
                />
              </Field>
              <Field label="Limite (R$)">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={c.limit_amount ?? ""}
                  placeholder="—"
                  onChange={(e) =>
                    patchLocal(c.id, {
                      limit_amount: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  onBlur={() => save(c.id, { limit_amount: c.limit_amount })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <p className="text-subtle text-sm border border-line p-6 mb-3">
          Nenhum cartão ainda.
        </p>
      )}

      <button
        type="button"
        onClick={add}
        className="mt-4 text-sm text-solar hover:text-solar/80 transition-colors"
      >
        + Adicionar cartão
      </button>
    </div>
  );
}

const inputCls =
  "w-full bg-abismo border border-line focus:border-solar outline-none px-3 py-2 text-fg placeholder:text-subtle [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-subtle text-xs uppercase tracking-[0.15em] mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}

function DayInput({
  value,
  onChange,
  onCommit,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  onCommit: () => void;
}) {
  return (
    <input
      type="number"
      min={1}
      max={31}
      value={value ?? ""}
      placeholder="—"
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      onBlur={onCommit}
      className={inputCls}
    />
  );
}
