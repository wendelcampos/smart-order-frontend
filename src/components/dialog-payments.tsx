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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DialogPaymentsOptions } from "./dialog-payments-options"
import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { api } from "@/services/api"
import { formatCurrency } from "@/utils/formatCurrency"

type PaymentProps = {
  orderId: string
}

export function DialogPayments({ orderId }: PaymentProps) {
  const [payments, setPayments] = useState<ItemsPaymentAPIResponse>()

  async function fetchPayments() {
    try {
      const response = await api.get<ItemsPaymentAPIResponse>(
        `/payments/${orderId}`
      )

      setPayments({
        orderId: response.data.orderId,
        total: response.data.total ? response.data.total : 0,
        items: response.data.items.map((item) => ({
          productName: item.productName,
          price: formatCurrency(Number(item.price)),
          quantity: item.quantity,
        })),
      })
    } catch (error) {
      console.log(error)

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }

      alert("Erro ao carregar")
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="text-blue-600 hover:text-blue-800 bg-transparent hover:bg-transparent hover:underline font-medium text-base px-0 h-auto">
            Pagamento
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
                </TableRow>
              </TableHeader>

              {payments?.items.map((item) => (
                <TableBody>
                  <TableRow
                    key={payments.orderId}
                    className="hover:bg-muted/30 transition-colors h-14"
                  >
                    <TableCell className="px-6 py-4 text-center font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">1</TableCell>
                    <TableCell className="px-6 py-4 text-center text-muted-foreground">
                      {item.price}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}

              <TableFooter>
                <TableRow className="border-t bg-muted/30 h-14">
                  <TableCell
                    colSpan={2}
                    className="px-6 py-4 text-right font-semibold"
                  >
                    Total
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center font-semibold">
                    {`R$ ${payments?.total}`}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-4">
            <DialogClose asChild>
              <Button className="h-14 px-10 w-24 bg-black hover:bg-gray-800 text-white rounded-xl text-base font-medium">
                Cancelar
              </Button>
            </DialogClose>
            <DialogPaymentsOptions orderId={orderId} />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
