import { cookies } from 'next/headers'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  // Get fresh values from environment (needed for Vercel)
  const adminEmail = process.env.ADMIN_EMAIL?.trim()
  const adminPassword = process.env.ADMIN_PASSWORD?.trim()
  
  // Trim to remove any whitespace
  const trimmedEmail = email.trim()
  const trimmedPassword = password.trim()
  
  // Check if env variables are set
  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL or ADMIN_PASSWORD not configured')
    return false
  }
  
  // Case-sensitive comparison
  return trimmedEmail === adminEmail && trimmedPassword === adminPassword
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

