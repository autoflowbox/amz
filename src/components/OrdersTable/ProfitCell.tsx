import type { OrderItem, ProductDefinition } from '../../types'
import { computeProfit, formatCurrency } from '../../lib/profit'

export function ProfitCell({
  price,
  items,
  definitions,
}: {
  price: number
  items: OrderItem[]
  definitions: ProductDefinition[]
}) {
  const profit = computeProfit(price, items, definitions)
  const color = profit >= 0 ? 'text-emerald-600' : 'text-red-600'

  return (
    <div className={`w-full h-full min-h-[28px] px-1 py-1 text-xs font-medium whitespace-nowrap ${color}`}>
      {formatCurrency(profit)}
    </div>
  )
}
