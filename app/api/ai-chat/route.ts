import { NextRequest, NextResponse } from 'next/server'
import { getSiteContent } from '@/lib/admin-content'

const ORARI = {
  lunedi: "CHIUSO",
  martedi: "12:00 - 15:00 | 19:00 - 23:00",
  mercoledi: "12:00 - 15:00 | 19:00 - 23:00",
  giovedi: "12:00 - 15:00 | 19:00 - 23:00",
  venerdi: "12:00 - 15:00 | 19:00 - 23:00",
  sabato: "12:00 - 15:00 | 19:00 - 23:00",
  domenica: "12:00 - 15:00 | 19:00 - 23:00",
}

function generateContext(siteContent: any): string {
  let context = `INFORMAZIONI RISTORANTE TERRA SINUS:
- Nome: ${siteContent.title}
- Sottotitolo: ${siteContent.subtitle}
- Descrizione: ${siteContent.description}
- Indirizzo: ${siteContent.address}
- Telefono: ${siteContent.phone}
- WhatsApp: ${siteContent.whatsapp}

ORARI DI APERTURA:
- Lunedì: CHIUSO
- Martedì-Domenica: 12:00-15:00 (pranzo) e 19:00-23:00 (cena)

MENU FISSO:
${siteContent.menuContent?.menuFisso?.title || "Menù Fisso Invernale – €35"}
${siteContent.menuContent?.menuFisso?.description || ""}
Disponibile tutti i giorni tranne domenica e festivi.

ANTIPASTI: ${siteContent.menuContent?.menuFisso?.courses?.antipasti?.join(", ") || ""}
PRIMI: ${siteContent.menuContent?.menuFisso?.courses?.primi?.join(", ") || ""}
SECONDO: ${siteContent.menuContent?.menuFisso?.courses?.secondo?.join(", ") || ""}
BEVANDA: ${siteContent.menuContent?.menuFisso?.courses?.bevanda?.join(", ") || ""}

PIATTI POPOLARI DALLA GALLERY:
`

  if (siteContent.galleryMedia) {
    siteContent.galleryMedia.slice(0, 15).forEach((item: any) => {
      context += `- ${item.alt}: ${item.description}\n`
    })
  }

  // Add menu sections if available
  if (siteContent.menuContent?.menuSections) {
    context += "\nMENU ALLA CARTA - PRIMI PIATTI:\n"
    const primiSection = siteContent.menuContent.menuSections.find((s: any) => 
      s.title?.toLowerCase().includes('primi')
    )
    if (primiSection) {
      primiSection.items?.slice(0, 5).forEach((item: any) => {
        context += `- ${item.name}${item.price ? ` - ${item.price}` : ""}${item.description ? `: ${item.description}` : ""}\n`
      })
    }
  }

  return context
}

function extractBookingIntent(message: string): boolean {
  const bookingKeywords = ['prenot', 'tavolo', 'riserv', 'disponibil', 'libero', 'posto', 'tavola']
  return bookingKeywords.some(keyword => message.toLowerCase().includes(keyword))
}

