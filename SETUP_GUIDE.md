# SpendWise × Supabase — Complete Setup Guide

## What you get after this setup
- All your transactions, accounts, budgets, goals saved permanently in Postgres
- Works across all devices (phone + laptop)
- Login with email/password
- Row Level Security — only YOU can see your data
- Free forever on Supabase's free tier

---

## STEP 1 — Create Supabase Project

1. Go to **https://supabase.com** and click **Start your project**
2. Sign in with GitHub (easiest)
3. Click **New Project**
4. Fill in:
   - **Name:** SpendWise
   - **Database Password:** SpendwiseforNisarg
   - **Region:** pick the closest to you (e.g. US East)
5. Click **Create new project** — wait ~1 minute

---

## STEP 2 — Run the Database Schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `supabase_schema.sql` from this project
4. Paste the entire contents into the SQL Editor
5. Click **Run** (green button)
6. You should see: *"Success. No rows returned"*

This creates 6 tables: accounts, transactions, budgets, savings_goals, subscriptions, widget_config — all with Row Level Security enabled.

---

## STEP 3 — Get Your API Keys

1. In Supabase dashboard → **Settings** (bottom left gear icon)
2. Click **Data API** (or API in older UI)
3. Copy two values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public key** — a long JWT string

---

## STEP 4 — Set Up Your React Project

```bash
# Create the app
npx create-react-app spendwise
cd spendwise

# Install Supabase
npm install @supabase/supabase-js
```

---

## STEP 5 — Add Your Keys

Create a file called `.env.local` in the root of your project:

```
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

Then update `src/supabaseClient.js` to use env vars:

```js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
```

> ⚠️ Never commit .env.local to GitHub. Add it to .gitignore.

---

## STEP 6 — Add the Files

Copy these files into your project:

```
src/
  supabaseClient.js          ← Supabase connection
  hooks/
    useSpendWise.js          ← All data hooks
  App.jsx                    ← Main app (merge with spendwise-ultimate.jsx)
```

**How to merge App.jsx:**
1. Open `spendwise-ultimate.jsx` — keep everything from `GLOBAL_STYLE` through all Screen components
2. Replace only the `export default function App()` section at the bottom with the one from `App_supabase.jsx`
3. Add the `AuthScreen` and `LoadingScreen` components from `App_supabase.jsx`

---

## STEP 7 — Enable Email Auth

1. Supabase dashboard → **Authentication** → **Providers**
2. Make sure **Email** is enabled (it is by default)
3. Go to **Authentication** → **URL Configuration**
4. Add your site URL to **Redirect URLs**:
   - For local dev: `http://localhost:3000`
   - For production: `https://your-vercel-app.vercel.app`

---

## STEP 8 — Run Locally

```bash
npm start
```

Open http://localhost:3000. You'll see the SpendWise login screen.

1. Click **Sign Up**, enter your email + password
2. Check your email for a confirmation link, click it
3. Sign in — you're in!

---

## STEP 9 — Deploy to Vercel (Free)

```bash
npm install -g vercel
npm run build
vercel
```

Vercel will ask a few questions, accept defaults. You'll get a URL like `spendwise-xyz.vercel.app`.

**Add environment variables to Vercel:**
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
4. Redeploy

---

## STEP 10 — Add to iPhone Home Screen

1. Open Safari on iPhone
2. Go to your Vercel URL
3. Tap **Share** → **Add to Home Screen**
4. Name it **SpendWise** → tap **Add**

Done. Full-screen app on your iPhone, data saved to cloud.

---

## Database Capacity (Free Tier)

| What | Free Tier | Your usage estimate |
|---|---|---|
| Storage | 500 MB | ~2–5 MB/year |
| Rows | Unlimited | ~500–2000/year |
| API requests | 500K/month | ~5,000/month |
| Auth users | 50,000 | 1 (you) |

**You could run this for 100+ years on the free tier.**

---

## File Structure Summary

```
spendwise/
├── .env.local                      ← your secret keys (never commit)
├── .gitignore                      ← add .env.local here
├── public/
├── src/
│   ├── supabaseClient.js           ← DB connection
│   ├── hooks/
│   │   └── useSpendWise.js         ← all data hooks
│   ├── App.jsx                     ← main app
│   └── index.js
└── package.json
```

---

## Troubleshooting

**"Invalid API key"** — double-check your anon key in `.env.local`, make sure there are no spaces

**"Row violates row-level security policy"** — you're not logged in, or the RLS policies weren't created. Re-run the SQL schema.

**Data not showing** — open browser console, look for Supabase errors. Usually a missing env var.

**Email confirmation not arriving** — check spam folder. In Supabase → Auth → Email Templates you can also disable confirmation for testing.
