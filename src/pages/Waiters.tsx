import { useEffect, useState } from "react"
import { z, ZodError } from "zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { api } from "@/services/api"

import { formatDate } from "@/utils/formatDate"
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
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  telephone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => /^\d{11}$/.test(val), {
      message: "Telefone inválido: deve conter 11 números",
    }),
})

export function Waiters() {
  const [waiters, setWaiters] = useState<WaiterAPIResponse[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      telephone: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await api.post("/waiters", data)

      if (response.data && response.data.id) {
        const newWaiter = response.data
        setWaiters((prevWaiters) => [
          ...prevWaiters,
          {
            id: newWaiter.id,
            name: newWaiter.name,
            hiringDate: formatDate(
              newWaiter.hiringDate || new Date().toISOString()
            ),
          },
        ])
      } else {
        await fetchWaiters()
      }

      form.reset()
      alert("Garçom cadastrado com sucesso!")
    } catch (error) {
      console.log("Erro ao cadastrar garçom:", error)

      if (error instanceof ZodError) {
        alert(`Erro de validação: ${error.issues[0].message}`)
        return
      }

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao cadastrar garçom: ${errorMessage}`)
        return
      }

      alert("Erro ao cadastrar o garçom.")
    }
  }

  async function fetchWaiters() {
    try {
      const response = await api.get<WaiterAPIResponse[]>("/waiters")

      setWaiters(
        response.data.map((waiter) => ({
          id: waiter.id,
          name: waiter.name,
          hiringDate: formatDate(waiter.hiringDate || new Date().toISOString()),
        }))
      )
    } catch (error) {
      console.log("Erro ao carregar garçons:", error)

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao carregar garçons: ${errorMessage}`)
      } else {
        alert("Erro ao carregar!")
      }
    }
  }

  async function handleOnDelete(waiterId: string) {
    if (!confirm("Tem certeza que deseja deletar este garçom?")) {
      return
    }

    try {
      await api.delete(`/waiters/${waiterId}`)

      setWaiters((prevWaiters) =>
        prevWaiters.filter((waiter) => waiter.id !== waiterId)
      )

      alert("Garçom deletado com sucesso!")
    } catch (error) {
      console.log("Erro ao deletar garçom:", error)

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao deletar garçom: ${errorMessage}`)
      } else {
        alert("Erro ao deletar!")
      }
    }
  }

  useEffect(() => {
    fetchWaiters()
  }, [])

  return (
    <div className="flex flex-col items-center min-h-80 gap-10">
      <div className="w-full max-w-6xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">Nome</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Digite o nome completo"
                      className="h-12 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">
                    Telefone
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="(11) 99999-9999"
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
                  Nome
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Data da Contratação
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waiters.map((waiter) => (
                <TableRow
                  key={waiter.id}
                  className="hover:bg-muted/30 transition-colors h-14"
                >
                  <TableCell className="font-medium py-8 px-8 text-center">
                    {waiter.id}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center text-base">
                    {waiter.name}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {waiter.hiringDate}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    <button
                      onClick={() => handleOnDelete(waiter.id)}
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
