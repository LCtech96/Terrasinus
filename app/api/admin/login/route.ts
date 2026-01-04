import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, setAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono richiesti' },
        { status: 400 }
      )
    }

    // Trim email and password
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    // Check if environment variables are configured
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL or ADMIN_PASSWORD not configured in environment variables')
      return NextResponse.json(
        { error: 'Configurazione server non valida. Contatta l\'amministratore.' },
        { status: 500 }
      )
    }

    const isValid = await verifyAdmin(trimmedEmail, trimmedPassword)

    if (!isValid) {
      // Log failed attempts in development only
      if (process.env.NODE_ENV === 'development') {
        console.log('Login attempt failed:', {
          providedEmail: trimmedEmail,
          providedPasswordLength: trimmedPassword.length,
          expectedEmail: adminEmail,
          expectedPasswordLength: adminPassword.length,
          emailMatch: trimmedEmail === adminEmail,
          passwordMatch: trimmedPassword === adminPassword
        })
      }
      return NextResponse.json(
        { error: 'Credenziali non valide' },
        { status: 401 }
      )
    }

    await setAdminSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Errore durante il login' },
      { status: 500 }
    )
  }
}

