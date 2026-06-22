# O SOVINA — Plano de Lançamento (até 15/07/2026)

> **Objetivo único:** abrir o **beta do Sovina para a waitlist** em **15/07/2026 (quarta)**,
> grátis e estável, com a waitlist **de fato aquecida** no Threads e o **Modo Roast por IA** funcionando.
> NÃO é o lançamento público — é beta pra aprender com usuários reais (ver Revisão v5).
>
> Estratégia: persona como fosso contra o Pierre (concorrente forte, Open Finance) —
> ver `docs/produto/posicionamento.md` e `docs/produto/analise-mercado-2026.md`.

---

## COMO USAR ESTE PLANO (leia uma vez)

Feito para TDAH + AHSD. Regras de ouro:

1. **Olhe só o dia de hoje.** O resto está guardado aqui e não vai sumir. Não role a página pra frente.
2. **Comece pela tarefa marcada ⭐.** É o "se eu só fizer uma coisa hoje, é essa".
3. **Cada caixa `[ ]` leva ≤ 25 min.** Se uma parecer maior, ela está mal quebrada — me peça pra dividir.
4. **Travou por mais de 5 min? Pare e me chame.** Marque a tarefa com ⚠️ e siga pra próxima. Não fique no muro.
5. **Tag de dono:**
   - `[VOCÊ]` = só você consegue fazer (contas externas, postar, decidir, testar como usuário).
   - `[CLAUDE]` = eu faço. Você só me pede. **Não carregue isso sozinho.**
   - `[@devops]` = deploy/produção. Você aciona, o agente executa.
6. **Timer 25/5:** 25 min de foco, 5 de pausa. Marque uma caixa por bloco.
7. **"Bom o bastante" lança. "Perfeito" não lança.** Polimento infinito é inimigo da data.

---

## 🧭 REVISÃO v5 (22/06) — RE-BASELINE: o beta vai para 15/07

> Decisão âncora: **a data do beta muda de 01/07 → 15/07/2026 (quarta).** Não por fôlego perdido — por aritmética de funil.

**O diagnóstico cru (medido, não estimado):**
- **11 dias de hiato (12–21/06):** zero commits, zero posts. Causa: um erro na conta do Threads travou a automação. **Já resolvido** — o post de 21/06 saiu.
- **Waitlist = 1 inscrito** (o próprio e-mail de teste). Na prática, **vazia**.
- **Modo Roast nunca foi testado** por humano; o fluxo nunca passou por smoke test.

**Por que a data move (e só ela):**
O beta existe pra "aprender com usuários reais". Abrir pra waitlist vazia **falha o objetivo**. O gargalo **não é o produto** (caminho crítico ~1 semana) — é o **aquecimento**, que enche a fila e precisa de semanas rodando. Como ele só recomeçou agora, a data se ajusta pra dar ~3 semanas de Threads de verdade.

**O que NÃO muda:** a filosofia (v2–v4), a persona como fosso, o manual como ritual, o beta grátis, e o WhatsApp como Sprint 1 pós-beta. A análise de mercado de 22/06 reforçou tudo isso com dados.

**Regra nova:** o cronograma abaixo é **re-baselined a partir de 22/06**. As datas antigas (09/06–01/07) viraram histórico. O calendário do Threads (`docs/marketing/threads-calendario-4x20.md`) foi re-sincronizado para terminar em **14/07** (véspera), com **fios** e mais **CTAs** de waitlist.

---

## 🧭 REVISÃO v4 (22/06) — MOBILE entra no roadmap (sem mexer no beta)

> Decisão âncora: **o beta web NÃO muda de escopo.** Mobile é track pós-beta, fast-follow.

**O que mudou:** o Sovina vai ter **app iOS + Android** (Expo/React Native), construído com a **`mobile-app-squad`** (AIOS). Mas a disciplina continua: nada de mobile antes do beta.

**Por que mobile faz sentido aqui:** push notification é o corpo perfeito do "O Sovina" — os 4 decretos/dia + o Roast viram push nativo. Notificação personalizada **triplica engajamento semanal**; gamified goals dão **+32% retenção**; AI recos **+42%** (CoinLaw 2026). É o canal onde finanças mora.

