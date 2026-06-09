-- Competência mensal dos custos fixos: cada custo pertence a um mês.
-- Ao abrir um mês novo, os custos são replicados do anterior (lazy, no app):
-- tipo Fixo com o valor; tipo Variável com valor a confirmar (zerado).
alter table public.fixed_costs add column competencia date;

update public.fixed_costs
  set competencia = date_trunc('month', current_date)::date
  where competencia is null;

alter table public.fixed_costs alter column competencia set not null;
alter table public.fixed_costs
  alter column competencia set default date_trunc('month', current_date)::date;

create index fixed_costs_competencia_idx
  on public.fixed_costs (user_id, competencia);
