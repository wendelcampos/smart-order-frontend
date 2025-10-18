export function formatCurrency(value: number): string {
  const currency = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return currency.format(value)
}
