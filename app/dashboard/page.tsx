import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { SnippetCard } from "@/components/snippet-card"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para mostrar en la interfaz
const snippets = [
  {
    id: "1",
    title: "Función para ordenar array",
    description: "Ordena un array de objetos por una propiedad específica",
    code: "const sortByProperty = (array, property) => {\n  return array.sort((a, b) => {\n    return a[property] < b[property] ? -1 : 1;\n  });\n};",
    language: "javascript",
    category: "Utilidades",
    tags: ["array", "ordenamiento", "función"],
  },
  {
    id: "2",
    title: "Componente React Button",
    description: "Componente de botón reutilizable con variantes",
    code: "const Button = ({ variant = 'primary', children, ...props }) => {\n  return (\n    <button\n      className={`btn btn-${variant}`}\n      {...props}\n    >\n      {children}\n    </button>\n  );\n};",
    language: "jsx",
    category: "React",
    tags: ["componente", "UI", "botón"],
  },
  {
    id: "3",
    title: "Consulta SQL para usuarios activos",
    description: "Obtiene todos los usuarios activos con sus roles",
    code: "SELECT u.id, u.name, u.email, r.name as role\nFROM users u\nJOIN roles r ON u.role_id = r.id\nWHERE u.active = true\nORDER BY u.name ASC;",
    language: "sql",
    category: "Bases de Datos",
    tags: ["SQL", "consulta", "usuarios"],
  },
  {
    id: "4",
    title: "Middleware de autenticación",
    description: "Middleware para verificar token JWT en Express",
    code: "const authMiddleware = (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  \n  if (!token) {\n    return res.status(401).json({ message: 'No token provided' });\n  }\n  \n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch (error) {\n    return res.status(401).json({ message: 'Invalid token' });\n  }\n};",
    language: "javascript",
    category: "Backend",
    tags: ["express", "middleware", "autenticación", "JWT"],
  },
  {
    id: "5",
    title: "Estilos CSS para tarjeta",
    description: "Estilos para crear una tarjeta con sombra y hover effect",
    code: ".card {\n  padding: 1.5rem;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n\n.card:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);\n}",
    language: "css",
    category: "Frontend",
    tags: ["CSS", "tarjeta", "animación"],
  },
  {
    id: "6",
    title: "Función fetch con async/await",
    description: "Patrón para hacer peticiones HTTP con manejo de errores",
    code: "const fetchData = async (url) => {\n  try {\n    const response = await fetch(url);\n    \n    if (!response.ok) {\n      throw new Error(`HTTP error! Status: ${response.status}`);\n    }\n    \n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Fetch error:', error);\n    throw error;\n  }\n};",
    language: "javascript",
    category: "Utilidades",
    tags: ["fetch", "async", "HTTP", "API"],
  },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight dark:neon-text">Ejemplos de Snippets</h1>
            <div className="flex items-center gap-4">
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
