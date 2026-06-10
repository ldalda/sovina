# Deploy da Waitlist — Guia de Micropassos (10/06)

> Objetivo: a landing `osovina.app` no ar, capturando e-mails, em **modo waitlist**
> (com `/app` e `/login` bloqueados). Faça **uma caixa por vez, na ordem.**
> Travou >5 min? Para e me chama (⚠️). Não force.

**Ordem das fases:** 0) Versionar → 1) Banco → 2) Vercel → 3) Domínio → 4) Testar.

---

## FASE 0 — Versionar o código (pré-requisito)
> O Vercel só deploya o que está no GitHub. Hoje o repo é local e sem remote.
> Push é tarefa do `[@devops]` — me chame que eu preparo.

- [x] `[CLAUDE/@dev]` ~~Commitar as mudanças pendentes.~~ ✅ **4 commits prontos na main (09/06).**
- [x] `[VOCÊ]` ~~Criar repo `sovina`.~~ ✅ github.com/ldalda/sovina
- [x] `[@devops]` ~~remote add + push.~~ ✅ **main → origin/main (commit 360db9f).**
- [ ] `[VOCÊ]` (opcional) Abrir o repo no GitHub e ver os arquivos lá. (1 min)

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

## FASE 3 — Domínio: comprar osovina.app pela Vercel
> Sem DNS manual: a Vercel registra, aponta e emite o SSL sozinha.

- [ ] ⭐ `[VOCÊ]` No projeto Vercel → **Settings → Domains** → digitar **`osovina.app`** → o Vercel mostra que está à venda → **Buy**. (5 min)
- [ ] `[VOCÊ]` Confirmar a compra. DNS e HTTPS ficam automáticos — **nada a fazer no registro.br**. (3 min)
- [ ] `[VOCÊ]` Atualizar a env var **`NEXT_PUBLIC_APP_URL`** para `https://osovina.app` (Settings → Environment Variables) e dar **Redeploy**. (3 min)
- [ ] `[VOCÊ]` Esperar o domínio ficar **verde (✓)** no painel Domains (rápido quando comprado na própria Vercel). (espera curta)

> O `sovino.com.br` que você já tem: deixa parado (o "sovino" é o typo errado, vale pouco). Sem ação necessária.
> Anti-bloqueio: enquanto o domínio não fica verde, **use a `.vercel.app` na bio** e troque depois.

---

## FASE 4 — Smoke test (a prova real)
- [ ] ⭐ `[VOCÊ]` Abrir o site (no `.vercel.app` ou no domínio) e **inserir um e-mail de teste**. (2 min)
- [ ] `[VOCÊ]` Ver a mensagem do Sovina ("Seu nome está na lista"). (1 min)
- [ ] `[VOCÊ]` No Supabase → Table Editor → `waitlist` → confirmar que o e-mail caiu lá. (2 min) — 🎉 **waitlist no ar.**
- [ ] `[VOCÊ]` Pôr o link **https://osovina.app** na bio do Threads e do Instagram. (3 min)

---

## Env vars (Vercel) — o que setar
> Para o **modo waitlist**, só as 4 primeiras são obrigatórias. As de IA/Stripe/etc.
> NÃO quebram o build (nenhuma rota da landing as importa) e entram no lançamento.

| Variável | Valor | Obrigatória agora? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yczkwfpuqqwpvdmuptpx.supabase.co` | ✅ Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Supabase → Settings → API → `anon public`) | ✅ Sim |
| `NEXT_PUBLIC_APP_URL` | `https://osovina.app` | ✅ Sim |
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
