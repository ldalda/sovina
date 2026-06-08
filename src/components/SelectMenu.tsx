"use client";

import { useEffect, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

// Select com a mesma aparência do dropdown do TypeCombobox (lista escura,
// posicionada em fixed pra escapar de overflow), mas só seleciona — sem criar.
export function SelectMenu({
  value,
  options,
  onChange,
  placeholder = "—",
  allowEmpty = true,
}: {
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
  placeholder?: string;
  /** mostra a opção vazia (placeholder) no topo */
  allowEmpty?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const place = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.bottom, left: r.left, width: r.width });
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

  function pick(v: string) {
    onChange(v);
    setOpen(false);
  }

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-3 text-left outline-none hover:bg-solar/5 transition-colors ${
          current ? "text-fg" : "text-subtle"
        }`}
      >
        <span className="truncate">{current?.label ?? placeholder}</span>
        <span className="text-subtle text-xs shrink-0">▾</span>
      </button>

      {open && rect && (
        <ul
          style={{
            position: "fixed",
            top: rect.top,
            left: rect.left,
            width: rect.width,
          }}
          className="z-50 max-h-56 overflow-auto bg-concreto border border-line shadow-xl"
        >
          {allowEmpty && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick("")}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-solar/10 transition-colors ${
                  value === "" ? "text-solar" : "text-subtle"
                }`}
              >
                {placeholder}
              </button>
            </li>
          )}
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(opt.value)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-solar/10 transition-colors ${
                  opt.value === value ? "text-solar" : "text-fg"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
