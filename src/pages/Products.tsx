import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, ZodError } from "zod"
import { AxiosError } from "axios"
import { useEffect, useState } from "react"

import { api } from "@/services/api"

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
import { formatCurrency } from "@/utils/formatCurrency"

const CategoryEnum = z.enum(["pratos", "bebida", "pratos_do_dia", "lanches"])

const formSchema = z.object({
  name: z.string().min(1, { message: "Informe o nome." }),
  description: z.string().min(1, { message: "Informe a descrição." }),
  price: z.string().min(1, { message: "Informe o preço." }),
  category: CategoryEnum,
})

export function Products() {
  const [products, setProducts] = useState<ProductsAPIResponse[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "pratos",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const formattedPrice = data.price.replace(",", ".")

      const dataFormatted = {
        ...data,
        price: Number(formattedPrice),
      }

      await api.post("/products", dataFormatted)

      if (confirm("Produto cadastrado com sucesso!")) {
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

      alert("Erro ao cadastrar produto.")
    }
  }

  async function fetchProducts() {
    try {
      const response = await api.get<ProductsAPIResponse[]>("/products")

      setProducts(
        response.data.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: formatCurrency(Number(product.price)),
          category: product.category.toUpperCase().replaceAll("_", " "),
        }))
      )
    } catch (error) {
      console.log(error)

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }

      alert("Erro ao carregar.")
    }
  }

  async function handleOnDelete(productId: string) {
    try {
      await api.delete(`/products/${productId}`)

      if (confirm("Produto deletado com sucesso!")) {
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
    fetchProducts()
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
                  <FormLabel>Nome Produto</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Descrição"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Preço"
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pratos">Pratos</SelectItem>
                      <SelectItem value="bebida">Bebida</SelectItem>
                      <SelectItem value="pratos_do_dia">
                        Pratos do dia
                      </SelectItem>
                      <SelectItem value="lanches">Lanches</SelectItem>
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
                  Nome do Produto
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Descrição
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Preço
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Categoria
                </TableHead>
                <TableHead className="h-16 px-8 font-semibold text-center text-base">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-muted/30 transition-colors h-14"
                >
                  <TableCell className="font-medium py-8 px-8 text-center">
                    {product.id}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center text-base">
                    {product.name}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center text-base">
                    {product.description}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {product.price}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    {product.category}
                  </TableCell>
                  <TableCell className="py-8 px-8 text-center">
                    <button
                      onClick={() => handleOnDelete(product.id)}
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
