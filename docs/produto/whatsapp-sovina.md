# O Sovina no seu WhatsApp — Design da Feature (fast-follow nº 1)

> Ideia do Lucas (10/06/2026): O Sovina como juiz que se comunica ativamente —
> manda a cota do dia, vereditos e lembretes de pagamento direto no WhatsApp
> da pessoa (com consentimento). Decisão: NÃO entra no lançamento de 01/07;
> é o fast-follow prioritário, casado com o Stripe (é a feature do plano Pro).

## Por quê
- Ataca o problema nº 1 de apps de finanças: a pessoa para de abrir o app.
  Inverte a direção — o juiz vai até a pessoa.
- Materializa a persona (juiz que cobra ≠ dashboard que espera).
- Loop de retenção: cota de manhã → gastos no dia → veredito à noite.
- Justifica o Pro: é a feature pela qual se paga. Conecta com a ingestão por
  áudio já planejada (responder a mensagem do Sovina com o gasto).

## Mensagens (v1 — outbound)
1. **Cota do dia** (manhã, ~7h): "Hoje você existe com R$ X. A ideal é R$ Y,
   se quiser que eu guarde seu futuro. Eu estou de olho." — via `computeQuota`.
2. **Lembrete de custo fixo** (D-1 do `due_date`): "O {label} vence amanhã.
   R$ {valor}. Não me decepcione."
3. **Veredito noturno** (~21h, opcional): resumo do dia no tom da persona.

## Ingestão de gastos (v1.1 — inbound; o Lançamentos via WhatsApp)
A pessoa RESPONDE a cobrança com o gasto — texto ("gastei 38 no ifood") ou
áudio. Fricção zero; fecha o loop cota → gasto → veredito na mesma conversa.

Fluxo: webhook `/api/whatsapp/inbound` (já excluído no proxy.ts — pré-planejado)
→ identifica o usuário pelo telefone (APENAS números com opt-in; resto ignora)
→ áudio? `transcriptionModel` (Whisper, já no router.ts) → texto
→ `extractionModel` (GPT-4o-mini tool calling, já no router.ts) extrai
  valor/descrição/categoria/parcelas
→ `createTransaction` (MESMA server logic do Lançamentos web)
→ responde com o veredito via `generateVerdict` (reuso do Modo Roast).

Regras: mensagem ambígua → o Sovina faz UMA pergunta de esclarecimento no
personagem; nunca registra no chute (Artigo IV — No Invention). Idempotência
por message_id do provider (webhook pode reentregar).

## Arquitetura (espelha a automação do Threads)
- `profiles`: + `whatsapp_phone`, `whatsapp_optin_at` (null = sem consentimento),
  `whatsapp_prefs` jsonb (quota_diaria, lembretes, veredito).
- Endpoint `/api/whatsapp/daily` (CRON_SECRET) → itera usuários com opt-in →
  monta mensagens → envia via provider.
- Agendador: GitHub Actions (mesmo padrão do Threads; cron diário).
- Provider em 2 fases:
  - **Beta (MVP):** Evolution API (já prevista na stack; envs existem).
    Não-oficial → risco de ban do número. Aceitável p/ beta pequeno e
    consentido; usar número dedicado, nunca o pessoal.
  - **Escala:** WhatsApp Cloud API oficial — templates aprovados + custo por
    conversa (centavos/dia/usuário) → precifica o Pro.
- Persona: mensagens template-based com variações pré-geradas pela IA (lote),
  não uma chamada de IA por usuário/dia (custo).

## LGPD / consentimento (inegociável)
- Opt-in explícito no app (checkbox + telefone), timestamp guardado.
- Opt-out instantâneo: responder "PARE" cancela tudo.
- Telefone nunca usado para outra finalidade.

## Fatia pré-lançamento (entra na Semana 2 do plano)
- Captura de telefone + opt-in no app (~1h de dev): "Quer que eu te cobre no
  WhatsApp? Deixa teu número." → valida demanda (% de opt-in) e constrói a
  lista antes da feature existir.
- Marketing: "O Sovina manda veredito no teu WhatsApp" entra como promessa
  nos posts de lançamento.

## Sequência pós-lançamento
1. Semana 1 de julho: Evolution API + **cota diária** (outbound, mais simples,
   cria o hábito) + opt-out PARE.
2. Semana 2: **ingestão de gastos** (inbound — o loop completo; é a parte de
   maior valor) + lembretes de custo fixo.
3. Em seguida: Stripe Pro gateando o WhatsApp; avaliar migração p/ Cloud API.
