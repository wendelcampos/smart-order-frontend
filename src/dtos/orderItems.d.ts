type OrderItemAPIResponse = {
  id: string,
  orderId: string,
  quantity: number,
  product: {
    id: string,
    name: string,
    price: number,
  }
}