-- Fila de publicação automática no Threads (aquecimento pré-lançamento).
-- Os posts são semeados por supabase/seed-threads-posts.sql e publicados pelo
-- endpoint /api/threads/publish (chamado via GitHub Actions nos 4 horários).
--
-- Sem policies de RLS de propósito: só o service role (que ignora RLS) acessa
-- a fila. Nem a anon key lê nem escreve aqui.

create table public.threads_queue (
  id              uuid primary key default gen_random_uuid(),
  body            text not null,
  scheduled_at    timestamptz not null,
  status          text not null default 'pending'
                    check (status in ('pending','posted','failed','skipped')),
  threads_post_id text,
  error           text,
  posted_at       timestamptz,
  created_at      timestamptz not null default now()
);

create index threads_queue_due_idx on public.threads_queue (status, scheduled_at);

alter table public.threads_queue enable row level security;
