import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, ZodError } from "zod"

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
import { Input } from "@/components/ui/input"
import { AxiosError } from "axios"
import { api } from "@/services/api"
import { useEffect, useState } from "react"
import { formatDate } from "@/utils/formatDate"
import { formatPhone } from "@/utils/formatPhone"

const formSchema = z.object({
  name: z.string().min(1, { message: "Informe o nome." }),
  email: z.string().email({ message: "E-mail inválido." }),
  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => /^\d{11}$/.test(val), {
      message: "CPF inválido: deve conter 11 números",
    }),
  telephone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => /^\d{11}$/.test(val), {
      message: "Telefone inválido: deve conter 11 números",
    }),
})

export function Customers() {
  const [customers, setCustomers] = useState<CustomersAPIResponse[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpf: "",
      telephone: "",
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await api.post("/customers", data)

      if (response.data && response.data.id) {
        const newCustomer = response.data
        setCustomers((prevCustomers) => [
          ...prevCustomers,
          {
            id: newCustomer.id,
            name: newCustomer.name,
            telephone: formatPhone(newCustomer.telephone),
            email: newCustomer.email,
            createdAt: formatDate(
              newCustomer.createdAt || new Date().toISOString()
            ),
          },
        ])
      } else {
        await fetchCustomers()
      }

      form.reset()
      alert("Cliente cadastrado com sucesso!")
    } catch (error) {
      console.log("Erro ao cadastrar cliente:", error)

      if (error instanceof ZodError) {
        alert(`Erro de validação: ${error.issues[0].message}`)
        return
      }

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao cadastrar cliente: ${errorMessage}`)
        return
      }

      alert("Erro ao cadastrar cliente.")
    }
  }

  async function fetchCustomers() {
    try {
      const response = await api.get<CustomersAPIResponse[]>("/customers")

      setCustomers(
        response.data.map((customer) => ({
          id: customer.id,
          name: customer.name,
          telephone: formatPhone(customer.telephone),
          email: customer.email,
          createdAt: formatDate(customer.createdAt || new Date().toISOString()),
        }))
      )
    } catch (error) {
      console.log("Erro ao carregar clientes:", error)

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao carregar clientes: ${errorMessage}`)
      } else {
        alert("Erro ao carregar clientes.")
      }
    }
  }

  async function handleOnDelete(customerId: string) {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) {
      return
    }

    try {
      await api.delete(`/customers/${customerId}`)

      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== customerId)
      )

      alert("Cliente deletado com sucesso!")
    } catch (error) {
      console.log("Erro ao deletar cliente:", error)

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao deletar cliente: ${errorMessage}`)
      } else {
        alert("Erro ao deletar cliente.")
      }
    }
  }

  useEffect(() => {
    fetchCustomers()
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="email@email.com.br"
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
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="456.789.123-00"
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
                  Telefone
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Email
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Data de cadastro
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-muted/30 transition-colors h-14"
                >
                  <TableCell className="font-medium py-8 px-8 text-center">
                    {customer.id}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {customer.name}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {customer.telephone}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {customer.email}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {customer.createdAt}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    <button
                      onClick={() => handleOnDelete(customer.id)}
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
