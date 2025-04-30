"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { FileDropUploader } from "@/components/upload_snippet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"



export default function NewSnippetPage() {
  const [titulo, setTitulo] = useState("")
  const [lenguaje, setLenguaje] = useState("javascript")
  const [descripcion, setDescripcion] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)

  const handleFileChange = (file: File) => {
    setArchivo(file)
  }

  const handleGuardar = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("Token no encontrado")
      return
    }

    if (!titulo || !lenguaje || !descripcion || !archivo) {
      console.error("Faltan datos en el formulario")
      return
    }

    const formData = new FormData()
    formData.append("Titulo", titulo)
    formData.append("Lenguaje", lenguaje)
    formData.append("Descripcion", descripcion)
    formData.append("file", archivo)

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Error al crear el snippet:", errorText)
        return
      }

      // Opcional: Manejar la respuesta si es necesario
      const createdSnippet = await res.json()
      console.log("Snippet creado:", createdSnippet)

      // Opcional: Redirigir o actualizar el estado
      // Ejemplo: Si rediriges a otra página
      // router.push("/snippets")

    } catch (err) {
      console.error("Error de red al crear el snippet:", err)
    }
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
                <Button variant="ghost" size="icon" className = "dark:neon-text">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight dark:neon-text">Nuevo Snippet</h1>
            </div>
            <Button className="gap-1 dark:neon-text" onClick={handleGuardar}>
              <Save className="h-4 w-4" />
              <span>Guardar Snippet</span>
            </Button>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2 dark:neon-text">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ej: Función para ordenar array"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="rounded-md border">
                <div className="flex items-center border-b px-3 py-2 dark:neon-text">
                  <Select
                    defaultValue={lenguaje}
                    onValueChange={setLenguaje}
                  >
                    <SelectTrigger className="w-40 border-0 bg-transparent p-0 shadow-none focus:ring-0">
                      <SelectValue placeholder="Seleccionar lenguaje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="jsx">JSX</SelectItem>
                      <SelectItem value="tsx">TSX</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="php">PHP</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FileDropUploader onDrop={handleFileChange} />
              </div>
            </div>

            <div className="space-y-2 dark:neon-text">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe para qué sirve este snippet y cómo utilizarlo"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
