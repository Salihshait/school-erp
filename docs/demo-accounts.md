# Demo login accounts

Run once against your Supabase project to get a working login for each portal:

```bash
cd school-erp.client
SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxxx npm run seed:demo
```

`SUPABASE_URL` is the same value as `VITE_SUPABASE_URL`. `SUPABASE_SERVICE_ROLE_KEY` is the
**service role** key from Project Settings → API in the Supabase dashboard — not the anon key,
and never expose it to the browser/client bundle. The script is idempotent (safe to re-run).

| Role    | Email               | Password       | Lands on        |
|---------|---------------------|----------------|------------------|
| Admin   | admin@school.test   | Admin@12345    | `/` (staff area) |
| Teacher | teacher@school.test | Teacher@12345  | `/teacher-portal`|
| Parent  | parent@school.test  | Parent@12345   | `/parent`        |
| Student | student@school.test | Student@12345  | `/student-portal`|

Sign in at `/auth` with any of these — `resolveRole` (see
`src/services/authService.js`) matches the email against the `teachers` /
`parents` / `students` tables and redirects automatically; the admin
account has no matching row in any of them, which is what makes it fall
back to admin.

Change these passwords (or delete the accounts) before using a shared or
production Supabase project.
