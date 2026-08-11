import { useState } from 'react'
import {
  useAddProductDefinition,
  useDeleteProductDefinition,
  useProductDefinitions,
  useUpdateProductDefinition,
} from '../../hooks/useProductDefinitions'

export function ProductDefinitionsModal({ onClose }: { onClose: () => void }) {
  const { data: definitions = [] } = useProductDefinitions()
  const addDef = useAddProductDefinition()
  const updateDef = useUpdateProductDefinition()
  const deleteDef = useDeleteProductDefinition()

  const [code, setCode] = useState('')
  const [productName, setProductName] = useState('')
  const [cost, setCost] = useState('')
  const [shipping, setShipping] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || !productName.trim()) return
    await addDef.mutateAsync({
      code: code.trim(),
      product_name: productName.trim(),
      cost: Number(cost) || 0,
      shipping: Number(shipping) || 0,
    })
    setCode('')
    setProductName('')
    setCost('')
    setShipping('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-2xl"
      >
        <h3 className="text-white font-medium mb-1">Thư viện định nghĩa SKU</h3>
        <p className="text-xs text-white/40 mb-4">
          Mỗi mã (VD: 2xMP hoặc 2xMousePad) gắn với 1 tên sản phẩm + giá cost + phí ship. Nhiều mã
          có thể trỏ tới cùng 1 sản phẩm.
        </p>

        <div className="max-h-72 overflow-y-auto space-y-1.5 mb-4">
          {definitions.map((def) => (
            <div
              key={def.id}
              className="grid grid-cols-[1fr_1.5fr_90px_90px_28px] gap-2 items-center rounded border border-white/10 px-2.5 py-1.5"
            >
              <input
                defaultValue={def.code}
                onBlur={(e) => {
                  const v = e.target.value.trim()
                  if (v && v !== def.code) updateDef.mutate({ id: def.id, patch: { code: v } })
                }}
                className="bg-transparent text-sm text-white outline-none border-b border-transparent focus:border-blue-500"
              />
              <input
                defaultValue={def.product_name}
                onBlur={(e) => {
                  const v = e.target.value.trim()
                  if (v && v !== def.product_name)
                    updateDef.mutate({ id: def.id, patch: { product_name: v } })
                }}
                className="bg-transparent text-sm text-white outline-none border-b border-transparent focus:border-blue-500"
              />
              <input
                type="number"
                step="0.01"
                defaultValue={def.cost}
                onBlur={(e) => {
                  const v = Number(e.target.value)
                  if (!Number.isNaN(v) && v !== def.cost) updateDef.mutate({ id: def.id, patch: { cost: v } })
                }}
                className="bg-transparent text-sm text-white outline-none border-b border-transparent focus:border-blue-500"
              />
              <input
                type="number"
                step="0.01"
                defaultValue={def.shipping}
                onBlur={(e) => {
                  const v = Number(e.target.value)
                  if (!Number.isNaN(v) && v !== def.shipping)
                    updateDef.mutate({ id: def.id, patch: { shipping: v } })
                }}
                className="bg-transparent text-sm text-white outline-none border-b border-transparent focus:border-blue-500"
              />
              <button
                onClick={() => deleteDef.mutate(def.id)}
                className="text-white/40 hover:text-red-400"
                title="Xóa"
              >
                ✕
              </button>
            </div>
          ))}
          {definitions.length === 0 && (
            <p className="text-sm text-white/40">Chưa có định nghĩa nào.</p>
          )}
        </div>

        <form onSubmit={handleAdd} className="grid grid-cols-[1fr_1.5fr_90px_90px_auto] gap-2 items-center">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Mã (2xMP)"
            className="rounded border border-white/15 bg-neutral-800 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
          />
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Tên sản phẩm"
            className="rounded border border-white/15 bg-neutral-800 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
          />
          <input
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Cost"
            className="rounded border border-white/15 bg-neutral-800 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
          />
          <input
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Ship"
            className="rounded border border-white/15 bg-neutral-800 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-sm text-white font-medium whitespace-nowrap"
          >
            + Thêm
          </button>
        </form>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
