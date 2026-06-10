# Automação de Posts no Threads — Guia de Setup

> O código está pronto (fila `threads_queue` + endpoint `/api/threads/publish`
> + agendador no GitHub Actions). O que falta é **a sua parte na Meta**: criar
> o app e gerar o token. Uma caixa por vez; travou >5 min, me chama com print.
>
> ⚠️ As telas da Meta mudam com frequência. Se algo não bater com o descrito,
> não force — me manda um print que eu te guio.

---

## FASE 1 — Criar o app na Meta (~15 min)

- [ ] `[VOCÊ]` Acessar **developers.facebook.com** → login com sua conta → **My Apps → Create App**.
- [ ] `[VOCÊ]` No caso de uso, escolher **"Access the Threads API"** (ou adicionar o produto **Threads** depois de criar). Tipo: o que a Meta sugerir para Threads.
- [ ] `[VOCÊ]` Anotar o **App ID** e o **App Secret** (Settings → Basic).
- [ ] `[VOCÊ]` Em **Threads → Settings** (do produto), adicionar como **Redirect Callback URL**: a URL da landing (ex.: `https://SEU-APP.vercel.app/`).
- [ ] `[VOCÊ]` Em **App Roles → Roles → Add People → Threads Tester**: convidar a conta **@osovina.app**.
- [ ] `[VOCÊ]` **No app do Threads** (celular): Configurações → Conta → *Permissões do site* (Website permissions) → **aceitar o convite**. Sem isso, nada funciona.

## FASE 2 — Gerar o token (~15 min)

> ⚡ **Atalho (tente primeiro):** na mesma tela de settings do Threads no painel
> da Meta há a seção **User Token Generator** — gera o token long-lived direto
> para Threads Testers, sem OAuth manual. Se funcionar, pule para a Fase 3.
> ⚠️ Use o **Threads App ID/Secret** (da tela do produto Threads), não os gerais do app.

- [ ] `[VOCÊ]` Abrir no navegador **logado como @osovina.app** (domínio novo — `threads.net` dá 404):

```
https://www.threads.com/oauth/authorize?client_id=2445760872565511&redirect_uri=https%3A%2F%2Fsovina.vercel.app%2F&scope=threads_basic,threads_content_publish&response_type=code
```

- [ ] `[VOCÊ]` Autorizar com a conta @osovina.app. O navegador volta pra landing com `?code=...` na barra de endereço. **Copiar o código** (tudo depois de `code=`, **removendo o `#_` do final** se houver).
- [ ] `[VOCÊ]` Trocar o código pelo token curto (terminal, ou me mande o código que eu rodo):

```bash
curl -X POST https://graph.threads.net/oauth/access_token \
  -d "client_id=APP_ID" \
  -d "client_secret=APP_SECRET" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=REDIRECT" \
  -d "code=CODE"
```

- [ ] `[VOCÊ]` Trocar o token curto pelo **token longo (60 dias)**:

```bash
curl "https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=APP_SECRET&access_token=TOKEN_CURTO"
```

- [ ] `[VOCÊ]` Pegar o **user id** numérico:

```bash
curl "https://graph.threads.net/v1.0/me?fields=id,username&access_token=TOKEN_LONGO"
```

> O token longo vale 60 dias (cobre a campanha + lançamento com folga).
> Para renovar depois: `curl "https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=TOKEN_ATUAL"`

## FASE 3 — Configurar os segredos (~10 min)

- [ ] `[VOCÊ]` Gerar um segredo aleatório (qualquer string longa serve): `openssl rand -hex 32`
- [ ] `[VOCÊ]` **No Vercel** (Settings → Environment Variables) adicionar e dar **Redeploy**:
  - `THREADS_USER_ID` = o id numérico
  - `THREADS_ACCESS_TOKEN` = o token longo
  - `CRON_SECRET` = o segredo gerado
- [ ] `[VOCÊ]` **No GitHub** (repo `sovina` → Settings → Secrets and variables → Actions → New repository secret):
  - `APP_URL` = `https://SEU-APP.vercel.app` (sem barra no final)
  - `CRON_SECRET` = o MESMO segredo do Vercel

## FASE 4 — Semear a fila (~5 min)

- [ ] `[VOCÊ]` SQL Editor do Supabase → rodar a migration `20260610190000_threads_queue.sql` (cria a tabela).
- [ ] `[VOCÊ]` SQL Editor → colar e rodar **`supabase/seed-threads-posts.sql`** (78 posts datados, D1=11/06).
- [ ] Se o início atrasou, reagendar tudo de uma vez:

```sql
update public.threads_queue
set scheduled_at = scheduled_at + interval '1 day'
where status = 'pending';
```

## FASE 5 — Testar (~10 min)

- [ ] `[VOCÊ]` Inserir um post de teste vencendo agora:

```sql
insert into public.threads_queue (body, scheduled_at)
values ('Teste do sistema. Ignorem. Ou não — eu estou de olho de qualquer forma.', now());
```

- [ ] `[VOCÊ]` GitHub → repo → aba **Actions** → workflow **"Threads publisher"** → **Run workflow** (botão manual).
- [ ] `[VOCÊ]` Conferir: o post apareceu no @osovina.app? A linha virou `status='posted'` no Supabase?
- [ ] 🎉 Automação no ar. Os 4 slots diários saem sozinhos. (Pode apagar o post de teste no Threads.)

---

## Como funciona / operação

- **Horários:** GitHub Actions roda às 08h/12h/18h/21h de Brasília (com repique 20 min depois, caso o primeiro atrase).
- **Anti-rajada:** post atrasado **mais de 90 min** é marcado `skipped` (não publicado) — evita despejar posts velhos de uma vez. Se quiser repostar um skipped: `update public.threads_queue set status='pending', scheduled_at=now() where id='...'`.
- **Enquetes (D9 e D16 às 18h):** a API não publica enquete — **poste essas 2 manualmente** (texto no calendário).
- **Monitorar:** tabela `threads_queue` no Supabase (status/error) e aba Actions no GitHub.
- **Falhou tudo?** Os posts continuam no calendário (`threads-calendario-4x20.md`) — dá pra postar manual qualquer slot.
