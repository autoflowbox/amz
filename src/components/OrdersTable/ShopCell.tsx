import { useState } from 'react'
import type { Shop } from '../../types'
import { useAddShop } from '../../hooks/useShops'

const ADD_NEW = '__add_new__'

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
  const addShop = useAddShop()

  if (adding) {
    return (
      <form
        className="flex gap-1 p-1"
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
        }}
      >
        <input
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={() => setAdding(false)}
          onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
          placeholder="Tên shop mới"
          className="w-full rounded border border-blue-500 bg-neutral-800 px-1.5 py-1 text-sm text-white outline-none"
        />
      </form>
    )
  }

  return (
    <select
      value={shopId ?? ''}
      onChange={(e) => {
        if (e.target.value === ADD_NEW) {
          setAdding(true)
          return
        }
        onChange(e.target.value)
      }}
      className="w-full h-full min-h-[28px] bg-transparent px-1.5 py-1 text-sm text-white outline-none cursor-pointer"
    >
      <option value="" className="bg-neutral-900">
        — Chọn shop —
      </option>
      {shops.map((shop) => (
        <option key={shop.id} value={shop.id} className="bg-neutral-900">
          {shop.name}
        </option>
      ))}
      <option value={ADD_NEW} className="bg-neutral-900 text-blue-400">
        + Thêm shop mới
      </option>
    </select>
  )
}
