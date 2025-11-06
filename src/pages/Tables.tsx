import { api } from "@/services/api"

import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { z, ZodError } from "zod"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const formSchema = z.object({
  tableNumber: z
    .string()
    .min(1, { message: "Numero da mesa deve ter pelo menos 1 caractere." }),
})

export function Tables() {
  const [tables, setTables] = useState<TableAPIResponse[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableNumber: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await api.post("/tables", data)

      if (confirm("Mesa cadatrada com sucesso!")) {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        return { message: error.issues[0].message }
      }

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }

      alert("Erro ao cadastrar a mesa.")
    }
  }

  async function fetchTables() {
    try {
      const response = await api.get<TableAPIResponse[]>("/tables")

      setTables(
        response.data.map((table) => ({
          id: table.id,
          tableNumber: table.tableNumber,
          status: table.status,
        }))
      )
    } catch (error) {
      console.log(error)

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }

      alert("Erro ao carregar!.")
    }
  }

  async function handleOnDelete(tableId: string) {
    try {
      await api.delete(`/tables/${tableId}`)

      setTables((prevTables) =>
        prevTables.filter((table) => table.id !== tableId)
      )

      alert("Mesa deletada com sucesso!")
    } catch (error) {
      console.log(error)

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }

      alert("Erro ao deletar a mesa.")
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  return (
    <div className="flex flex-col justify-center items-center min-h-80 gap-10">
      <div className="w-full max-w-6xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="tableNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Table Number"
                      className="h-12 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full max-w-sm h-12 bg-black hover:bg-gray-800 text-white rounded-xl text-base font-medium"
              >
                Cadastrar
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="w-full max-w-6xl mt-10">
        <div className="rounded-lg border shadow-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-b">
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  ID
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Numero da Mesa
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Status
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow
                  key={table.id}
                  className="hover:bg-muted/30 transition-colors h-14"
                >
                  <TableCell className="font-medium py-8 px-8 text-center">
                    {table.id}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {table.tableNumber}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {table.status === "open" ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                        {table.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
                        {table.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    <button
                      onClick={() => handleOnDelete(table.id)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors text-base cursor-pointer"
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
