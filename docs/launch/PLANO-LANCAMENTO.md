# O SOVINA — Plano de Lançamento (até 01/07/2026)

> **Objetivo único:** abrir o **beta do Sovina para a waitlist** em **01/07/2026 (quarta)**,
> grátis e estável, com a waitlist aquecida no Threads e o **Modo Roast por IA** funcionando.
> NÃO é o lançamento público — é beta pra aprender com usuários reais (ver Revisão v3).
>
> Estratégia: persona como fosso contra o Pierre (concorrente forte, Open Finance) — ver `docs/produto/posicionamento.md`.

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

## 🧭 REVISÃO v3 (11/06) — ESTRATÉGIA (pós-análise do Pierre)

> Decisão âncora: **01/07 é um BETA para a waitlist, não um lançamento público.**

**O contexto:** o Pierre (comprado pela CloudWalk, bilionária) é o concorrente — tem Open Finance (sync bancário automático), multiagente, WhatsApp, já lançado com tração. **Não dá pra vencê-lo em features nem capital.** Conclusões que regem o plano daqui pra frente:

1. **Zero features novas antes do beta.** Competir em feature contra o Pierre é corrida perdida. O produto atual (onboarding → cota → Modo Roast) já entrega um beta. Polir > adicionar.
2. **O fosso é a PERSONA + nicho.** O Pierre é o assistente gentil que conecta teu banco. O Sovina é o juiz implacável pra quem quer **disciplina dura** e/ou **não quer conectar o banco** (registrar manual = a própria intervenção comportamental). Não tente ser o Pierre de todos; seja o juiz de um nicho.
3. **01/07 = beta pra waitlist.** A data fica (disciplina + momentum); a ambição é que encolhe pro tamanho real do produto. Sem grande PR público ainda.
4. **Marketing roda em paralelo** — o Threads não espera o beta.
5. **Ingestão de gasto por WhatsApp = Sprint 1 pós-beta** (não "fast-follow vago"). É a ponte que compensa a falta de Open Finance: responder "gastei 40 no Outback" tira a fricção do registro manual. É o que retém.

**Roadmap pós-beta:** Jul S1 = ingestão WhatsApp · Jul S2 = Stripe Pro + cota diária no WhatsApp · depois = Radar (se App Review sair), Reels, influenciadores.

---

## 🔄 REVISÃO v2 (10/06) — o que mudou
- **Threads:** 5 **Tribunais Abertos** (posts interativos às 21h, dias 5/8/11/15/18) + 2 enquetes (18h, dias 9/16). Replies são o que o algoritmo premia — e o Tribunal ensaia o comportamento do produto (confessar gasto = registrar gasto). Regra nova: **responder todo comentário na 1ª hora**, no personagem.
- **Novas entregas [CLAUDE] na Semana 1 (conversão):** landing com seção "Como funciona" + social proof, OG image/metadata, Vercel Analytics com origem por canal (`?src=`), honeypot anti-spam.
- **Novas na Semana 2 (confiança):** página /privacidade (LGPD) e e-mail do magic link no tom do Sovina.

---

## MAPA DE HELICÓPTERO (as 4 trilhas)

| Trilha | O que é | Quem puxa |
|--------|---------|-----------|
| **A. Infra** | Deploy da waitlist, domínio, produção | VOCÊ + @devops |
| **B. Divulgação** | Threads no ar, 80 vereditos (4/dia), e-mails | VOCÊ (conteúdo pronto) |
| **C. Produto** | Modo Roast por IA + polimento das telas | CLAUDE |
| **D. Lançamento** | Abrir o app, e-mail à waitlist, post | VOCÊ + @devops |

**Ritmo das semanas:**
- **Sem 0 (09–14/06):** destravar o aquecimento — waitlist no ar + Threads começando.
- **Sem 1 (15–21/06):** feature estrela (Modo Roast) + polimento.
- **Sem 2 (22–28/06):** caça a bugs, produção pronta, conteúdo de lançamento.
- **Reta final (29/06–01/07):** abrir o app e lançar.

---

# SEMANA 0 — Destravar o aquecimento

## 📅 TER 09/06 — HOJE
> Meta do dia: a waitlist no caminho do ar + conta do Threads nascendo.

