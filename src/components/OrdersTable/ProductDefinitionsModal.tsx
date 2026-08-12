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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl border border-neutral-300 bg-white p-5 shadow-xl"
      >
        <h3 className="text-neutral-900 font-medium mb-1">Thư viện SKU</h3>
        <p className="text-xs text-neutral-500 mb-4">
          Cột <span className="text-neutral-700">Keyword SKU</span> là các từ khóa chứa trong SKU, cách
          nhau bởi dấu phẩy — hễ SKU của đơn hàng khớp với <em>bất kỳ</em> từ khóa nào trong đó ở bất
          kỳ vị trí nào (không cần khớp chính xác) thì được nhận diện là sản phẩm đó. VD: 2 Mousepad |{' '}
          <span className="text-neutral-700">2xMousepad, 2xMP, 2Mpad</span> — điền thêm không giới hạn số
          từ khóa.
        </p>

        <div className="grid grid-cols-[1.5fr_1fr_90px_90px_28px] gap-2 px-2.5 mb-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          <span>Sản phẩm</span>
          <span>Keyword SKU</span>
          <span>Giá cost</span>
          <span>Phí ship</span>
          <span />
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1.5 mb-4">
          {definitions.map((def) => (
            <div
              key={def.id}
              className="grid grid-cols-[1.5fr_1fr_90px_90px_28px] gap-2 items-center rounded border border-neutral-300 px-2.5 py-1.5"
            >
              <input
                defaultValue={def.product_name}
                onBlur={(e) => {
                  const v = e.target.value.trim()
                  if (v && v !== def.product_name)
                    updateDef.mutate({ id: def.id, patch: { product_name: v } })
                }}
                className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
              />
              <input
                defaultValue={def.code}
                onBlur={(e) => {
                  const v = e.target.value.trim()
                  if (v && v !== def.code) updateDef.mutate({ id: def.id, patch: { code: v } })
                }}
                className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
              />
              <input
                type="number"
                step="0.01"
                defaultValue={def.cost}
                onBlur={(e) => {
                  const v = Number(e.target.value)
                  if (!Number.isNaN(v) && v !== def.cost) updateDef.mutate({ id: def.id, patch: { cost: v } })
                }}
                className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
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
                className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
              />
              <button
                onClick={() => {
                  if (confirm(`Xóa sản phẩm "${def.product_name}"?`)) deleteDef.mutate(def.id)
                }}
                className="text-neutral-400 hover:text-red-500"
                title="Xóa"
              >
                ✕
              </button>
            </div>
          ))}
          {definitions.length === 0 && (
            <p className="text-sm text-neutral-500">Chưa có định nghĩa nào.</p>
          )}
        </div>

        <form onSubmit={handleAdd} className="grid grid-cols-[1.5fr_1fr_90px_90px_auto] gap-2 items-center">
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Tên sản phẩm"
            className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Keyword SKU (VD: 2xMP, 2xMousepad, 2Mpad)"
            className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
          />
          <input
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Cost"
            className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
          />
          <input
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Ship"
            className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
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
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
