"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { Code2, Home, Plus, Search, User, PlusCircle, Shield } from "lucide-react"
import React, { useEffect, useState } from "react"
import {jwtDecode} from "jwt-decode"

interface SidebarProps {
  mobile?: boolean
}

interface JwtPayload {
  role: string
}

export function Sidebar({ mobile = false }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token") // o document.cookie si lo tienes ahí

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        if (decoded.role === "admin") {
          setIsAdmin(true)
        }
      } catch (err) {
        console.error("Error al decodificar el token:", err)
      }
    }
  }, [])

  const HandleClick = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`/publications/user?username=${searchQuery}`)
    }
  }

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-background", mobile && "w-full border-r-0")}>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="mt-4 flex w-full">
          <Link href="/snippets/new" className="w-full">
            <Button className="w-full gap-1">
              <Plus className="h-4 w-4" />
              <span>Nuevo Snippet</span>
            </Button>
          </Link>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-6">
          {/* Navegación */}
          <div>
            <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navegación
            </div>
            <nav className="grid gap-1">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Home className="h-4 w-4" />
                  <span>Introducción</span>
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/Admin">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Panel Administrativo</span>
                  </Button>
                </Link>
              )}
            </nav>
          </div>

          {/* Publicaciones */}
          <div>
            <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Publicaciones
            </div>
            <nav className="grid gap-1">
              <Link href="/publications/me">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  <span>Mis Publicaciones</span>
                </Button>
              </Link>
            </nav>
          </div>

          {/* Snippets */}
          <div>
            <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Snippets
            </div>
            <nav className="grid gap-1">
              <Link href="/snippets/me">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Code2 className="h-4 w-4" />
                  <span>Mis Snippets</span>
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
