-- Custos fixos: a antiga coluna "tipo" era, na verdade, a CATEGORIA da
-- despesa (Aluguel, Energia, Internet…). Renomeada para "categoria".
-- A nova coluna "tipo" classifica o custo como Fixo ou Variável.

alter table public.fixed_costs rename column tipo to categoria;

alter table public.fixed_costs
  add column tipo text not null default ''
  check (tipo in ('', 'Fixo', 'Variável'));
