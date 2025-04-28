"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Eye, EyeOff } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { headers } from "next/headers"
import axios from "axios"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      const payload = {
        username,
        full_name: fullName,
        email,
        hashed_password: password,
      }
  
      // Axios detecta automáticamente application/json
      const res = await axios.post(
        "http://localhost:8000/users",
        payload
      )
  
      const data = res.data
      console.log("Usuario creado:", data)
      router.push("/login")
    } catch (err: any) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        const msgs = detail.map((e: any) => e.msg).join(", ")
        setError(msgs)
      } else {
        setError(detail || err.message)
      }
    }
  }
      

      
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SnippetHub</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
            <CardDescription>Regístrate para comenzar a organizar tus snippets de código</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Nombre Usuario */}
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input id="username" placeholder="usuario123" value={username} onChange={e => setUsername(e.target.value)}/>
            </div>

            {/* Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="username">Nombre Completo</Label>
              <Input id="full-name" placeholder="Tu Nombre" value={fullName} onChange={e => setFullName(e.target.value)}/>
            </div>

            {/* email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" placeholder="tu@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <PasswordInput id="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <PasswordInput id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
            </div>

            {confirmPassword && password !== confirmPassword && (
                <p className="text-red-600 text-sm">
                  Las contraseñas no coinciden
                </p>
            )}

            <Button className="w-full" type="submit" onClick={handleSubmit} disabled={!fullName || !username || !email || !password || !confirmPassword || password !== confirmPassword}>
              Registrarse
            </Button>
            {error && <p className="text-red-600">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="mt-2 text-center text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Inicia Sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

function PasswordInput({ id, value, onChange }: { id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input id={id} type={showPassword ? "text" : "password"} placeholder="••••••••" value={value} onChange={onChange} />
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
