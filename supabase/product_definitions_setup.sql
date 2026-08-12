create extension if not exists "pgcrypto";

create table if not exists public.product_definitions (
  id uuid primary key default gen_random_uuid(),
  id_tem text not null default '',
  code text not null unique,
  product_name text not null,
  cost numeric not null default 0,
  shipping numeric not null default 0,
  weight numeric not null default 0,
  p_weight numeric not null default 0,
  length numeric not null default 0,
  width numeric not null default 0,
  height numeric not null default 0,
  hs_code text not null default '',
  item_price numeric not null default 0,
  note1 text not null default '',
  note2 text not null default '',
  created_at timestamptz not null default now()
);

alter table public.product_definitions add column if not exists id_tem text not null default '';
alter table public.product_definitions add column if not exists weight numeric not null default 0;
alter table public.product_definitions add column if not exists p_weight numeric not null default 0;
alter table public.product_definitions add column if not exists length numeric not null default 0;
alter table public.product_definitions add column if not exists width numeric not null default 0;
alter table public.product_definitions add column if not exists height numeric not null default 0;
alter table public.product_definitions add column if not exists hs_code text not null default '';
alter table public.product_definitions add column if not exists item_price numeric not null default 0;
alter table public.product_definitions add column if not exists note1 text not null default '';
alter table public.product_definitions add column if not exists note2 text not null default '';

alter table public.product_definitions enable row level security;

drop policy if exists "authenticated full access" on public.product_definitions;
create policy "authenticated full access" on public.product_definitions
  for all to authenticated using (true) with check (true);
