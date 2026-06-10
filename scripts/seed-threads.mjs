// Semeia a fila threads_queue a partir de supabase/seed-threads-posts.sql.
// Uso: node scripts/seed-threads.mjs
// Idempotente na prática: aborta se a fila já tiver linhas pendentes.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const sql = readFileSync("supabase/seed-threads-posts.sql", "utf8");
const rows = [...sql.matchAll(/\(\$sov\$([\s\S]*?)\$sov\$, '([^']+)'\)/g)].map(
  ([, body, scheduled_at]) => ({ body: body.trim(), scheduled_at }),
);

if (rows.length !== 78) {
  console.error(`Esperava 78 posts no seed, achei ${rows.length}. Abortando.`);
  process.exit(1);
}

const { count } = await supabase
  .from("threads_queue")
  .select("*", { count: "exact", head: true });
if ((count ?? 0) > 0) {
  console.error(`A fila já tem ${count} linhas. Abortando para não duplicar.`);
  process.exit(1);
}

const { error } = await supabase.from("threads_queue").insert(rows);
if (error) {
  console.error("Erro ao inserir:", error.message);
  process.exit(1);
}

const { count: final } = await supabase
  .from("threads_queue")
  .select("*", { count: "exact", head: true });
console.log(`OK: ${final} posts na fila.`);
