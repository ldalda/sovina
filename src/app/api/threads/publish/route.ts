import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { publishTextPost } from "@/lib/threads/publish";

export const maxDuration = 60;

// Posts atrasados além disto são marcados 'skipped' em vez de publicados.
// GitHub Actions atrasa runs em horas (best-effort), então a janela é larga
// (5h): tolera o atraso e ainda assim não despeja posts de um dia anterior.
const LATE_LIMIT_MS = 5 * 60 * 60 * 1000;

// Publica os posts devidos da fila. Chamado pelo GitHub Actions nos horários
// 08/12/18/21 (BRT) com Authorization: Bearer {CRON_SECRET}.
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();
  // Limite alto: um fio são várias linhas e o catch-up pode ter vários devidos.
  // Ordenado por scheduled_at e thread_position para publicar fios na ordem certa.
  const { data: due, error } = await supabase
    .from("threads_queue")
    .select("id,body,scheduled_at,thread_key,thread_position")
    .eq("status", "pending")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at")
    .order("thread_position", { nullsFirst: true })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let posted = 0;
  let skipped = 0;
  let failed = 0;

  const markSkipped = (id: string) =>
    supabase
      .from("threads_queue")
      .update({ status: "skipped", error: "atrasado além do limite" })
      .eq("id", id);

  const markPosted = (id: string, threadsId: string) =>
    supabase
      .from("threads_queue")
      .update({
        status: "posted",
        threads_post_id: threadsId,
        posted_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", id);

  const markFailed = (id: string, e: unknown) =>
    supabase
      .from("threads_queue")
      .update({
        status: "failed",
        error: e instanceof Error ? e.message : String(e),
      })
      .eq("id", id);

  const isLate = (scheduledAt: string) =>
    Date.now() - new Date(scheduledAt).getTime() > LATE_LIMIT_MS;

  // Separa avulsos (thread_key null) dos fios (agrupados por thread_key,
  // preservando a ordem de scheduled_at vinda da query).
  const avulsos = (due ?? []).filter((p) => !p.thread_key);
  const fios = new Map<string, typeof due>();
  for (const p of due ?? []) {
    if (!p.thread_key) continue;
    const group = fios.get(p.thread_key) ?? [];
    group.push(p);
    fios.set(p.thread_key, group as typeof due);
  }

  // Avulsos: um post por vez, como antes.
  for (const post of avulsos) {
    if (isLate(post.scheduled_at)) {
      await markSkipped(post.id);
      skipped++;
      continue;
    }
    try {
      const threadsId = await publishTextPost(post.body);
      await markPosted(post.id, threadsId);
      posted++;
    } catch (e) {
      await markFailed(post.id, e);
      failed++;
    }
  }

  // Fios: publica em cadeia, cada post respondendo ao anterior (reply_to_id).
  for (const group of fios.values()) {
    const parts = (group ?? [])
      .slice()
      .sort((a, b) => (a.thread_position ?? 0) - (b.thread_position ?? 0));
    if (parts.length === 0) continue;

    if (isLate(parts[0].scheduled_at)) {
      for (const part of parts) {
        await markSkipped(part.id);
        skipped++;
      }
      continue;
    }

    let replyToId: string | undefined;
    let broke = false;
    for (const part of parts) {
      if (broke) {
        // Sem o post anterior não há como encadear: marca o resto como failed.
        await markFailed(part.id, "fio interrompido: post anterior falhou");
        failed++;
        continue;
      }
      try {
        const threadsId = await publishTextPost(part.body, { replyToId });
        await markPosted(part.id, threadsId);
        replyToId = threadsId;
        posted++;
      } catch (e) {
        await markFailed(part.id, e);
        failed++;
        broke = true;
      }
    }
  }

  return NextResponse.json({ processed: due?.length ?? 0, posted, skipped, failed });
}
