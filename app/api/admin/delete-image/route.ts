import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { fileName } = await request.json()

    if (!fileName) {
      return NextResponse.json({ error: 'Nome file richiesto' }, { status: 400 })
    }

    // Security: prevent path traversal
    if (fileName.includes('..') || fileName.includes('/')) {
      return NextResponse.json({ error: 'Nome file non valido' }, { status: 400 })
    }

    const filePath = join(process.cwd(), 'public', fileName)

    try {
      await unlink(filePath)
      return NextResponse.json({ success: true })
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ error: 'File non trovato' }, { status: 404 })
      }
      throw error
    }
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione del file' },
      { status: 500 }
    )
  }
}

