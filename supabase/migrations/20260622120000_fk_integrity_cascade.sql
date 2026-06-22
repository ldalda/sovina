-- Integridade referencial + direito à exclusão (LGPD Art. 18).
-- Origem: auditoria @devsecops (Cipher) 22/06 — o schema public não tinha
-- NENHUMA foreign key, então deletar a conta em auth.users deixava os dados
-- financeiros órfãos (H1), e card_id/relações ficavam sem integridade (M2).
-- Verificado: ZERO linhas órfãs antes desta migração — seguro aplicar.
--
-- Política de ON DELETE:
--   user_id → auth.users  : CASCADE  (deletar a conta apaga os dados do titular)
--   card_id → cards       : SET NULL (remover um cartão preserva o histórico)
--
-- Idempotente (DROP CONSTRAINT IF EXISTS + ADD). Rollback: DROP das constraints abaixo.

-- ── H1: user_id → auth.users(id) ON DELETE CASCADE ───────────────────────────
alter table public.profiles        drop constraint if exists profiles_id_fkey;
alter table public.profiles        add  constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

alter table public.transactions    drop constraint if exists transactions_user_id_fkey;
alter table public.transactions    add  constraint transactions_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.income_sources  drop constraint if exists income_sources_user_id_fkey;
alter table public.income_sources  add  constraint income_sources_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.fixed_costs     drop constraint if exists fixed_costs_user_id_fkey;
alter table public.fixed_costs     add  constraint fixed_costs_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.cards           drop constraint if exists cards_user_id_fkey;
alter table public.cards           add  constraint cards_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.categories      drop constraint if exists categories_user_id_fkey;
alter table public.categories      add  constraint categories_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.custom_columns  drop constraint if exists custom_columns_user_id_fkey;
alter table public.custom_columns  add  constraint custom_columns_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

-- ── M2: card_id → cards(id) ON DELETE SET NULL (preserva histórico) ───────────
alter table public.transactions    drop constraint if exists transactions_card_id_fkey;
alter table public.transactions    add  constraint transactions_card_id_fkey
  foreign key (card_id) references public.cards(id) on delete set null;

alter table public.fixed_costs     drop constraint if exists fixed_costs_card_id_fkey;
alter table public.fixed_costs     add  constraint fixed_costs_card_id_fkey
  foreign key (card_id) references public.cards(id) on delete set null;

-- ── Índices nas FK columns (cascade/lookup sem índice = full scan) ────────────
create index if not exists transactions_user_id_idx   on public.transactions (user_id);
create index if not exists income_sources_user_id_idx on public.income_sources (user_id);
create index if not exists fixed_costs_user_id_idx     on public.fixed_costs (user_id);
create index if not exists cards_user_id_idx           on public.cards (user_id);
create index if not exists categories_user_id_idx      on public.categories (user_id);
create index if not exists custom_columns_user_id_idx  on public.custom_columns (user_id);
create index if not exists transactions_card_id_idx    on public.transactions (card_id);
create index if not exists fixed_costs_card_id_idx     on public.fixed_costs (card_id);
