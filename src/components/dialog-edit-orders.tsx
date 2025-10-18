import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DialogAddItems } from "./dialog-add-items"
import { AxiosError } from "axios"
import { api } from "@/services/api"
import { formatCurrency } from "@/utils/formatCurrency"

type DialogEditOrdersProps = {
  orderId: string
}

export function DialogEditOrders({ orderId }: DialogEditOrdersProps) {
  const [items, setItems] = useState<OrderItemAPIResponse[]>([])

  async function fetchItemsOrder() {
    try {
      const response = await api.get<OrderItemAPIResponse[]>("/ordersItens")

      setItems(
        response.data.map((item) => ({
          id: item.id,
          orderId: item.orderId,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
          },
        }))
      )
    } catch (error) {
      console.log(error)

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }

      alert("Erro ao carregar")
    }
  }

  async function handleOnDelete(itemId: string) {
    try {
      await api.delete(`/ordersItens/${itemId}`)

      if (confirm("Item deletado com sucesso!")) {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }

      alert("Erro ao deletar item")
    }
  }

  useEffect(() => {
    fetchItemsOrder()
  }, [])

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="text-blue-600 hover:text-blue-800 bg-transparent hover:bg-transparent hover:underline font-medium text-base px-0 h-auto cursor-pointer">
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="overflow-x-auto">
            <Table className="w-full text-base">
              <TableHeader>
                <TableRow className="h-14">
                  <TableHead className="px-6 py-3 text-center font-semibold h-14">
                    Produto
                  </TableHead>
                  <TableHead className="px-6 py-3 text-center font-semibold h-14">
                    Quantidade
                  </TableHead>
                  <TableHead className="px-6 py-3 text-center font-semibold h-14">
                    Preço
                  </TableHead>
                  <TableHead className="px-6 py-3 text-center font-semibold h-14">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.orderId}
                    className="hover:bg-muted/30 transition-colors h-14 overflow-y-scroll"
                  >
                    <TableCell className="px-6 py-4 text-center font-medium">
                      {item.product.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center text-muted-foreground">
                      {formatCurrency(item.product.price)}
                    </TableCell>
                    <TableCell className="py-6 px-8 text-center">
                      <button
                        onClick={() => handleOnDelete(item.id)}
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
          <DialogFooter className="mt-6 flex justify-end gap-4">
            <DialogClose asChild>
              <Button className="h-14 px-10 w-24 bg-black hover:bg-gray-800 text-white rounded-xl text-base font-medium">
                Cancelar
              </Button>
            </DialogClose>
            <DialogAddItems orderId={orderId} />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
