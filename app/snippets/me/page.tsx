"use client";

import { useEffect, useState } from "react";
import { Navbar } from "../../../components/navbar";
import { Sidebar } from "../../../components/sidebar";
import { Card } from "@/components/ui/card";
import { Trash, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SnippetInterface {
  id: string;
  Titulo: string;
  snippet: string;
  Lenguaje: string;
  descripcion: string;
}

export default function MisSnippetsPage() {
  const [snippets, setSnippets] = useState<SnippetInterface[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editContenido, setEditContenido] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null); 

  const handleCopiar = async (snippet: SnippetInterface) => {
    try {
      await navigator.clipboard.writeText(snippet.snippet);
      setCopiadoId(snippet.id);

      setTimeout(() => {
        setCopiadoId(null);
      }, 2000);
    } catch (err) {
      console.error("Error al copiar el snippet:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      try {
        const res = await fetch("/api/snippets/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();

        const normalizadas = data
          .map((pub: any) => ({
            ...pub,
            id: pub.Snippetid?.toString(),
          }))
          .filter((pub: any) => pub && pub.id);

        setSnippets(normalizadas);
      } catch (err) {
        console.error("Error al obtener los snippets", err);
      }
    };

    fetchData();
  }, []);


  const handleGuardar = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("Token no encontrado");

    try {
      const res = await fetch(`/api/snippets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Titulo: editTitulo,
          snippet: editContenido,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error al actualizar snippet:", errorText);
        return;
      }

      const actualizado = await res.json();

      setSnippets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...actualizado } : s))
      );

      setEditandoId(null);
    } catch (err) {
      console.error("Error al guardar snippet:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("Token no encontrado");

    try {
      await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnippets((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error al eliminar snippet:", err);
    }
  };

  const handlePublish = async (snippet: SnippetInterface) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    if (!snippet.id || !snippet.Titulo || !snippet.snippet) {
      console.warn("Campos requeridos faltantes al publicar");
      return;
    }

    const formData = new FormData();
    formData.append("Titulo", snippet.Titulo);
    formData.append("Contenido", snippet.descripcion);
    formData.append("SnippetId", snippet.id);

    try {
      const response = await fetch("/api/publicaciones", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Respuesta del servidor:", data);
        throw new Error("Error al publicar el snippet");
      }

      console.log("Publicación exitosa:", data);
      setMensajeExito("Snippet publicado exitosamente");
      setTimeout(() => {
        setMensajeExito(null);
      }, 3000);
    } catch (error) {
      console.error("Error en la publicación:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 space-y-4">
          <h1 className="text-2xl font-bold dark:neon-text">Mis Snippets</h1>

          {/* ✅ Mensaje de éxito al publicar */}
          {mensajeExito && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-sm">
              {mensajeExito}
            </div>
          )}

          {snippets.length === 0 ? (
            <p className="dark:neon-text">No tienes snippets en nuestra plataforma</p>
          ) : (
            <div className="space-y-4">
              {snippets.map((snippet, index) => (
                <Card
                  key={snippet.id ?? `pub-${index}`}
                  className="flex flex-col gap-4 p-6 shadow-md rounded-2xl border border-gray-200"
                >
                  {editandoId === snippet.id ? (
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        className="border p-2 rounded-md"
                        value={editTitulo}
                        onChange={(e) => setEditTitulo(e.target.value)}
                        placeholder="Título"
                      />
                      <textarea
                        className="border p-2 rounded-md"
                        value={editContenido}
                        onChange={(e) => setEditContenido(e.target.value)}
                        placeholder="Código"
                      />
                      <input
                        type="file"
                        accept=".txt,.js,.ts,.py,.java,.c,.cpp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setArchivo(file || null);
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const text = e.target?.result as string;
                              setEditContenido(text);
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          className="dark:neon-text"
                          variant="outline"
                          onClick={() => setEditandoId(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="dark:neon-text"
                          variant="default"
                          onClick={() => handleGuardar(snippet.id)}
                        >
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-bold text-gray-800 ">
                            {snippet.Titulo}
                          </h2>
                          <p className="text-sm text-indigo-600 font-medium">
                            {snippet.Lenguaje}
                          </p>
                          <p className="text-sm text-gray-700 italic">
                            {snippet.descripcion}
                          </p>
                        </div>

                        <pre className="bg-gray-900 text-gray-100 text-sm rounded-lg p-4 overflow-x-auto font-mono">
                          <code>{snippet.snippet}</code>
                        </pre>

                        <div className="flex flex-wrap gap-3 items-center justify-between">
                          {copiadoId === snippet.id && (
                            <span className="text-green-600 text-sm font-semibold">
                              ¡Copiado!
                            </span>
                          )}

                          <div className="flex flex-wrap gap-2 ml-auto">
                            <Button
                              variant="destructive"
                              className="flex items-center gap-2 dark:neon-text"
                              onClick={() => handleDelete(snippet.id)}
                            >
                              <Trash className="h-4 w-4" />
                              Eliminar
                            </Button>

                            <Button
                              variant="default"
                              className="flex items-center gap-2 dark:neon-text"
                              onClick={() => handlePublish(snippet)}
                            >
                              <Upload className="h-4 w-4" />
                              Publicar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
