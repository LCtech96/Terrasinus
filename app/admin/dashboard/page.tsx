"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/Navigation"
import { MediaGallery } from "@/components/MediaGallery"
import { Description } from "@/components/Description"
import { Address } from "@/components/Address"
import { Orari } from "@/components/Orari"
import { Footer } from "@/components/Footer"
import { HeroSection } from "@/components/HeroSection"
import { EditableText } from "@/components/admin/EditableText"
import { EditableImage } from "@/components/admin/EditableImage"
import { LogOut, Save, Plus, Trash2, Image as ImageIcon, Menu } from "lucide-react"
import type { SiteContent } from "@/lib/admin-content"
import Link from "next/link"
import { MenuEditor } from "@/components/admin/MenuEditor"

export default function AdminDashboard() {
  const router = useRouter()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [images, setImages] = useState<Array<{ name: string; path: string; url: string; type?: 'image' | 'video' }>>([])
  const [showImages, setShowImages] = useState(false)

  useEffect(() => {
    checkAuthAndLoad()
    loadImages()
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

  const loadImages = async () => {
    try {
      const response = await fetch("/api/admin/images")
      if (response.ok) {
        const data = await response.json()
        setImages(data.images || [])
      }
    } catch (error) {
      console.error("Error loading images:", error)
    }
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

  const defaultMenuFisso = {
    title: "🌿 Menù Fisso Invernale – €35 🌿",
    description: "Disponibile tutti i giorni, a pranzo e a cena (esclusi la domenica ed i giorni festivi)",
    warning: "⚠️ Il menù fisso è personale e non può essere condiviso o diviso tra più persone.",
    courses: {
      antipasti: ["Insalata di mare", "Cocktail di gamberi", "Arancininetta", "Caponata di pesce"],
      primi: ["Busiate con pesce spada e melanzane", "oppure", "Pacchero al ragù di cernia"],
      secondo: ["Frittura mista"],
      bevanda: ["Acqua", "+ a scelta:", "• 1 calice di vino", "o", "• Coca-Cola 33 cl", "o", "• Birra 33 cl"]
    }
  }

  return (
    <div className="relative">
      {/* Admin Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <span className="font-bold">Admin Dashboard - Modalità Modifica</span>
          {saved && <span className="text-green-300">✓ Salvato!</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-1 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvataggio..." : "Salva"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Esci
          </button>
        </div>
      </div>

      <main className="min-h-screen pt-12">
        {/* Navigation Bar - positioned below admin toolbar */}
        <div className="pt-12 md:pt-16">
          <Navigation />
        </div>
        
        {/* Hero Section with Cover and Profile */}
        <div className="pt-0 md:pt-16">
          <div className="relative w-full">
            {/* Cover Image - Editable */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
              <EditableImage
                src={content.coverImage}
                alt="Immagine di copertina"
                onSave={(src) => updateContent("coverImage", src)}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
            </div>

            {/* Profile Image Container - Editable */}
            <div className="container mx-auto px-4">
              <div className="relative -mt-20 md:-mt-24 flex justify-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-lg">
                  <EditableImage
                    src={content.profileImage}
                    alt="Immagine profilo"
                    onSave={(src) => updateContent("profileImage", src)}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Title and Subtitle - Editable */}
          <div className="container mx-auto px-4 mt-6 text-center space-y-2">
            <EditableText
              value={content.subtitle || "Tra i faraglioni e la vista del mare"}
              onSave={(value) => updateContent("subtitle", value)}
              tag="h2"
              className="text-lg md:text-xl text-muted-foreground"
            />
            <EditableText
              value={content.title}
              onSave={(value) => updateContent("title", value)}
              tag="h1"
              className="text-3xl md:text-5xl font-bold"
            />
          </div>
        </div>

        {/* Media Gallery Section */}
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex items-center justify-center gap-4 mb-12 md:mb-16">
            <EditableText
              value="Le Nostre Specialità"
              onSave={() => {}}
              tag="h2"
              className="text-3xl md:text-4xl font-bold text-center"
            />
            <button
              onClick={addGalleryItem}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              title="Aggiungi elemento"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-16 md:space-y-24">
            {content.galleryMedia.map((item, index) => {
              const isEven = index % 2 === 0
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12 group`}
                >
                  <button
                    onClick={() => removeGalleryItem(item.id)}
                    className="absolute top-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    title="Rimuovi elemento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden">
                    <EditableImage
                      src={item.src}
                      alt={item.alt}
                      onSave={(src) => updateGalleryItem(item.id, "src", src)}
                      onDelete={() => removeGalleryItem(item.id)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                    <EditableText
                      value={item.alt}
                      onSave={(value) => updateGalleryItem(item.id, "alt", value)}
                      tag="h3"
                      className="text-2xl md:text-3xl font-bold"
                    />
                    <EditableText
                      value={item.description}
                      onSave={(value) => updateGalleryItem(item.id, "description", value)}
                      tag="p"
                      className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                      multiline
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Description Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <EditableText
              value={content.description || ""}
              onSave={(value) => updateContent("description", value)}
              tag="p"
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              multiline
            />
            <EditableText
              value={content.description2 || ""}
              onSave={(value) => updateContent("description2", value)}
              tag="p"
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              multiline
            />
          </div>
        </div>

        {/* Orari Section */}
        <Orari />

        {/* Address Section */}
        <div className="container mx-auto px-4 py-8 text-center">
          <EditableText
            value={content.address}
            onSave={(value) => updateContent("address", value)}
            tag="p"
            className="text-muted-foreground"
          />
        </div>

        {/* Admin Sections */}
        <div className="container mx-auto px-4 py-12 space-y-8">
          <div className="border-t border-border pt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Gestione Avanzata</h2>
            
            {/* Images Gallery Section */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Immagini e Video Disponibili</h3>
                  <span className="text-sm text-muted-foreground">
                    ({images.length} totali)
                  </span>
                </div>
                <button
                  onClick={() => setShowImages(!showImages)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {showImages ? "Nascondi" : "Mostra"} Tutte
                </button>
              </div>
              {showImages && (
                <div className="space-y-4">
                  <div className="flex gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-600"></div>
                      <span>Usata nella gallery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-500 rounded border-2 border-gray-600"></div>
                      <span>Non usata</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((img) => {
                      const isUsed = content?.galleryMedia?.some(
                        item => item.src === img.path || item.src === img.url
                      ) || false
                      return (
                        <div
                          key={img.name}
                          className={`relative group aspect-square border-2 rounded-lg overflow-hidden ${
                            isUsed 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-border'
                          }`}
                        >
                          {img.type === 'video' ? (
                            <video
                              src={img.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {/* Video indicator */}
                          {img.type === 'video' && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              ▶
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                            <p className="text-white text-xs text-center break-words font-semibold">{img.name}</p>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {img.type === 'video' && (
                                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                  Video
                                </span>
                              )}
                              {isUsed && (
                                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                  In uso
                                </span>
                              )}
                              {!isUsed && (
                                <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                                  Disponibile
                                </span>
                              )}
                            </div>
                          </div>
                          {isUsed && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {images.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Nessuna immagine trovata nella cartella public
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Menu Editor Section - Always visible */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Menu className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Editor Menù</h3>
                </div>
                <Link
                  href="/menu"
                  target="_blank"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Vedi Menù Pubblico
                </Link>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Modifica il contenuto del menù. Le modifiche verranno salvate quando clicchi su &quot;Salva&quot; nella toolbar.
                </p>
                <MenuEditor
                    menuFisso={content.menuContent?.menuFisso || defaultMenuFisso}
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
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}

