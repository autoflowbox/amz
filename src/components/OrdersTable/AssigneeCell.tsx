import { useState } from 'react'
import { Dropdown } from './Dropdown'

/**
 * Creatable dropdown for "Người làm đơn": pick from names already used elsewhere in the table,
 * or type a brand new one — no separate backend list, options are derived from existing orders.
 */
export function AssigneeCell({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  return (
    <Dropdown
      className="w-full"
      trigger={() => (
        <div className="w-full h-full min-h-[28px] px-1.5 py-1 text-sm cursor-pointer flex items-center">
          {value.trim() === '' ? (
            <span className="text-neutral-400">Team</span>
          ) : (
            <span className="text-neutral-900">{value}</span>
          )}
        </div>
      )}
    >
      {(close) => (
        <div className="py-1">
          {options.length === 0 && (
            <div className="px-3 py-1.5 text-xs text-neutral-400">Chưa có ai trong danh sách</div>
          )}
          {options.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onChange(name)
                close()
              }}
              className={`w-full text-left px-3 py-1.5 text-sm whitespace-nowrap hover:bg-neutral-100 ${
                name === value ? 'text-blue-600 font-medium' : 'text-neutral-700'
              }`}
            >
              {name}
            </button>
          ))}

          <div className="border-t border-neutral-200 mt-1 pt-1 px-2">
            {adding ? (
              <form
                className="flex gap-1"
                onSubmit={(e) => {
                  e.preventDefault()
                  const name = newName.trim()
                  if (name) {
                    onChange(name)
                    setNewName('')
                    setAdding(false)
                    close()
                  }
                }}
              >
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
                  placeholder="Tên người làm đơn mới"
                  className="w-full rounded border border-blue-500 bg-white px-2 py-1 text-sm text-neutral-900 outline-none"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="w-full text-left px-1 py-1.5 text-sm text-blue-600 hover:text-blue-500"
              >
                + Thêm người mới
              </button>
            )}
          </div>
        </div>
      )}
    </Dropdown>
  )
}
