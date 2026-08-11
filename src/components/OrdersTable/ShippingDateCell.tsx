import { useState } from 'react'
import { getShippingDateInfo, urgencyClasses } from '../../lib/shippingDate'

export function ShippingDateCell({
  shippingDate,
  onSave,
}: {
  shippingDate: string | null
  onSave: (value: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const info = getShippingDateInfo(shippingDate)

  if (editing) {
    return (
      <input
        type="date"
        autoFocus
        defaultValue={shippingDate ?? ''}
        onBlur={(e) => {
          setEditing(false)
          if (e.target.value !== (shippingDate ?? '')) onSave(e.target.value)
        }}
        onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
        className="w-full h-full min-h-[28px] rounded border border-blue-500 bg-neutral-800 px-1.5 py-1 text-sm text-white outline-none"
      />
    )
  }

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      className="w-full h-full min-h-[28px] px-1.5 py-1 text-sm cursor-text flex items-center"
      title="Nhấp đúp để sửa"
    >
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${urgencyClasses[info.urgency]}`}
      >
        {shippingDate ?? '—'} {info.daysLeft !== null && `· ${info.label}`}
      </span>
    </div>
  )
}
