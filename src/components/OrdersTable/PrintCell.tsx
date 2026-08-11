import { useState } from 'react'
import type { Order, ProductDefinition, Shop } from '../../types'
import { printOrderLabel } from '../../lib/printLabel'
import { buildSheetRow } from '../../lib/sheetExport'

export function PrintCell({
  order,
  shops,
  definitions,
}: {
  order: Order
  shops: Shop[]
  definitions: ProductDefinition[]
}) {
  const [copied, setCopied] = useState(false)
  const shopName = shops.find((s) => s.id === order.shop_id)?.name ?? '—'

  async function handleExtract() {
    const row = buildSheetRow(order, definitions)
    try {
      await navigator.clipboard.writeText(row)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access can be denied by the browser — silently ignore.
    }
  }

  return (
    <div className="w-full h-full min-h-[28px] flex flex-col items-start gap-1 px-1.5 py-1">
      <button
        onClick={() => printOrderLabel(order, shopName, definitions)}
        className="text-xs text-white/70 hover:text-blue-400 border border-white/15 rounded-md px-2 py-1 hover:border-blue-500 whitespace-nowrap"
        title="Xem trước và in tem sản phẩm 100x150"
      >
        🖨 In tem
      </button>
      <button
        onClick={handleExtract}
        className={`text-xs rounded-md px-2 py-1 whitespace-nowrap border ${
          copied
            ? 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10'
            : 'text-white/70 hover:text-blue-400 border-white/15 hover:border-blue-500'
        }`}
        title="Copy địa chỉ dạng dòng để dán vào Google Sheet"
      >
        {copied ? '✓ Đã copy' : '📋 Extract'}
      </button>
    </div>
  )
}
