-- migrations/schema.sql

-- Enable required extensions
create extension if not exists "pgcrypto";

-- profiles: link to auth.users
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  display_name text,
  phone text,
  created_at timestamptz default now()
);

-- games: catalogue
create table if not exists games (
  id serial primary key,
  slug text unique not null,
  name text not null,
  regions jsonb, -- servers, meta
  created_at timestamptz default now()
);

-- products (topup packages)
create table if not exists products (
  id serial primary key,
  game_id int references games(id),
  code text, -- internal sku
  title text,
  price_cents int not null, -- store in cents
  currency text default 'THB',
  meta jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

-- transactions
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  game_id int references games(id),
  product_id int references products(id),
  player_uid text not null, -- game account id
  amount_cents int not null,
  currency text default 'THB',
  payment_provider text,
  provider_payment_id text,
  status text default 'pending', -- pending, paid, failed, refunded
  idempotency_key text,
  raw_payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- fulfillment logs
create table if not exists fulfillment_logs (
  id serial primary key,
  transaction_id uuid references transactions(id),
  attempt int default 1,
  status text,
  detail text,
  created_at timestamptz default now()
);

-- optional: basic seed data (games/products)
insert into games (slug, name, regions)
select 'example-game', 'Example Game', '{"servers": ["SEA-1", "SEA-2"]}'
where not exists (select 1 from games where slug = 'example-game');

insert into products (game_id, code, title, price_cents, currency, meta, active)
select g.id, 'EX100', '100 Diamonds', 10000, 'THB', '{"amount":100}', true
from games g
where g.slug = 'example-game' and not exists (select 1 from products p where p.code = 'EX100');
