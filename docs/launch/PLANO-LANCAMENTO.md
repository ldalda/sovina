# O SOVINA — Plano de Lançamento (até 01/07/2026)

> **Objetivo único:** lançar O Sovina, grátis e estável, no dia **01/07/2026 (quarta)**,
> com a waitlist aquecida no Threads e o **Modo Roast por IA** funcionando.
>
> Hoje é **terça, 09/06**. Você tem **22 dias** e **3 fins de semana**.

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

## MAPA DE HELICÓPTERO (as 4 trilhas)

| Trilha | O que é | Quem puxa |
|--------|---------|-----------|
| **A. Infra** | Deploy da waitlist, domínio, produção | VOCÊ + @devops |
| **B. Divulgação** | Threads no ar, 40 vereditos, e-mails | VOCÊ (conteúdo pronto) |
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

- [x] ⭐ `[VOCÊ]` ~~Decidir o domínio.~~ **DEFINIDO: osovina.com.br** ✅ (sovino.com.br, já comprado, vira redirect 301)
- [x] `[VOCÊ]` Criar conta no **Instagram + Threads**. ✅ (Threads: `@osovinajulga` · Instagram: `@osovina.app`)
- [x] `[VOCÊ]` ~~Pôr a foto de perfil (avatar do leão, recortado no busto).~~ ✅ (nas duas contas)
- [x] `[VOCÊ]` ~~Colar a bio opção A (sem link ainda).~~ ✅
- [x] `[CLAUDE]` ~~Me peça: "comece o Modo Roast".~~ ✅ **v1 entregue adiantada (09/06)** — falta você testar com a API key.

## 📅 QUA 10/06 — Waitlist no ar
> Meta: e-mail sendo capturado de verdade.
> **Guia detalhado, passo a passo, pronto:** `docs/launch/DEPLOY-WAITLIST.md`

- [ ] ⭐ `[CLAUDE/@devops]` Versionar o código (commit + repo GitHub + push). Me peça **"commita o que está pronto"**.
- [ ] `[VOCÊ]` Fase 1 do guia: criar a tabela `waitlist` (SQL pronto pra colar no SQL Editor).
- [ ] `[VOCÊ]` Fase 2: importar o repo no Vercel + setar as 4 env vars obrigatórias.
- [ ] `[VOCÊ]` Fase 3: apontar `osovina.com.br` (e redirect do `sovino.com.br`).
- [ ] `[VOCÊ]` Fase 4: inserir e-mail de teste e confirmar no Supabase. — **vitória: a máquina funciona.**

## 📅 QUI 11/06 — Threads começa
> Meta: primeiro veredito público no ar.

- [ ] ⭐ `[VOCÊ]` Pôr o **link da waitlist** na bio do Threads. (5 min)
- [ ] `[VOCÊ]` Publicar e **fixar o post fixado** (`docs/marketing/threads-perfil.md`). (10 min)
- [ ] `[VOCÊ]` Postar o **Dia 1 — Manhã** dos vereditos. (5 min)
- [ ] `[VOCÊ]` Postar o **Dia 1 — Noite** (à noite, ~20h). (5 min)
- [ ] `[CLAUDE]` Pedir atualização do Modo Roast (o que já está pronto). (1 min seu)

## 📅 SEX 12/06
- [ ] ⭐ `[VOCÊ]` Postar **Dia 2 — Manhã e Noite**. (10 min no total)
- [ ] `[VOCÊ]` Responder qualquer comentário **no tom do Sovina** (nunca quebrar personagem). (10 min)
- [ ] `[CLAUDE]` Continuo o Modo Roast.

## 📅 🔵 SÁB 13/06 + DOM 14/06 — Fim de semana leve
> Só o essencial. Descansar também é parte do plano (e do TDAH).

- [ ] `[VOCÊ]` Postar **Dia 3** (sáb) e **Dia 4** (dom), 2 posts cada. (10 min/dia)
- [ ] *(Opcional)* `[VOCÊ]` Rodar os vereditos no **Gemini** com o brand kit pra gerar 3 variações de cada e encher o banco. (30 min, se a energia permitir)

---

# SEMANA 1 — Feature estrela + polimento

## 📅 SEG 15/06 — Modo Roast ganha vida
- [x] ⭐ `[CLAUDE]` ~~Entregar a primeira versão do Modo Roast por IA.~~ ✅ **Feito adiantado em 09/06.**
- [ ] `[VOCÊ]` Testar registrando 3 gastos diferentes e **sentir o tom**. Me dizer o que ajustar. (15 min)
- [ ] `[VOCÊ]` Postar **Dia 5** (manhã+noite). (10 min)

## 📅 TER 16/06 → SEX 19/06 — Polir o que já existe
> Bloco de produto. A maioria é `[CLAUDE]`; você testa e aponta.

- [ ] `[VOCÊ]` Diário: postar **Dia 6, 7, 8, 9** (2/dia). (10 min/dia)
- [ ] ⭐ `[VOCÊ]` Fazer **um "passeio de usuário"** por dia: entrar no app e usar uma tela como se fosse cliente novo. Anotar tudo que estranhar. Me mandar a lista. (20 min/dia)
- [ ] `[CLAUDE]` Ajustar o tom/latência do Modo Roast com seu feedback.
- [ ] `[CLAUDE]` Corrigir os bugs/estranhezas que você anotar.
- [ ] `[CLAUDE]` Estados vazios e mensagens de erro no tom do Sovina (telas sem dados ainda).
- [ ] `[CLAUDE]` Conferir o **responsivo no celular** (a maioria vai entrar pelo Threads no mobile).