function generateResponse(message: string, context: string, bookingData: any): { response: string; bookingRequest?: boolean; bookingData?: any } {
  const lowerMessage = message.toLowerCase()
  
  // Booking intent
  if (extractBookingIntent(lowerMessage) || lowerMessage.includes('prenota')) {
    const newBookingData = { ...bookingData }
    
    // Extract info from message
    const nameMatch = message.match(/(?:nome|mi chiamo|sono)\s+([A-Za-z\s]+)/i)
    if (nameMatch && !newBookingData.name) newBookingData.name = nameMatch[1].trim()
    
    const phoneMatch = message.match(/(?:telefono|cellulare|numero)\s*:?\s*(\d{10,})/i)
    if (phoneMatch && !newBookingData.phone) newBookingData.phone = phoneMatch[1]
    
    const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
    if (emailMatch && !newBookingData.email) newBookingData.email = emailMatch[1]
    
    const guestsMatch = message.match(/(?:persone|ospiti|coperti)\s*:?\s*(\d+)/i)
    if (guestsMatch && !newBookingData.guests) newBookingData.guests = guestsMatch[1]
    
    const dateMatch = message.match(/(?:data|giorno)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]?\d{0,4})/i)
    if (dateMatch && !newBookingData.date) newBookingData.date = dateMatch[1]
    
    const timeMatch = message.match(/(?:ora|orario)\s*:?\s*(\d{1,2}:\d{2})/i)
    if (timeMatch && !newBookingData.time) newBookingData.time = timeMatch[1]
    
    const missing = []
    if (!newBookingData.name) missing.push("nome")
    if (!newBookingData.phone) missing.push("telefono")
    if (!newBookingData.email) missing.push("email")
    if (!newBookingData.guests) missing.push("numero di ospiti")
    if (!newBookingData.date) missing.push("data")
    if (!newBookingData.time) missing.push("orario")
    
    if (missing.length > 0) {
      return {
        response: `Perfetto! Per completare la prenotazione ho bisogno di: ${missing.join(", ")}. Puoi darmi queste informazioni?`,
        bookingRequest: true,
        bookingData: newBookingData,
      }
    }
    
    return {
      response: "Perfetto! Ho tutte le informazioni. Clicca sul pulsante 'Invia Prenotazione' per confermare.",
      bookingRequest: true,
      bookingData: newBookingData,
    }
  }
  
  // Orari
  if (lowerMessage.includes('orari') || lowerMessage.includes('aperto') || lowerMessage.includes('chiuso') || lowerMessage.includes('apertura')) {
    return {
      response: "Siamo aperti da martedì a domenica: 12:00-15:00 per il pranzo e 19:00-23:00 per la cena. Lunedì siamo chiusi.",
    }
  }
  
  // Menu
  if (lowerMessage.includes('menu') || lowerMessage.includes('piatti') || lowerMessage.includes('carta')) {
    return {
      response: "Abbiamo un menù fisso a €35 disponibile tutti i giorni (tranne domenica e festivi) e un'ampia carta con piatti di pesce freschissimo. Il menù fisso include: antipasti, primi, secondo e bevanda. Vuoi sapere qualcosa di specifico?",
    }
  }
  
  // Specific dish questions
  const dishKeywords = ['spaghetti', 'vongole', 'tonno', 'gamberi', 'polpo', 'risotto', 'pasta', 'pesce spada', 'branzino', 'orata']
  const askedDish = dishKeywords.find(dish => lowerMessage.includes(dish))
  if (askedDish) {
    const dishInfo = context.match(new RegExp(`- .*${askedDish}.*: (.+)`, 'i'))
    if (dishInfo) {
      return {
        response: dishInfo[1].substring(0, 200) + (dishInfo[1].length > 200 ? "..." : ""),
      }
    }
  }
  
  // Prezzi
  if (lowerMessage.includes('prezzo') || lowerMessage.includes('costa') || lowerMessage.includes('quanto')) {
    return {
      response: "Il menù fisso è €35. Per i prezzi dei piatti alla carta, ti consiglio di consultare il nostro menù completo sul sito o contattarci direttamente.",
    }
  }
  
  // Indirizzo
  if (lowerMessage.includes('dove') || lowerMessage.includes('indirizzo') || lowerMessage.includes('posizione') || lowerMessage.includes('trov')) {
    return {
      response: `Siamo in ${context.match(/Indirizzo: (.+)/)?.[1] || "Piazzale del Mediterraneo, 6, 90049 Terrasini PA"}. Puoi trovarci facilmente su Google Maps!`,
    }
  }
  
  // Contatti
  if (lowerMessage.includes('telefono') || lowerMessage.includes('chiam') || lowerMessage.includes('contatt')) {
    return {
      response: `Puoi contattarci al ${context.match(/Telefono: (.+)/)?.[1] || "3206380567"} o via WhatsApp. Siamo sempre felici di sentirti!`,
    }
  }
  
  // Specialties
  if (lowerMessage.includes('specialità') || lowerMessage.includes('consigli') || lowerMessage.includes('consiglia')) {
    return {
      response: "Le nostre specialità includono piatti freschissimi di pesce come antipasti di mare, spaghetti alle vongole, grigliate di pesce, risotto ai frutti di mare e molto altro. Tutto preparato con ingredienti freschi del territorio siciliano.",
    }
  }
  
  // Default response
  return {
    response: "Grazie per la tua domanda! Posso aiutarti con informazioni su orari, menu, prenotazioni e molto altro. Cosa vorresti sapere?",
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, bookingData } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Messaggio richiesto' }, { status: 400 })
    }
    
    const siteContent = await getSiteContent()
    const context = generateContext(siteContent)
    
    const result = generateResponse(message, context, bookingData || {})
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { error: 'Errore durante la generazione della risposta' },
      { status: 500 }
    )
  }
}

