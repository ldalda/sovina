-- Cartões e forma de pagamento transversal.
-- O cartão é um MEIO de pagamento, não uma categoria de despesa: cada gasto
-- (custo fixo ou lançamento) aponta como foi pago. A "fatura" será uma visão
-- derivada desses gastos (fases B/C), nunca um lançamento próprio.

create table public.cards (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  nome         text not null,
  closing_day  smallint check (closing_day between 1 and 31),  -- fechamento
  due_day      smallint check (due_day between 1 and 31),      -- vencimento
  limit_amount numeric(12,2),
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index cards_user_idx on public.cards (user_id);
create trigger cards_set_updated_at before update on public.cards
  for each row execute function public.set_updated_at();

alter table public.cards enable row level security;
create policy "own cards" on public.cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- forma de pagamento nos gastos
alter table public.transactions
  add column payment_method text not null default 'cash'
    check (payment_method in ('cash', 'pix', 'debit', 'credit')),
  add column card_id uuid references public.cards(id) on delete set null;

alter table public.fixed_costs
  add column payment_method text not null default 'cash'
    check (payment_method in ('cash', 'pix', 'debit', 'credit')),
  add column card_id uuid references public.cards(id) on delete set null;

-- migra o antigo Tipo 'Cartão de Crédito' para forma de pagamento
update public.fixed_costs set payment_method = 'credit' where tipo = 'Cartão de Crédito';
update public.fixed_costs set tipo = '' where tipo = 'Cartão de Crédito';

-- Tipo volta a ser só Fixo/Variável
alter table public.fixed_costs drop constraint fixed_costs_tipo_check;
alter table public.fixed_costs
  add constraint fixed_costs_tipo_check check (tipo in ('', 'Fixo', 'Variável'));

notify pgrst, 'reload schema';