- [x] ⭐ `[VOCÊ]` ~~Decidir o domínio.~~ **DEFINIDO: osovina.app** ✅ (comprado pela Vercel — DNS/SSL automáticos; casa com @osovina.app)
- [x] `[VOCÊ]` Criar conta no **Instagram + Threads**. ✅ **Consolidado: `@osovina.app` nas duas redes** (a `@osovinajulga` desassociou do IG e ficou dormente — não mexer mais em handles)
- [x] `[VOCÊ]` ~~Pôr a foto de perfil (avatar do leão, recortado no busto).~~ ✅ (nas duas contas)
- [x] `[VOCÊ]` ~~Colar a bio opção A (sem link ainda).~~ ✅
- [x] `[CLAUDE]` ~~Me peça: "comece o Modo Roast".~~ ✅ **v1 entregue adiantada (09/06)** — falta você testar com a API key.

## 📅 QUA 10/06 — Waitlist no ar
> Meta: e-mail sendo capturado de verdade.
> **Guia detalhado, passo a passo, pronto:** `docs/launch/DEPLOY-WAITLIST.md`

- [x] `[CLAUDE/@devops]` ~~Commit + push.~~ ✅ github.com/ldalda/sovina (main)
- [x] `[VOCÊ]` ~~Fase 1: tabela `waitlist`.~~ ✅
- [x] `[VOCÊ]` ~~Fase 2: Vercel + env vars.~~ ✅ landing no ar em modo waitlist
- [ ] `[VOCÊ]` Fase 3: comprar **`osovina.app`** pela Vercel (DNS/SSL automáticos), trocar `NEXT_PUBLIC_APP_URL` e o link das bios. **(único passo de infra pendente)**
- [x] `[VOCÊ]` ~~Fase 4: e-mail de teste.~~ ✅ caiu no Supabase — **a máquina funciona.**

## 📅 QUI 11/06 — Threads começa
> Meta: primeiro veredito público no ar.

- [x] `[VOCÊ]` ~~Pôr o link da waitlist nas bios.~~ ✅ (Threads + Instagram, URL `.vercel.app` por enquanto)
- [ ] ⭐ `[VOCÊ]` Publicar e **fixar o post fixado** (`docs/marketing/threads-perfil.md`). (10 min)
- [x] `[CLAUDE]` ~~Construir a automação de posts.~~ ✅ fila + endpoint + GitHub Actions prontos (10/06); falta só o seu token da Meta.
- [ ] ⭐ `[VOCÊ]` **Setup do app na Meta** (app + tester + token) — guia de micropassos: `docs/launch/THREADS-AUTOMACAO.md`. (45 min, rende 20 dias de posts automáticos)
- [ ] `[VOCÊ]` Até a automação ficar verde: **postar manualmente os 4 slots do dia** (copiar do calendário). (15 min/dia)
- [ ] `[VOCÊ]` Regra de ouro a partir de agora: **responder todo comentário na 1ª hora**, no personagem (Gemini/NotebookLM + revisão). (contínuo)
- [ ] `[CLAUDE]` Pedir atualização do Modo Roast (o que já está pronto). (1 min seu)

## 📅 SEX 12/06
- [ ] ⭐ `[VOCÊ]` Conferir se os 4 posts do **Dia 2** saíram agendados (ou postar manual). (10 min)
- [ ] `[VOCÊ]` Responder qualquer comentário **no tom do Sovina** (nunca quebrar personagem). (10 min)
- [ ] `[CLAUDE]` Continuo o Modo Roast.

## 📅 🔵 SÁB 13/06 + DOM 14/06 — Fim de semana leve
> Só o essencial. Descansar também é parte do plano (e do TDAH).

- [ ] `[VOCÊ]` Postar **Dia 3** (sáb) e **Dia 4** (dom), 4 posts cada (08h/12h/18h/21h — ou agende). (15 min/dia)
- [ ] *(Opcional)* `[VOCÊ]` Rodar os vereditos no **Gemini** com o brand kit pra gerar 3 variações de cada e encher o banco. (30 min, se a energia permitir)

---

# SEMANA 1 — Feature estrela + polimento

## 📅 SEG 15/06 — Modo Roast ganha vida
- [x] ⭐ `[CLAUDE]` ~~Entregar a primeira versão do Modo Roast por IA.~~ ✅ **Feito adiantado em 09/06.**
- [ ] `[VOCÊ]` Testar registrando 3 gastos diferentes e **sentir o tom**. Me dizer o que ajustar. (15 min)
- [ ] `[VOCÊ]` Dia 5 no ar. Às 21h é o **1º Tribunal Aberto** — fique por perto e responda as confissões no personagem. (20 min à noite)

