"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Code2, Home, Plus, Search, User } from "lucide-react"
import React, { useState } from "react"

interface SidebarProps {
  mobile?: boolean
}

export function Sidebar({ mobile = false }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const HandleClick = (e: React.FormEvent) => {
    e.preventDefault()
    
  }

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-background", mobile && "w-full border-r-0")}>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground space-y-4" />
          <Input
            type="search"
            placeholder="Buscar snippets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mt-4 flex w-full ">
          <Link href="/snippets/new" className="w-full">
            <Button className="w-full gap-1 dark:neon-text">
              <Plus className="h-4 w-4" />
              <span>Nuevo Snippet</span>
            </Button>
          </Link>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
      <div className="space-y-6">
        <div>
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navegación
          </div>
          <nav className="grid gap-1 dark:neon-text">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2 dark:neon-text">
                <Home className="h-4 w-4" />
                <span>Todos los Snippets</span>
              </Button>
            </Link>
          </nav>
        </div>

        {/* Publicaciones */}
        <div>
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Publicaciones
          </div>
          <nav className="grid gap-1 dark:neon-text">
            <Link href="/publications/me">
              <Button variant="ghost" className="w-full justify-start gap-2c dark:neon-text" onClick={() => {HandleClick}}>
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
          <nav className="grid gap-1 dark:neon-text">
            <Link href="/snippets/mios">
              <Button variant="ghost" className="w-full justify-start gap-2 dark:neon-text">
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
