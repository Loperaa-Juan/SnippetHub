// components/publication-card.tsx
"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Download } from "lucide-react"

interface PublicationCardProps {
  publication: {
    id: String,
    Titulo: String,
    Contenido: String,
    archivo: String,
    fileUrl: String
  }
}

export function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <TooltipProvider>
      <Card className="flex h-full flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-1 text-lg">{publication.Titulo}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-2">
          <div className="text-sm text-muted-foreground">{publication.Contenido}</div>
        </CardContent>
        {publication.fileUrl && (
          <CardFooter>
            <a href={publication.fileUrl.toString()} download>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Descargar archivo
              </Button>
            </a>
          </CardFooter>
        )}
      </Card>
    </TooltipProvider>
  )
}
