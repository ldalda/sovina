"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectOption = { value: string; label: string };

// Radix Select não aceita item com value "" — usamos um sentinela pro vazio.
const NONE = "__none__";

// Select de opções fixas, com a aparência do Sovina (trigger sem borda, pra
// caber em célula de tabela; o form que precisar de borda envolve por fora).
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
  allowEmpty?: boolean;
}) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(v) => onChange(v === NONE ? "" : v)}
    >
      <SelectTrigger className="w-full h-auto rounded-none border-0 bg-transparent px-3 py-3 text-sm shadow-none hover:bg-solar/5 focus-visible:ring-0 data-[placeholder]:text-subtle">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowEmpty && (
          <SelectItem value={NONE} className="text-subtle">
            {placeholder}
          </SelectItem>
        )}
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
