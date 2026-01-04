"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Edit2, Upload, Trash2, X } from "lucide-react"

interface EditableImageProps {
  src: string
  alt: string
  onSave: (src: string) => void
  onDelete?: () => void
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

export function EditableImage({
  src,
  alt,
  onSave,
  onDelete,
  width,
  height,
  className,
  fill = false,
}: EditableImageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Errore durante il caricamento")
        return
      }

      onSave(data.url)
      setIsEditing(false)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Errore durante il caricamento del file")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async () => {
    if (!onDelete || !confirm("Sei sicuro di voler eliminare questa immagine?")) {
      return
    }

    const fileName = src.replace(/^\//, "")
    try {
      const response = await fetch("/api/admin/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || "Errore durante l'eliminazione")
        return
      }

      onDelete()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Errore durante l'eliminazione del file")
    }
  }

  if (isEditing) {
    return (
      <div className="relative border-2 border-dashed border-primary rounded-lg p-4 min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 w-full">
          {src && !src.includes("placeholder") && (
            <div className="relative w-32 h-32">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover rounded"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Caricamento..." : "Carica nuova immagine"}
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Elimina
              </button>
            )}
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative group cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      {fill ? (
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            fill
            className={className}
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
        <div className="bg-white text-black px-4 py-2 rounded flex items-center gap-2">
          <Edit2 className="w-4 h-4" />
          <span className="text-sm">Doppio click per modificare</span>
        </div>
      </div>
    </div>
  )
}

