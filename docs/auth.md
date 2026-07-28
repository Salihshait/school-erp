# Authentication Module (Phase 3)

This module integrates Supabase Authentication into the frontend and uses the Supabase Auth system for sign-up, sign-in, magic links, and session management.

Files added/updated:

- `school-erp.client/src/lib/supabaseClient.js` — Supabase client wrapper using Vite env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `school-erp.client/src/components/auth/AuthProvider.jsx` — React context provider + `useAuth()` hook.
- `school-erp.client/src/components/auth/AuthForm.jsx` — Login / signup / magic link UI wired to `useAuth()`.
- `school-erp.client/src/components/auth/index.js` — re-export provider and hook.
- `school-erp.client/package.json` — dependency entry for `@supabase/supabase-js`.

Environment variables (add to `.env` or Vercel dashboard):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

Notes:
- The `AuthProvider` should wrap your app root (e.g. in `main.jsx`) so `useAuth()` is available across the app.
- No server-side code was added for authentication — Supabase Auth handles tokens and sessions. If you need server-side verification for protected API routes, use Supabase's JWT verification or the `@supabase/supabase-js` server helpers.

Next steps (on approval):
- Wire `AuthProvider` into `school-erp.client/src/main.jsx`.
- Protect routes and add role-based checks using the `profiles` table created in Phase 3 DB design.
