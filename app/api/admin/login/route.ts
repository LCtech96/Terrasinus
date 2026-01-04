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

    const isValid = await verifyAdmin(trimmedEmail, trimmedPassword)

    if (!isValid) {
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

