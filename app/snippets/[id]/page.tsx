"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { CodeEditor } from "@/components/upload_snippet"
import { TagInput } from "@/components/tag-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Save, Trash2 } from "lucide-react"

interface Snippet {
  id: string
  title: string
  description: string
  code: string
  language: string
  category: string
  tags: string[]
}

export default function EditSnippetPage() {
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetch(`/api/snippets/${id}`)
        .then(res => res.json())
        .then(data => setSnippet(data))
        .catch(err => console.error("Error al cargar el snippet", err))
    }
  }, [id])

  if (!snippet) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando snippet...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">Editar Snippet</h1>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. El snippet será eliminado permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button className="gap-1">
                <Save className="h-4 w-4" />
                <span>Guardar Cambios</span>
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" defaultValue={snippet.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code-editor">Código</Label>
              <div className="rounded-md border">
                <div className="flex items-center border-b px-3 py-2">
                  <Select defaultValue={snippet.language}>
                    <SelectTrigger className="w-40 border-0 bg-transparent p-0 shadow-none focus:ring-0">
                      <SelectValue placeholder="Seleccionar lenguaje" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "javascript", "typescript", "html", "css", "jsx", "tsx",
                        "python", "java", "csharp", "php", "ruby", "go", "rust", "sql", "json", "markdown"
                      ].map(lang => (
                        <SelectItem key={lang} value={lang}>
                          {lang.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <CodeEditor defaultValue={snippet.code} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" defaultValue={snippet.description} rows={3} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tags">Etiquetas</Label>
                <TagInput defaultTags={snippet.tags} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select defaultValue={snippet.category}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "frontend", "backend", "database", "devops", "utils",
                      "react", "vue", "angular", "node", "python", "algorithms"
                    ].map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
