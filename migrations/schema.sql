-- migrations/schema.sql
-- Run this SQL in your Supabase SQL editor or via psql.

create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  email text unique,
  display_name text,
  role text default 'user',
  balance numeric default 0,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null default 0,
  stock int default 0,
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete set null,
  status text default 'pending',
  total numeric default 0,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  price numeric,
  quantity int default 1
);

create table if not exists topups (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete set null,
  amount numeric not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- indices for common queries
create index if not exists idx_orders_created_at on orders(created_at);
create index if not exists idx_products_featured on products(featured);
