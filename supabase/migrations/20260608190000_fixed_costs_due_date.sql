-- Vencimento passa de "dia do mês" (int) para data completa.
alter table public.fixed_costs drop column due_day;
alter table public.fixed_costs add column due_date date;
