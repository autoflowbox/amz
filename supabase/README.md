# Supabase setup

One-time setup for the project at `https://hobcjyknizjnloemugrc.supabase.co`.

## 1. Create the database tables

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Open `schema.sql` from this folder, copy all of it, paste into a new query, and click **Run**.
3. This creates: `shops`, `product_definitions`, `orders`, `order_items`, `order_files`, enables Row Level Security (only logged-in users can read/write), and creates a private Storage bucket `order-attachments` for file uploads.

Safe to re-run if you need to reapply it later — it uses `if not exists` / `drop policy if exists` throughout.

## 2. Create your login user

The app requires being signed in (Supabase Auth, email/password). There's no self-signup screen on purpose — create accounts yourself:

1. Dashboard → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter an email + password, tick **Auto Confirm User** (so it doesn't need an email confirmation link).
3. Repeat for each teammate who needs access.

## 3. Environment variables

Already filled in for you in `.env` (copied from `Amazon Prompt.txt`):

```
VITE_SUPABASE_URL=https://hobcjyknizjnloemugrc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_nXkoDHimAUkJmaw-bWHyUA_sivy53iM
```

This is the **publishable/anon** key — it's meant to be shipped in frontend code (that's what RLS is for). Never put a `service_role` key in this project.

## Adjusting assumptions later

A few things in the spec were ambiguous and I made a concrete call — easy to change in code if you want it different:

- **Profit formula**: `price * 0.8 - Σ(quantity * (cost + shipping))` across an order's SKU lines — see `src/lib/profit.ts`.
- **Multi-SKU entry**: each order can have multiple SKU lines added individually (not auto-parsed from a pasted delimited string) — see `src/components/OrdersTable/SkuCell.tsx`.
- **Dashboard "last month" stats**: current calendar month to date (from the 1st) — see `src/lib/dashboardQueries.ts` (if present) or `Dashboard.tsx`.
- **Shipping-date colors**: >5 days = default, 3–5 = yellow, 1–2 = orange, ≤0 = red/overdue — see `src/lib/shippingDate.ts`.