## 📅 TER 16/06 → SEX 19/06 — Polir o que já existe
> Bloco de produto. A maioria é `[CLAUDE]`; você testa e aponta.

- [ ] `[VOCÊ]` Diário: postar **Dia 6, 7, 8, 9** (4/dia — ou agende a semana). (15 min/dia)
- [ ] ⭐ `[VOCÊ]` Fazer **um "passeio de usuário"** por dia: entrar no app e usar uma tela como se fosse cliente novo. Anotar tudo que estranhar. Me mandar a lista. (20 min/dia)
- [ ] `[CLAUDE]` Ajustar o tom/latência do Modo Roast com seu feedback.
- [ ] `[CLAUDE]` Corrigir os bugs/estranhezas que você anotar.
- [ ] `[CLAUDE]` Estados vazios e mensagens de erro no tom do Sovina (telas sem dados ainda).
- [ ] `[CLAUDE]` Conferir o **responsivo no celular** (a maioria vai entrar pelo Threads no mobile).
- [x] `[CLAUDE]` ~~Landing que converte~~ ✅ (10/06) seção "Como funciona" + veredito de exemplo + social proof (aparece a partir de 20 inscritos) + **ISR de 5 min** (de quebra, mata o cold start).
- [x] `[CLAUDE]` ~~OG image + metadata~~ ✅ (10/06) card brutalista via next/og + Open Graph/Twitter completos.
- [x] `[CLAUDE]` ~~Vercel Analytics + origem por canal~~ ✅ (10/06) `?src=` gravado na coluna `source`. **Falta `[VOCÊ]`:** ativar Analytics no painel do Vercel (aba Analytics → Enable) e trocar o link das bios para `...vercel.app/?src=threads` (e `?src=ig` no IG).
- [x] `[CLAUDE]` ~~Honeypot anti-spam~~ ✅ (10/06) bot recebe sucesso falso, nada é gravado.

## 📅 🔵 SÁB 20/06 + DOM 21/06 — Fim de semana leve
- [ ] `[VOCÊ]` Postar **Dia 10** (sáb) e **Dia 11** (dom). (10 min/dia)
- [ ] *(Opcional)* `[VOCÊ]` Olhar os números do Threads: qual veredito engajou mais? Me diz que eu reforço esse ângulo. (15 min)

---

# SEMANA 2 — Bugs, produção e munição de lançamento

## 📅 SEG 22/06 → SEX 26/06
- [ ] `[VOCÊ]` Diário: postar **Dia 12 a 16** (4/dia — ou agende a semana). (15 min/dia)
- [ ] ⭐ `[VOCÊ] + [CLAUDE]` **Smoke test do fluxo inteiro** num cenário limpo: cadastro → magic link → Julgamento → registrar gasto → ver veredito. Caçar qualquer trava. (1 bloco contigo guiando)
- [ ] `[CLAUDE]` Escrever o **e-mail de lançamento** para a waitlist (no tom do Sovina: "o julgamento começou").
- [ ] `[CLAUDE]` Escrever o **post de lançamento** do Threads.
- [ ] `[VOCÊ]` Decidir como enviar o e-mail à waitlist: **Resend** (eu integro) ou export manual. (10 min — me diga e eu preparo)
- [ ] `[CLAUDE]` Página **/privacidade** (LGPD): você coleta e-mails e, no lançamento, dados financeiros. Obrigação legal + confiança — no tom sóbrio, não no roast.
- [ ] `[VOCÊ] + [CLAUDE]` **E-mail do magic link no tom do Sovina:** eu escrevo o template, você cola no Supabase (Auth → Email Templates). É a primeira impressão do produto no lançamento. (15 min seu)
- [ ] `[CLAUDE]` **Captura de WhatsApp + opt-in** no app ("Quer que eu te cobre no WhatsApp? Deixa teu número." + consentimento LGPD): ~1h, constrói a lista e valida demanda pro fast-follow nº 1 antes dele existir.

## 📅 🔵 SÁB 27/06 + DOM 28/06 — Penúltimo fim de semana
- [ ] `[VOCÊ]` Postar **Dia 17** (sáb) e **Dia 18** (dom). (10 min/dia)
- [ ] ⭐ `[VOCÊ]` **Ensaio geral mental:** ler o checklist da reta final (abaixo) e me perguntar o que ainda estiver nebuloso. Zero surpresas no dia D. (20 min)

---

# RETA FINAL — Lançar

