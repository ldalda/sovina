-- Compras parceladas no cartão. Uma compra de N parcelas vira N linhas em
-- transactions (uma por mês), agrupadas por purchase_id. Cada parcela é um
-- compromisso do seu mês — reduz o disponível daquele mês (como custo fixo).
alter table public.transactions
  add column purchase_id uuid,
  add column installment_no smallint not null default 1 check (installment_no >= 1),
  add column installments_total smallint not null default 1
    check (installments_total >= 1);

create index transactions_purchase_idx
  on public.transactions (purchase_id)
  where purchase_id is not null;
