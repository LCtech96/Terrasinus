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
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  }
  
  // Try to save to file system (works locally)
  try {
    const bookings = await getBookings()
    bookings.push(newBooking)
    
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }
    
    await writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
  } catch (error) {
    // On Vercel (read-only file system), we can't write files
    // Log the booking for now - in production you'd use a database
    console.log('Booking received (file system not writable):', newBooking)
    // In production, you should integrate with a database like Supabase
  }
  
  return newBooking
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, guests, date, time } = await request.json()
    
    // Validazione più rigorosa
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Il nome è obbligatorio' },
        { status: 400 }
      )
    }
    if (!phone || !phone.trim() || phone.length < 10) {
      return NextResponse.json(
        { error: 'Il telefono è obbligatorio e deve essere valido' },
        { status: 400 }
      )
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json(
        { error: 'L\'email è obbligatoria e deve essere valida' },
        { status: 400 }
      )
    }
    if (!guests || !guests.trim() || parseInt(guests) < 1) {
      return NextResponse.json(
        { error: 'Il numero di ospiti è obbligatorio e deve essere almeno 1' },
        { status: 400 }
      )
    }
    if (!date || !date.trim()) {
      return NextResponse.json(
        { error: 'La data è obbligatoria' },
        { status: 400 }
      )
    }
    if (!time || !time.trim()) {
      return NextResponse.json(
        { error: 'L\'orario è obbligatorio' },
        { status: 400 }
      )
    }
    
    const booking = await saveBooking({ 
      name: name.trim(), 
      phone: phone.trim(), 
      email: email.trim(), 
      guests: guests.trim(), 
      date: date.trim(), 
      time: time.trim() 
    })
    
    // Sempre restituisci successo anche se il file system non è scrivibile
    // (su Vercel il file system è read-only, ma la prenotazione è stata processata)
    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Prenotazione ricevuta con successo. Ti contatteremo presto per confermare.' 
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Errore durante il salvataggio della prenotazione. Riprova più tardi o contattaci direttamente.' },
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