## 📅 SEG 29/06 — Congelar e preparar
- [ ] ⭐ `[CLAUDE]` **Code freeze:** parar features novas. Só correções críticas a partir de agora.
- [ ] `[VOCÊ]` Postar **Dia 19** (4 posts).
- [ ] `[VOCÊ] + [CLAUDE]` Última passada de smoke test. Lista final de bugs bloqueadores (só os que impedem o uso). (1 bloco)
- [ ] `[CLAUDE]` Preparar o PR/branch de lançamento (remover `LAUNCH_MODE=waitlist` → abre `/app` e `/login`).

## 📅 TER 30/06 — Véspera
- [ ] ⭐ `[VOCÊ]` Postar **Dia 20 — Manhã** (o fechamento da série) e **Noite** (a convocação final).
- [ ] `[VOCÊ]` Conferir o e-mail de lançamento (texto do Claude) e o post de lançamento. Aprovar. (15 min)
- [ ] `[@devops]` Deixar o deploy de produção **engatilhado** (pronto pra apertar o botão amanhã). (você aciona)
- [ ] `[VOCÊ]` Dormir cedo. Dia D exige cabeça. (sério, é tarefa.)

## 📅 QUA 01/07 — 🚀 BETA PRA WAITLIST (não é lançamento público)
> Abre o app SÓ pra quem está na waitlist. Objetivo: aprender com usuários
> reais e validar a persona — não fazer barulho público ainda. Uma caixa por vez.

- [ ] ⭐ `[@devops]` **Deploy do beta** com `LAUNCH_MODE` desligado. O app abre pra quem tem o link.
- [ ] `[VOCÊ]` Fazer o fluxo completo **você mesmo, na produção real**, com um e-mail novo. Confirmar ponta a ponta. (15 min)
- [ ] `[VOCÊ]` Enviar o **e-mail de convite ao beta** para a waitlist (tom do Sovina: "o julgamento começou — você foi convocado"). (via Resend)
- [ ] `[VOCÊ]` Publicar o **post de abertura do beta** no Threads e fixá-lo. **Sem grande PR ainda** — o público vem depois, com o produto endurecido pelo beta. (10 min)
- [ ] `[VOCÊ]` Ficar de olho: responder comentários no tom, me avisar de **qualquer erro**. Eu corrijo na hora.
- [ ] ⭐ `[VOCÊ]` Pedir a **3-5 betatesters** que usem por uma semana e te digam onde travaram (a matéria-prima do Sprint 1).
- [ ] 🎉 `[VOCÊ]` Reconhecer que você botou um produto na mão de usuários reais em 22 dias. Isso é enorme.

---

## 🅿️ PARKING LOT — depois do lançamento (tire da cabeça agora)
> Importante NÃO fazer antes do dia 1. Está anotado, está seguro.

- 🥇 **FAST-FOLLOW Nº 1 — O Sovina no seu WhatsApp** (design: `docs/produto/whatsapp-sovina.md`): cota do dia + lembretes de custo fixo (`due_date`) + veredito, enviados ativamente com opt-in. É a feature do plano Pro — casa com o Stripe. Ingestão por áudio/texto entra na sequência.
- Monetização **Stripe**: checkout, plano Pro, webhook, gate de acesso (gateia o WhatsApp).
- **Chat completo** com o Sovina (Modo Roast conversacional, além do veredito).
- Parcerias com **microinfluenciadores** (formato "O Sovina julga seus gastos").
- **Reels** reciclando os vereditos campeões (kinetic typography).
- ~~Automação de posts própria~~ → **antecipada e construída em 10/06** (fila `threads_queue` + `/api/threads/publish` + GitHub Actions). Setup: `docs/launch/THREADS-AUTOMACAO.md`.
- **Programa de indicação "fure a fila"** (indicou 3 → acesso antecipado): viral loop da waitlist; exige códigos únicos + tracking.
- **Monitoramento de erros (Sentry)** — quando houver usuários de verdade.
- Migrar os wrappers de UI restantes (`SelectMenu`, `SaveStatus`).
- Newsletter recorrente "Vereditos" via Resend.

---

## SE TUDO DER ERRADO (plano B do escopo)
Se a semana 1 atrasar, **corte nesta ordem, sem culpa:**
1. Modo Roast vira "semi": mantém os vereditos atuais (locais) e a IA entra como fast-follow. O app ainda lança.
2. Polimento vira "só o caminho crítico funciona". Feio mas funcional lança.
3. O que **nunca** corta: a waitlist no ar, o Threads rodando, e o app abrindo no dia 01/07.

**A data é sagrada. O escopo é negociável.**
