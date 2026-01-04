import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getSiteContent, saveSiteContent, SiteContent } from '@/lib/admin-content'

export async function GET() {
  try {
    // Allow unauthenticated access for public site to read content
    // Authentication is only required for POST (save)
    const content = await getSiteContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error getting content:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei contenuti' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const content: SiteContent = await request.json()
    await saveSiteContent(content)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json(
      { error: 'Errore nel salvataggio dei contenuti' },
      { status: 500 }
    )
  }
}

