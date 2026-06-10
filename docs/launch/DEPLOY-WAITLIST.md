# Deploy da Waitlist — Guia de Micropassos (10/06)

> Objetivo: a landing `osovina.com.br` no ar, capturando e-mails, em **modo waitlist**
> (com `/app` e `/login` bloqueados). Faça **uma caixa por vez, na ordem.**
> Travou >5 min? Para e me chama (⚠️). Não force.

**Ordem das fases:** 0) Versionar → 1) Banco → 2) Vercel → 3) Domínio → 4) Testar.

---

## FASE 0 — Versionar o código (pré-requisito)
> O Vercel só deploya o que está no GitHub. Hoje o repo é local e sem remote.
> Push é tarefa do `[@devops]` — me chame que eu preparo.

- [ ] `[CLAUDE/@dev]` Commitar as mudanças pendentes (waitlist + Modo Roast + docs). **Me peça "commita o que está pronto"** e eu faço o commit local.
- [ ] `[VOCÊ]` Criar um repositório **privado** no GitHub chamado `sovina`. (5 min)
- [ ] `[@devops]` `git remote add` + `git push -u origin main`. Eu aciono o @devops.
- [ ] `[VOCÊ]` Confirmar no GitHub que os arquivos subiram. (2 min)

---

## FASE 1 — Banco: criar a tabela `waitlist`
> Caminho fácil, sem terminal: **SQL Editor do Supabase.**

- [ ] ⭐ `[VOCÊ]` Abrir o projeto Supabase **`yczkwfpuqqwpvdmuptpx`** → menu **SQL Editor** → **New query**. (2 min)
- [ ] `[VOCÊ]` Colar o SQL abaixo e clicar em **Run**. (2 min)

```sql
create table public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text not null default 'landing',
  created_at timestamptz not null default now()
);

create index waitlist_created_idx on public.waitlist (created_at);

alter table public.waitlist enable row level security;

create policy "anyone can join waitlist" on public.waitlist
  for insert to anon, authenticated
  with check (true);
```

- [ ] `[VOCÊ]` Conferir em **Table Editor** que a tabela `waitlist` apareceu. (1 min) — ✅ banco pronto.

> Alternativa (CLI, se preferir manter o histórico de migrations): `supabase link --project-ref yczkwfpuqqwpvdmuptpx` → `supabase db push`. Pode dar conflito se o histórico remoto não estiver sincronizado — por isso o SQL Editor é o caminho recomendado para hoje.

---

## FASE 2 — Vercel: subir o app
- [ ] ⭐ `[VOCÊ]` Em vercel.com → **Add New → Project** → importar o repo `sovina` do GitHub. (3 min)
- [ ] `[VOCÊ]` O Vercel detecta **Next.js** sozinho. Não mexa em build settings. (1 min)
- [ ] `[VOCÊ]` Em **Environment Variables**, adicionar as da tabela abaixo (seção "Env vars"). (10 min)
- [ ] `[VOCÊ]` Clicar **Deploy** e esperar o build terminar (~2 min). (5 min)
- [ ] `[VOCÊ]` Abrir a URL `*.vercel.app` que o Vercel gerou e ver a landing em **modo waitlist** (só o campo de e-mail, sem "Entrar"). (2 min)

---

## FASE 3 — Domínio: apontar osovina.com.br
- [ ] ⭐ `[VOCÊ]` No projeto Vercel → **Settings → Domains** → adicionar **`osovina.com.br`**. (2 min)
- [ ] `[VOCÊ]` O Vercel mostra os **registros DNS** a configurar (geralmente um `A` para `76.76.21.21` no apex e um `CNAME` para `www`). **Copie os valores que o Vercel mostrar.** (2 min)
- [ ] `[VOCÊ]` No **registro.br** → painel DNS do `osovina.com.br` → colar exatamente esses registros. (10 min)
- [ ] `[VOCÊ]` Adicionar também **`sovino.com.br`** no Vercel e marcar **Redirect → osovina.com.br** (aproveita o domínio que você já tem). (5 min)
- [ ] `[VOCÊ]` Esperar a propagação do DNS (pode levar de minutos a algumas horas). Enquanto isso, **a URL `.vercel.app` já funciona** para testar. (espera)

> Dica anti-bloqueio: se o DNS demorar, **ponha a URL `.vercel.app` na bio** temporariamente e troque pelo domínio quando propagar. Não deixe o aquecimento parado esperando DNS.

---

## FASE 4 — Smoke test (a prova real)
- [ ] ⭐ `[VOCÊ]` Abrir o site (no `.vercel.app` ou no domínio) e **inserir um e-mail de teste**. (2 min)
- [ ] `[VOCÊ]` Ver a mensagem do Sovina ("Seu nome está na lista"). (1 min)
- [ ] `[VOCÊ]` No Supabase → Table Editor → `waitlist` → confirmar que o e-mail caiu lá. (2 min) — 🎉 **waitlist no ar.**
- [ ] `[VOCÊ]` Pôr o link **https://osovina.com.br** na bio do Threads e do Instagram. (3 min)

---

## Env vars (Vercel) — o que setar
> Para o **modo waitlist**, só as 4 primeiras são obrigatórias. As de IA/Stripe/etc.
> NÃO quebram o build (nenhuma rota da landing as importa) e entram no lançamento.

| Variável | Valor | Obrigatória agora? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yczkwfpuqqwpvdmuptpx.supabase.co` | ✅ Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Supabase → Settings → API → `anon public`) | ✅ Sim |
| `NEXT_PUBLIC_APP_URL` | `https://osovina.com.br` | ✅ Sim |
| `LAUNCH_MODE` | `waitlist` | ✅ Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | (Supabase → API → `service_role`) | Opcional |
| `ANTHROPIC_API_KEY` | (sua chave) | No lançamento (Modo Roast) |
| `OPENAI_API_KEY` | (sua chave) | No lançamento |
| `STRIPE_*`, `EVOLUTION_*`, `RESEND_API_KEY` | — | Fast-follow |

> No lançamento (01/07): **remover `LAUNCH_MODE`** (ou trocar para vazio) abre `/app` e `/login`, e adicionar `ANTHROPIC_API_KEY` liga o Modo Roast.

---

## Se travar
- DNS não propaga / erro de domínio → use a URL `.vercel.app` e siga; resolvemos o domínio depois.
- Build falhou no Vercel → me mande o log do erro, eu corrijo.
- E-mail não cai no Supabase → confirme que a Fase 1 rodou e que a `ANON_KEY` está correta no Vercel.
