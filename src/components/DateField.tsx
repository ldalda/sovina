"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Campo de data: digita DD/MM/AAAA OU escolhe no calendário. Guarda ISO
// (YYYY-MM-DD). O Popover do Radix renderiza em portal — escapa de qualquer
// overflow (ex: a tabela de Custos) sem posicionamento manual.

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
  const d = +m[1];
  const mo = +m[2];
  const y = +m[3];
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

  useEffect(() => setText(isoToBR(value)), [value]);

  const selected = value ? parseISO(value) : undefined;

  function commitText(t: string) {
    if (t.trim() === "") {
      onChange(null);
      return;
    }
    const iso = brToISO(t);
    if (iso) onChange(iso);
    else setText(isoToBR(value)); // reverte se inválida
  }

  function pick(d: Date | undefined) {
    if (!d) {
      onChange(null);
      setText("");
    } else {
      const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      onChange(iso);
      setText(isoToBR(iso));
    }
    setOpen(false);
  }

  return (
    <div className="flex items-center">
      <input
        value={text}
        placeholder="DD/MM/AAAA"
        inputMode="numeric"
        onChange={(e) => setText(maskBR(e.target.value))}
        onBlur={() => commitText(text)}
        onKeyDown={(e) => e.key === "Enter" && commitText(text)}
        className="w-full min-w-0 bg-transparent outline-none pl-3 pr-1 py-3 text-fg placeholder:text-subtle focus:bg-solar/5"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Abrir calendário"
            className="pr-3 text-subtle hover:text-solar transition-colors shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="1" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={pick}
            defaultMonth={selected}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
