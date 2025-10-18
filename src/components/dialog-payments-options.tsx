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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { api } from "@/services/api"

import { payments } from "@/utils/payments"
import { useState } from "react"

type PaymentProps = {
  orderId: string
}

export function DialogPaymentsOptions({ orderId }: PaymentProps) {
  const [paymentType, setPaymentType] = useState(payments[0]?.value || "")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const data = {
        paymentType,
        orderId,
      }

      console.log(data)

      await api.post("/payments", data)

      if (confirm("Pagamento realizado com sucesso!")) {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-14 px-10 w-24 bg-black hover:bg-gray-800 text-white rounded-xl text-base font-medium">
          Pagar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Escolha uma forma de pagamento</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="overflow-x-auto flex flex-col gap-2">
            <RadioGroup
              value={paymentType}
              onValueChange={setPaymentType}
            >
              {payments.map((payment) => (
                <div key={payment.value} className="flex items-center gap-4">
                  <RadioGroupItem value={payment.value} id={payment.value} />
                  <Label htmlFor={payment.value}>{payment.type}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-4">
            <DialogClose asChild>
              <Button className="h-14 px-10 w-24 bg-black hover:bg-gray-800 text-white rounded-xl text-base font-medium">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-14 px-10 w-24 bg-black hover:bg-gray-800 text-white rounded-xl text-base font-medium"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
