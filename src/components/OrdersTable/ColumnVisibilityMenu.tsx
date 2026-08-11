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
        className="text-sm text-white/70 hover:text-white border border-white/15 rounded-md px-3 py-1.5 hover:bg-white/5"
      >
        Cột hiển thị
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-56 rounded-md border border-white/10 bg-neutral-900 p-2 shadow-xl">
            {columns.map((col) => {
              const visible = visibility[col.id] !== false
              return (
                <label
                  key={col.id}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-white/80 hover:bg-white/5 rounded cursor-pointer"
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
