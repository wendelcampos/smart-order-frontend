export function formatDate(dateString: string){
  if (!dateString) {
      return null
  }

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
     return null
   }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}