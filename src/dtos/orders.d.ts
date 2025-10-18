type OrdersAPIResponse = {
  id: string
  status: string
  createdAt: string | null
  table: {
    tableNumber: string
  }
  waiter: {
    name: string
  }
  customer: {
    name: string
  }
}