"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Code2, LogOut, Menu, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { Sidebar } from "./sidebar"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden ">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileSidebar />
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 dark:neon-text">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">SnippetHub</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full dark:neon-text">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link className="dark:neon-text" href="/profile">Mi Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2 text-destructive dark:neon-text">
                  <LogOut className="h-4 w-4 " />
                  <span>Cerrar Sesión</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function MobileSidebar() {
  return (
    <div className="flex h-full flex-col py-4">
      <Link href="/dashboard" className="flex items-center gap-2 px-2">
        <Code2 className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">SnippetHub</span>
      </Link>
      <div className="mt-8 flex-1">
        <Sidebar mobile />
      </div>
    </div>
  )
}
