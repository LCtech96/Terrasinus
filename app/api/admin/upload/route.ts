import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'public'

    if (!file) {
      return NextResponse.json({ error: 'Nessun file fornito' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to public folder
    const publicDir = join(process.cwd(), 'public')
    const fileName = file.name
    const filePath = join(publicDir, fileName)

    // Ensure public directory exists
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      url: `/${fileName}`,
      fileName,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento del file' },
      { status: 500 }
    )
  }
}

