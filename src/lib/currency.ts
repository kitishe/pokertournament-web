export function currencySymbol(currency?: string | null): string {
  if (!currency) return '$'
  const code = currency.toUpperCase()
  switch (code) {
    case 'USD': return '$'
    case 'EUR': return '€'
    case 'GBP': return '£'
    case 'RUB': return '₽'
    case 'UAH': return '₴'
    case 'KZT': return '₸'
    case 'GEL': return '₾'
    case 'TRY': return '₺'
    case 'JPY': return '¥'
    case 'CNY': return '¥'
    case 'KRW': return '₩'
    case 'INR': return '₹'
    case 'BRL': return 'R$'
    case 'AUD': return 'A$'
    case 'CAD': return 'C$'
    case 'CHF': return 'CHF'
    default: return code
  }
}

export function formatMoney(amount: number | null | undefined, currency?: string | null): string {
  const symbol = currencySymbol(currency)
  const value = typeof amount === 'number' ? amount : 0
  return `${symbol}${value}`
}


