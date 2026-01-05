"use client"

import { useState, useRef } from "react"
import { Upload, X, Crop } from "lucide-react"
import { ImageCropper } from "./ImageCropper"

interface MenuItemImageUploaderProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  onImageRemove: () => void
}

export function MenuItemImageUploader({
  currentImage,
  onImageChange,
  onImageRemove,
}: MenuItemImageUploaderProps) {
  const [showCropper, setShowCropper] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setSelectedFile(result)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCrop = async (croppedImageUrl: string) => {
    // Convert blob URL to file and upload
    const response = await fetch(croppedImageUrl)
    const blob = await response.blob()
    const file = new File([blob], "cropped-image.png", { type: "image/png" })

    const formData = new FormData()
    formData.append("file", file)

    try {
      const uploadResponse = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await uploadResponse.json()

      if (!uploadResponse.ok) {
        alert(data.error || "Errore durante il caricamento")
        return
      }

      onImageChange(data.url)
      setShowCropper(false)
      setSelectedFile(null)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Errore durante il caricamento del file")
    }
  }

  return (
    <>
      <div className="space-y-2">
        {currentImage ? (
          <div className="relative">
            <img
              src={currentImage}
              alt="Piatto"
              className="w-full h-48 object-cover rounded-lg border border-border"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => {
                  fileInputRef.current?.click()
                }}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                title="Cambia immagine"
              >
                <Crop className="w-4 h-4" />
              </button>
              <button
                onClick={onImageRemove}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                title="Rimuovi immagine"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-4">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Carica Immagine
            </button>
            <p className="text-sm text-muted-foreground text-center">
              Puoi ritagliare l&apos;immagine dopo il caricamento
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {showCropper && selectedFile && (
        <ImageCropper
          imageSrc={selectedFile}
          onCrop={handleCrop}
          onCancel={() => {
            setShowCropper(false)
            setSelectedFile(null)
          }}
        />
      )}
    </>
  )
}

