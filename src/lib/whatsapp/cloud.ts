import "server-only";

// WhatsApp Cloud API (oficial, Meta) — canal interno de aprovação dos replies
// do Threads. No modo de teste, o número fala apenas com destinatários
// verificados (o admin). Este módulo só envia PARA o admin.
//
// Env: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ADMIN_PHONE.

const GRAPH = "https://graph.facebook.com/v23.0";

export function whatsappConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_ADMIN_PHONE,
  );
}

async function send(payload: Record<string, unknown>): Promise<void> {
  const res = await fetch(
    `${GRAPH}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: process.env.WHATSAPP_ADMIN_PHONE,
        ...payload,
      }),
    },
  );
  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    throw new Error(json.error?.message ?? `WhatsApp API ${res.status}`);
  }
}

/** Mensagem de texto simples para o admin. */
export async function sendAdminText(text: string): Promise<void> {
  await send({ type: "text", text: { body: text.slice(0, 4096) } });
}

const truncate = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n - 1)}…` : s;

/** Rascunho de reply com botões Aprovar/Pular (interactive, máx 1024 chars no corpo). */
export async function sendApprovalRequest(opts: {
  id: string;
  username: string;
  keyword: string;
  targetText: string;
  draft: string;
  permalink?: string | null;
}): Promise<void> {
  const body = [
    "VEREDITO PENDENTE",
    "",
    `@${opts.username} (busca: "${opts.keyword}"):`,
    `"${truncate(opts.targetText, 320)}"`,
    "",
    "Rascunho do Sovina:",
    `"${truncate(opts.draft, 320)}"`,
    opts.permalink ? `\n${opts.permalink}` : "",
  ]
    .join("\n")
    .slice(0, 1024);

  await send({
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: {
        buttons: [
          { type: "reply", reply: { id: `approve:${opts.id}`, title: "Aprovar" } },
          { type: "reply", reply: { id: `skip:${opts.id}`, title: "Pular" } },
        ],
      },
    },
  });
}