**Ingestão: um cérebro, várias portas (o WhatsApp NÃO morre).**
O parser de IA que entende "gastei 40 no Outback" é o **ativo central**. WhatsApp e app são **duas portas** do mesmo cérebro:
- **WhatsApp** = fricção zero, sem install, no calor do momento, habitat da persona, **sem IAP** (margem melhor). É a ponte que **valida a hipótese de retenção que de-risca o mobile**.
- **App** = dashboard rico, push, áudio/voz nativo, biometria, "casa". Reusa o mesmo parser.
- → WhatsApp ingestion **continua Sprint 1** (pós-beta). O app é a 2ª porta, não substituto.

**Verdades de mobile que pesam no prazo:**
- **IAP obrigatório** (RevenueCat) p/ assinatura dentro do app — Apple/Google tiram 15–30%. Empurrar pra web/WhatsApp onde a regra permitir.
- App é **cliente novo** + review de loja: Apple ~dias; **Google exige teste fechado ~14 dias** p/ conta nova. São **semanas**.

**Teste no beta (produto):** equilibrar **roast × reconhecimento**. A pesquisa diz que retenção vem de "coach firme + motivador", não hostil-puro. O leão também reconhece acerto (streaks/vitórias). Validar o tom agora define o push do mobile.

**Stack/ferramentas:** `mobile-app-squad` (agentes mobile-ux, mobile-engineer, release-engineer). MCPs úteis: **Supabase** (backend = API do app), **Context7** (Expo/RN/EAS), **Sentry** (crash em produção), **Figma** (design→código). Apify p/ pesquisa de ASO/concorrentes.

**Roadmap revisado (v5):**
- **15/07** → beta web pra waitlist
- **Jul S3/S4** → ingestão WhatsApp · depois → Stripe Pro + cota no WhatsApp
- **~Ago** → arranca o track mobile (depois que o WhatsApp validar retenção)
- **~Set** → mobile beta (TestFlight + Play closed testing)
- **~Out/2026** → lançamento do app nas lojas
- depois → Radar (se App Review), Reels, influenciadores

### 📊 Validação por dados (Apify + EXA, 22/06) — ver `docs/produto/analise-mercado-2026.md`

Scrape de reviews recentes do Google Play **confirma a tese — e abre uma janela:**

- **Os dois líderes de Open Finance estão sangrando nota AGORA.** Pierre caiu de 4,8★ histórica p/ **≈3,7★** no fluxo recente (jun/26); Mobills, de 4,7★ p/ **≈3,1★**. Mesma causa raiz: sync que falha, IA que erra número, paywall agressivo, suporte zero. **São dores que o modelo manual + ritual do Sovina não tem por construção.** Reforça: não competir em feature — o manual é fosso, não fraqueza.
- **Usuários do Pierre PEDEM lançamento manual.** O que tratamos como diferencial, o concorrente é cobrado por não ter.
- **Mobills removeu a gamificação e os usuários reclamaram** ("desmotiva"). Valida a aposta gamificada (push + streaks do mobile, v4).
- **WhatsApp já está lotado** (ZapGastos, FinAI, POQT, Financinha, MeuAssessor, Graniq). Nenhum é "o juiz" → entrar pelo **tom**, não pela feature.
- **Graniq é web/PWA, sem app nativo** → há espaço para um app mobile nativo bem-feito no nicho IA-chat (reforça a decisão mobile da v4).

---

## 🧭 REVISÃO v3 (11/06) — ESTRATÉGIA (pós-análise do Pierre)

> Decisão âncora: **o beta é para a waitlist, não um lançamento público.**

**O contexto:** o Pierre (comprado pela CloudWalk, bilionária) é o concorrente — tem Open Finance (sync bancário automático), multiagente, WhatsApp, já lançado com tração. **Não dá pra vencê-lo em features nem capital.** Conclusões que regem o plano daqui pra frente:

