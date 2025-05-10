"use client"

import Link from "next/link"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Code2, Cookie, Eye, EyeOff } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Cookies from "js-cookie"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)
  
      const res = await axios.post("api/token", formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
  
      const data = res.data
  
      
      localStorage.setItem("token", data.access_token)
  
    
      Cookies.set("token", data.access_token, {
        path: "/",     
        secure: true, 
        sameSite: "strict",
      })
  
      router.push("/profile")
    } catch (err: any) {
      alert("Error al iniciar sesión: " + (err.response?.data?.detail || err.message))
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 dark:neon-text">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SnippetHub</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <form onSubmit={handleLogin}>
          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold dark:neon-text">Iniciar Sesión</CardTitle>
              <CardDescription>Ingresa tus credenciales para acceder a tu biblioteca de snippets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 dark:neon-text">
                <Label>Usuario</Label>
                <Input id="user"value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2 ">
                <div className="flex items-center justify-between ">
                  <Label className="dark:neon-text" htmlFor="password">Contraseña</Label>
                  <Link href="#" className="text-xs text-primary hover:underline dark:neon-text">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4 text-muted-foreground dark:neon-text" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                  </Button>
                </div>
              </div>
              <Button className="w-full dark:neon-text" type="submit" >Iniciar Sesión</Button>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="mt-2 text-center text-sm">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-primary hover:underline dark:neon-text">
                  Regístrate
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  )
}
