type PaymentAPIResponse = {
  id: string
  orderId: string
  paymentType: string
  paymentDate: string | null
  status: string
  total: string
  createdAt: string | null
}

type ItemPayment = {
  productName: string
  price: string
  quantity: number
}

type ItemsPaymentAPIResponse = {
  orderId: string
  total: number
  items: ItemPayment[]
}