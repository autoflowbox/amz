import { formatCurrency } from '../../lib/profit'

export function StatCards({
  orderCount,
  revenue,
  profit,
}: {
  orderCount: number
  revenue: number
  profit: number
}) {
  const cards = [
    { label: 'Số đơn hàng', value: String(orderCount) },
    { label: 'Doanh thu', value: formatCurrency(revenue) },
    { label: 'Lợi nhuận', value: formatCurrency(profit) },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-neutral-300 bg-white p-5">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{card.label}</p>
          <p
            className="mt-2 text-2xl font-semibold text-neutral-900"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
