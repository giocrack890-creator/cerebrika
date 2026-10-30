-- Catálogo: cada pedido recuerda el slug del ebook.
-- Los leads pueden pedir prompts y, aparte, aviso de un ebook que todavía no sale.
-- Correr en el SQL Editor de Supabase después de 20261030213000_orders_and_leads.sql.

alter table public.orders add column if not exists product_slug text;

update public.orders
set product_slug = product_id
where product_slug is null;

alter table public.orders alter column product_slug set not null;

create index if not exists orders_product_slug_idx on public.orders (product_slug);

alter table public.leads drop constraint if exists leads_email_unique;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_email_source_unique'
      and conrelid = 'public.leads'::regclass
  ) then
    alter table public.leads
      add constraint leads_email_source_unique unique (email, source);
  end if;
end $$;
