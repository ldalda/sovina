-- Lançamentos do dia-a-dia: gastos que consomem a cota diária.
create table public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  valor       numeric(12,2) not null check (valor >= 0),
  descricao   text,
  categoria   text not null default '',
  occurred_at date not null default current_date,
  source      text not null default 'manual'
              check (source in ('manual', 'whatsapp', 'audio', 'fatura')),
  created_at  timestamptz not null default now()
);
create index transactions_user_date_idx
  on public.transactions (user_id, occurred_at desc);

alter table public.transactions enable row level security;
create policy "own transactions" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
