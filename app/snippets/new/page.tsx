"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { FileDropUploader } from "@/components/upload_snippet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewSnippetPage() {
  const [titulo, setTitulo] = useState("");
  const [lenguaje, setLenguaje] = useState("javascript");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [fileUploaderKey, setFileUploaderKey] = useState(0); // 🔑

  const handleFileChange = (file: File) => {
    if (!file) {
      console.error("No se ha seleccionado ningún archivo");
      return;
    }
    setArchivo(file);
  };

  const handleGuardar = async () => {
    if (!archivo) {
      console.error("No se ha seleccionado ningún archivo");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    const formData = new FormData();
    formData.append("Titulo", titulo);
    formData.append("Lenguaje", lenguaje);
    formData.append("file", archivo);
    formData.append("descripcion", descripcion);

    const res = await fetch("/api/create/snippets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error al crear el snippet:", errorText);
      return;
    }

    setMensajeExito(true);
    setTitulo("");
    setLenguaje("javascript");
    setDescripcion("");
    setArchivo(null);
    setFileUploaderKey((prev) => prev + 1); 

    setTimeout(() => setMensajeExito(false), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button className="dark:neon-text" variant="ghost" size="icon">
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

          {mensajeExito && (
            <div className="mb-6 rounded-md border border-green-300 bg-green-100 p-4 text-green-800">
              Snippet subido exitosamente
            </div>
          )}

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
                <div className="flex items-center border-b px-3 py-2">
                  <Select value={lenguaje} onValueChange={setLenguaje}>
                    <SelectTrigger className="w-40 border-0 bg-transparent p-0 shadow-none focus:ring-0 dark:neon-text">
                      <SelectValue placeholder="Seleccionar lenguaje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="dark:neon-text" value="javascript">JavaScript</SelectItem>
                      <SelectItem className="dark:neon-text" value="typescript">TypeScript</SelectItem>
                      <SelectItem className="dark:neon-text" value="html">HTML</SelectItem>
                      <SelectItem className="dark:neon-text" value="css">CSS</SelectItem>
                      <SelectItem className="dark:neon-text" value="jsx">JSX</SelectItem>
                      <SelectItem className="dark:neon-text" value="tsx">TSX</SelectItem>
                      <SelectItem className="dark:neon-text" value="python">Python</SelectItem>
                      <SelectItem className="dark:neon-text" value="java">Java</SelectItem>
                      <SelectItem className="dark:neon-text" value="csharp">C#</SelectItem>
                      <SelectItem className="dark:neon-text" value="php">PHP</SelectItem>
                      <SelectItem className="dark:neon-text" value="ruby">Ruby</SelectItem>
                      <SelectItem className="dark:neon-text" value="go">Go</SelectItem>
                      <SelectItem className="dark:neon-text" value="rust">Rust</SelectItem>
                      <SelectItem className="dark:neon-text" value="sql">SQL</SelectItem>
                      <SelectItem className="dark:neon-text" value="json">JSON</SelectItem>
                      <SelectItem className="dark:neon-text" value="markdown">Markdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FileDropUploader
                  key={fileUploaderKey} 
                  onDrop={handleFileChange}
                />
                {archivo && (
                  <p className="text-sm text-gray-500 px-3 py-1">
                    Archivo cargado: <span className="font-medium">{archivo.name}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="dark:neon-text" htmlFor="description">Descripción</Label>
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
  );
}