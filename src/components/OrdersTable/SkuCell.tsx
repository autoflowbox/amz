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
  orderId,
  address,
  shippingDate,
  onSave,
  onSaveOrderId,
  onSaveAddress,
  onSaveShippingDate,
}: {
  items: OrderItem[]
  definitions: ProductDefinition[]
  orderId: string
  address: string
  shippingDate: string | null
  onSave: (lines: SkuLineInput[]) => void
  onSaveOrderId: (value: string) => void
  onSaveAddress: (value: string) => void
  onSaveShippingDate: (value: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [rows, setRows] = useState<EditRow[]>([])
  const [orderIdDraft, setOrderIdDraft] = useState('')
  const [addressDraft, setAddressDraft] = useState('')
  const [shippingDateDraft, setShippingDateDraft] = useState('')

  function openEditor() {
    setRows(items.length > 0 ? toEditRows(items) : [{ key: crypto.randomUUID(), sku: '', quantity: 1 }])
    setOrderIdDraft(orderId)
    setAddressDraft(address)
    setShippingDateDraft(shippingDate ?? '')
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
    if (orderIdDraft !== orderId) onSaveOrderId(orderIdDraft)
    if (addressDraft !== address) onSaveAddress(addressDraft)
    if (shippingDateDraft !== (shippingDate ?? '')) onSaveShippingDate(shippingDateDraft)
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
          <span className="text-neutral-400">— chưa có SKU —</span>
        ) : (
          sorted.map((item) => {
            const def = findProductDefinition(item.sku, definitions)
            return (
              <div key={item.id} className="mb-1 last:mb-0">
                <div className="text-neutral-900 leading-tight">{item.sku}</div>
                {def ? (
                  <div className="text-[11px] text-neutral-500 leading-tight">{def.product_name}</div>
                ) : (
                  <div className="text-[11px] text-red-600 leading-tight">Chưa xác định sản phẩm</div>
                )}
              </div>
            )
          })
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setEditing(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-neutral-300 bg-white p-5 shadow-xl"
          >
            <h3 className="text-neutral-900 font-medium mb-3">Thông tin đơn hàng</h3>

            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Order ID
            </label>
            <input
              value={orderIdDraft}
              onChange={(e) => setOrderIdDraft(e.target.value)}
              placeholder="Order ID"
              className="w-full mb-3 rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />

            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              SKU
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {rows.map((row, i) => {
                const def = findProductDefinition(row.sku, definitions)
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
                        className="w-full rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
                      />
                      <div className="text-[11px] mt-0.5 leading-tight">
                        {row.sku.trim() === '' ? (
                          <span className="text-neutral-400">&nbsp;</span>
                        ) : def ? (
                          <span className="text-neutral-500">{def.product_name}</span>
                        ) : (
                          <span className="text-red-600">Chưa xác định sản phẩm</span>
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
                      className="w-16 rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                      className="text-neutral-400 hover:text-red-500 px-1.5 py-1.5"
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
              className="mt-2 inline-flex items-center gap-1 rounded-md border border-blue-300 bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700 hover:border-blue-500 hover:bg-blue-100"
            >
              + Thêm SKU
            </button>

            <label className="block mt-4 text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Address
            </label>
            <textarea
              value={addressDraft}
              onChange={(e) => setAddressDraft(e.target.value)}
              rows={3}
              placeholder="Địa chỉ"
              className="w-full rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />

            <label className="block mt-4 text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Shipping Date
            </label>
            <input
              type="date"
              value={shippingDateDraft}
              onChange={(e) => setShippingDateDraft(e.target.value)}
              className="w-full rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
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
