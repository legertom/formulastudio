# Auth Setup Checklist

Use this once after connecting Supabase.

## 1) Run SQL setup

In Supabase SQL Editor, run:

`/Users/tomleger/repo/formulastudio/supabase/sql/001_auth_setup.sql`

This creates:
- `profiles`
- `step_progress`
- `signup_allowlist`
- RLS policies
- admin bootstrap for `tom.leger@clever.com`
- `before_user_created` hook function

## 2) Enable the hook

In Supabase:
- `Authentication -> Hooks -> Before user created`
- Choose function: `public.before_user_created`
- Save

This enforces:
- `@clever.com` emails allowed
- non-`@clever.com` must be in `signup_allowlist`

## 3) Verify URL settings

In Supabase:
- `Authentication -> URL Configuration`
- Site URL: `https://formulastudio.net`
- Redirect URLs:
  - `https://formulastudio.net/auth/callback`
  - `http://localhost:5173/auth/callback`

## 4) Verify env vars

In Vercel and local `.env.local`, confirm:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 5) Smoke test

1. Open `/auth`.
2. Sign in with `tom.leger@clever.com`.
3. Open `/admin`.
4. Complete a training step and refresh.
5. Confirm progress persists and appears in admin.

