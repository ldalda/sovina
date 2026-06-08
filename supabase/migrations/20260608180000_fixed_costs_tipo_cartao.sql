-- Adiciona "Cartão de Crédito" às opções da coluna "tipo" dos custos fixos.
alter table public.fixed_costs drop constraint fixed_costs_tipo_check;

alter table public.fixed_costs
  add constraint fixed_costs_tipo_check
  check (tipo in ('', 'Fixo', 'Variável', 'Cartão de Crédito'));
