"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface TagInputProps {
  defaultTags?: string[]
}

export function TagInput({ defaultTags = [] }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultTags)
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !tags.includes(trimmedValue)) {
      setTags([...tags, trimmedValue])
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="h-3 w-3 rounded-full p-0 hover:bg-transparent"
              onClick={() => removeTag(tag)}
            >
              <X className="h-2 w-2" />
              <span className="sr-only">Eliminar {tag}</span>
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Añadir etiqueta (presiona Enter)"
          className="flex-1"
        />
        <Button type="button" variant="secondary" onClick={addTag} disabled={!inputValue.trim()}>
          Añadir
        </Button>
      </div>
    </div>
  )
}
