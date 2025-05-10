"use client"

import { useEffect, useState } from "react"
import { Copy, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sidebar } from "../../../components/sidebar"
import { Navbar } from "@/components/navbar"

interface Publicacion {
  id: string
  titulo: string
  contenido: string
  archivo: string
}

export default function MisPublicacionesPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editTitulo, setEditTitulo] = useState("")
  const [editContenido, setEditContenido] = useState("")
  const [editArchivo, setEditArchivo] = useState<File | null>(null)
  const [archivoActual, setArchivoActual] = useState<string | null>(null)
  const [copiadoId, setCopiadoId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("Token no encontrado")
        return
      }

      try {
        const res = await fetch("/api/publicaciones/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`)
        }

        const data = await res.json()

        const normalizadas = data.map((pub: any) => ({
          ...pub,
          id: pub.id.toString(),
        }))

        setPublicaciones(normalizadas)
      } catch (err) {
        console.error("Error al obtener publicaciones", err)
      }
    }

    fetchData()
  }, [])

  const handleEditar = (pub: Publicacion) => {
    setEditandoId(pub.id)
    setEditTitulo(pub.titulo)
    setEditContenido(pub.contenido)
    setArchivoActual(pub.archivo)
    setEditArchivo(null)
  }

  const handleGuardar = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("Token no encontrado. No se puede actualizar la publicación.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("Titulo", editTitulo)
      formData.append("Contenido", editContenido)
      formData.append("SnippetId", "") // ← tu lógica aquí

      if (editArchivo) {
        formData.append("Archivo", editArchivo)
      }

      const res = await fetch(`/api/publicaciones/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Error al actualizar publicación:", errorText)
        alert(errorText)
        return
      }

      const actualizada = await res.json()

      setPublicaciones((prev) =>
        prev.map((pub) =>
          pub.id.toString() === id ? { ...pub, ...actualizada } : pub
        )
      )

      setEditandoId(null)
    } catch (err) {
      console.error("Error de red al actualizar publicación:", err)
    }
  }

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) return console.error("Token no encontrado")

    try {
      const res = await fetch(`/api/publicaciones/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setPublicaciones((prev) => prev.filter((pub) => pub.id !== id))
    } catch (err) {
      console.error("Error al eliminar publicación:", err)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar arriba */}
      <Navbar />

      {/* Contenido debajo del navbar */}
      <div className="flex flex-1">
        {/* Sidebar a la izquierda */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-1 p-6 space-y-4">
          <h1 className="text-2xl font-bold dark:neon-text">Mis Publicaciones</h1>

          {publicaciones.length === 0 ? (
            <p className="dark:neon-text">No tienes publicaciones aún.</p>
          ) : (
            <div className="space-y-4">
              {publicaciones.map((pub, index) => (
                <Card
                  key={pub.id ?? `pub-${index}`}
                  className="flex flex-col gap-4 p-6 shadow-md rounded-2xl border border-gray-200"
                >
                  {editandoId === pub.id ? (
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        className="border p-2 rounded-md dark:neon-text"
                        value={editTitulo}
                        onChange={(e) => setEditTitulo(e.target.value)}
                        placeholder="Título"
                      />
                      <textarea
                        className="border p-2 rounded-md dark:neon-text"
                        value={editContenido}
                        onChange={(e) => setEditContenido(e.target.value)}
                        placeholder="Contenido"
                      />

                      <div className="flex gap-2 ">
                        <Button className="dark:neon-text" variant="outline" onClick={() => setEditandoId(null)}>
                          Cancelar
                        </Button>
                        <Button className="dark:neon-text" variant="default" onClick={() => handleGuardar(pub.id)}>
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-semibold text-gray-800 dark:neon-text">{pub.titulo}</h2>
                        <p className="text-gray-600">{pub.contenido}</p>
                      </div>

                      <pre className="bg-gray-900 text-gray-100 text-sm rounded-lg p-4 overflow-x-auto font-mono">
                        <code className="dark:neon-text">{pub.archivo}</code>
                      </pre>

                      <div className="flex flex-wrap gap-2 items-center">
                        {pub.archivo && (
                          <div className="relative">
                            <Button
                              variant="outline"
                              className="flex items-center gap-2 dark:neon-text"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(pub.archivo)
                                  setCopiadoId(pub.id)
                                  setTimeout(() => setCopiadoId(null), 1000)
                                } catch (error) {
                                  console.error("Error al copiar:", error)
                                }
                              }}
                            >
                              <Copy className="h-4 w-4" />
                              Copiar
                            </Button>

                            {copiadoId === pub.id && (
                              <span className="absolute -top-6 left-0 text-green-600 text-sm font-medium">
                                ¡Copiado!
                              </span>
                            )}
                          </div>
                        )}

                        <Button
                          variant="outline"
                          className="flex items-center gap-2 dark:neon-text"
                          onClick={() => handleEditar(pub)}
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Button>

                        <Button
                          variant="destructive"
                          className="flex items-center gap-2 dark:neon-text"
                          onClick={() => handleDelete(pub.id)}
                        >
                          <Trash className="h-4 w-4" />
                          Eliminar
                        </Button>
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
  )
}
