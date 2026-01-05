import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const BOOKINGS_FILE = join(process.cwd(), 'data', 'bookings.json')

interface Booking {
  id: string
  name: string
  phone: string
  email: string
  guests: string
  date: string
  time: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

async function getBookings(): Promise<Booking[]> {
  if (!existsSync(BOOKINGS_FILE)) {
    return []
  }
  try {
    const data = await readFile(BOOKINGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
  const bookings = await getBookings()
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  }
  
  bookings.push(newBooking)
  
  const dataDir = join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
  
  await writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
  return newBooking
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, guests, date, time } = await request.json()
    
    if (!name || !phone || !email || !guests || !date || !time) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      )
    }
    
    const booking = await saveBooking({ name, phone, email, guests, date, time })
    
    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Errore durante il salvataggio della prenotazione' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const bookings = await getBookings()
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { error: 'Errore durante il recupero delle prenotazioni' },
      { status: 500 }
    )
  }
}

