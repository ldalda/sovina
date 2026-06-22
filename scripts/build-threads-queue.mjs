// Reconstrói a fila threads_queue com o calendário re-baselined (v3):
// 4 avulsos + 2 fios por dia. Avulsos vêm de supabase/seed-threads-posts.sql
// (datas deslocadas +11 dias: 11/06→22/06). Fios são parseados de
// docs/marketing/threads-calendario-4x20.md (header [Dx slot · DD/MM] + posts N/).
//
// Uso:
//   node scripts/build-threads-queue.mjs           # dry-run: só mostra o que faria
//   node scripts/build-threads-queue.mjs --commit  # deleta pending e insere
//
// Preserva o histórico (status posted/failed) — só remove 'pending'.
// Filtra linhas já vencidas (scheduled_at < agora), então o dia corrente
// entra parcial (slots futuros apenas).
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const COMMIT = process.argv.includes("--commit");

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

// ── Avulsos: seed atual, datas +11 dias (11/06 → 22/06), texto↔slot preservados ──
function shiftDate(schedStr, days) {
  const m = schedStr.match(/^(\d{4})-(\d{2})-(\d{2}) (.+)$/);
  if (!m) throw new Error(`Data inesperada no seed: ${schedStr}`);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  d.setUTCDate(d.getUTCDate() + days);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${m[4]}`; // mantém hora + offset -03
}

const seedSql = readFileSync("supabase/seed-threads-posts.sql", "utf8");
const avulsos = [...seedSql.matchAll(/\(\$sov\$([\s\S]*?)\$sov\$, '([^']+)'\)/g)].map(
  ([, body, sched]) => ({
    body: body.trim(),
    scheduled_at: shiftDate(sched, 11),
    thread_key: null,
    thread_position: null,
  }),
);

// ── Fios: calendário .md, 2/dia (manhã 10h, noite 20h), 4 posts encadeados ──
const cal = readFileSync("docs/marketing/threads-calendario-4x20.md", "utf8");
const fioBlocks = [
  ...cal.matchAll(
    /\*\*\[D\d+ (manhã|noite) · (\d{2})\/(\d{2})\][^\n]*\n([\s\S]*?)(?=\n\*\*\[D\d+ |\n### |\n# |\n---)/g,
  ),
];

const fios = [];
for (const [, slot, dd, mm, block] of fioBlocks) {
  const hh = slot === "manhã" ? "10" : "20";
  const scheduled_at = `2026-${mm}-${dd} ${hh}:00:00-03`;
  const key = randomUUID();
  const parts = block
    .split(/\n(?=\d+\/)/)
    .map((s) => s.trim())
    .filter((s) => /^\d+\//.test(s))
    .map((s) => s.replace(/^\d+\/\s*/, "").trim());
  parts.forEach((body, i) => {
    fios.push({ body, scheduled_at, thread_key: key, thread_position: i + 1 });
  });
}

// ── Validação (guard, como no seed-threads.mjs) ──
const fioCount = fioBlocks.length;
const fioPosts = fios.length;
if (fioCount !== 46) {
  console.error(`Esperava 46 fios, parseei ${fioCount}. Abortando.`);
  process.exit(1);
}
if (fioPosts !== 46 * 4) {
  console.error(`Esperava ${46 * 4} posts de fio, parseei ${fioPosts}. Abortando.`);
  process.exit(1);
}
if (avulsos.length < 70 || avulsos.length > 84) {
  console.error(`Avulsos fora do esperado (${avulsos.length}). Abortando.`);
  process.exit(1);
}

// ── Filtra o que já venceu (dia corrente entra parcial) ──
const now = Date.now();
// scheduled_at vem como '2026-06-22 08:00:00-03'; o offset precisa de ':00'
// (-03 → -03:00) senão new Date() devolve Invalid Date.
const toMs = (s) =>
  new Date(s.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00")).getTime();
const all = [...avulsos, ...fios].filter((r) => toMs(r.scheduled_at) >= now);

// Resumo por dia
const byDay = {};
for (const r of all) {
  const day = r.scheduled_at.slice(0, 10);
  byDay[day] = byDay[day] ?? { avulso: 0, fio: 0 };
  if (r.thread_key) byDay[day].fio++;
  else byDay[day].avulso++;
}
console.log(`\nAvulsos parseados: ${avulsos.length} | Fios: ${fioCount} (${fioPosts} posts)`);
console.log(`Linhas futuras a inserir: ${all.length} (avulsos ${all.filter((r) => !r.thread_key).length} + fio-posts ${all.filter((r) => r.thread_key).length})`);
console.log("\nPor dia (avulsos / fio-posts):");
for (const day of Object.keys(byDay).sort()) {
  console.log(`  ${day}: ${byDay[day].avulso} avulsos, ${byDay[day].fio} fio-posts`);
}

if (!COMMIT) {
  console.log("\n[dry-run] Nada foi alterado. Rode com --commit para aplicar.");
  process.exit(0);
}

// ── Commit: deleta só pending, preserva histórico, insere ──
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { error: delErr, count: delCount } = await supabase
  .from("threads_queue")
  .delete({ count: "exact" })
  .eq("status", "pending");
if (delErr) {
  console.error("Erro ao deletar pending:", delErr.message);
  process.exit(1);
}
console.log(`\nDeletados ${delCount ?? "?"} pending antigos.`);

const { error: insErr } = await supabase.from("threads_queue").insert(all);
if (insErr) {
  console.error("Erro ao inserir:", insErr.message);
  process.exit(1);
}

const { count: finalPending } = await supabase
  .from("threads_queue")
  .select("*", { count: "exact", head: true })
  .eq("status", "pending");
console.log(`OK: ${all.length} linhas inseridas. Pending agora: ${finalPending}.`);
