-- migrations/policies.sql

-- Enable RLS on sensitive tables
alter table transactions enable row level security;
alter table profiles enable row level security;

-- Allow authenticated users to insert their own profile (on sign-up sync)
create policy "insert own profile" on profiles
  for insert using (auth.role() = 'authenticated') with check (auth.uid() = id);

-- Allow users to select/update their own profile
create policy "select own profile" on profiles
  for select using (auth.uid() = id);
create policy "update own profile" on profiles
  for update using (auth.uid() = id);

-- Transactions: insert when auth.uid() = user_id
create policy "insert own transaction" on transactions
  for insert using (auth.role() = 'authenticated') with check (auth.uid() = user_id);

-- Transactions: select only owner
create policy "select own transaction" on transactions
  for select using (auth.uid() = user_id);

-- Transactions: allow update by owner (for status updates via service role we'll use service key)
create policy "update own transaction" on transactions
  for update using (auth.uid() = user_id);

-- If you need admin access, create policies that check for a role column in profiles or use the service_role key server-side.
