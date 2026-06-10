import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { keywordSearch, type FoundPost } from "@/lib/threads/search";
import { personaModel } from "@/lib/ai/router";
import { SOVINA_SYSTEM_PROMPT } from "@/lib/ai/persona";
import {
  sendApprovalRequest,
  whatsappConfigured,
} from "@/lib/whatsapp/cloud";

export const maxDuration = 60;

// "Radar de Pródigos": caça posts públicos sobre gastar demais, filtra crise,
// rascunha a resposta na persona e manda pro WhatsApp do admin aprovar.
// Chamado 2x/dia pelo GitHub Actions. Regras de segurança como consts:

const KEYWORDS = [
  "gastei muito",
  "gastei demais",
  "estou liso",
  "tô liso",
  "torrei o salário",
  "não posso gastar",
];
const MAX_LIVE_DRAFTS = 10; // rascunhos pendentes simultâneos
const TARGET_WINDOW_H = 72; // só posts recentes
const AUTHOR_COOLDOWN_DAYS = 14; // nunca abordar o mesmo autor 2x no período
const OWN_USERNAMES = ["osovina.app"]; // nunca responder a si mesmo

const ClassificationSchema = z.object({
  decisions: z.array(
    z.object({
      post_id: z.string().describe("id do post avaliado"),
      verdict: z
        .enum(["REPLY", "SKIP"])
        .describe("REPLY só para humor/desabafo leve sobre gastar; SKIP na dúvida"),
      reply: z
        .string()
        .nullable()
        .describe("a resposta do Sovina quando verdict=REPLY; null se SKIP"),
    }),
  ),
});

const REPLY_INSTRUCTIONS = `Você vai avaliar posts públicos do Threads encontrados por busca de palavras-chave sobre gastar dinheiro. Para CADA post, decida:

SKIP (obrigatório) se houver QUALQUER sinal de: crise real (dívida grave, desemprego, doença, luto, desespero), apostas/jogo, política/religião, autor aparentemente menor de idade, texto incompreensível ou que não é sobre gasto pessoal. NA DÚVIDA, SKIP — você não inventa contexto.

REPLY apenas para posts de tom claramente leve/humorístico ou desabafo casual sobre gastar demais. A resposta deve:
- Ter 1 a 2 frases curtas, no seu tom (irônico, matemático).
- Atacar o HÁBITO com humor, jamais a pessoa.
- Citar um número em R$ quando fizer sentido natural (anualizar o hábito é sua arma).
- NUNCA: emoji, hashtag, link, CTA, mencionar app/produto/IA, soar publicidade.
- Soar como um comentário espirituoso de um personagem, não como marketing.`;

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();
  const nowMs = Date.now();

  // 1) expira rascunhos velhos (>24h sem decisão)
  await supabase
    .from("threads_reply_queue")
    .update({ status: "expired" })
    .eq("status", "draft")
    .lt("created_at", new Date(nowMs - 24 * 3600_000).toISOString());

  // 2) capacidade: quantos rascunhos vivos ainda cabem
  const { count: liveDrafts } = await supabase
    .from("threads_reply_queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");
  const capacity = MAX_LIVE_DRAFTS - (liveDrafts ?? 0);
  if (capacity <= 0) {
    return NextResponse.json({ found: 0, drafted: 0, note: "fila cheia" });
  }

  // 3) histórico p/ dedup (post já visto + autor em cooldown)
  const { data: recent } = await supabase
    .from("threads_reply_queue")
    .select("target_post_id,target_username")
    .gte(
      "created_at",
      new Date(nowMs - AUTHOR_COOLDOWN_DAYS * 24 * 3600_000).toISOString(),
    );
  const seenPosts = new Set((recent ?? []).map((r) => r.target_post_id));
  const seenAuthors = new Set(
    (recent ?? []).map((r) => r.target_username.toLowerCase()),
  );

  // 4) caça: TOP por keyword, filtros determinísticos
  const minTs = nowMs - TARGET_WINDOW_H * 3600_000;
  const candidates: (FoundPost & { keyword: string })[] = [];
  const searchErrors: string[] = [];
  for (const keyword of KEYWORDS) {
    try {
      const found = await keywordSearch(keyword);
      for (const p of found.slice(0, 8)) {
        const username = p.username?.toLowerCase() ?? "";
        if (!p.text || p.is_reply) continue;
        if (p.timestamp && new Date(p.timestamp).getTime() < minTs) continue;
        if (!username || OWN_USERNAMES.includes(username)) continue;
        if (seenPosts.has(p.id) || seenAuthors.has(username)) continue;
        if (candidates.some((c) => c.id === p.id)) continue;
        candidates.push({ ...p, keyword });
      }
    } catch (e) {
      searchErrors.push(
        `${keyword}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  if (candidates.length === 0) {
    return NextResponse.json({ found: 0, drafted: 0, searchErrors });
  }

  // 5) classificação + rascunho num único lote (persona)
  const { object } = await generateObject({
    model: personaModel,
    schema: ClassificationSchema,
    system: SOVINA_SYSTEM_PROMPT,
    prompt: `${REPLY_INSTRUCTIONS}\n\nPOSTS:\n${candidates
      .map((c) => `- post_id: ${c.id}\n  @${c.username}: "${c.text}"`)
      .join("\n")}`,
  });

  // 6) insere rascunhos (até a capacidade) e notifica o admin
  let drafted = 0;
  let notified = 0;
  for (const d of object.decisions) {
    if (drafted >= capacity) break;
    if (d.verdict !== "REPLY" || !d.reply?.trim()) continue;
    const post = candidates.find((c) => c.id === d.post_id);
    if (!post) continue;

    const { data: row, error } = await supabase
      .from("threads_reply_queue")
      .insert({
        target_post_id: post.id,
        target_username: post.username!,
        target_text: post.text!,
        target_permalink: post.permalink ?? null,
        keyword: post.keyword,
        draft: d.reply.trim(),
      })
      .select("id")
      .single();
    if (error || !row) continue;
    drafted++;

    if (whatsappConfigured()) {
      try {
        await sendApprovalRequest({
          id: row.id,
          username: post.username!,
          keyword: post.keyword,
          targetText: post.text!,
          draft: d.reply.trim(),
          permalink: post.permalink,
        });
        notified++;
      } catch {
        /* rascunho fica na fila mesmo sem notificação */
      }
    }
  }

  return NextResponse.json({
    found: candidates.length,
    drafted,
    notified,
    searchErrors,
  });
}
