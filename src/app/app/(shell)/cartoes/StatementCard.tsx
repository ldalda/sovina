import { formatBRL } from "@/lib/format";
import type { Statement } from "@/lib/finance/statement";

const brShort = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};

export function StatementCard({ s }: { s: Statement }) {
  const pct =
    s.limit && s.limit > 0 ? Math.min(100, (s.total / s.limit) * 100) : null;
  const limitHigh = pct !== null && pct > 90;

  return (
    <div className="border border-line bg-concreto/20 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xl tracking-tight">{s.cardName}</p>
          <p className="text-subtle text-xs mt-1">
            Ciclo {brShort(s.start)} – {brShort(s.end)}
            {s.due && ` · vence ${brShort(s.due)}`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-subtle text-xs uppercase tracking-[0.2em] mb-1">
            Fatura atual
          </p>
          <p className="font-display text-4xl text-solar tracking-tight leading-none">
            {formatBRL(s.total)}
          </p>
        </div>
      </div>

      {pct !== null && (
        <div className="mt-5">
          <div className="flex justify-between text-xs text-subtle uppercase tracking-[0.15em] mb-1.5">
            <span>Limite</span>
            <span>{formatBRL(s.limit ?? 0)}</span>
          </div>
          <div className="h-2 bg-abismo border border-line">
            <div
              className={limitHigh ? "h-full bg-furia" : "h-full bg-solar"}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 border-t border-line pt-3">
        {s.items.length === 0 ? (
          <p className="text-subtle text-sm py-2">
            Nenhum gasto neste ciclo.
          </p>
        ) : (
          <ul className="flex flex-col max-h-64 overflow-y-auto">
            {s.items.map((it, i) => (
              <li
                key={i}
                className="flex items-center gap-3 py-1.5 text-sm border-b border-line/40 last:border-0"
              >
                <span className="flex-1 truncate text-fg">
                  {it.label}
                  {it.kind === "fixed" && (
                    <span className="text-subtle"> · fixo</span>
                  )}
                  {it.date && (
                    <span className="text-subtle"> · {brShort(it.date)}</span>
                  )}
                </span>
                <span className="tabular-nums text-fg">
                  {formatBRL(it.valor)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
