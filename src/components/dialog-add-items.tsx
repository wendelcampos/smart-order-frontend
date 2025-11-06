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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input"
import z, { ZodError } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/services/api"
import { AxiosError } from "axios"

const formSchema = z.object({
  productId: z.string().trim(),
  quantity: z.string(),
})

type DialogAddItemsProps = {
  orderId: string
  onItemAdded?: () => void
}

export function DialogAddItems({ orderId, onItemAdded }: DialogAddItemsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const dataToSend = {
        ...data,
        quantity: Number(data.quantity),
        orderId: orderId,
      }

      await api.post("/ordersItens", dataToSend)

      // Chama a callback para atualizar a lista no componente pai
      onItemAdded?.()

      // Limpa o formulário
      form.reset()

      alert("Item adicionado com sucesso!")
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        return { message: error.issues[0].message }
      }

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }

      alert("Erro ao adicionar item")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-14 px-10 w-24 bg-black hover:bg-gray-800 text-white rounded-xl text-base font-medium">
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Adicionar Item ao Pedido</DialogTitle>
              <DialogDescription>
                Adicione um novo item ao pedido
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produto ID</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="ID do produto"
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Ex: 2"
                        className="h-12 px-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-1 justify-end">
              <DialogFooter className="flex justify-end gap-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="h-14 px-10 w-24 bg-black hover:bg-gray-800 text-white rounded-xl text-base font-medium"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="h-14 px-10 w-24 bg-black hover:bg-gray-800 text-white rounded-xl text-base font-medium"
                >
                  Salvar
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
