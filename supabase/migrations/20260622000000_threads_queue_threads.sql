-- Suporte a FIOS (threads encadeadas) na fila de publicação do Threads.
-- Até aqui a fila só modelava posts avulsos; a estratégia v3 (4 avulsos + 2
-- fios/dia) precisa agrupar posts de um mesmo fio e publicá-los encadeados
-- (cada post 2..N responde ao threads_post_id do anterior, via reply_to_id).
--
-- thread_key      : agrupa os posts de um fio. NULL = post avulso (comportamento atual).
-- thread_position : ordem do post dentro do fio (1..N). NULL para avulsos.
-- Todos os posts de um fio compartilham thread_key e o MESMO scheduled_at.

alter table public.threads_queue
  add column if not exists thread_key uuid,
  add column if not exists thread_position smallint;

comment on column public.threads_queue.thread_key is
  'Agrupa posts de um mesmo fio (thread encadeada). NULL = post avulso.';
comment on column public.threads_queue.thread_position is
  'Ordem do post dentro do fio (1..N). NULL para avulsos.';

create index if not exists threads_queue_thread_idx
  on public.threads_queue (thread_key, thread_position)
  where thread_key is not null;