1. **Zero features novas antes do beta.** Competir em feature contra o Pierre é corrida perdida. O produto atual (onboarding → cota → Modo Roast) já entrega um beta. Polir > adicionar.
2. **O fosso é a PERSONA + nicho.** O Pierre é o assistente gentil que conecta teu banco. O Sovina é o juiz implacável pra quem quer **disciplina dura** e/ou **não quer conectar o banco** (registrar manual = a própria intervenção comportamental). Não tente ser o Pierre de todos; seja o juiz de um nicho.
3. **Beta pra waitlist.** A data fica como âncora de disciplina + momentum; a ambição é que encolhe pro tamanho real do produto. Sem grande PR público ainda.
4. **Marketing roda em paralelo** — o Threads não espera o beta.
5. **Ingestão de gasto por WhatsApp = Sprint 1 pós-beta** (não "fast-follow vago"). É a ponte que compensa a falta de Open Finance: responder "gastei 40 no Outback" tira a fricção do registro manual. É o que retém.

---

## 🔄 REVISÃO v2 (10/06) — o que mudou
- **Threads:** Tribunais Abertos (posts interativos às 21h) + enquetes (18h). Replies são o que o algoritmo premia — e o Tribunal ensaia o comportamento do produto (confessar gasto = registrar gasto). Regra: **responder todo comentário na 1ª hora**, no personagem.
- **Novas entregas [CLAUDE] (conversão):** landing com seção "Como funciona" + social proof, OG image/metadata, Vercel Analytics com origem por canal (`?src=`), honeypot anti-spam.
- **Novas (confiança):** página /privacidade (LGPD) e e-mail do magic link no tom do Sovina.

---

## MAPA DE HELICÓPTERO (as 4 trilhas)

| Trilha | O que é | Quem puxa |
|--------|---------|-----------|
| **A. Infra** | Deploy da waitlist, domínio, produção | VOCÊ + @devops |
| **B. Divulgação** | Threads no ar, vereditos + fios + CTAs | VOCÊ (conteúdo pronto) |
| **C. Produto** | Modo Roast por IA + polimento das telas | CLAUDE |
| **D. Lançamento** | Abrir o app, e-mail à waitlist, post | VOCÊ + @devops |

**Ritmo do re-baseline (22/06 → 15/07):**
- **Semana A (22–28/06):** destravar os 3 bloqueios + validar o produto (smoke test, Roast) + religar o Threads de verdade.
- **Semana B (29/06–05/07):** produto beta-ready (LGPD, magic link, captura WhatsApp) + aquecimento a todo vapor.
- **Semana C (06–12/07):** munição de lançamento + caça a bugs + pico de CTAs no Threads.
- **Reta final (13–15/07):** congelar, convocar, abrir o beta.

---

# ✅ JÁ FEITO (jun) — não retrabalhar
> Base sólida construída em 09–11/06. Está no ar e funciona. Não mexer salvo bug.

- [x] **Waitlist no ar** — landing + Supabase + e-mail capturando (a máquina funciona)
- [x] **Landing de conversão** — "como funciona", social proof, OG/metadata, Vercel Analytics (`?src=`), honeypot
- [x] **Automação Threads** — fila `threads_queue` + `/api/threads/publish` + GitHub Actions (scheduler 30min)
- [x] **Radar de Pródigos** + página `/admin/replies` (aprovação de replies)
- [x] **Modo Roast por IA** — v1 entregue (⚠️ falta testar com a API key)

---

# 🔴 DESTRAVAR PRIMEIRO (começa hoje, 22/06)
> Os 3 bloqueios `[VOCÊ]` que causaram o hiato. Enquanto não caem, o resto não anda. Ataque-os antes de qualquer coisa nova.

- [ ] ⭐ `[VOCÊ]` Confirmar a **automação do Threads "verde"**: ver no `/admin` (ou no Supabase `threads_queue`) se os 4 slots de hoje saíram sozinhos. Se sim, o motor voltou. (10 min)
- [ ] ⭐ `[VOCÊ]` **Testar o Modo Roast**: registrar 3 gastos diferentes e sentir o tom. Me mandar o que ajustar. (15 min)
  > 📊 Foco (dados 22/06): **números corretos > IA esperta** — a dor nº1 que mata confiança no Pierre/Mobills é valor/categoria errados. No manual o número é exato; não estrague com IA. E equilibrar roast × reconhecimento (o leão também valida acerto).
