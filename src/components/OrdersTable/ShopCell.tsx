import { useState } from 'react'
import type { Shop } from '../../types'
import { useAddShop, useUpdateShop } from '../../hooks/useShops'
import { getShopColorStyle } from '../../lib/shopColor'
import { Dropdown } from './Dropdown'

export function ShopCell({
  shopId,
  shops,
  onChange,
}: {
  shopId: string | null
  shops: Shop[]
  onChange: (shopId: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const addShop = useAddShop()
  const updateShop = useUpdateShop()

  const currentShop = shops.find((s) => s.id === shopId) ?? null

  function commitRename(shop: Shop) {
    const name = editName.trim()
    if (name && name !== shop.name) updateShop.mutate({ id: shop.id, name })
    setEditingId(null)
  }

  return (
    <Dropdown
      className="w-full"
      trigger={() => (
        <div
          className="w-full h-full min-h-[28px] px-1.5 py-1 text-sm cursor-pointer flex items-center rounded font-medium border border-neutral-300 bg-white text-neutral-900"
          style={getShopColorStyle(shopId, shops)}
        >
          {currentShop ? currentShop.name : <span className="opacity-60">— Chọn shop —</span>}
        </div>
      )}
    >
      {(close) => (
        <div className="py-1">
          {shops.map((shop) => {
            const style = getShopColorStyle(shop.id, shops)
            if (editingId === shop.id) {
              return (
                <form
                  key={shop.id}
                  className="flex items-center gap-1 px-2 py-1"
                  onSubmit={(e) => {
                    e.preventDefault()
                    commitRename(shop)
                  }}
                >
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Escape' && setEditingId(null)}
                    className="w-full rounded border border-blue-500 bg-white px-1.5 py-1 text-sm text-neutral-900 outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 text-emerald-600 hover:text-emerald-500 px-1 py-1 text-sm font-bold"
                    title="Lưu tên shop"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="shrink-0 text-neutral-400 hover:text-red-500 px-1 py-1 text-sm"
                    title="Hủy"
                  >
                    ✕
                  </button>
                </form>
              )
            }
            return (
              <div key={shop.id} className="flex items-center gap-1 px-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onChange(shop.id)
                    close()
                  }}
                  className={`flex-1 flex items-center gap-1.5 text-left px-1.5 py-1.5 text-sm rounded whitespace-nowrap hover:bg-neutral-100 ${
                    shop.id === shopId ? 'font-semibold text-neutral-900' : 'text-neutral-700'
                  }`}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: style.backgroundColor as string }}
                  />
                  {shop.name}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingId(shop.id)
                    setEditName(shop.name)
                  }}
                  className="text-neutral-400 hover:text-blue-600 px-1 py-1 text-xs"
                  title="Sửa tên shop"
                >
                  ✎
                </button>
              </div>
            )
          })}

          {shops.length === 0 && (
            <div className="px-3 py-1.5 text-xs text-neutral-400">Chưa có shop nào</div>
          )}

          <div className="border-t border-neutral-200 mt-1 pt-1 px-2">
            {adding ? (
              <form
                className="flex gap-1"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const name = newName.trim()
                  if (!name) {
                    setAdding(false)
                    return
                  }
                  const shop = await addShop.mutateAsync(name)
                  onChange(shop.id)
                  setAdding(false)
                  setNewName('')
                  close()
                }}
              >
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => setAdding(false)}
                  onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
                  placeholder="Tên shop mới"
                  className="w-full rounded border border-blue-500 bg-white px-2 py-1 text-sm text-neutral-900 outline-none"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="w-full text-left px-1 py-1.5 text-sm text-blue-600 hover:text-blue-500"
              >
                + Thêm shop mới
              </button>
            )}
          </div>
        </div>
      )}
    </Dropdown>
  )
}
