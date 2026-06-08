-- Core schema do Sovina: perfil, fontes de renda, custos fixos, categorias
-- e colunas customizadas (tabelas estilo Notion).
--
-- As colunas `tipo` e `valor` são FIXAS e definitivas: alimentam o cálculo
-- da cota diária. As colunas livres do usuário vivem em `custom` (jsonb),
-- com seus cabeçalhos/definições em `custom_columns`.

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ────────────────────────────────────────────────────────
create table public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  savings_mode     text not null default 'percent' check (savings_mode in ('fixed','percent')),
  savings_amount   numeric(12,2) not null default 0,                       -- usado se mode='fixed'
  savings_percent  numeric(5,2)  not null default 0 check (savings_percent between 0 and 100),
  cycle_anchor_day smallint check (cycle_anchor_day between 1 and 31),     -- futuro: dia do pagamento
  onboarded_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- cria a linha de profile automaticamente no signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── categories (tipos customizáveis) ────────────────────────────────
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  scope      text not null check (scope in ('fixed_cost','income')),
  name       text not null,
  created_at timestamptz not null default now(),
  unique (user_id, scope, name)
);

-- ── fixed_costs ─────────────────────────────────────────────────────
create table public.fixed_costs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  label      text,                                    -- "Despesa" (nome)
  tipo       text not null default '',                -- FIXA: categoria p/ cálculo
  valor      numeric(12,2) not null default 0,        -- FIXA: valor p/ cálculo
  due_day    smallint check (due_day between 1 and 31),
  custom     jsonb not null default '{}'::jsonb,      -- colunas livres do "Notion"
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index fixed_costs_user_idx on public.fixed_costs (user_id);
create trigger fixed_costs_set_updated_at before update on public.fixed_costs
  for each row execute function public.set_updated_at();

-- ── income_sources (recebíveis + investimentos) ────────────────────
create table public.income_sources (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  section    text not null check (section in ('receivable','investment')),
  label      text,
  tipo       text not null default '',                -- FIXA (p/ investimentos: Ações/FIIs/...)
  valor      numeric(12,2) not null default 0,        -- FIXA: valor p/ cálculo
  custom     jsonb not null default '{}'::jsonb,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index income_sources_user_idx on public.income_sources (user_id, section);
create trigger income_sources_set_updated_at before update on public.income_sources
  for each row execute function public.set_updated_at();

-- ── custom_columns (cabeçalhos das tabelas estilo Notion) ───────────
create table public.custom_columns (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  table_key  text not null check (table_key in ('fixed_costs','income_receivable','income_investment')),
  key        text not null,                           -- chave usada no jsonb `custom`
  label      text not null,                           -- rótulo exibido
  type       text not null default 'text' check (type in ('text','number','date','select')),
  options    jsonb not null default '[]'::jsonb,      -- p/ type='select'
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, table_key, key)
);
create index custom_columns_user_idx on public.custom_columns (user_id, table_key);

-- ── RLS ─────────────────────────────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.fixed_costs    enable row level security;
alter table public.income_sources enable row level security;
alter table public.custom_columns enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own categories" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own fixed_costs" on public.fixed_costs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own income_sources" on public.income_sources
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own custom_columns" on public.custom_columns
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
