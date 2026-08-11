-- Amazon Order Management — Supabase schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.

create extension if not exists "pgcrypto";

-- =========================================================
-- Tables
-- =========================================================

create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.product_definitions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  product_name text not null,
  cost numeric not null default 0,
  shipping numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references public.shops(id) on delete set null,
  order_id text not null default '',
  address text not null default '',
  price numeric not null default 0,
  shipping_date date,
  note text not null default '',
  status text not null default 'Chờ ship' check (status in ('Chờ ship', 'Đã gửi', 'DONE', 'Lưu ý')),
  assignee text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sku text not null default '',
  sku_code text not null default '',
  quantity integer not null default 1,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  uploaded_at timestamptz not null default now()
);

-- Migration: 'Đã ship' status renamed to 'DONE', 'Đã gửi' added as an in-between step.
-- Safe to re-run against an existing database that still has the old check constraint.
update public.orders set status = 'DONE' where status = 'Đã ship';
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('Chờ ship', 'Đã gửi', 'DONE', 'Lưu ý'));

create index if not exists orders_shop_id_idx on public.orders(shop_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_shipping_date_idx on public.orders(shipping_date);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_sku_code_idx on public.order_items(sku_code);
create index if not exists order_files_order_id_idx on public.order_files(order_id);

-- keep orders.updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- =========================================================
-- Row Level Security — only logged-in (authenticated) users
-- =========================================================

alter table public.shops enable row level security;
alter table public.product_definitions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_files enable row level security;

drop policy if exists "authenticated full access" on public.shops;
create policy "authenticated full access" on public.shops
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on public.product_definitions;
create policy "authenticated full access" on public.product_definitions
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on public.orders;
create policy "authenticated full access" on public.orders
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on public.order_items;
create policy "authenticated full access" on public.order_items
  for all to authenticated using (true) with check (true);

drop policy if exists "authenticated full access" on public.order_files;
create policy "authenticated full access" on public.order_files
  for all to authenticated using (true) with check (true);

-- =========================================================
-- Storage bucket for order file attachments
-- =========================================================

insert into storage.buckets (id, name, public)
values ('order-attachments', 'order-attachments', false)
on conflict (id) do nothing;

drop policy if exists "authenticated read order-attachments" on storage.objects;
create policy "authenticated read order-attachments" on storage.objects
  for select to authenticated
  using (bucket_id = 'order-attachments');

drop policy if exists "authenticated upload order-attachments" on storage.objects;
create policy "authenticated upload order-attachments" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'order-attachments');

drop policy if exists "authenticated update order-attachments" on storage.objects;
create policy "authenticated update order-attachments" on storage.objects
  for update to authenticated
  using (bucket_id = 'order-attachments')
  with check (bucket_id = 'order-attachments');

drop policy if exists "authenticated delete order-attachments" on storage.objects;
create policy "authenticated delete order-attachments" on storage.objects
  for delete to authenticated
  using (bucket_id = 'order-attachments');

-- =========================================================
-- Seed a couple of example product definitions (optional — edit/delete freely)
-- =========================================================

insert into public.product_definitions (code, product_name, cost, shipping)
values
  ('2xMP', '2 Mousepad', 2, 9.5),
  ('2xMousePad', '2 Mousepad', 2, 9.5)
on conflict (code) do nothing;