## 📅 🔵 SÁB 20/06 + DOM 21/06 — Fim de semana leve
- [ ] `[VOCÊ]` Postar **Dia 10** (sáb) e **Dia 11** (dom). (10 min/dia)
- [ ] *(Opcional)* `[VOCÊ]` Olhar os números do Threads: qual veredito engajou mais? Me diz que eu reforço esse ângulo. (15 min)

---

# SEMANA 2 — Bugs, produção e munição de lançamento

## 📅 SEG 22/06 → SEX 26/06
- [ ] `[VOCÊ]` Diário: postar **Dia 12 a 16** (2/dia). (10 min/dia)
- [ ] ⭐ `[VOCÊ] + [CLAUDE]` **Smoke test do fluxo inteiro** num cenário limpo: cadastro → magic link → Julgamento → registrar gasto → ver veredito. Caçar qualquer trava. (1 bloco contigo guiando)
- [ ] `[CLAUDE]` Escrever o **e-mail de lançamento** para a waitlist (no tom do Sovina: "o julgamento começou").
- [ ] `[CLAUDE]` Escrever o **post de lançamento** do Threads.
- [ ] `[VOCÊ]` Decidir como enviar o e-mail à waitlist: **Resend** (eu integro) ou export manual. (10 min — me diga e eu preparo)
- [ ] `[CLAUDE]` Revisar a seção **"como funciona"** da landing (a âncora `#como-funciona` existe no botão; garantir que leva a algo real).

## 📅 🔵 SÁB 27/06 + DOM 28/06 — Penúltimo fim de semana
- [ ] `[VOCÊ]` Postar **Dia 17** (sáb) e **Dia 18** (dom). (10 min/dia)
- [ ] ⭐ `[VOCÊ]` **Ensaio geral mental:** ler o checklist da reta final (abaixo) e me perguntar o que ainda estiver nebuloso. Zero surpresas no dia D. (20 min)

---

# RETA FINAL — Lançar

## 📅 SEG 29/06 — Congelar e preparar
- [ ] ⭐ `[CLAUDE]` **Code freeze:** parar features novas. Só correções críticas a partir de agora.
- [ ] `[VOCÊ]` Postar **Dia 19** (2 posts).
- [ ] `[VOCÊ] + [CLAUDE]` Última passada de smoke test. Lista final de bugs bloqueadores (só os que impedem o uso). (1 bloco)
- [ ] `[CLAUDE]` Preparar o PR/branch de lançamento (remover `LAUNCH_MODE=waitlist` → abre `/app` e `/login`).

## 📅 TER 30/06 — Véspera
- [ ] ⭐ `[VOCÊ]` Postar **Dia 20 — Manhã** (o fechamento da série) e **Noite** (a convocação final).
- [ ] `[VOCÊ]` Conferir o e-mail de lançamento (texto do Claude) e o post de lançamento. Aprovar. (15 min)
- [ ] `[@devops]` Deixar o deploy de produção **engatilhado** (pronto pra apertar o botão amanhã). (você aciona)
- [ ] `[VOCÊ]` Dormir cedo. Dia D exige cabeça. (sério, é tarefa.)

## 📅 QUA 01/07 — 🚀 LANÇAMENTO
> Faça nesta ordem. Uma caixa por vez.

- [ ] ⭐ `[@devops]` **Deploy final** com `LAUNCH_MODE` desligado. O app abre ao público.
- [ ] `[VOCÊ]` Fazer o fluxo completo **você mesmo, na produção real**, com um e-mail novo. Confirmar que funciona ponta a ponta. (15 min)
- [ ] `[VOCÊ]` Enviar o **e-mail de lançamento** para a waitlist. (via Resend ou ferramenta escolhida)
- [ ] `[VOCÊ]` Publicar o **post de lançamento** no Threads e fixá-lo no lugar do anterior. (10 min)
- [ ] `[VOCÊ]` Ficar de olho: responder comentários no tom, me avisar de **qualquer erro** que aparecer. Eu corrijo na hora.
- [ ] 🎉 `[VOCÊ]` Reconhecer que você lançou um produto em 22 dias. Isso é enorme.

---

## 🅿️ PARKING LOT — depois do lançamento (tire da cabeça agora)
> Importante NÃO fazer antes do dia 1. Está anotado, está seguro.

- Monetização **Stripe**: checkout, planos Pro, webhook, gate de acesso.
- **WhatsApp** (Evolution API): ingestão de gasto por áudio/texto.
- **Chat completo** com o Sovina (Modo Roast conversacional, além do veredito).
- Parcerias com **microinfluenciadores** (formato "O Sovina julga seus gastos").
- **Reels** reciclando os vereditos campeões (kinetic typography).
- Migrar os wrappers de UI restantes (`SelectMenu`, `SaveStatus`).
- Newsletter recorrente "Vereditos" via Resend.

---

## SE TUDO DER ERRADO (plano B do escopo)
Se a semana 1 atrasar, **corte nesta ordem, sem culpa:**
1. Modo Roast vira "semi": mantém os vereditos atuais (locais) e a IA entra como fast-follow. O app ainda lança.
2. Polimento vira "só o caminho crítico funciona". Feio mas funcional lança.
3. O que **nunca** corta: a waitlist no ar, o Threads rodando, e o app abrindo no dia 01/07.

**A data é sagrada. O escopo é negociável.**
