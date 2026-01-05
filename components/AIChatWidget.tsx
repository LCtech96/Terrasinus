"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface BookingData {
  name?: string
  phone?: string
  email?: string
  guests?: string
  date?: string
  time?: string
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ciao! Sono l'assistente digitale di Terrasinus. Come posso aiutarti? Posso rispondere a domande su orari, menu, prenotazioni e molto altro!",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData>({})
  const [isCollectingBooking, setIsCollectingBooking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const extractBookingInfo = (text: string): Partial<BookingData> => {
    const info: Partial<BookingData> = {}
    
    // Extract name
    const nameMatch = text.match(/(?:nome|mi chiamo|sono)\s+([A-Za-z\s]+)/i)
    if (nameMatch) info.name = nameMatch[1].trim()
    
    // Extract phone
    const phoneMatch = text.match(/(?:telefono|cellulare|numero)\s*:?\s*(\d{10,})/i)
    if (phoneMatch) info.phone = phoneMatch[1]
    
    // Extract email
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
    if (emailMatch) info.email = emailMatch[1]
    
    // Extract guests
    const guestsMatch = text.match(/(?:persone|ospiti|coperti)\s*:?\s*(\d+)/i)
    if (guestsMatch) info.guests = guestsMatch[1]
    
    // Extract date
    const dateMatch = text.match(/(?:data|giorno)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]?\d{0,4})/i)
    if (dateMatch) info.date = dateMatch[1]
    
    // Extract time
    const timeMatch = text.match(/(?:ora|orario)\s*:?\s*(\d{1,2}:\d{2})/i)
    if (timeMatch) info.time = timeMatch[1]
    
    return info
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    // Extract booking info from user message
    const extractedInfo = extractBookingInfo(userMessage)
    if (extractedInfo.name || extractedInfo.phone || extractedInfo.email) {
      setBookingData((prev) => ({ ...prev, ...extractedInfo }))
      setIsCollectingBooking(true)
    }

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
          bookingData,
        }),
      })

      const data = await response.json()
      
      if (data.bookingRequest) {
        setIsCollectingBooking(true)
      }

      // Update booking data from response
      if (data.bookingData) {
        setBookingData((prev) => ({ ...prev, ...data.bookingData }))
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Mi dispiace, si è verificato un errore. Riprova più tardi.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSubmit = async () => {
    if (!bookingData.name || !bookingData.phone || !bookingData.email || !bookingData.guests || !bookingData.date || !bookingData.time) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Per completare la prenotazione, ho bisogno di tutte le informazioni: nome, telefono, email, numero di ospiti, data e orario.",
        },
      ])
      return
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Perfetto! La tua prenotazione è stata inviata con successo. Ti aspettiamo il ${bookingData.date} alle ${bookingData.time} per ${bookingData.guests} persone. Ti contatteremo presto per confermare!`,
          },
        ])
        setBookingData({})
        setIsCollectingBooking(false)
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Mi dispiace, c'è stato un problema con l'invio della prenotazione. Riprova o contattaci direttamente al " + (process.env.NEXT_PUBLIC_PHONE || "3206380567"),
          },
        ])
      }
    } catch (error) {
      console.error("Booking error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Errore durante l'invio della prenotazione. Riprova più tardi.",
        },
      ])
    }
  }

  const missingFields = () => {
    const missing: string[] = []
    if (!bookingData.name) missing.push("nome")
    if (!bookingData.phone) missing.push("telefono")
    if (!bookingData.email) missing.push("email")
    if (!bookingData.guests) missing.push("numero di ospiti")
    if (!bookingData.date) missing.push("data")
    if (!bookingData.time) missing.push("orario")
    return missing
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center",
          isOpen && "hidden"
        )}
        aria-label="Apri chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 w-96 h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-bold">Assistente Terrasinus</h3>
              <p className="text-xs opacity-90">Sono qui per aiutarti!</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-primary/80 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-black"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap text-black">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            {isCollectingBooking && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                <p className="text-sm font-semibold text-blue-900">
                  Informazioni prenotazione:
                </p>
                <div className="text-xs text-blue-800 space-y-1">
                  {bookingData.name && <p>✓ Nome: {bookingData.name}</p>}
                  {bookingData.phone && <p>✓ Telefono: {bookingData.phone}</p>}
                  {bookingData.email && <p>✓ Email: {bookingData.email}</p>}
                  {bookingData.guests && <p>✓ Ospiti: {bookingData.guests}</p>}
                  {bookingData.date && <p>✓ Data: {bookingData.date}</p>}
                  {bookingData.time && <p>✓ Orario: {bookingData.time}</p>}
                </div>
                {missingFields().length > 0 && (
                  <p className="text-xs text-blue-700">
                    Mancano: {missingFields().join(", ")}
                  </p>
                )}
                {missingFields().length === 0 && (
                  <button
                    onClick={handleBookingSubmit}
                    className="w-full mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-semibold"
                  >
                    Invia Prenotazione
                  </button>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Scrivi un messaggio..."
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

