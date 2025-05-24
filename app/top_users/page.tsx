"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar'
import { Card } from "@/components/ui/card"
import { Sidebar } from '@/components/sidebar'
import {UserIcon, BadgeCheckIcon, FileTextIcon} from 'lucide-react'


interface User {
    id: string,
    username: string,
    full_name: string,
    numero_publicaciones: number
}

const TopUsers = () => {
    const router = useRouter()
    
    const [loading, setLoading] = useState(true);
    const [Users, setUsers] = useState<User[]>([ ])

    useEffect(() => {
      const token = localStorage.getItem("token");
    
      if( !token ) {
        console.error("Token not found")
        setLoading(false)
        return
      }

      const fetchUsers = async () => {
        try {
            const response = await fetch("api/top_users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            const users = data.map( (user: any) => ({
                ...user,
                id: user.id.toString()
            }))

            setUsers( users )
        } catch (error) {
            throw error;
        } finally {
            setLoading(false)
        }
      }

      fetchUsers();
    }, [])

    return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <section className="flex-1 bg-muted/40 px-8 py-12">
          <h1 className="text-3xl font-extrabold mb-6 text-center">TOP USUARIOS</h1>

          <h4 className="text-xl mb-6 text-center">
            Como comunidad en SnippetHub, nos complace reconocer a los siguientes usuarios por su destacada participación y compromiso constante en compartir conocimiento y aportar contenido de valor. 
            ¡Gracias por ser parte activa de esta comunidad!
          </h4>
          {loading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Users.map((user, index) => (
                <Card
                  key={user.id ?? `user-${index}`}
                  className="p-6 rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/publications/user?username=${user.username}`)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <BadgeCheckIcon className="text-green-500 w-5 h-5" />
                    <h3 className="text-lg font-bold text-gray-800">
                      {user.username}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span>{user.full_name}</span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <FileTextIcon className="w-4 h-4" />
                    <span>{user.numero_publicaciones} publicaciones</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default TopUsers;