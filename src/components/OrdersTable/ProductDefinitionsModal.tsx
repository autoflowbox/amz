import { useState } from 'react'
import {
  useAddProductDefinition,
  useDeleteProductDefinition,
  useProductDefinitions,
  useUpdateProductDefinition,
} from '../../hooks/useProductDefinitions'

const GRID_COLS =
  'grid-cols-[70px_150px_130px_60px_60px_60px_60px_54px_54px_54px_80px_74px_110px_110px_32px]'

const emptyForm = {
  idTem: '',
  productName: '',
  code: '',
  cost: '',
  shipping: '',
  weight: '',
  pWeight: '',
  length: '',
  width: '',
  height: '',
  hsCode: '',
  itemPrice: '',
  note1: '',
  note2: '',
}

export function ProductDefinitionsModal({ onClose }: { onClose: () => void }) {
  const { data: definitions = [] } = useProductDefinitions()
  const addDef = useAddProductDefinition()
  const updateDef = useUpdateProductDefinition()
  const deleteDef = useDeleteProductDefinition()

  const [form, setForm] = useState(emptyForm)

  function setField(key: keyof typeof emptyForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.code.trim() || !form.productName.trim()) return
    await addDef.mutateAsync({
      id_tem: form.idTem.trim(),
      code: form.code.trim(),
      product_name: form.productName.trim(),
      cost: Number(form.cost) || 0,
      shipping: Number(form.shipping) || 0,
      weight: Number(form.weight) || 0,
      p_weight: Number(form.pWeight) || 0,
      length: Number(form.length) || 0,
      width: Number(form.width) || 0,
      height: Number(form.height) || 0,
      hs_code: form.hsCode.trim(),
      item_price: Number(form.itemPrice) || 0,
      note1: form.note1.trim(),
      note2: form.note2.trim(),
    })
    setForm(emptyForm)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl rounded-xl border border-neutral-300 bg-white p-5 shadow-xl"
      >
        <h3 className="text-neutral-900 font-medium mb-1">Thư viện SKU</h3>
        <p className="text-xs text-neutral-500 mb-4">
          Cột <span className="text-neutral-700">Keyword SKU</span> là các từ khóa chứa trong SKU, cách
          nhau bởi dấu phẩy — hễ SKU của đơn hàng khớp với <em>bất kỳ</em> từ khóa nào trong đó ở bất
          kỳ vị trí nào (không cần khớp chính xác) thì được nhận diện là sản phẩm đó. VD: 2 Mousepad |{' '}
          <span className="text-neutral-700">2xMousepad, 2xMP, 2Mpad</span> — điền thêm không giới hạn số
          từ khóa.
        </p>

        <div className="overflow-x-auto">
          <div className={`grid ${GRID_COLS} gap-2 px-2.5 mb-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide`}>
            <span>ID-Tem</span>
            <span>Sản phẩm</span>
            <span>Keyword SKU</span>
            <span>Cost</span>
            <span>Ship</span>
            <span>U-Weight</span>
            <span>P-Weight</span>
            <span>Length</span>
            <span>Width</span>
            <span>Height</span>
            <span>HS Code</span>
            <span>Item Price</span>
            <span>Note 1</span>
            <span>Note 2</span>
            <span />
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1.5 mb-4">
            {definitions.map((def) => (
              <div
                key={def.id}
                className={`grid ${GRID_COLS} gap-2 items-center rounded border border-neutral-300 px-2.5 py-1.5`}
              >
                <input
                  defaultValue={def.id_tem}
                  onBlur={(e) => {
                    const v = e.target.value.trim()
                    if (v !== def.id_tem) updateDef.mutate({ id: def.id, patch: { id_tem: v } })
                  }}
                  className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
                />
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
                <input
                  type="number"
                  step="0.01"
                  defaultValue={def.weight}
                  onBlur={(e) => {
                    const v = Number(e.target.value)
                    if (!Number.isNaN(v) && v !== def.weight)
                      updateDef.mutate({ id: def.id, patch: { weight: v } })
                  }}
                  className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
                />
                <input
                  type="number"
                  step="0.01"
                  defaultValue={def.p_weight}
                  onBlur={(e) => {
                    const v = Number(e.target.value)
                    if (!Number.isNaN(v) && v !== def.p_weight)
                      updateDef.mutate({ id: def.id, patch: { p_weight: v } })
                  }}
                  className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
                />
                <input
                  type="number"
                  step="0.01"
                  defaultValue={def.length}
                  onBlur={(e) => {
                    const v = Number(e.target.value)
                    if (!Number.isNaN(v) && v !== def.length)
                      updateDef.mutate({ id: def.id, patch: { length: v } })
                  }}
                  className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
                />
                <input
                  type="number"
                  step="0.01"
                  defaultValue={def.width}
                  onBlur={(e) => {
                    const v = Number(e.target.value)
                    if (!Number.isNaN(v) && v !== def.width)
                      updateDef.mutate({ id: def.id, patch: { width: v } })
                  }}
                  className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
                />
                <input
                  type="number"
                  step="0.01"
                  defaultValue={def.height}
                  onBlur={(e) => {
                    const v = Number(e.target.value)
                    if (!Number.isNaN(v) && v !== def.height)
                      updateDef.mutate({ id: def.id, patch: { height: v } })
                  }}
                  className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
                />
                <input
                  defaultValue={def.hs_code}
                  onBlur={(e) => {
                    const v = e.target.value.trim()
                    if (v !== def.hs_code) updateDef.mutate({ id: def.id, patch: { hs_code: v } })
                  }}
                  className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
                />
                <input
                  type="number"
                  step="0.01"
                  defaultValue={def.item_price}
                  onBlur={(e) => {
                    const v = Number(e.target.value)
                    if (!Number.isNaN(v) && v !== def.item_price)
                      updateDef.mutate({ id: def.id, patch: { item_price: v } })
                  }}
                  className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
                />
                <input
                  defaultValue={def.note1}
                  onBlur={(e) => {
                    const v = e.target.value.trim()
                    if (v !== def.note1) updateDef.mutate({ id: def.id, patch: { note1: v } })
                  }}
                  className="bg-transparent text-sm text-neutral-900 outline-none border-b border-transparent focus:border-blue-500"
                />
                <input
                  defaultValue={def.note2}
                  onBlur={(e) => {
                    const v = e.target.value.trim()
                    if (v !== def.note2) updateDef.mutate({ id: def.id, patch: { note2: v } })
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

          <form onSubmit={handleAdd} className={`grid ${GRID_COLS} gap-2 items-center`}>
            <input
              value={form.idTem}
              onChange={(e) => setField('idTem', e.target.value)}
              placeholder="ID-Tem"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.productName}
              onChange={(e) => setField('productName', e.target.value)}
              placeholder="Tên sản phẩm"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.code}
              onChange={(e) => setField('code', e.target.value)}
              placeholder="Keyword SKU"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.cost}
              onChange={(e) => setField('cost', e.target.value)}
              type="number"
              step="0.01"
              placeholder="Cost"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.shipping}
              onChange={(e) => setField('shipping', e.target.value)}
              type="number"
              step="0.01"
              placeholder="Ship"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.weight}
              onChange={(e) => setField('weight', e.target.value)}
              type="number"
              step="0.01"
              placeholder="U-Weight"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.pWeight}
              onChange={(e) => setField('pWeight', e.target.value)}
              type="number"
              step="0.01"
              placeholder="P-Weight"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.length}
              onChange={(e) => setField('length', e.target.value)}
              type="number"
              step="0.01"
              placeholder="L"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.width}
              onChange={(e) => setField('width', e.target.value)}
              type="number"
              step="0.01"
              placeholder="W"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.height}
              onChange={(e) => setField('height', e.target.value)}
              type="number"
              step="0.01"
              placeholder="H"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.hsCode}
              onChange={(e) => setField('hsCode', e.target.value)}
              placeholder="HS Code"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.itemPrice}
              onChange={(e) => setField('itemPrice', e.target.value)}
              type="number"
              step="0.01"
              placeholder="Price"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.note1}
              onChange={(e) => setField('note1', e.target.value)}
              placeholder="Note 1"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <input
              value={form.note2}
              onChange={(e) => setField('note2', e.target.value)}
              placeholder="Note 2"
              className="rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 hover:bg-blue-500 py-1.5 text-sm text-white font-medium"
              title="Thêm"
            >
              +
            </button>
          </form>
        </div>

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
