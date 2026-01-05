"use client"

import { useState, useRef, useEffect } from "react"
import { X, Check, Move } from "lucide-react"

interface ImageCropperProps {
  imageSrc: string
  onCrop: (croppedImageUrl: string) => void
  onCancel: () => void
  aspectRatio?: "horizontal" | "vertical" | "square" | null
}

export function ImageCropper({ imageSrc, onCrop, onCancel, aspectRatio = null }: ImageCropperProps) {
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const containerWidth = containerRef.current?.clientWidth || 800
      const containerHeight = containerRef.current?.clientHeight || 600
      
      const scale = Math.min(containerWidth / img.width, containerHeight / img.height, 1)
      const width = img.width * scale
      const height = img.height * scale
      
      setImageSize({ width, height })
      
      // Set initial crop area
      const initialSize = Math.min(width, height) * 0.6
      let cropWidth = initialSize
      let cropHeight = initialSize
      
      if (aspectRatio === "horizontal") {
        cropWidth = initialSize * 1.5
        cropHeight = initialSize
      } else if (aspectRatio === "vertical") {
        cropWidth = initialSize
        cropHeight = initialSize * 1.5
      }
      
      setCropArea({
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight,
      })
    }
    img.src = imageSrc
  }, [imageSrc, aspectRatio])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      setIsDragging(true)
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    let x = e.clientX - rect.left - dragStart.x
    let y = e.clientY - rect.top - dragStart.y
    
    // Constrain to image bounds
    x = Math.max(0, Math.min(x, imageSize.width - cropArea.width))
    y = Math.max(0, Math.min(y, imageSize.height - cropArea.height))
    
    setCropArea(prev => ({ ...prev, x, y }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleResize = (direction: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startCrop = { ...cropArea }
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const deltaX = (moveEvent.clientX - startX) * (imageSize.width / rect.width)
      const deltaY = (moveEvent.clientY - startY) * (imageSize.height / rect.height)
      
      let newCrop = { ...startCrop }
      
      if (direction.includes("right")) {
        newCrop.width = Math.max(50, startCrop.width + deltaX)
        newCrop.width = Math.min(newCrop.width, imageSize.width - newCrop.x)
      }
      if (direction.includes("left")) {
        const newWidth = Math.max(50, startCrop.width - deltaX)
        const newX = Math.max(0, startCrop.x + deltaX)
        newCrop.width = newWidth
        newCrop.x = newX
      }
      if (direction.includes("bottom")) {
        newCrop.height = Math.max(50, startCrop.height + deltaY)
        newCrop.height = Math.min(newCrop.height, imageSize.height - newCrop.y)
      }
      if (direction.includes("top")) {
        const newHeight = Math.max(50, startCrop.height - deltaY)
        const newY = Math.max(0, startCrop.y + deltaY)
        newCrop.height = newHeight
        newCrop.y = newY
      }
      
      // Maintain aspect ratio if specified
      if (aspectRatio === "horizontal") {
        newCrop.height = newCrop.width / 1.5
      } else if (aspectRatio === "vertical") {
        newCrop.height = newCrop.width * 1.5
      } else if (aspectRatio === "square") {
        newCrop.height = newCrop.width
      }
      
      setCropArea(newCrop)
    }
    
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
    
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const handleCrop = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Calculate scale factor
      const scaleX = img.width / imageSize.width
      const scaleY = img.height / imageSize.height
      
      canvas.width = cropArea.width * scaleX
      canvas.height = cropArea.height * scaleY
      
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      )
      
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        onCrop(url)
      }, "image/png")
    }
    img.src = imageSrc
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-black">Ritaglia Immagine</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-muted rounded"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
        
        <div
          ref={containerRef}
          className="relative border-2 border-border rounded-lg overflow-hidden bg-black/20"
          style={{ minHeight: "400px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop"
            className="max-w-full h-auto"
            style={{ maxHeight: "600px" }}
            draggable={false}
          />
          
          {/* Crop overlay */}
          <div
            className="absolute border-2 border-primary bg-primary/20 cursor-move"
            style={{
              left: `${cropArea.x}px`,
              top: `${cropArea.y}px`,
              width: `${cropArea.width}px`,
              height: `${cropArea.height}px`,
            }}
          >
            {/* Resize handles */}
            <div
              className="absolute -top-1 -left-1 w-4 h-4 bg-primary border-2 border-white rounded cursor-nwse-resize"
              onMouseDown={(e) => handleResize("top-left", e)}
            />
            <div
              className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded cursor-nesw-resize"
              onMouseDown={(e) => handleResize("top-right", e)}
            />
            <div
              className="absolute -bottom-1 -left-1 w-4 h-4 bg-primary border-2 border-white rounded cursor-nesw-resize"
              onMouseDown={(e) => handleResize("bottom-left", e)}
            />
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded cursor-nwse-resize"
              onMouseDown={(e) => handleResize("bottom-right", e)}
            />
          </div>
        </div>
        
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleCrop}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Check className="w-4 h-4" />
            Conferma Ritaglio
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-border rounded-lg hover:bg-muted text-black"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  )
}

