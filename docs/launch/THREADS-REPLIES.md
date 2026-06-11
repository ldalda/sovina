# Radar de Pródigos — Setup (replies irônicos com aprovação via WhatsApp)

> O código está pronto: caça 2x/dia (10h/19h BRT) → filtro de crise + rascunho
> na persona → mensagem no SEU WhatsApp com [Aprovar][Pular] → toque = postado.
> Teto: 10 replies/24h. O que falta é o setup na Meta. Uma caixa por vez.
>
> Regras vivas no código: `src/app/api/threads/hunt/route.ts` (keywords, janela
> 72h, cooldown de autor 14d) e `src/app/api/whatsapp/inbound/route.ts` (teto).

---

## FASE A — Escopo de busca no token do Threads (~10 min) [SPIKE]

- [ ] `[VOCÊ]` Painel Meta → app **O Sovina Threads** → use case **Threads** (Customize) → na lista de **permissions**, adicionar **`threads_keyword_search`**.
- [ ] `[VOCÊ]` Na mesma tela, **User Token Generator** → gerar **novo token** para @osovina.app (o antigo não tem o escopo novo).
- [ ] `[VOCÊ]` Trocar **`THREADS_ACCESS_TOKEN`** no Vercel → **Redeploy**. Me mandar o token novo (ou rodar você o curl do passo seguinte).
- [ ] `[CLAUDE]` Spike: `curl "https://graph.threads.net/v1.0/keyword_search?q=gastei%20muito&search_type=TOP&fields=id,text,username&access_token=TOKEN"` — se vierem posts públicos, ✅ caça liberada. Se vier erro de permissão/só posts próprios → **Plano B** (você manda permalinks e o sistema rascunha/posta; a aprovação via WhatsApp fica igual).

## ⚠️ Canal de aprovação: PÁGINA ADMIN (decidido 10/06)
O número de teste compartilhado da Meta não entrega no Brasil de forma confiável,
então o canal primário é a **página `/admin/replies`** (mobile, com botões
Aprovar/Pular). O WhatsApp (Fase B) fica em standby até haver um número próprio
(fast-follow de julho) — o código do webhook já está pronto e reusa a mesma lógica.

**Setup da página (rápido):**
- [ ] `[VOCÊ]` No Vercel, adicionar a env `ADMIN_KEY` (chave longa que o Claude gera) + `ANTHROPIC_API_KEY` (rascunhos) → Redeploy.
- [ ] Acessar `https://sovina.vercel.app/admin/replies?key=SUA_ADMIN_KEY` no celular. Sem a chave certa = 404.

## FASE B — WhatsApp Cloud API (~30 min) — STANDBY (julho, com número próprio)

- [ ] `[VOCÊ]` Tentar no MESMO app: **Add Product** → **WhatsApp** → Set up. ⚠️ Apps do tipo "Threads use case" muitas vezes NÃO permitem outros produtos — se o WhatsApp não aparecer, criar um **segundo app** (Create App → tipo **Business** → nome `Sovina WhatsApp`) e adicionar o produto lá. Pro código é indiferente (envs separadas). Se pedir *business portfolio*, criar.
- [ ] `[VOCÊ]` Na tela **API Setup / Getting Started**, anotar:
  - o **número de teste** (test number) e o **Phone number ID**;
  - o **token temporário** (24h — serve pro teste; o permanente vem depois).
- [ ] `[VOCÊ]` Em **To** (destinatários), adicionar o **seu número** e confirmar o código que chega no seu WhatsApp.
- [ ] `[VOCÊ]` No Vercel, adicionar e **Redeploy**:
  - `WHATSAPP_TOKEN` = token (temporário por enquanto)
  - `WHATSAPP_PHONE_NUMBER_ID` = o Phone number ID
  - `WHATSAPP_VERIFY_TOKEN` = uma string qualquer que você inventar (ex.: gere com `openssl rand -hex 16`)
  - `WHATSAPP_ADMIN_PHONE` = seu número com DDI, só dígitos (ex.: 5511999999999)
- [ ] `[VOCÊ]` Ainda no produto WhatsApp → **Configuration → Webhook**:
  - Callback URL: `https://sovina.vercel.app/api/whatsapp/inbound`
  - Verify token: o MESMO `WHATSAPP_VERIFY_TOKEN`
  - **Verify and save** (o endpoint responde o challenge)
  - Em **Webhook fields**, assinar **`messages`**.
- [ ] `[VOCÊ]` ⚠️ Token permanente (o temporário expira em 24h): Business Settings → **System Users** → criar → gerar token com o app + permissão `whatsapp_business_messaging` → trocar `WHATSAPP_TOKEN` no Vercel. (Posso te guiar quando chegar aqui.)

## FASE C — Banco (~2 min)

- [ ] `[VOCÊ]` SQL Editor do Supabase → colar e rodar o conteúdo de **`supabase/migrations/20260610230000_threads_reply_queue.sql`** (o Claude te manda o SQL pronto no chat se preferir).

## FASE D — Teste E2E com a cobaia (~10 min)

- [ ] `[VOCÊ]` Pela conta órfã **@osovinajulga**, postar: `gastei muito hoje kkk` (ela é a cobaia perfeita — pública e nossa).
- [ ] `[CLAUDE/VOCÊ]` Disparar a caça: GitHub → Actions → **Threads hunt** → Run workflow (ou eu disparo daqui).
- [ ] `[VOCÊ]` Conferir: chegou a mensagem **VEREDITO PENDENTE** no seu WhatsApp?
- [ ] `[VOCÊ]` Tocar **[Aprovar]** → o reply do @osovina.app deve aparecer no post da cobaia + confirmação no WhatsApp.
- [ ] 🎉 Radar no ar. A partir daí: 2 caças/dia, você aprova do bolso.

## Operação
- Mandar **qualquer texto** pro número do Sovina → ele responde o status (rascunhos pendentes + postados/24h).
- Rascunho não decidido **expira em 24h** (não acumula culpa).
- Monitorar: tabela `threads_reply_queue` no Supabase; aba Actions no GitHub.
- Semana 1: revise com carinho a QUALIDADE dos rascunhos antes de aprovar — me passe os ruins que eu ajusto o prompt.
