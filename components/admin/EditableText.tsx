"use client"

import { useState, useRef, useEffect } from "react"
import { Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditableTextProps {
  value: string
  onSave: (value: string) => void
  className?: string
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  multiline?: boolean
}

export function EditableText({ 
  value, 
  onSave, 
  className, 
  tag = "p",
  multiline = false 
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditValue(value)
  }

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      handleCancel()
    }
  }

  const Tag = tag as any

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              "w-full p-2 border-2 border-primary rounded-lg bg-background",
              className
            )}
            rows={4}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              "w-full p-2 border-2 border-primary rounded-lg bg-background",
              className
            )}
          />
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleSave}
            className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
            title="Salva"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
            title="Annulla"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative group cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      <Tag className={cn("group-hover:outline group-hover:outline-2 group-hover:outline-dashed group-hover:outline-primary", className)}>
        {value}
      </Tag>
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
        <Edit2 className="w-3 h-3" />
        <span>Doppio click per modificare</span>
      </div>
    </div>
  )
}

