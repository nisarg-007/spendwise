# SpendWise

A mobile-first personal finance app that feels like a native iPhone app. Track accounts, transactions, budgets, subscriptions and savings goals — all synced to a Postgres database through Supabase, and installable to your home screen as a PWA.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)
![License](https://img.shields.io/badge/license-personal-lightgrey)

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Supabase setup](#supabase-setup)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Deploying to Vercel](#deploying-to-vercel)
- [Install on iPhone](#install-on-iphone)
- [Architecture](#architecture)
- [Database schema](#database-schema)
- [Financial Health Score](#financial-health-score)
- [Theming](#theming)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Roadmap](#roadmap)

---

## Features

### Dashboard (modular widgets)
The home screen is built from widgets you can switch on or off in **More → Customize**. Your choices are saved per user in the `widget_config` table.

Only the essentials are on by default, so a fresh dashboard stays clean. Turn extras on when you need them.

| Widget | What it shows | Default |
|---|---|---|
| Net Worth | Bank balances minus credit card debt | On |
| Financial Health Score | 0–100 score with advice ([details](#financial-health-score)) | On |
| Bank Cards | Swipeable card carousel | On |
| Credit Cards | Balances and utilization per card | On |
| Monthly Summary | Income vs. expense ring chart | On |
| Recent Transactions | Last 5 transactions | On |
| Quick Stats | Savings rate, daily average, counts | Off |
| Spending Bars | Weekly spend bar chart | Off |
| Savings Goals | Progress toward each goal | Off |
| Subscriptions | Monthly recurring cost tracker | Off |
| CC Utilization | Credit-score impact meter | Off |
| Upcoming Bills | Bills due in the next 7 days | Off |
| Tax Summary | Tax-deductible expenses YTD | Off |
| Mileage Tracker | Trip distance and reimbursement | Off |
| Cash Flow | 30-day income/expense bars | Off |

### Money management
- **Accounts** — bank accounts and credit cards with custom card art, last-4 digits and credit limits.
- **Transactions** — income/expense entry with a custom numeric keypad, categories, notes, tags, recurring and tax-deductible flags.
- **Smart categorization** — type a note like "Chipotle" or "Uber" and the category is auto-detected.
- **Split transactions** — split one payment across several categories; linked splits are edited and deleted together.
- **Transfers** — move money between bank accounts.
- **Pay credit card bill** — pay a card from a bank account; both balances update.
- **Edit/delete with balance correction** — editing a transaction re-adjusts the affected account balances.
- **Budgets** — per-category monthly limits with progress tracking.
- **Subscriptions** — recurring charges with billing cycle and next due date (stored in Supabase; add/edit from the UI is on the roadmap, so the tab is hidden for now).
- **Reset all data** — **More → Settings**. Deletes every transaction, budget, goal and subscription, sets all balances to $0 and restores the default dashboard. Accounts and cards are kept. You must type `RESET` to confirm.
- **Clear History** — on the History tab; tap twice to delete all transactions. Balances are not changed.
- **Reports** — category breakdowns and trends.
- **History filters** — by type, account and search text, plus a tax-deductible view.

### Privacy mode
Tap the **eye button** at the top of Home, Accounts, History, Budget or More to hide every dollar amount (`$•••••`). It's safe to open the app in public. Tap again to show amounts. Your choice is remembered on this device. Percentages and the health score stay visible; they don't reveal amounts.

### Navigation

| Tab | What's there |
|---|---|
| Home | Dashboard widgets and the **+** button (add transaction, transfer) |
| Accounts | Bank accounts and credit cards; tap a card to edit, **Pay Bill** on cards |
| History | All transactions with filters; tap one to edit or delete |
| Budget | Monthly limit per category |
| More | **Reports**, **Customize** (themes + widgets), **Settings** (reset) |

### Experience
- iPhone 16 Pro–style layout with a **Dynamic Island ambient glow** that reacts to your spending.
- **10 themes**, switchable in one tap and remembered per device.
- Smooth tab transitions, sliding nav indicator and spring pop-up menu built with [Motion](https://motion.dev) (`motion` package). All motion respects the system **Reduce Motion** setting.
- Animated numbers, scroll-reveal timelines, horizontal snap scrolling, frosted-glass surfaces.
- Phone-frame preview on desktop; full-screen on mobile.

---

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19 (function components + hooks), Create React App 5 |
| Animation | [Motion](https://motion.dev) (`motion/react`) — tab transitions, nav indicator, menus |
| Styling | Plain CSS-in-JS template strings with CSS custom properties for themes |
| Data | Supabase (PostgreSQL) via `@supabase/supabase-js` v2 |
| Auth | Supabase Auth (email/password) |
| Security | Postgres Row Level Security — users only see their own rows |
| Hosting | Vercel (static build) |

No Redux, no UI kit, no chart library — charts and rings are hand-built with SVG and CSS.

---

## Project structure

```
spendwise/                       ← repository root
├── README.md                    ← you are here
├── SETUP_GUIDE.md               ← step-by-step Supabase walkthrough
├── supabase_schema.sql          ← run once in Supabase SQL Editor
├── SpendWise_Ultimate_Guide.*   ← product spec / design prompt
└── spendwise/                   ← the React app (Vercel root directory)
    ├── .env.example             ← copy to .env.local
    ├── package.json
    ├── public/                  ← index.html, icons, manifest.json
    └── src/
        ├── index.js             ← React entry point
        ├── App.jsx              ← all screens, modals, themes and styles
        ├── supabaseClient.js    ← Supabase client (reads env vars)
        └── hooks/
            └── useSpendWise.js  ← data hooks: auth, accounts, transactions,
                                    budgets, goals, subscriptions, widgets
```

---

## Quick start

**Requirements:** Node.js 18+ (tested on Node 22) and a free [Supabase](https://supabase.com) project.

```bash
git clone https://github.com/nisarg-007/spendwise.git
cd spendwise/spendwise          # the app lives in the inner folder
npm install
cp .env.example .env.local      # then paste your Supabase URL + anon key
npm start                       # opens http://localhost:3000
```

If you have not set up Supabase yet, do the next section first.

---

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com) → **New project**.
2. Open **SQL Editor → New query**, paste the full contents of [`supabase_schema.sql`](./supabase_schema.sql) and click **Run**. This creates 6 tables, enables RLS and adds indexes.
3. Go to **Project Settings → API** and copy the **Project URL** and the **anon public** key into `.env.local`.
4. Go to **Authentication → Providers** and make sure **Email** is enabled.
5. For the auto-login flow (see [Security notes](#security-notes)) turn **off** "Confirm email" under **Authentication → Providers → Email**, or confirm the account once from the email Supabase sends.
6. Under **Authentication → URL Configuration**, add `http://localhost:3000` and your Vercel URL to **Redirect URLs**.

> **Free-tier projects pause after about 7 days without activity.** If the app suddenly stops loading data, open the Supabase dashboard and click **Restore project**. See [Troubleshooting](#troubleshooting).

A longer walkthrough with screenshots-style steps is in [SETUP_GUIDE.md](./SETUP_GUIDE.md).

---

## Environment variables

Create `spendwise/.env.local` (never commit it — it is already in `.gitignore`):

```env
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

| Variable | Where to find it | Required |
|---|---|---|
| `REACT_APP_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Yes |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key | Yes |

CRA only exposes variables that start with `REACT_APP_`, and it reads them **at build time** — restart `npm start` or redeploy after changing them.

---

## Available scripts

Run inside `spendwise/spendwise`:

| Command | What it does |
|---|---|
| `npm start` | Dev server with hot reload on port 3000 |
| `npm run build` | Production build into `build/` |
| `CI=true npm run build` | Strict build: ESLint warnings fail it. Most CI services run this way — keep it passing |
| `npm test` | Jest test runner in watch mode |

---

## Deploying to Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com/new).
2. Set **Root Directory** to `spendwise` (the inner folder).
   Live app: **https://spendwise-nisu.vercel.app**
3. Framework preset: **Create React App** (build `npm run build`, output `build`).
4. Add both `REACT_APP_SUPABASE_*` variables under **Settings → Environment Variables** for Production and Preview.
5. Deploy. Every push to `main` redeploys automatically.
6. Add the Vercel URL to Supabase **Redirect URLs**.

> If your CI or Vercel project sets `CI=true`, every ESLint warning becomes a build error. Run `CI=true npm run build` before pushing to catch these early.

By default Vercel puts **Deployment Protection** on preview URLs (`*-projects.vercel.app`), which asks for a Vercel login. Use the production domain to share the app, or turn protection off in **Settings → Deployment Protection**.

---

## Install on iPhone

1. Open your Vercel URL in **Safari**.
2. Tap **Share → Add to Home Screen** and name it *SpendWise*.
3. Launch it from the home screen — it runs full-screen with the status-bar-aware layout.

---

## Architecture

```
┌──────────────────────────── Browser / PWA ─────────────────────────────┐
│                                                                        │
│  App.jsx                                                               │
│   ├─ App (root) ─ tab state, modals, theme                             │
│   │    ├─ HomeScreen ── widgets (Net Worth, Health Score, …)           │
│   │    ├─ AccountsScreen   ├─ TxScreen   ├─ BudgetScreen               │
│   │    ├─ SubsScreen       ├─ ReportsScreen ├─ CustomizeScreen         │
│   │    └─ Modals: AddTx, EditTx, Transfer, PayCC, Acct, HealthScore    │
│   │                                                                    │
│  hooks/useSpendWise.js                                                 │
│   useAuth · useAccounts · useTransactions · useBudgets                 │
│   useSavingsGoals · useSubscriptions · useWidgetConfig                 │
│        │  optimistic local state + Supabase calls                      │
└────────┼───────────────────────────────────────────────────────────────┘
         │ supabase-js (HTTPS, JWT)
┌────────▼─────────────── Supabase ──────────────────────────────────────┐
│  Auth (email/password)  →  PostgreSQL with Row Level Security          │
│  accounts · transactions · budgets · savings_goals ·                   │
│  subscriptions · widget_config                                         │
└────────────────────────────────────────────────────────────────────────┘
```

**Data flow.** Each hook loads its table for the signed-in `user_id`, keeps it in React state, and exposes `add / update / delete` helpers that write to Supabase and update state. Field names are mapped between snake_case (database) and camelCase (UI) inside the hooks — for example `theme_idx` ↔ `themeIdx` and `credit_limit` ↔ `limit`.

**Balance consistency.** Adding, editing or deleting a transaction also updates the linked account balance, so the Net Worth always matches the ledger. All balance changes go through `adjustBalance(id, delta)` in `useAccounts`, which queues updates and reads the latest balance, so quick back-to-back changes (split receipts, transfers) can't overwrite each other. Amounts are rounded to cents.

**Dates** are stored as `YYYY-MM-DD` in the device's local time zone (`localISODate` / `parseLocalDate` in `App.jsx`), so an evening expense never lands on tomorrow.

**What counts as spending.** Transfers between accounts and credit-card payments are tagged `__transfer__` and excluded from income, expenses, budgets, reports and the health score. Home and Budget use the current calendar month; Reports follows the selected period (week, month, quarter, year).

**Errors.** If a save fails (offline, Supabase paused), a red banner appears at the top instead of the change silently disappearing.

**Theme preference** is stored in `localStorage` (`spendwise_theme`), so it is per device. Everything else lives in Supabase.

---

## Database schema

Defined in [`supabase_schema.sql`](./supabase_schema.sql). Every table has a `user_id` foreign key to `auth.users` with `on delete cascade`, and an RLS policy `auth.uid() = user_id`.

| Table | Purpose | Key columns |
|---|---|---|
| `accounts` | Bank accounts and credit cards | `type` (`bank`/`credit`), `balance`, `credit_limit`, `last4`, `theme_idx`, `color` |
| `transactions` | Income and expenses | `account_id`, `type`, `amount`, `category`, `date`, `recurring`, `tax_deductible`, `tags[]` |
| `budgets` | Monthly limit per category | `category`, `amount`, `month` (`YYYY-MM`) — unique per user/category/month |
| `savings_goals` | Saving targets | `target`, `saved`, `deadline`, `color` |
| `subscriptions` | Recurring charges | `amount`, `cycle`, `next_due` |
| `widget_config` | Dashboard layout | `config` JSONB `{ widgetId: true/false }` — one row per user |

Indexes: `transactions(user_id, date desc)`, `transactions(user_id, type)`, `transactions(account_id)`, `budgets(user_id, month)`.

---

## Financial Health Score

A 0–100 score computed on the client in `calculateFinancialHealthScore()`:

| Component | Max points | Based on |
|---|---|---|
| Savings rate | 30 | (income − expenses) / income this month |
| Budget adherence | 25 | How many categories stay under budget |
| Credit utilization | 20 | Total card balance / total credit limit |
| Savings goals | 15 | Average progress across goals |
| Liquidity | 10 | Cash on hand vs. card debt |

Tap the widget to see the breakdown and personalised advice.

---

## Theming

Ten themes are defined in the `THEMES` array in `App.jsx`. Each one sets CSS custom properties (`--bg`, `--text`, `--t2`, accent colors, surfaces) that every component reads.

Nordic Sage · Swiss Grotesk (default) · Obsidian Terracotta · Brutalist Steel · Tokyo Midnight · Champagne Luxury · Cybernetic Carbon · Pearl Mint Glass · Sage & Alabaster · Sovereign Cobalt

To add a theme, copy an existing object in `THEMES`, give it a new `id` and `name`, and change the colors. It appears in **More → Customize** automatically.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Build fails with `Treating warnings as errors because process.env.CI = true` | An ESLint warning (unused variable, hook dependency) | Run `CI=true npm run build` locally, fix the listed warnings, push again |
| App loads but shows no data / spinner forever | Supabase free project is **paused** | Supabase dashboard → project → **Restore project**, wait ~2 min |
| `Invalid API key` | Wrong or missing anon key | Check `.env.local` / Vercel env vars, no quotes or spaces; redeploy |
| `new row violates row-level security policy` | Not signed in, or policies missing | Re-run `supabase_schema.sql` |
| `Email not confirmed` in the console | Email confirmation is on | Confirm from the email, or disable "Confirm email" in Supabase Auth |
| Preview link asks for a Vercel login | Deployment Protection | Use the production URL or disable protection |
| `npm ci` fails: lock file out of sync | `package-lock.json` drifted | Run `npm install` and commit the updated lock file |
| Env var change has no effect | CRA bakes env vars in at build time | Restart `npm start` / trigger a new Vercel deploy |
| Items flicker or look faded while scrolling | Old scroll-reveal animation | Fixed — update to the latest version and reopen the app |
| Want a clean slate | — | **More → Settings → Reset all data**, or run the SQL below |

To reset from the Supabase **SQL Editor** instead (keeps accounts, zeroes balances, affects every user in the project):

```sql
delete from transactions;
delete from budgets;
delete from savings_goals;
delete from subscriptions;
delete from widget_config;
update accounts set balance = 0;
```

---

## Security notes

- **Row Level Security** is enabled on every table, so a signed-in user can only read and write their own rows. The anon key is safe to ship in the browser *because* of RLS.
- **Auto-login.** `useAuth()` in `src/hooks/useSpendWise.js` signs in automatically with a fixed email and password (and creates the account on first run). That keeps the app one-tap on a phone, but the credentials are visible in the source and in the built JavaScript, so **anyone who has them can read and edit that account's data**. For anything beyond a personal demo:
  1. Change the password in Supabase → Authentication → Users.
  2. Replace the auto-login in `useAuth()` with the `AuthScreen` component that already exists in `App.jsx` (email/password form wired to `signIn` / `signUp`).
- Never commit `.env.local` or a Supabase **service_role** key.

---

## Roadmap

- [ ] Replace auto-login with the built-in `AuthScreen`
- [ ] Savings goals and subscriptions add/edit from the UI (then re-enable the Subscriptions tab)
- [ ] CSV / PDF export from Reports
- [ ] Proper PWA manifest (name, icons, theme color) and offline cache
- [ ] Split `App.jsx` into per-screen files
- [ ] Unit tests for the health score and balance logic

---

## License

Personal project by [Nisarg](https://github.com/nisarg-007). All rights reserved unless a license file is added.
