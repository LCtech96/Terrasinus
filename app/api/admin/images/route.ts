import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET() {
  try {
    const isAuth = await isAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const publicDir = join(process.cwd(), 'public')
    
    if (!existsSync(publicDir)) {
      return NextResponse.json({ images: [] })
    }

    const files = await readdir(publicDir)
    const mediaFiles = files.filter(file => {
      const ext = file.toLowerCase()
      return ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg') || 
             ext.endsWith('.gif') || ext.endsWith('.webp') || ext.endsWith('.svg') ||
             ext.endsWith('.mp4') || ext.endsWith('.webm') || ext.endsWith('.mov') ||
             ext.endsWith('.avi') || ext.endsWith('.mkv')
    })

    const images = mediaFiles.map(file => {
      const ext = file.toLowerCase()
      const isVideo = ext.endsWith('.mp4') || ext.endsWith('.webm') || ext.endsWith('.mov') ||
                      ext.endsWith('.avi') || ext.endsWith('.mkv')
      return {
        name: file,
        path: `/${file}`,
        url: `/${file}`,
        type: isVideo ? 'video' : 'image'
      }
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error listing images:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero delle immagini' },
      { status: 500 }
    )
  }
}

