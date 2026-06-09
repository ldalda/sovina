"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Combobox de categoria/tipo: escolhe um valor pré-cadastrado OU cria um novo.
// Popover + Command (cmdk) do shadcn — em portal, escapa de overflow sozinho.
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
  /** chamado quando o usuário cria um valor fora da lista */
  onCreate?: (v: string) => void;
  placeholder?: string;
  /** abre a lista já ao montar (linha recém-adicionada) */
  autoFocus?: boolean;
}) {
  const [open, setOpen] = useState(autoFocus);
  const [query, setQuery] = useState("");

  const q = query.trim();
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(q.toLowerCase()),
  );
  const exact = options.some((o) => o.toLowerCase() === q.toLowerCase());

  function select(v: string) {
    onChange(v);
    setQuery("");
    setOpen(false);
  }
  function create() {
    if (!q) return;
    onCreate?.(q);
    onChange(q);
    setQuery("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between gap-2 border border-line bg-abismo px-3 py-2 text-sm outline-none transition-colors hover:border-solar/60 focus:border-solar",
            value ? "text-fg" : "text-subtle",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown className="size-3.5 shrink-0 text-subtle" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-44 p-0"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={placeholder}
          />
          <CommandList>
            <CommandGroup>
              {filtered.map((o) => (
                <CommandItem key={o} value={o} onSelect={() => select(o)}>
                  <Check
                    className={cn(
                      "size-4",
                      o.toLowerCase() === value.toLowerCase()
                        ? "text-solar opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {o}
                </CommandItem>
              ))}
            </CommandGroup>
            {q && !exact && (
              <CommandGroup>
                <CommandItem value="__create__" onSelect={create}>
                  <Plus className="size-4 text-solar" />
                  Criar &ldquo;{q}&rdquo;
                </CommandItem>
              </CommandGroup>
            )}
            {filtered.length === 0 && !q && (
              <p className="px-3 py-2 text-sm text-subtle">
                Digite para criar um tipo
              </p>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
