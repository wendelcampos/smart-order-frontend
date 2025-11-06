import { AxiosError } from "axios"
import { useEffect, useState } from "react"

import { api } from "@/services/api"

import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { DialogPayments } from "@/components/dialog-payments"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Payments() {
  const [payments, setPayments] = useState<PaymentAPIResponse[]>([])

  async function fetchPayments() {
    try {
      const response = await api.get<PaymentAPIResponse[]>("/payments")

      setPayments(
        response.data.map((payment) => ({
          id: payment.id,
          orderId: payment.orderId,
          paymentType: payment.paymentType,
          total: formatCurrency(Number(payment.total)),
          createdAt: formatDate(payment.createdAt || new Date().toISOString()),
          paymentDate: formatDate(
            payment.paymentDate || new Date().toISOString()
          ),
          status: payment.status,
        }))
      )
    } catch (error) {
      console.log("Erro ao carregar pagamentos:", error)

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao carregar pagamentos: ${errorMessage}`)
      } else {
        alert("Erro ao carregar pagamentos.")
      }
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  async function handleOnDelete(paymentId: string) {
    if (!confirm("Tem certeza que deseja deletar este pagamento?")) {
      return
    }

    try {
      await api.delete(`/payments/${paymentId}`)

      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== paymentId)
      )

      alert("Pagamento deletado com sucesso!")
    } catch (error) {
      console.log("Erro ao deletar pagamento:", error)

      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro do servidor"
        alert(`Erro ao deletar pagamento: ${errorMessage}`)
      } else {
        alert("Erro ao deletar pagamento.")
      }
    }
  }

  useEffect(() => {
    fetchPayments()
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
                  OrderID
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Tipo de Pagamento
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Total
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Data do Pagamento
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Status
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Data do Cadastro
                </TableHead>
                <TableHead className="h-18 px-8 font-semibold text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium py-6 px-8 text-center h-14">
                    {payment.id}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    {payment.orderId}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center text-muted-foreground">
                    {payment.paymentType}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    {payment.total}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    {payment.paymentDate}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    {payment.status === "open" ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                        {payment.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
                        {payment.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    {payment.createdAt}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-center">
                    <div className="flex gap-4 items-center justify-center">
                      <DialogPayments orderId={payment.orderId} />
                      <button
                        onClick={() => handleOnDelete(payment.id)}
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
