"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useState } from "react"

interface SnippetCardProps {
  snippet: {
    id: string
    title: string
    description: string
    code: string
    language: string
    category: string
    tags: string[]
  }
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <TooltipProvider>
      <Card className="flex h-full flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-1 text-lg">{snippet.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={toggleFavorite}
            >
              <span className="sr-only">Favorito</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-2">
          <div className="line-clamp-2 text-sm text-muted-foreground">{snippet.description}</div>
          <div className="mt-4 rounded-md bg-muted p-2">
            <pre className="line-clamp-3 overflow-x-auto text-xs">
              <code>{snippet.code}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
