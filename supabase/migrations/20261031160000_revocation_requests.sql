-- Pedidos hechos con el botón de arrepentimiento.
-- Correr en el SQL Editor de Supabase después de 20261030234500_order_items.sql.
-- Igual que las otras tablas: RLS activo, sin policies, solo la service role entra.

create table if not exists public.revocation_requests (
  id bigint generated always as identity primary key,
  code text not null,
  email text not null,
  order_ref text,
  reason text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint revocation_requests_code_unique unique (code),
  constraint revocation_requests_email_lowercase check (email = lower(email)),
  constraint revocation_requests_status_check check (status in ('pending', 'resolved')),
  constraint revocation_requests_order_ref_length check (order_ref is null or char_length(order_ref) <= 80),
  constraint revocation_requests_reason_length check (reason is null or char_length(reason) <= 1000)
);

create index if not exists revocation_requests_email_idx on public.revocation_requests (email);

alter table public.revocation_requests enable row level security;
alter table public.revocation_requests force row level security;
revoke all on table public.revocation_requests from anon, authenticated;
grant select, insert, update on table public.revocation_requests to service_role;
grant usage, select on sequence public.revocation_requests_id_seq to service_role;