- [ ] `[VOCÊ]` **Domínio `osovina.app`** (Fase 3): comprar pela Vercel, trocar `NEXT_PUBLIC_APP_URL` e o link das bios. (20 min — único passo de infra pendente)
- [ ] `[VOCÊ]` Publicar e **fixar o post fixado** (`docs/marketing/threads-perfil.md`). (10 min)

---

# SEMANA A (22–28/06) — Produto validado + Threads religado
> Meta: provar que o fluxo do beta funciona ponta a ponta, e o aquecimento rodando de verdade (4 posts/dia + 1º Tribunal).

**Produto [CLAUDE + você testa]:**
- [ ] ⭐ `[VOCÊ]+[CLAUDE]` **Smoke test do fluxo inteiro** num cenário limpo: cadastro → magic link → Julgamento → registrar gasto → veredito. Você roda o app (porta 3001), eu guio e corrijo travas na hora. (1 bloco)
- [ ] `[CLAUDE]` Ajustar **tom/latência do Modo Roast** com seu feedback.
- [ ] `[CLAUDE]` **Estados vazios + mensagens de erro** no tom do Sovina (telas sem dados).
- [ ] `[CLAUDE]` Conferir o **responsivo no celular** (a maioria entra pelo Threads no mobile).

**Divulgação [VOCÊ]:**
- [ ] `[VOCÊ]` **Postar 4/dia** seguindo o calendário re-sincronizado (ou conferir que a automação postou). (contínuo)
- [ ] `[VOCÊ]` **Responder todo comentário na 1ª hora**, no personagem. É o que o algoritmo premia. (contínuo)
- [ ] `[VOCÊ]` Conduzir o **1º Tribunal Aberto** (21h) — máquina de replies + ensaio do produto. (20 min na noite)

---

# SEMANA B (29/06–05/07) — Beta-ready: confiança + captura
> Meta: o que falta pro produto receber estranhos (LGPD, primeira impressão) + construir a lista do fast-follow.

**Produto [CLAUDE]:**
- [ ] `[CLAUDE]` Página **/privacidade** (LGPD) — tom sóbrio, não roast.
- [ ] `[VOCÊ]+[CLAUDE]` **E-mail do magic link no tom do Sovina** — eu escrevo o template, você cola no Supabase (Auth → Email Templates). Primeira impressão do produto. (15 min seu)
- [ ] `[CLAUDE]` **Captura de WhatsApp + opt-in** no app (+ consentimento LGPD). Constrói a lista e valida demanda pro fast-follow nº1.
  > 📊 Lembrete (22/06): o WhatsApp já tem 6+ concorrentes. Nosso diferencial ali não é "registrar por mensagem" (commodity) — é o **tom de juiz**. O copy da captura já pode plantar isso.
- [ ] `[VOCÊ]` **Passeio de usuário** (entrar como cliente novo, anotar estranhezas) → me mandar a lista. (20 min)
- [ ] `[CLAUDE]` Corrigir as estranhezas/bugs que você anotar.

**Divulgação [VOCÊ]:**
- [ ] `[VOCÊ]` Threads 4/dia + replies na 1ª hora + Tribunais/enquetes do calendário. (contínuo)

---

# SEMANA C (06–12/07) — Munição de lançamento + caça a bugs
> Meta: tudo pronto pra apertar o botão + a waitlist no pico.

- [ ] `[CLAUDE]` Escrever o **e-mail de convite ao beta** ("o julgamento começou — você foi convocado").
- [ ] `[CLAUDE]` Escrever o **fio de abertura do beta** no Threads.
- [ ] `[VOCÊ]` Decidir o envio do e-mail à waitlist: **Resend** (eu integro) ou export manual. (10 min)
- [ ] `[CLAUDE]` Se Resend: integrar o disparo à waitlist.
- [ ] ⭐ `[VOCÊ]+[CLAUDE]` **Smoke test final** num cenário limpo. Lista de bugs bloqueadores (só os que impedem o uso). (1 bloco)
- [ ] `[VOCÊ]` Threads 4/dia com **pico de CTAs** perto do beta + replies. (contínuo)

---

