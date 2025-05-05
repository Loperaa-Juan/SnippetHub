"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Publicacion {
  id: string;
  titulo: string;
  contenido: string;
  archivo: string;
}

export default function PublicationsPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [comentarioActivo, setComentarioActivo] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<{ [id: string]: string }>({});
  const [comentarioExitosoId, setComentarioExitosoId] = useState<string | null>(null);
  const [comentariosCargados, setComentariosCargados] = useState<{ [pubId: string]: any[] }>({});
  const [comentariosVisiblesId, setComentariosVisiblesId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token no encontrado");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/publications/user/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Error al obtener publicaciones");
        }

        const data = await res.json();
        const normalizadas = data.map((pub: any) => ({
          ...pub,
          id: pub.id.toString(),
        }));

        setPublicaciones(normalizadas);
      } catch (err: any) {
        setError(err.message || "Error inesperado al obtener publicaciones");
        console.error("Error al obtener publicaciones:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchData();
  }, [username]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 space-y-4">
          <h1 className="text-2xl font-bold">Publicaciones de {username}</h1>

          {loading && <p className="text-gray-500">Cargando publicaciones...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && publicaciones.length === 0 && (
            <p className="text-gray-500">No hay publicaciones disponibles.</p>
          )}

          <div className="space-y-4">
            {publicaciones.map((pub) => (
              <Card key={pub.id} className="flex flex-col gap-4 p-6 shadow-md rounded-2xl border border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{pub.titulo}</h2>
                  <p className="text-sm text-gray-700 italic">{pub.contenido}</p>
                </div>

                <pre className="bg-gray-900 text-gray-100 text-sm rounded-lg p-4 overflow-x-auto font-mono">
                  <code>{atob(pub.archivo)}</code>
                </pre>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(atob(pub.archivo));
                        setCopiadoId(pub.id);
                        setTimeout(() => setCopiadoId(null), 1000);
                      } catch (error) {
                        console.error("Error al copiar:", error);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={() => setComentarioActivo(pub.id === comentarioActivo ? null : pub.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Comentar
                  </Button>

                  <Button
                    variant="default"
                    className="flex items-center gap-2"
                    onClick={async () => {
                      if (comentariosVisiblesId === pub.id) {
                        setComentariosVisiblesId(null); // Ocultar si ya está visible
                        return;
                      }

                      try {
                        const token = localStorage.getItem("token");
                        if (!token) {
                          setError("Token no encontrado");
                          return;
                        }

                        const res = await fetch(`http://localhost:8000/comentarios/${pub.id}`, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });

                        if (!res.ok) {
                          const errorData = await res.json();
                          throw errorData;
                        }

                        const data = await res.json();
                        setComentariosCargados((prev) => ({ ...prev, [pub.id]: data }));
                        setComentariosVisiblesId(pub.id);
                      } catch (err: any) {
                        console.error("Error al cargar comentarios:", err);
                        let mensaje = "Error desconocido";

                        if (Array.isArray(err?.detail)) {
                          mensaje = err.detail.map((e: any) => e.msg).join(" | ");
                        } else if (typeof err?.detail === "string") {
                          mensaje = err.detail;
                        } else if (err?.message) {
                          mensaje = err.message;
                        } else {
                          mensaje = JSON.stringify(err);
                        }

                        setError(mensaje);
                      }
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    {comentariosVisiblesId === pub.id ? "Ocultar comentarios" : "Ver comentarios"}
                  </Button>

                  {copiadoId === pub.id && (
                    <span className="text-green-600 text-sm">¡Copiado!</span>
                  )}
                </div>

                {comentariosVisiblesId === pub.id && (
                  <div className="mt-4 w-full space-y-3 p-4 bg-gray-50 rounded-xl shadow-inner border-t">
                    {comentariosCargados[pub.id]?.length > 0 ? (
                      comentariosCargados[pub.id].map((comentario, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-1 border-b last:border-b-0 pb-3"
                        >
                          <p className="text-sm text-gray-700">{comentario.comentario}</p>
                          <span className="text-xs text-blue-500 font-medium">
                            — {comentario.usuario}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic text-center">
                        No hay comentarios disponibles.
                      </p>
                    )}
                  </div>
                )}

                {comentarioActivo === pub.id && (
                  <div className="mt-2 space-y-2">
                    <Input
                      placeholder="Escribe tu comentario..."
                      value={comentarios[pub.id] || ""}
                      onChange={(e) =>
                        setComentarios((prev) => ({
                          ...prev,
                          [pub.id]: e.target.value,
                        }))
                      }
                    />

                    <Button
                      onClick={async () => {
                        const token = localStorage.getItem("token");
                        if (!token) {
                          setError("Token no encontrado");
                          return;
                        }

                        const comentarioTexto = comentarios[pub.id]?.trim();
                        if (!comentarioTexto) {
                          setError("El comentario no puede estar vacío.");
                          return;
                        }

                        const formData = new FormData();
                        formData.append("Publicacionid", pub.id);
                        formData.append("comentario", comentarioTexto);
                        try {
                          const res = await fetch("http://localhost:8000/create/comentario", {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                          });

                          if (!res.ok) {
                            const errorData = await res.json();
                            throw errorData;
                          }

                          const data = await res.json();
                          console.log("Comentario enviado correctamente:", data);

                          setComentarios((prev) => ({ ...prev, [pub.id]: "" }));
                          setComentarioActivo(null);
                          setComentarioExitosoId(pub.id);
                          setTimeout(() => setComentarioExitosoId(null), 2000);
                        } catch (err: any) {
                          let mensaje = "Error desconocido";

                          if (Array.isArray(err?.detail)) {
                            mensaje = err.detail.map((e: any) => e.msg).join(" | ");
                          } else if (typeof err?.detail === "string") {
                            mensaje = err.detail;
                          } else if (err?.message) {
                            mensaje = err.message;
                          } else {
                            mensaje = JSON.stringify(err);
                          }

                          console.error("Error al enviar comentario:", mensaje);
                          setError(mensaje);
                        }
                      }}
                    >
                      Enviar
                    </Button>

                    {comentarioExitosoId === pub.id && (
                      <p className="text-green-600 text-sm">¡Comentario enviado!</p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
