import { useState } from 'react'
import type { OrderItem, ProductDefinition } from '../../types'
import { findProductDefinition, parseSkuCode } from '../../lib/sku'
import type { SkuLineInput } from '../../hooks/useOrders'

interface EditRow {
  key: string
  sku: string
  quantity: number
}

function toEditRows(items: OrderItem[]): EditRow[] {
  return [...items]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({ key: item.id, sku: item.sku, quantity: item.quantity }))
}

export function SkuCell({
  items,
  definitions,
  onSave,
}: {
  items: OrderItem[]
  definitions: ProductDefinition[]
  onSave: (lines: SkuLineInput[]) => void
}) {
  const [editing, setEditing] = useState(false)
  const [rows, setRows] = useState<EditRow[]>([])

  function openEditor() {
    setRows(items.length > 0 ? toEditRows(items) : [{ key: crypto.randomUUID(), sku: '', quantity: 1 }])
    setEditing(true)
  }

  function save() {
    const lines: SkuLineInput[] = rows
      .filter((r) => r.sku.trim() !== '')
      .map((r) => ({
        sku: r.sku.trim(),
        sku_code: parseSkuCode(r.sku),
        quantity: r.quantity || 1,
      }))
    onSave(lines)
    setEditing(false)
  }

  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <>
      <div
        onClick={openEditor}
        className="w-full h-full min-h-[28px] px-1.5 py-1 text-sm cursor-pointer"
        title="Nhấp để sửa danh sách SKU"
      >
        {sorted.length === 0 ? (
          <span className="text-white/25">— chưa có SKU —</span>
        ) : (
          sorted.map((item) => {
            const def = findProductDefinition(item.sku_code, definitions)
            return (
              <div key={item.id} className="mb-1 last:mb-0">
                <div className="text-white leading-tight">{item.sku}</div>
                {def ? (
                  <div className="text-[11px] text-white/40 leading-tight">{def.product_name}</div>
                ) : (
                  <div className="text-[11px] text-red-400 leading-tight">Chưa xác định sản phẩm</div>
                )}
              </div>
            )
          })
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setEditing(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-2xl"
          >
            <h3 className="text-white font-medium mb-3">Danh sách SKU trong đơn</h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {rows.map((row, i) => {
                const code = parseSkuCode(row.sku)
                const def = findProductDefinition(code, definitions)
                return (
                  <div key={row.key} className="flex items-start gap-2">
                    <div className="flex-1">
                      <input
                        value={row.sku}
                        onChange={(e) => {
                          const next = [...rows]
                          next[i] = { ...next[i], sku: e.target.value }
                          setRows(next)
                        }}
                        placeholder="VD: 2xMP-mpWISHpq1ELECTRICIA40830"
                        className="w-full rounded border border-white/15 bg-neutral-800 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                      />
                      <div className="text-[11px] mt-0.5 leading-tight">
                        {row.sku.trim() === '' ? (
                          <span className="text-white/25">&nbsp;</span>
                        ) : def ? (
                          <span className="text-white/40">{def.product_name}</span>
                        ) : (
                          <span className="text-red-400">Chưa xác định sản phẩm (mã: {code})</span>
                        )}
                      </div>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={row.quantity}
                      onChange={(e) => {
                        const next = [...rows]
                        next[i] = { ...next[i], quantity: Number(e.target.value) || 1 }
                        setRows(next)
                      }}
                      className="w-16 rounded border border-white/15 bg-neutral-800 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                      className="text-white/40 hover:text-red-400 px-1.5 py-1.5"
                      title="Xóa dòng"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => setRows([...rows, { key: crypto.randomUUID(), sku: '', quantity: 1 }])}
              className="mt-3 text-sm text-blue-400 hover:text-blue-300"
            >
              + Thêm SKU
            </button>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
              >
                Hủy
              </button>
              <button
                onClick={save}
                className="rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-sm text-white font-medium"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
