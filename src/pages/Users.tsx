import { AxiosError } from "axios"
import { useEffect, useState } from "react"

import { api } from "@/services/api"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Users() {
  const [users, setUsers] = useState<UserResponse[]>([])

  async function fetchUsers() {
    try {
      const response = await api.get<UserResponse[]>("/users")

      setUsers(
        response.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }))
      )
    } catch (error) {
      console.log(error)

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }
    }
  }

  async function handleOnDelete(userId: string) {
    try {
      await api.delete(`/users/${userId}`)

      if (confirm("Usuário deletado com sucesso!")) {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4">
      <div className="w-full max-w-7xl space-y-8">
        <div className="rounded-lg border shadow-lg bg-card mx-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-b">
                <TableHead className="h-18 px-8 font-semibold text-center">
                  ID
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Nome
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Email
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Role
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium py-6 px-8 text-center h-14">
                    {user.id}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    {user.name}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    {user.role}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    <button
                      onClick={() => handleOnDelete(user.id)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors cursor-pointer"
                    >
                      Deletar
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
