# 🛡️ Auditoria de Dados & LGPD — Sovina

> Executada por **@devsecops (Cipher)** em 22/06/2026 · `*audit-data` · escopo: projeto completo (Supabase `yczkwfpuqqwpvdmuptpx`).
> Método: inspeção real do schema, RLS, policies, FKs e do código (evidência sobre asserção).

## ✅ RE-AUDITORIA (22/06, pós-fixes) — Veredito: PASS
Todos os 6 achados foram corrigidos e **verificados por evidência** (não por relato):

| # | Verificação | Status |
|---|-------------|--------|
| H1 | `pg_constraint`: 7 FKs `user_id → auth.users` ON DELETE CASCADE | ✅ FECHADO |
| M2 | 2 FKs `card_id → cards` ON DELETE SET NULL | ✅ FECHADO |
| H2 | `/privacidade` existe + consentimento no WaitlistForm | ✅ FECHADO |
| H3 | Política declara Anthropic/OpenAI + transferência internacional | ✅ FECHADO |
| M3 | Rate-limit por IP na action `joinWaitlist` | ✅ MITIGADO |
| M4 | Zero `console.*` no projeto (sem logging de PII) | ✅ FECHADO |

Os 3 HIGH caíram. Publicado na `main` (`a0ce67f` FKs, `0ceba05` privacidade).

**Debts residuais (não-bloqueadores):**
- M3 é best-effort (rate-limit in-memory por instância) → migrar pra store global (Upstash) é debt rastreado.
- Onboarding "O Julgamento" (dados financeiros) ainda sem aceite explícito da política — tem base legal (execução de contrato) + política linkada, mas recomenda-se aceite explícito antes do beta.

**Pronto pro lançamento** no escopo dados/LGPD. Antes de 15/07, rodar o `*security-gate` completo (inclui `*scan-deps` + AppSec geral) como gate final.

---

## Veredito inicial (22/06, pré-fixes): ⚠️ CONCERNS
Postura **técnica de acesso é forte** (RLS exemplar), mas há **gaps de conformidade LGPD** que viram **bloqueadores** antes do beta com usuários reais (15/07). Nenhum vazamento ativo nem CRITICAL — porém 3 itens HIGH dariam **FAIL** num `*security-gate` de lançamento.

---

## 1. Inventário de PII

| Tabela | Dados pessoais/sensíveis | Classificação |
|--------|--------------------------|---------------|
| `auth.users` (Supabase) | email, magic-link | PII direta |
| `waitlist` | email | PII direta |
| `profiles` | savings_mode/amount/percent, ciclo | Perfil financeiro |
| `transactions` | valor, **descrição (texto livre)**, categoria, método | **Financeiro sensível** |
| `income_sources` | label, tipo, **valor (renda)** | **Financeiro sensível** |
| `fixed_costs` | label, categoria, valor, vencimento | Financeiro |
| `cards` | apelido, limite, dias — **sem PAN/CVV** | Financeiro (minimizado) |

**Conjunto = retrato financeiro completo do titular.** Dado sensível por agregação.

## 2. Pontos fortes (validados)
- ✅ **RLS ativa em 100% das tabelas**, isolamento por dono correto (`auth.uid() = user_id`, USING + WITH CHECK).
- ✅ **Minimização exemplar:** não coleta CPF, telefone, endereço; **cartão sem número/CVV** → fora do escopo PCI-DSS.
- ✅ Service-role `import "server-only"`, key não vaza pro client; `waitlist` não é legível por anon (só INSERT).
- ✅ Criptografia at rest (AES-256) e in transit (TLS) — padrão de plataforma Supabase.

## 3. Gaps (severidade + fix exigido)

### 🔴 HIGH — bloqueiam o security-gate de lançamento
| # | Achado | Evidência | Fix exigido | Dono |
|---|--------|-----------|-------------|------|
| H1 | **Direito à exclusão não atendido.** Deletar a conta NÃO apaga os dados financeiros. | **Zero FK no schema** → sem `ON DELETE CASCADE`; PII vira órfã | FK `user_id → auth.users(id) ON DELETE CASCADE` em todas as tabelas, OU rotina/Edge Function de hard-delete por usuário | @data-engineer |
| H2 | **Sem política de privacidade nem base legal/consentimento.** | Sem rota `/privacidade`; sem `consent` na waitlist (grep vazio) | Publicar `/privacidade` (LGPD) + consentimento explícito na captura de email e no onboarding | @dev |
| H3 | **PII financeira enviada a IA (EUA) sem disclosure.** Descrições de gasto vão pra Anthropic/OpenAI. | `src/lib/ai/router.ts`, `statement-parser.ts` | Declarar sub-processadores + transferência internacional na política; avaliar DPA/opt-out; não enviar mais que o necessário | @dev + @architect |

### 🟡 MEDIUM — security-debt rastreável
- M1 — **Sem política de retenção** definida por categoria de dado. → Definir retenção + rotina de expurgo.
- M2 — **Sem FK formal** (`card_id`, `user_id` soltos) → risco de dados órfãos/integridade. → Adicionar FKs.
- M3 — **`waitlist` INSERT aberto** sem rate-limit no nível de dado (honeypot existe no app, DB aceita tudo). → Rate-limit/captcha server-side.
- M4 — **`transactions.descricao` texto livre** → risco de PII em logs e de o titular inserir dado de terceiros. → Garantir que descrição nunca caia em log; aviso no input.

### 🔵 LOW — advisory
- L1 — RLS não é `FORCE` (padrão Supabase; baixo risco pois acesso é por roles). Considerar `FORCE` nas tabelas de PII.

## 4. Handoff (fix-and-resubmit)
- **@data-engineer (Dara):** H1, M2 (FKs + cascade / rotina de deleção) — **prioridade**, é o gap mais sério.
- **@dev (Dex):** H2, H3, M3, M4 (privacidade, consentimento, disclosure de IA, rate-limit, logs).
- **@architect (Aria):** H3 (decisão de transferência a IA / minimização do payload).

## 5. Recomendação pro beta 15/07
Resolver **H1, H2, H3 antes** de abrir pra usuários reais — são exatamente os itens que um `*security-gate` de release barraria. M1–M4 podem ir como security-debt rastreado. A base de acesso (RLS) está pronta; o que falta é a **camada de conformidade** (consentimento, exclusão, transparência).

---
*Próxima ação sugerida: `@data-engineer` ataca H1/M2 e `@dev` ataca H2/H3 → re-auditar com `*audit-data` antes do `*security-gate` de lançamento.*
