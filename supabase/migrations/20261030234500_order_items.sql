-- Ítems de un pedido con varios ebooks. Cada uno tiene su enlace de descarga.
-- Correr en el SQL Editor de Supabase después de 20261030230000_product_slug_and_lead_sources.sql.

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  product_slug text not null,
  title text not null,
  unit_price numeric(12, 2) not null,
  quantity integer not null default 1,
  download_token text not null,
  download_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint order_items_quantity_one check (quantity = 1),
  constraint order_items_price_nonnegative check (unit_price >= 0),
  constraint order_items_order_slug_unique unique (order_id, product_slug),
  constraint order_items_download_token_unique unique (download_token)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;
alter table public.order_items force row level security;
revoke all on table public.order_items from anon, authenticated;
grant select, insert, update, delete on table public.order_items to service_role;
grant usage, select on sequence public.order_items_id_seq to service_role;
