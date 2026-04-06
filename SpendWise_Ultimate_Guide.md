# 💠 SpendWise: The Ultimate Setup & AI Hyper-Prompt

This document contains the **Hyper-Prompt**, a high-density instruction set designed for AI coding agents to build the complete SpendWise experience with zero ambiguity.

---

## 🚀 Part 1: The AI Hyper-Prompt (Deep-Level Specification)
*Copy and paste the entire block below for a "one-shot" generation of the project.*

```text
TASK: BUILD "SPENDWISE" – THE ULTIMATE PERSONAL FINANCE OPERATING SYSTEM

[IDENTITY & DESIGN LANGUAGE]
- OS Style: iPhone 16 Pro Native. 100dvh (dynamic viewport height).
- Background: Absolute Dark (#06060F). Surfaces: Glassmorphic (#151528 at 60% opacity with 20px blur).
- Borders: 1.5px solid rgba(255,255,255,0.06).
- Typography: 'Plus Jakarta Sans' (Weights: 400-900). 'JetBrains Mono' for all currency values ($0.00).
- Animations: Framer-motion style spring physics: stiff: 300, damping: 30. Use cubic-bezier(0.34, 1.56, 0.64, 1).
- NO POPUPS: All data entry must use slide-up "iOS Sheet" components (88% height max).

[TECHNICAL STACK & CORE ARCHITECTURE]
- Frontend: React with Functional Components + Hooks.
- State Management: Custom hook `useSpendWise` for data synchronization.
- Backend: Supabase (PostgreSQL, Auth, RLS). Use @supabase/supabase-js.
- Responsive: Perfect desktop "Phone Frame" vs. 1:1 mobile scaling (ignore status bar on web).

[FEATURE SPECIFICATIONS - DEEP DIVE]

1. AUTHENTICATION (Supabase Auth)
- Login/Signup screen with minimalist glassy inputs. 
- Auto-redirect to dashboard upon session detection. 
- "Sign Out" located within a top-right profile avatar menu.

2. DASHBOARD (MODULAR WIDGET SYSTEM)
- Widget Config: Fetch from `widget_config` table (JSONB). Only show active widgets.
- HERO: Net Worth = Sum(Banks) - Sum(Credit Debt). Use a gradient #0B0B28 to #18125C.
- FORECAST ENGINE (Logic):
    - Current Spent = Sum of expenses in current month.
    - Daily Burn = Current Spent / Current Day of Month.
    - Projected = Daily Burn * Total Days in Month.
    - Status: "On Track" or "Over Budget" based on comparison with Budget Sum.
- BANK CARDS: Horizontal swipeable carousel. Each has Type, Last4, Balance, and Category Icon.
- CREDIT CARDS: Visual cards with a utilization bar. 
    - Logic: (Balance / Limit) * 100. Color logic: <30% Green, >30% Amber, >80% Red.
    - Action: "Pay Bill" button that triggers a transfer from a Bank account to the Credit card.

3. FINANCIAL ENGINES
- Transactions: Infinite scroll list. Support for: Income/Expense toggle, Categories (Food, Bills, etc.), Note, Date, Tags (array), and "Tax Deductible" flag.
- Budgeting: Set amount PER category. Display "Remaining" math in a progress bar.
- Savings Goals: "Saved" vs "Target" progress. Calculate "Days Remaining" based on a deadline date.
- Subscription Hub: Manage recurring bills. Logic: Calculate "Monthly Total" and highlight anything due within 7 days.

4. SPECIALIZED TRACKERS
- Tax Intelligence: Filter transactions where `tax_deductible` is true. Calculate estimated tax saving (Deductible * 0.22).
- Mileage Tracker: Simple input for "Miles Logged". Logic: Miles * $0.67 (IRS rate) = Reimbursable total.

[DATABASE REPLICA - SUPABASE]
- Table `accounts`: type (bank/credit), name, balance, credit_limit, theme_idx, color.
- Table `transactions`: amount (numeric), type (income/expense), category, note, recurring (bool), tax_deductible (bool).
- Table `budgets`: category (unique per month), amount.
- Table `widget_config`: config (jsonb - {net_worth: true, forecast: true...}).

[PWA & PERFORMANCE]
- Service Worker registration for offline capability.
- 100ms debounce on all expense inputs.
- All interactive elements must have unique, descriptive HTML IDs for browser testing.
```

---

## 🗄️ Part 2: Database Schema (SQL)
*Copy this into the Supabase SQL Editor.*

```sql
-- Full Schema implementation (Simplified for brevity)
create table accounts (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), type text, name text, balance numeric, credit_limit numeric, theme_idx int, color text);
create table transactions (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), account_id uuid references accounts(id), amount numeric, type text, category text, note text, date date, recurring boolean, tax_deductible boolean);
create table budgets (id uuid primary_key default gen_random_uuid(), user_id uuid references auth.users(id), category text, amount numeric, month text);
create table widget_config (user_id uuid references auth.users(id) unique, config jsonb);

-- Enable RLS
alter table accounts enable row level security;
alter table transactions enable row level security;
create policy "admin_access" on accounts for all using (auth.uid() = user_id);
create policy "admin_access" on transactions for all using (auth.uid() = user_id);
```

---

## 🛠️ Part 3: Launch & Vercel Deployment Guide
1. **Init**: `npx create-react-app spendwise`
2. **Connect**: Create `.env.local` with your Supabase `URL` and `ANON_KEY`.
3. **Deploy**: Push your code to GitHub and import the project into Vercel.

### ⚠️ CRITICAL: Vercel Deployment Checklist
To avoid a crashed build or a "Blank White Screen" on Vercel, you **MUST** configure these 3 settings in your Vercel Dashboard before your first deploy:

1. **Root Directory**: If your React app is inside a sub-folder (e.g., `spendwise/`), go to Settings -> General -> **Root Directory** and type your folder name. Otherwise, Vercel won't find your `package.json`.
2. **Ignore Warnings (CI = false)**: Vercel strictly fails React builds if they have minor code warnings. 
   - Go to Settings -> Environment Variables. 
   - Add Key: `CI`, Value: `false`.
3. **Supabase Keys**: Since your `.env.local` isn't uploaded to Vercel, you must manually add your database keys. 
   - Go to Settings -> Environment Variables.
   - Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` exactly as they appear locally.

4. **Mobile**: Open your live Vercel URL on iOS Safari, tap "Share", and select "Add to Home Screen" for the full native app experience.