# RETA FINAL (13–15/07) — Lançar

## 📅 SEG 13/07 — Congelar
- [ ] ⭐ `[CLAUDE]` **Code freeze**: parar features novas. Só correções críticas.
- [ ] `[VOCÊ]+[CLAUDE]` Última passada de smoke test.
- [ ] `[CLAUDE]` Preparar o PR/branch de lançamento (remover `LAUNCH_MODE=waitlist` → abre `/app` e `/login`).

## 📅 TER 14/07 — Véspera
- [ ] ⭐ `[VOCÊ]` Postar o **fio de convocação final** no Threads (fechamento da série de aquecimento).
- [ ] `[VOCÊ]` Aprovar o e-mail de convite e o post de abertura. (15 min)
- [ ] `[@devops]` Deixar o **deploy de produção engatilhado** (pronto pra apertar amanhã). (você aciona)
- [ ] `[VOCÊ]` Dormir cedo. Dia D exige cabeça. (sério, é tarefa.)

## 📅 QUA 15/07 — 🚀 BETA PRA WAITLIST (não é lançamento público)
> Abre o app SÓ pra quem está na waitlist. Objetivo: aprender com usuários reais e validar a persona. Uma caixa por vez.

- [ ] ⭐ `[@devops]` **Deploy do beta** com `LAUNCH_MODE` desligado. O app abre pra quem tem o link.
- [ ] `[VOCÊ]` Fazer o fluxo completo **você mesmo, na produção real**, com um e-mail novo. (15 min)
- [ ] `[VOCÊ]` Enviar o **e-mail de convite ao beta** pra waitlist (via Resend).
- [ ] `[VOCÊ]` Publicar o **post de abertura do beta** no Threads e fixá-lo. **Sem grande PR ainda.** (10 min)
- [ ] `[VOCÊ]` Ficar de olho: responder no tom, me avisar de **qualquer erro**. Eu corrijo na hora.
- [ ] ⭐ `[VOCÊ]` Pedir a **3-5 betatesters** que usem por uma semana e digam onde travaram (matéria-prima do Sprint 1).
  > 📊 Diferencial barato (22/06): "suporte zero" é reclamação transversal nos concorrentes. Suporte próximo e humano no beta é um fosso de marca que não custa capital.
- [ ] 🎉 `[VOCÊ]` Reconhecer que você botou um produto na mão de usuários reais. Isso é enorme.

---

## 🅿️ PARKING LOT — depois do beta (tire da cabeça agora)
> Importante NÃO fazer antes do dia 1. Está anotado, está seguro.

- 🥇 **FAST-FOLLOW Nº 1 — O Sovina no seu WhatsApp** (design: `docs/produto/whatsapp-sovina.md`): cota do dia + lembretes de custo fixo (`due_date`) + veredito, enviados ativamente com opt-in. É a feature do plano Pro — casa com o Stripe. Ingestão por áudio/texto entra na sequência.
- Monetização **Stripe**: checkout, plano Pro, webhook, gate de acesso (gateia o WhatsApp).
- **Chat completo** com o Sovina (Modo Roast conversacional, além do veredito).
- **Track mobile** (app iOS/Android, Expo/RN) — ver Revisão v4.
- Parcerias com **microinfluenciadores** (formato "O Sovina julga seus gastos").
- **Reels** reciclando os vereditos campeões (kinetic typography).
- **Programa de indicação "fure a fila"** (indicou 3 → acesso antecipado): viral loop da waitlist.
- **Monitoramento de erros (Sentry)** — quando houver usuários de verdade.
- Newsletter recorrente "Vereditos" via Resend.

---

## SE TUDO DER ERRADO (plano B do escopo)
Se a Semana A/B atrasar, **corte nesta ordem, sem culpa:**
1. Modo Roast vira "semi": mantém os vereditos atuais (locais) e a IA entra como fast-follow. O app ainda lança.
2. Polimento vira "só o caminho crítico funciona". Feio mas funcional lança.
3. O que **nunca** corta: a waitlist no ar, o Threads rodando (enchendo a fila), e o app abrindo no dia **15/07**.

**A data é sagrada. O escopo é negociável.**
