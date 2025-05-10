import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Code2, Database, Search, Tag, Clock, Users } from "lucide-react"

export default function LobbyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 dark:neon-text">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SnippetHub</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button className="dark:neon-text" variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="dark:neon-text">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl dark:neon-text">
              Tu Biblioteca de Código Personalizada
            </h1>
            <p className="mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Organiza, busca y reutiliza tus snippets de código en un solo lugar. Deja atrás las notas dispersas y
              optimiza tu flujo de trabajo."
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2 dark:neon-text">
                  Comenzar Ahora
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="gap-2 dark:neon-text">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/40 py-16">
          <div className="container">
            <h2 className="mb-10 text-center text-3xl font-bold dark:neon-text">¿Por qué elegir SnippetHub?</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                <Clock className="mb-4 h-10 w-10 text-primary " />
                <h3 className="mb-2 text-xl font-medium dark:neon-text">Ahorra Tiempo</h3>
                <p className="text-muted-foreground">
                  Accede rápidamente a tus snippets sin tener que recordar o buscar en múltiples lugares.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                <Database className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-medium dark:neon-text">Organización Eficiente</h3>
                <p className="text-muted-foreground">
                  Categoriza y etiqueta tus snippets para mantener tu biblioteca de código ordenada.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                <Search className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-medium dark:neon-text">Búsqueda Potente</h3>
                <p className="text-muted-foreground">
                  Encuentra exactamente lo que necesitas con búsquedas por título, contenido o etiquetas.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                <Tag className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-medium dark:neon-text">Etiquetado Inteligente</h3>
                <p className="text-muted-foreground">
                  Organiza tus snippets con etiquetas personalizadas para acceder rápidamente a ellos.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                <Code2 className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-medium dark:neon-text">Resaltado de Sintaxis</h3>
                <p className="text-muted-foreground">
                  Visualiza tu código con resaltado de sintaxis para múltiples lenguajes de programación.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                <Users className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-medium dark:neon-text">Experiencia Personalizada</h3>
                <p className="text-muted-foreground">
                  Adapta la plataforma a tus necesidades con temas claros y oscuros.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 dark:neon-text">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">SnippetHub</span>
          </div>
          <p className="text-center text-sm text-muted-foreground dark:neon-text">© 2025 SnippetHub. Todos los derechos reservados.</p>
          <div className="flex gap-4 ">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground dark:neon-text">
              Ayuda
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground dark:neon-text">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground dark:neon-text">
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
