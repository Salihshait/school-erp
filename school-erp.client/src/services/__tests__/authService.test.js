import { describe, it, expect, vi, beforeEach } from 'vitest'

function createBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    maybeSingle: vi.fn(() => Promise.resolve(result)),
  }
  return builder
}

const tableResults = {}
function defaultFromImpl(table) {
  return createBuilder(tableResults[table] ?? { data: null, error: null })
}
const fromMock = vi.fn(defaultFromImpl)

const authMocks = {
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signInWithOtp: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  resend: vi.fn(),
}

vi.mock('../../lib/supabaseClient', () => ({
  default: { auth: authMocks, from: (...args) => fromMock(...args) },
  REMEMBER_ME_KEY: 'school-erp:remember-me',
}))

const authService = await import('../authService')

beforeEach(() => {
  fromMock.mockReset()
  fromMock.mockImplementation(defaultFromImpl)
  Object.keys(tableResults).forEach(k => delete tableResults[k])
  Object.values(authMocks).forEach(m => m.mockReset())
  window.localStorage.clear()
})

describe('authService.signIn / signUp / signOut', () => {
  it('signIn returns the session data on success', async () => {
    authMocks.signInWithPassword.mockResolvedValue({ data: { user: { email: 'a@b.com' }, session: {} }, error: null })
    const result = await authService.signIn({ email: 'a@b.com', password: 'secret' })
    expect(result.user.email).toBe('a@b.com')
    expect(authMocks.signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret' })
  })

  it('signIn throws when supabase returns an error', async () => {
    authMocks.signInWithPassword.mockResolvedValue({ data: null, error: new Error('invalid credentials') })
    await expect(authService.signIn({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow('invalid credentials')
  })

  it('signUp returns user/session data', async () => {
    authMocks.signUp.mockResolvedValue({ data: { user: { email: 'new@b.com' }, session: null }, error: null })
    const result = await authService.signUp({ email: 'new@b.com', password: 'secret' })
    expect(result.session).toBeNull()
  })

  it('signOut throws when supabase returns an error', async () => {
    authMocks.signOut.mockResolvedValue({ error: new Error('network error') })
    await expect(authService.signOut()).rejects.toThrow('network error')
  })
})

describe('authService password reset / update', () => {
  it('requestPasswordReset sends the redirect URL to /reset-password', async () => {
    authMocks.resetPasswordForEmail.mockResolvedValue({ error: null })
    await authService.requestPasswordReset('a@b.com')
    expect(authMocks.resetPasswordForEmail).toHaveBeenCalledWith('a@b.com', {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  })

  it('updatePassword throws when supabase returns an error', async () => {
    authMocks.updateUser.mockResolvedValue({ data: null, error: new Error('weak password') })
    await expect(authService.updatePassword('123')).rejects.toThrow('weak password')
  })

  it('resendVerificationEmail calls resend with type signup', async () => {
    authMocks.resend.mockResolvedValue({ error: null })
    await authService.resendVerificationEmail('a@b.com')
    expect(authMocks.resend).toHaveBeenCalledWith({ type: 'signup', email: 'a@b.com' })
  })
})

describe('authService.resolveRole', () => {
  it('resolves to teacher when the email matches a teacher', async () => {
    tableResults.teachers = { data: { id: 't1' }, error: null }
    const role = await authService.resolveRole('teacher@school.com')
    expect(role).toBe('teacher')
  })

  it('resolves to parent when only the parents table matches', async () => {
    tableResults.teachers = { data: null, error: null }
    tableResults.parents = { data: { id: 'p1' }, error: null }
    const role = await authService.resolveRole('parent@school.com')
    expect(role).toBe('parent')
  })

  it('resolves to student when only the students table matches', async () => {
    tableResults.teachers = { data: null, error: null }
    tableResults.parents = { data: null, error: null }
    tableResults.students = { data: { id: 's1' }, error: null }
    const role = await authService.resolveRole('student@school.com')
    expect(role).toBe('student')
  })

  it('falls back to admin when no table matches', async () => {
    const role = await authService.resolveRole('staff@school.com')
    expect(role).toBe('admin')
  })
})

describe('authService.setRememberMe', () => {
  it('persists the remember-me preference to localStorage', () => {
    authService.setRememberMe(false)
    expect(window.localStorage.getItem('school-erp:remember-me')).toBe('false')
    authService.setRememberMe(true)
    expect(window.localStorage.getItem('school-erp:remember-me')).toBe('true')
  })
})
