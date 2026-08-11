import { formatCurrency } from '../../lib/profit'

export function StatCards({
  ordersThisMonth,
  revenueThisMonth,
  profitThisMonth,
}: {
  ordersThisMonth: number
  revenueThisMonth: number
  profitThisMonth: number
}) {
  const cards = [
    { label: 'Đơn hàng tháng này', value: String(ordersThisMonth) },
    { label: 'Doanh thu tháng này', value: formatCurrency(revenueThisMonth) },
    { label: 'Lợi nhuận tháng này', value: formatCurrency(profitThisMonth) },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-white/10 bg-neutral-900 p-5">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wide">{card.label}</p>
          <p
            className="mt-2 text-2xl font-semibold text-white"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
