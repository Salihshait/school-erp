// Creates one login for each role (admin, teacher, parent, student) so you
// can sign in and see each portal without registering real accounts.
//
// Role resolution (see src/services/authService.js#resolveRole) works by
// matching the logged-in email against the teachers / parents / students
// tables; whichever matches first wins, and no match falls back to 'admin'.
// So this script creates the Supabase Auth user for each account, then
// inserts a matching row in the right table (skipping that step for admin,
// since no table match is exactly what makes it resolve to 'admin').
//
// Requires the Supabase project's URL and *service role* key (not the anon
// key — this uses the Admin API to create users directly). Get the service
// role key from Project Settings -> API in the Supabase dashboard; never
// expose it to the browser/client bundle.
//
// Usage (from school-erp.client/):
//   SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxxx npm run seed:demo
// or, with the values in a .env file (Node 20.6+ loads it natively):
//   node --env-file=.env scripts/seed-demo-accounts.js

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL (or VITE_SUPABASE_URL) and/or SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Set them as environment variables and re-run this script.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const ACCOUNTS = {
  admin: { email: 'admin@school.test', password: 'Admin@12345' },
  teacher: { email: 'teacher@school.test', password: 'Teacher@12345' },
  parent: { email: 'parent@school.test', password: 'Parent@12345' },
  student: { email: 'student@school.test', password: 'Student@12345' },
}

async function ensureAuthUser(email, password) {
  const { data: list, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) throw listError

  const existing = list.users.find(u => u.email === email)
  if (existing) {
    console.log(`  auth user already exists: ${email}`)
    return existing
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error) throw error
  console.log(`  created auth user: ${email}`)
  return data.user
}

async function ensureStudent(email) {
  const { data: existing, error: findError } = await supabase.from('students')
    .select('*').eq('email', email).maybeSingle()
  if (findError) throw findError
  if (existing) return existing

  const { data, error } = await supabase.from('students').insert([{
    admission_number: 'DEMO-S001',
    first_name: 'Demo',
    last_name: 'Student',
    email,
  }]).select().single()
  if (error) throw error
  console.log(`  created student row: ${email}`)
  return data
}

async function ensureTeacher(email) {
  const { data: existing, error: findError } = await supabase.from('teachers')
    .select('*').eq('email', email).maybeSingle()
  if (findError) throw findError
  if (existing) return existing

  const { data, error } = await supabase.from('teachers').insert([{
    employee_number: 'DEMO-T001',
    first_name: 'Demo',
    last_name: 'Teacher',
    email,
  }]).select().single()
  if (error) throw error
  console.log(`  created teacher row: ${email}`)
  return data
}

async function ensureParent(email, studentId) {
  const { data: existing, error: findError } = await supabase.from('parents')
    .select('*').eq('email', email).maybeSingle()
  if (findError) throw findError
  if (existing) return existing

  const { data, error } = await supabase.from('parents').insert([{
    student_id: studentId,
    relation: 'father',
    name: 'Demo Parent',
    email,
  }]).select().single()
  if (error) throw error
  console.log(`  created parent row: ${email}`)
  return data
}

async function main() {
  console.log('Admin login (no profile row -> resolves to admin):')
  await ensureAuthUser(ACCOUNTS.admin.email, ACCOUNTS.admin.password)

  console.log('\nTeacher login:')
  await ensureAuthUser(ACCOUNTS.teacher.email, ACCOUNTS.teacher.password)
  await ensureTeacher(ACCOUNTS.teacher.email)

  console.log('\nStudent login:')
  await ensureAuthUser(ACCOUNTS.student.email, ACCOUNTS.student.password)
  const student = await ensureStudent(ACCOUNTS.student.email)

  console.log('\nParent login:')
  await ensureAuthUser(ACCOUNTS.parent.email, ACCOUNTS.parent.password)
  await ensureParent(ACCOUNTS.parent.email, student.id)

  console.log('\nDone. Demo credentials:\n')
  console.table(ACCOUNTS)
}

main().catch(err => {
  console.error('\nSeeding failed:', err.message || err)
  process.exit(1)
})
