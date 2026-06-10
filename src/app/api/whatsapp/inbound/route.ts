import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { publishTextPost } from "@/lib/threads/publish";
import { sendAdminText } from "@/lib/whatsapp/cloud";

export const maxDuration = 60;

// Webhook do WhatsApp Cloud API. Hoje serve ao fluxo de aprovação dos replies
// do Threads: botões [Aprovar]/[Pular] enviados pelo /api/threads/hunt.
// Só reage a mensagens vindas do WHATSAPP_ADMIN_PHONE — o resto é ignorado
// (responder 200 sempre, senão a Meta reentrega o evento).

const MAX_REPLIES_PER_DAY = 10; // teto de replies postados por 24h móveis

// Verificação do webhook (Meta chama com hub.challenge na configuração)
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  if (
    sp.get("hub.mode") === "subscribe" &&
    sp.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new NextResponse(sp.get("hub.challenge") ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

type InboundMessage = {
  from?: string;
  type?: string;
  text?: { body?: string };
  interactive?: { button_reply?: { id?: string } };
};

export async function POST(req: NextRequest) {
  const payload = (await req.json().catch(() => null)) as {
    entry?: { changes?: { value?: { messages?: InboundMessage[] } }[] }[];
  } | null;

  const messages =
    payload?.entry?.flatMap(
      (e) => e.changes?.flatMap((c) => c.value?.messages ?? []) ?? [],
    ) ?? [];

  const admin = process.env.WHATSAPP_ADMIN_PHONE ?? "";
  for (const msg of messages) {
    // segurança: só o admin comanda; outros remetentes são ignorados
    if (!msg.from || !admin || !msg.from.endsWith(admin.slice(-11))) continue;
    try {
      const buttonId = msg.interactive?.button_reply?.id;
      if (buttonId) {
        await handleButton(buttonId);
      } else if (msg.type === "text") {
        await sendStatusSummary();
      }
    } catch (e) {
      try {
        await sendAdminText(
          `Erro ao processar: ${e instanceof Error ? e.message : String(e)}`,
        );
      } catch {
        /* sem canal de erro — segue */
      }
    }
  }

  // 200 sempre: a Meta reentrega eventos não confirmados
  return NextResponse.json({ ok: true });
}

async function handleButton(buttonId: string) {
  const [action, id] = buttonId.split(":");
  if (!id || (action !== "approve" && action !== "skip")) return;

  const supabase = createServiceClient();
  const { data: row } = await supabase
    .from("threads_reply_queue")
    .select("id,status,draft,target_post_id,target_username")
    .eq("id", id)
    .single();

  if (!row) {
    await sendAdminText("Rascunho não encontrado.");
    return;
  }
  if (row.status !== "draft") {
    await sendAdminText(`Esse rascunho já foi tratado (${row.status}).`);
    return;
  }

  if (action === "skip") {
    await supabase
      .from("threads_reply_queue")
      .update({ status: "skipped", decided_at: new Date().toISOString() })
      .eq("id", id);
    await sendAdminText(`Pulado o post de @${row.target_username}.`);
    return;
  }

  // approve — teto diário primeiro
  const { count: postedToday } = await supabase
    .from("threads_reply_queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "posted")
    .gte("posted_at", new Date(Date.now() - 24 * 3600_000).toISOString());
  if ((postedToday ?? 0) >= MAX_REPLIES_PER_DAY) {
    await sendAdminText(
      `Teto de ${MAX_REPLIES_PER_DAY} replies/24h atingido. O rascunho continua pendente.`,
    );
    return;
  }

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
    await sendAdminText(`Postado em @${row.target_username}. Eu avisei que eu via tudo.`);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await supabase
      .from("threads_reply_queue")
      .update({ status: "failed", error: message })
      .eq("id", id);
    await sendAdminText(`Falhou ao postar: ${message}`);
  }
}

async function sendStatusSummary() {
  const supabase = createServiceClient();
  const { count: drafts } = await supabase
    .from("threads_reply_queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");
  const { count: posted } = await supabase
    .from("threads_reply_queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "posted")
    .gte("posted_at", new Date(Date.now() - 24 * 3600_000).toISOString());
  await sendAdminText(
    `Tribunal em ordem. ${drafts ?? 0} rascunho(s) pendente(s), ${posted ?? 0} de ${MAX_REPLIES_PER_DAY} replies postados nas últimas 24h.`,
  );
}
