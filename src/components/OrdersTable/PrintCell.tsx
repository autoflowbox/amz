import type { Order, ProductDefinition, Shop } from '../../types'
import { printOrderLabel } from '../../lib/printLabel'

export function PrintCell({
  order,
  shops,
  definitions,
}: {
  order: Order
  shops: Shop[]
  definitions: ProductDefinition[]
}) {
  const shopName = shops.find((s) => s.id === order.shop_id)?.name ?? '—'

  return (
    <div className="w-full h-full min-h-[28px] flex items-center px-1.5 py-1">
      <button
        onClick={() => printOrderLabel(order, shopName, definitions)}
        className="text-xs text-white/70 hover:text-blue-400 border border-white/15 rounded-md px-2 py-1 hover:border-blue-500 whitespace-nowrap"
        title="In tem sản phẩm 100x150"
      >
        🖨 In tem
      </button>
    </div>
  )
}
