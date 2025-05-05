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

export default function NewPublicationPage() {
  const [titulo, setTitulo] = useState("");
  const [lenguaje, setLenguaje] = useState("javascript");
  const [contenido, setContenido] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [fileUploaderKey, setFileUploaderKey] = useState(0);
  const [snippetIdManual, setSnippetIdManual] = useState("");

  const handleGuardar = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    if (!snippetIdManual.trim()) {
      console.error("El ID del snippet es obligatorio");
      return;
    }

    const formData = new FormData();
    formData.append("Titulo", titulo);
    formData.append("Contenido", contenido);
    formData.append("SnippetId", snippetIdManual);

    const res = await fetch("http://localhost:8000/publicaciones", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error al crear la publicación:", errorText);
      return;
    }

    setMensajeExito(true);
    setTitulo("");
    setContenido(""); // ✅ Corrección aquí
    setSnippetIdManual("");
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
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">
                Nuevo Snippet
              </h1>
            </div>
            <Button className="gap-1" onClick={handleGuardar}>
              <Save className="h-4 w-4" />
              <span>Publicar Snippet</span>
            </Button>
          </div>

          {mensajeExito && (
            <div className="mb-6 rounded-md border border-green-300 bg-green-100 p-4 text-green-800">
              Snippet subido exitosamente
            </div>
          )}

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ej: Función para ordenar array"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="content"
                placeholder="Danos una breve descripción de tu publicación"
                rows={3}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)} // ✅ Corrección aquí
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snippet-id">ID del Snippet (opcional)</Label>
              <Input
                id="snippet-id"
                placeholder="Pega el ID de tu snippet aquí"
                value={snippetIdManual}
                onChange={(e) => setSnippetIdManual(e.target.value)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
