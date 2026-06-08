"use client";

import { useEffect, useRef, useState } from "react";

// Combobox de tipo/categoria: escolhe um valor pré-cadastrado OU cria um novo
// digitando. Substitui o <select> nativo (que não permite adicionar opções).
export function TypeCombobox({
  value,
  onChange,
  options,
  onCreate,
  placeholder = "Tipo",
  autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  /** chamado quando o usuário cria um tipo fora da lista */
  onCreate?: (v: string) => void;
  placeholder?: string;
  /** foca o campo e já abre a lista ao montar (linha recém-adicionada) */
  autoFocus?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value);
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // posiciona a lista (fixed) logo abaixo do input — escapa de containers
  // com overflow que recortariam um dropdown absolute
  const place = () => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.bottom, left: r.left, width: r.width });
  };

  // sincroniza quando o valor muda por fora
  useEffect(() => {
    setText(value);
  }, [value]);

  // linha nova: foca e abre a lista assim que monta
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // mantém a lista colada no input enquanto aberta (scroll/resize)
  useEffect(() => {
    if (!open) return;
    place();
    const onMove = () => place();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const q = text.trim();
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(q.toLowerCase()),
  );
  const exact = options.some((o) => o.toLowerCase() === q.toLowerCase());

  function commitText() {
    const v = text.trim();
    if (!v) {
      setText(value);
      return;
    }
    if (!options.some((o) => o.toLowerCase() === v.toLowerCase())) onCreate?.(v);
    onChange(v);
  }

  function select(opt: string) {
    setText(opt);
    onChange(opt);
    setOpen(false);
  }

  function createNew() {
    if (!q) return;
    onCreate?.(q);
    onChange(q);
    setText(q);
    setOpen(false);
  }

  // fecha (e confirma o texto) ao clicar fora
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        commitText();
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, text, value]);

  return (
    <div ref={ref} className="relative">
      <input
        ref={inputRef}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (q && !exact) createNew();
            else if (filtered[0]) select(filtered[0]);
            else setOpen(false);
          } else if (e.key === "Escape") {
            setText(value);
            setOpen(false);
          }
        }}
        className="w-full bg-abismo border border-line focus:border-solar outline-none px-3 py-2 text-fg text-sm placeholder:text-subtle"
      />

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
          {filtered.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(opt)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-solar/10 transition-colors ${
                  opt.toLowerCase() === value.toLowerCase()
                    ? "text-solar"
                    : "text-fg"
                }`}
              >
                {opt}
              </button>
            </li>
          ))}

          {q && !exact && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={createNew}
                className="w-full text-left px-3 py-2 text-sm text-solar hover:bg-solar/10 border-t border-line transition-colors"
              >
                + Criar &ldquo;{q}&rdquo;
              </button>
            </li>
          )}

          {filtered.length === 0 && !q && (
            <li className="px-3 py-2 text-sm text-subtle">
              Digite para criar um tipo
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
