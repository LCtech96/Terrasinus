import { cookies } from 'next/headers'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('admin-session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')
  return session?.value === 'authenticated'
}

