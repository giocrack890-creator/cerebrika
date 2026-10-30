-- Pedidos del ebook y mails del material gratis.
-- Correr en el SQL Editor de Supabase (o con supabase db push).
-- La app usa la service role, que saltea RLS. anon y authenticated no tienen acceso.
-- No hay policies a propósito: nadie entra por la API pública.

create table public.orders (
  id bigint generated always as identity primary key,
  provider text not null,
  provider_payment_id text not null,
  product_id text not null,
  status text not null,
  email text not null,
  amount numeric(12, 2) not null,
  currency text not null,
  download_token text not null,
  download_expires_at timestamptz not null,
  email_status text not null default 'pending',
  email_claimed_at timestamptz,
  email_sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_provider_check check (provider in ('mercadopago', 'lemonsqueezy')),
  constraint orders_status_check check (status in ('approved')),
  constraint orders_email_status_check check (email_status in ('pending', 'sending', 'sent')),
  constraint orders_email_lowercase check (email = lower(email)),
  constraint orders_amount_nonnegative check (amount >= 0),
  constraint orders_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint orders_provider_payment_unique unique (provider, provider_payment_id),
  constraint orders_download_token_unique unique (download_token)
);

create index orders_email_idx on public.orders (email);

create table public.leads (
  id bigint generated always as identity primary key,
  email text not null,
  source text not null default 'prompts-planificacion',
  created_at timestamptz not null default now(),
  constraint leads_email_unique unique (email),
  constraint leads_email_lowercase check (email = lower(email)),
  constraint leads_source_length check (char_length(source) between 1 and 80)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.leads enable row level security;
alter table public.orders force row level security;
alter table public.leads force row level security;

revoke all on table public.orders from anon, authenticated;
revoke all on table public.leads from anon, authenticated;

grant select, insert, update on table public.orders to service_role;
grant select, insert, update on table public.leads to service_role;
grant usage, select on sequence public.orders_id_seq to service_role;
grant usage, select on sequence public.leads_id_seq to service_role;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'storage'
      and table_name = 'buckets'
  ) then
    insert into storage.buckets (id, name, public)
    values ('ebooks', 'ebooks', false)
    on conflict (id) do nothing;
  end if;
end $$;
