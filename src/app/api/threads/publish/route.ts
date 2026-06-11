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
  const { data: due, error } = await supabase
    .from("threads_queue")
    .select("id,body,scheduled_at")
    .eq("status", "pending")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at")
    .limit(4);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let posted = 0;
  let skipped = 0;
  let failed = 0;

  for (const post of due ?? []) {
    const lateBy = Date.now() - new Date(post.scheduled_at).getTime();
    if (lateBy > LATE_LIMIT_MS) {
      await supabase
        .from("threads_queue")
        .update({ status: "skipped", error: "atrasado além do limite" })
        .eq("id", post.id);
      skipped++;
      continue;
    }
    try {
      const threadsId = await publishTextPost(post.body);
      await supabase
        .from("threads_queue")
        .update({
          status: "posted",
          threads_post_id: threadsId,
          posted_at: new Date().toISOString(),
          error: null,
        })
        .eq("id", post.id);
      posted++;
    } catch (e) {
      await supabase
        .from("threads_queue")
        .update({
          status: "failed",
          error: e instanceof Error ? e.message : String(e),
        })
        .eq("id", post.id);
      failed++;
    }
  }

  return NextResponse.json({ processed: due?.length ?? 0, posted, skipped, failed });
}
