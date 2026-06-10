-- Fila de respostas irônicas do Sovina a posts de terceiros no Threads
-- ("Radar de Pródigos"). A caça (/api/threads/hunt) insere rascunhos; o Lucas
-- aprova/pula via WhatsApp (webhook /api/whatsapp/inbound); aprovado = postado.
--
-- Sem policies de RLS de propósito: só o service role acessa.

create table public.threads_reply_queue (
  id               uuid primary key default gen_random_uuid(),
  target_post_id   text not null unique,
  target_username  text not null,
  target_text      text not null,
  target_permalink text,
  keyword          text not null,
  draft            text not null,
  status           text not null default 'draft'
                     check (status in ('draft','posted','skipped','expired','failed')),
  threads_reply_id text,
  error            text,
  created_at       timestamptz not null default now(),
  decided_at       timestamptz,
  posted_at        timestamptz
);

create index threads_reply_queue_status_idx
  on public.threads_reply_queue (status, created_at);
create index threads_reply_queue_username_idx
  on public.threads_reply_queue (target_username, created_at);

alter table public.threads_reply_queue enable row level security;
