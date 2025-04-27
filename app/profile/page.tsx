"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Save, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


export default function ProfilePage() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null)

  const router = useRouter()

useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    try {
      const res = await fetch("http://localhost:8000/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        localStorage.removeItem("token")
        router.push("/login") 
      }
    } catch (error) {
      console.error("Error de red:", error)
      router.push("/login") 
    }
  }

  fetchUser()
}, [router])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
            <p className="text-muted-foreground">Administra tu información personal y preferencias</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center sm:flex-row sm:items-start sm:justify-start sm:gap-6">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted sm:mb-0">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="grid w-full gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nombre de Usuario</Label>
                      <Input id="username" defaultValue={user?.username || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" type="email" defaultValue={user?.email} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button className="gap-1">
                <Save className="h-4 w-4" />
                <span>Guardar Cambios</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function PasswordInput({ id }: { id: string }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input id={id} type={showPassword ? "text" : "password"} placeholder="••••••••" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
      </Button>
    </div>
  )
}

function Select({ children, defaultValue, ...props }: any) {
  return (
    <select
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      defaultValue={defaultValue}
      {...props}
    >
      {children}
    </select>
  )
}

function SelectTrigger({ children, ...props }: any) {
  return <div {...props}>{children}</div>
}

function SelectValue({ children, ...props }: any) {
  return <span {...props}>{children}</span>
}

function SelectContent({ children, ...props }: any) {
  return (
    <div
      className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
      {...props}
    >
      {children}
    </div>
  )
}

function SelectItem({ children, value, ...props }: any) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  )
}
