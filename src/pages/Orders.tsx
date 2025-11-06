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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DialogEditOrders } from "@/components/dialog-edit-orders"
import { api } from "@/services/api"
import { formatDate } from "@/utils/formatDate"
import { AxiosError } from "axios"
import { useEffect, useState } from "react"

const formSchema = z.object({
  tableNumber: z.string(),
  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => /^\d{11}$/.test(val), {
      message: "CPF inválido: deve conter 11 números",
    }),
  waiterName: z.string(),
})

export function Orders() {
  const [orders, setOrders] = useState<OrdersAPIResponse[]>([])
  const [waiters, setWaiters] = useState<WaiterAPIResponse[]>([])
  const [tables, setTables] = useState<TableAPIResponse[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableNumber: "",
      cpf: "",
      waiterName: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await api.post("/orders", data)

      await fetchOrders()

      form.reset()
      alert("Pedido cadastrado com sucesso!")
    } catch (error) {
      console.log("Erro ao cadastrar pedido:", error)

      if (error instanceof ZodError) {
        alert(`Erro de validação: ${error.issues[0].message}`)
        return
      }

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao cadastrar pedido: ${errorMessage}`)
        return
      }

      alert("Erro ao cadastrar pedido.")
    }
  }

  async function handleOnDelete(orderId: string) {
    if (!confirm("Tem certeza que deseja deletar este pedido?")) {
      return
    }

    try {
      await api.delete(`/orders/${orderId}`)

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      )

      alert("Pedido deletado com sucesso!")
    } catch (error) {
      console.log("Erro ao deletar pedido:", error)

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao deletar pedido: ${errorMessage}`)
      } else {
        alert("Erro ao deletar pedido.")
      }
    }
  }

  async function fetchOrders() {
    try {
      const response = await api.get<OrdersAPIResponse[]>("/orders")

      setOrders(
        response.data.map((order) => ({
          id: order.id,
          status: order.status,
          createdAt: formatDate(order.createdAt || new Date().toISOString()),
          customer: order.customer,
          table: order.table,
          waiter: order.waiter,
        }))
      )
    } catch (error) {
      console.log("Erro ao carregar pedidos:", error)

      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          setOrders([])
          return
        }
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao carregar pedidos: ${errorMessage}`)
      } else {
        alert("Erro ao carregar pedidos.")
      }
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
        if (error.response?.status === 400) {
          setWaiters([])
          return
        }
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao carregar garçons: ${errorMessage}`)
      } else {
        alert("Erro ao carregar garçons.")
      }
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
      console.log("Erro ao carregar mesas:", error)

      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          setTables([])
          return
        }
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao carregar mesas: ${errorMessage}`)
      } else {
        alert("Erro ao carregar mesas.")
      }
    }
  }

  useEffect(() => {
    fetchWaiters()
    fetchTables()
    fetchOrders()
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
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
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
              name="tableNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Mesa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Numero da mesa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tables.map((table) => (
                        <SelectItem key={table.id} value={table.tableNumber}>
                          {table.tableNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="waiterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Garçom</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um garçom" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {waiters.map((waiter) => (
                        <SelectItem key={waiter.id} value={waiter.name}>
                          {waiter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  Nome do Garçom
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Status
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Data do pedido
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors h-14"
                >
                  <TableCell className="font-medium py-8 px-8 text-center">
                    {order.id}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center text-base">
                    {order.table?.tableNumber}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center text-base">
                    {order.waiter?.name}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {order.status === "open" ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                        {order.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
                        {order.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center text-base">
                    {order.createdAt}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    <div className="flex gap-4 items-center justify-center">
                      <DialogEditOrders orderId={order.id} />
                      <button
                        onClick={() => handleOnDelete(order.id)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors text-base cursor-pointer"
                      >
                        Deletar
                      </button>
                    </div>
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
