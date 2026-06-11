import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import { publishTextPost } from "./publish";

// Ações de decisão sobre um rascunho de reply — compartilhadas entre a página
// admin (/admin/replies) e o webhook do WhatsApp. Toda a regra (teto diário,
// publicação via reply_to_id) mora aqui, num lugar só.

export const MAX_REPLIES_PER_DAY = 10;

export type ReplyActionResult = { ok: boolean; message: string };

export async function skipReply(id: string): Promise<ReplyActionResult> {
  const supabase = createServiceClient();
  const { data: row } = await supabase
    .from("threads_reply_queue")
    .select("status,target_username")
    .eq("id", id)
    .single();
  if (!row) return { ok: false, message: "Rascunho não encontrado." };
  if (row.status !== "draft")
    return { ok: false, message: `Já tratado (${row.status}).` };

  await supabase
    .from("threads_reply_queue")
    .update({ status: "skipped", decided_at: new Date().toISOString() })
    .eq("id", id);
  return { ok: true, message: `Pulado @${row.target_username}.` };
}

export async function approveReply(id: string): Promise<ReplyActionResult> {
  const supabase = createServiceClient();
  const { data: row } = await supabase
    .from("threads_reply_queue")
    .select("status,draft,target_post_id,target_username")
    .eq("id", id)
    .single();
  if (!row) return { ok: false, message: "Rascunho não encontrado." };
  if (row.status !== "draft")
    return { ok: false, message: `Já tratado (${row.status}).` };

  const { count } = await supabase
    .from("threads_reply_queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "posted")
    .gte("posted_at", new Date(Date.now() - 24 * 3600_000).toISOString());
  if ((count ?? 0) >= MAX_REPLIES_PER_DAY)
    return {
      ok: false,
      message: `Teto de ${MAX_REPLIES_PER_DAY} replies/24h atingido.`,
    };

  try {
    const threadsReplyId = await publishTextPost(row.draft, {
      replyToId: row.target_post_id,
    });
    await supabase
      .from("threads_reply_queue")
      .update({
        status: "posted",
        threads_reply_id: threadsReplyId,
        decided_at: new Date().toISOString(),
        posted_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", id);
    return { ok: true, message: `Postado em @${row.target_username}.` };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await supabase
      .from("threads_reply_queue")
      .update({ status: "failed", error: message })
      .eq("id", id);
    return { ok: false, message: `Falhou: ${message}` };
  }
}
