import type { OrderItem } from '../../types'

export function QuantityCell({ items }: { items: OrderItem[] }) {
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)
  const highlight = sorted.some((item) => item.quantity > 1) || sorted.length >= 2

  if (sorted.length === 0) {
    return <div className="w-full h-full min-h-[28px] px-1 py-1 text-xs text-neutral-400">—</div>
  }

  return (
    <div
      className={`w-full h-full min-h-[28px] px-1 py-1 text-xs text-center ${
        highlight ? 'bg-amber-100 text-amber-800 font-semibold' : ''
      }`}
    >
      {sorted.map((item) => (
        <div key={item.id} className="mb-1 last:mb-0 leading-tight">
          {item.quantity}
        </div>
      ))}
    </div>
  )
}
