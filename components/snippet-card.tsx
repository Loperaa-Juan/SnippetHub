"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface Snippet {
  id: string
  title: string
  description: string
  code: string
  language: string
  category: string
  tags: string[]
}

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error al copiar:", error)
    }
  }

  return (
    <div className="relative p-4 border rounded-lg shadow-md bg-white dark:bg-zinc-900">
      <h3 className="text-lg font-semibold mb-1">{snippet.title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">{snippet.description}</p>
      
      <pre className="relative text-sm  text-black p-3 rounded overflow-auto whitespace-pre-wrap max-h-60">
        <code className="dark:neon-text">{snippet.code}</code>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="absolute top-2 right-2 dark:neon-text"
          title="Copiar al portapapeles"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </Button>
      </pre>
    </div>
  )
}
