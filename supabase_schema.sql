-- ============================================================
-- SpendWise Ultimate — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── ACCOUNTS ──────────────────────────────────────────────────
create table if not exists accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  type        text not null check (type in ('bank', 'credit')),
  name        text not null,
  bank        text,
  balance     numeric(12, 2) default 0,
  credit_limit numeric(12, 2),           -- only for credit cards
  last4       text,
  icon        text default '🏦',
  theme_idx   int default 0,             -- bank card gradient index
  color       text,                      -- credit card hex color
  created_at  timestamptz default now()
);

-- ── TRANSACTIONS ──────────────────────────────────────────────
create table if not exists transactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  account_id      uuid references accounts(id) on delete set null,
  type            text not null check (type in ('income', 'expense')),
  amount          numeric(12, 2) not null,
  category        text not null,
  note            text,
  date            date not null default current_date,
  recurring       boolean default false,
  tax_deductible  boolean default false,
  tags            text[] default '{}',
  created_at      timestamptz default now()
);

-- ── BUDGETS ───────────────────────────────────────────────────
create table if not exists budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  category    text not null,
  amount      numeric(12, 2) not null default 0,
  month       text not null default to_char(current_date, 'YYYY-MM'), -- e.g. '2025-03'
  created_at  timestamptz default now(),
  unique(user_id, category, month)
);

-- ── SAVINGS GOALS ─────────────────────────────────────────────
create table if not exists savings_goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  icon        text default '🎯',
  target      numeric(12, 2) not null,
  saved       numeric(12, 2) default 0,
  color       text default '#7B6FFF',
  deadline    date,
  created_at  timestamptz default now()
);

-- ── SUBSCRIPTIONS ─────────────────────────────────────────────
create table if not exists subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  icon        text default '📦',
  amount      numeric(12, 2) not null,
  cycle       text default 'Monthly',
  next_due    date,
  color       text default '#6366F1',
  created_at  timestamptz default now()
);

-- ── WIDGET CONFIG ─────────────────────────────────────────────
create table if not exists widget_config (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  config      jsonb default '{}'::jsonb,   -- stores {widgetId: true/false}
  updated_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Each user can ONLY see and modify their own data
-- ============================================================

alter table accounts       enable row level security;
alter table transactions   enable row level security;
alter table budgets        enable row level security;
alter table savings_goals  enable row level security;
alter table subscriptions  enable row level security;
alter table widget_config  enable row level security;

-- accounts
create policy "accounts: own data" on accounts
  for all using (auth.uid() = user_id);

-- transactions
create policy "transactions: own data" on transactions
  for all using (auth.uid() = user_id);

-- budgets
create policy "budgets: own data" on budgets
  for all using (auth.uid() = user_id);

-- savings_goals
create policy "savings_goals: own data" on savings_goals
  for all using (auth.uid() = user_id);

-- subscriptions
create policy "subscriptions: own data" on subscriptions
  for all using (auth.uid() = user_id);

-- widget_config
create policy "widget_config: own data" on widget_config
  for all using (auth.uid() = user_id);

-- ============================================================
-- INDEXES for fast queries
-- ============================================================
create index if not exists idx_tx_user_date   on transactions(user_id, date desc);
create index if not exists idx_tx_user_type   on transactions(user_id, type);
create index if not exists idx_tx_account     on transactions(account_id);
create index if not exists idx_budgets_month  on budgets(user_id, month);

-- ============================================================
-- Done! Now go to Supabase → Authentication → Settings
-- and add your site URL to "Redirect URLs"
-- ============================================================
