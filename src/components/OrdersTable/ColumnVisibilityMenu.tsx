import { useState } from 'react'
import type { VisibilityState } from '@tanstack/react-table'

export function ColumnVisibilityMenu({
  columns,
  visibility,
  onChange,
}: {
  columns: { id: string; label: string }[]
  visibility: VisibilityState
  onChange: (next: VisibilityState) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-md px-3 py-1.5 hover:bg-neutral-100"
      >
        Cột hiển thị
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-56 rounded-md border border-neutral-300 bg-white p-2 shadow-lg">
            {columns.map((col) => {
              const visible = visibility[col.id] !== false
              return (
                <label
                  key={col.id}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={() => onChange({ ...visibility, [col.id]: !visible })}
                  />
                  {col.label}
                </label>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
