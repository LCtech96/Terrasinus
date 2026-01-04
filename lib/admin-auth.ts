import { cookies } from 'next/headers'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  // Trim to remove any whitespace
  const trimmedEmail = email.trim()
  const trimmedPassword = password.trim()
  
  // Check if env variables are set
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('ADMIN_EMAIL or ADMIN_PASSWORD not configured')
    return false
  }
  
  // Case-sensitive comparison
  return trimmedEmail === ADMIN_EMAIL && trimmedPassword === ADMIN_PASSWORD
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

