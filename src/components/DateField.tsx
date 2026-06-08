"use client";

import { useEffect, useRef, useState } from "react";

// Campo de data: exibe/aceita DD/MM/AAAA, abre um calendário ao focar e
// guarda o valor como ISO (YYYY-MM-DD). Calendário em fixed pra escapar de
// containers com overflow (igual aos outros dropdowns).

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const pad = (n: number) => String(n).padStart(2, "0");

function isoToBR(iso: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : "";
}

function isReal(y: number, m: number, d: number): boolean {
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function brToISO(br: string): string | null {
  const m = br.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const d = +m[1], mo = +m[2], y = +m[3];
  return isReal(y, mo, d) ? `${y}-${pad(mo)}-${pad(d)}` : null;
}

function maskBR(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join("/");
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function DateField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (iso: string | null) => void;
}) {
  const [text, setText] = useState(isoToBR(value));
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number } | null>(null);
  const [view, setView] = useState<Date>(value ? parseISO(value) : new Date());
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(isoToBR(value));
    if (value) setView(parseISO(value));
  }, [value]);

  const place = () => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.bottom, left: r.left });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onMove = () => place();
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    document.addEventListener("mousedown", onDoc);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open]);

  function commitText(t: string) {
    if (t.trim() === "") {
      onChange(null);
      return;
    }
    const iso = brToISO(t);
    if (iso) onChange(iso);
    else setText(isoToBR(value)); // reverte se inválida
  }

  function pickDay(d: number) {
    const iso = `${view.getFullYear()}-${pad(view.getMonth() + 1)}-${pad(d)}`;
    onChange(iso);
    setText(isoToBR(iso));
    setOpen(false);
  }

  const y = view.getFullYear();
  const m = view.getMonth();
  const firstWeekday = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const noBlur = (e: React.MouseEvent) => e.preventDefault(); // mantém foco no input

  return (
    <div ref={ref} className="relative flex items-center">
      <input
        ref={inputRef}
        value={text}
        placeholder="DD/MM/AAAA"
        inputMode="numeric"
        onChange={(e) => setText(maskBR(e.target.value))}
        onFocus={() => {
          setOpen(true);
          place();
        }}
        onBlur={() => commitText(text)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitText(text);
          if (e.key === "Escape") setOpen(false);
        }}
        className="w-full min-w-0 bg-transparent outline-none pl-3 pr-1 py-3 text-fg placeholder:text-subtle focus:bg-solar/5"
      />
      <span
        onMouseDown={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
          setOpen(true);
          place();
        }}
        className="pr-3 text-subtle hover:text-solar cursor-pointer shrink-0"
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="1" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
      </span>

      {open && rect && (
        <div
          style={{ position: "fixed", top: rect.top, left: rect.left }}
          className="z-50 w-64 bg-concreto border border-line shadow-xl p-3"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onMouseDown={noBlur}
              onClick={() => setView(new Date(y, m - 1, 1))}
              className="px-2 text-dim hover:text-solar transition-colors"
            >
              ◀
            </button>
            <span className="text-fg text-sm font-bold">
              {MONTHS[m]} {y}
            </span>
            <button
              type="button"
              onMouseDown={noBlur}
              onClick={() => setView(new Date(y, m + 1, 1))}
              className="px-2 text-dim hover:text-solar transition-colors"
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-subtle mb-1">
            {WEEKDAYS.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <span key={`b${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const iso = `${y}-${pad(m + 1)}-${pad(d)}`;
              const selected = value === iso;
              return (
                <button
                  key={d}
                  type="button"
                  onMouseDown={noBlur}
                  onClick={() => pickDay(d)}
                  className={`text-sm py-1 transition-colors ${
                    selected
                      ? "bg-solar text-abismo font-bold"
                      : "text-fg hover:bg-solar/10"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onMouseDown={noBlur}
            onClick={() => {
              onChange(null);
              setText("");
              setOpen(false);
            }}
            className="mt-3 w-full text-xs text-subtle hover:text-furia transition-colors"
          >
            Limpar
          </button>
        </div>
      )}
    </div>
  );
}
