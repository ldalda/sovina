-- Waitlist de pré-lançamento: captura de e-mails na landing pública.
--
-- Insert anônimo é permitido (RLS abaixo); leitura NÃO. Ninguém consegue ler
-- a lista de e-mails com a anon key — só o service role, que ignora RLS, para
-- export/admin/broadcast. Assim a captura é pública e a lista fica protegida.

create table public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text not null default 'landing',  -- origem: landing, threads, reels...
  created_at timestamptz not null default now()
);

create index waitlist_created_idx on public.waitlist (created_at);

alter table public.waitlist enable row level security;

-- Qualquer visitante entra na lista; ninguém lê de volta (sem policy de select).
create policy "anyone can join waitlist" on public.waitlist
  for insert to anon, authenticated
  with check (true);
