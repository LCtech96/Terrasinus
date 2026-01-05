"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Save, Image as ImageIcon, FileText, UtensilsCrossed } from "lucide-react"
import type { SiteContent } from "@/lib/admin-content"
import { EditableText } from "@/components/admin/EditableText"
import { EditableImage } from "@/components/admin/EditableImage"
import { MenuEditor } from "@/components/admin/MenuEditor"
import { Plus, Trash2 } from "lucide-react"

type ActiveSection = "photos" | "texts" | "menu" | null

export default function AdminDashboard() {
  const router = useRouter()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)

  useEffect(() => {
    checkAuthAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuthAndLoad = async () => {
    try {
      const response = await fetch("/api/admin/content")
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin")
          return
        }
        throw new Error("Errore nel caricamento dei contenuti")
      }
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error("Error loading content:", error)
      alert("Errore nel caricamento dei contenuti")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      })

      if (!response.ok) {
        throw new Error("Errore nel salvataggio")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Errore nel salvataggio dei contenuti")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateContent = (key: keyof SiteContent, value: any) => {
    if (!content) return
    setContent({ ...content, [key]: value })
  }

  const updateGalleryItem = (id: number, field: string, value: any) => {
    if (!content) return
    const updatedGallery = content.galleryMedia.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    )
    setContent({ ...content, galleryMedia: updatedGallery })
  }

  const removeGalleryItem = (id: number) => {
    if (!content) return
    const updatedGallery = content.galleryMedia.filter((item) => item.id !== id)
    setContent({ ...content, galleryMedia: updatedGallery })
  }

  const addGalleryItem = () => {
    if (!content) return
    const newId = Math.max(...content.galleryMedia.map((item) => item.id), 0) + 1
    const newItem = {
      id: newId,
      src: "/placeholder.png",
      alt: "Nuovo elemento",
      description: "Descrizione da modificare",
      type: "image" as const,
    }
    setContent({ ...content, galleryMedia: [...content.galleryMedia, newItem] })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Caricamento...</div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Errore nel caricamento dei contenuti</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">Admin Dashboard</span>
          {saved && <span className="text-green-300">✓ Salvato!</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvataggio..." : "Salva"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Esci
          </button>
        </div>
      </div>

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => setActiveSection(activeSection === "photos" ? null : "photos")}
              className={`p-6 rounded-lg border-2 transition-all ${
                activeSection === "photos"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${activeSection === "photos" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold">Gestione Foto</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Modifica le foto della home page: copertina, profilo e gallery
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveSection(activeSection === "texts" ? null : "texts")}
              className={`p-6 rounded-lg border-2 transition-all ${
                activeSection === "texts"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${activeSection === "texts" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <FileText className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold">Gestione Testi</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Modifica i testi della home page: titolo, sottotitolo, descrizioni
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveSection(activeSection === "menu" ? null : "menu")}
              className={`p-6 rounded-lg border-2 transition-all ${
                activeSection === "menu"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${activeSection === "menu" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold">Gestione Menu</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Modifica i piatti: nome, prezzo, ingredienti, aggiungi o rimuovi
                </p>
              </div>
            </button>
          </div>

          {/* Photos Section */}
          {activeSection === "photos" && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h3 className="text-2xl font-bold">Gestione Foto</h3>
              
              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Immagine di Copertina</label>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                  <EditableImage
                    src={content.coverImage}
                    alt="Immagine di copertina"
                    onSave={(src) => updateContent("coverImage", src)}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Immagine Profilo</label>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-border mx-auto">
                  <EditableImage
                    src={content.profileImage}
                    alt="Immagine profilo"
                    onSave={(src) => updateContent("profileImage", src)}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Gallery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold">Gallery Immagini</label>
                  <button
                    onClick={addGalleryItem}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Aggiungi Immagine
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.galleryMedia.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                        <EditableImage
                          src={item.src}
                          alt={item.alt}
                          onSave={(src) => updateGalleryItem(item.id, "src", src)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <EditableText
                        value={item.alt}
                        onSave={(value) => updateGalleryItem(item.id, "alt", value)}
                        tag="h4"
                        className="font-semibold"
                      />
                      <EditableText
                        value={item.description}
                        onSave={(value) => updateGalleryItem(item.id, "description", value)}
                        tag="p"
                        className="text-sm text-muted-foreground"
                        multiline
                      />
                      <button
                        onClick={() => removeGalleryItem(item.id)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Rimuovi
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Texts Section */}
          {activeSection === "texts" && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h3 className="text-2xl font-bold">Gestione Testi</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Titolo</label>
                  <EditableText
                    value={content.title}
                    onSave={(value) => updateContent("title", value)}
                    tag="h1"
                    className="text-3xl font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Sottotitolo</label>
                  <EditableText
                    value={content.subtitle || ""}
                    onSave={(value) => updateContent("subtitle", value)}
                    tag="h2"
                    className="text-xl text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Descrizione</label>
                  <EditableText
                    value={content.description || ""}
                    onSave={(value) => updateContent("description", value)}
                    tag="p"
                    className="text-muted-foreground"
                    multiline
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Descrizione 2</label>
                  <EditableText
                    value={content.description2 || ""}
                    onSave={(value) => updateContent("description2", value)}
                    tag="p"
                    className="text-muted-foreground"
                    multiline
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Indirizzo</label>
                  <EditableText
                    value={content.address || ""}
                    onSave={(value) => updateContent("address", value)}
                    tag="p"
                    className="text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Menu Section */}
          {activeSection === "menu" && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h3 className="text-2xl font-bold">Gestione Menu</h3>
              <MenuEditor
                menuFisso={content.menuContent?.menuFisso || {
                  title: "🌿 Menù Fisso Invernale – €35 🌿",
                  description: "Disponibile tutti i giorni, a pranzo e a cena (esclusi la domenica ed i giorni festivi)",
                  warning: "⚠️ Il menù fisso è personale e non può essere condiviso o diviso tra più persone.",
                  courses: {
                    antipasti: ["Insalata di mare", "Cocktail di gamberi", "Arancininetta", "Caponata di pesce"],
                    primi: ["Busiate con pesce spada e melanzane", "oppure", "Pacchero al ragù di cernia"],
                    secondo: ["Frittura mista"],
                    bevanda: ["Acqua", "+ a scelta:", "• 1 calice di vino", "o", "• Coca-Cola 33 cl", "o", "• Birra 33 cl"]
                  }
                }}
                menuSections={content.menuContent?.menuSections || []}
                onMenuFissoChange={(menuFisso) => {
                  if (!content) return
                  setContent({
                    ...content,
                    menuContent: { ...(content.menuContent || {}), menuFisso }
                  })
                }}
                onMenuSectionsChange={(menuSections) => {
                  if (!content) return
                  setContent({
                    ...content,
                    menuContent: { ...(content.menuContent || {}), menuSections }
                  })
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
