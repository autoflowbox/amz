import { useRef, useState } from 'react'
import { formatDateDMY, getShippingDateInfo, urgencyClasses } from '../../lib/shippingDate'

export function ShippingDateCell({
  shippingDate,
  onSave,
}: {
  shippingDate: string | null
  onSave: (value: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const info = getShippingDateInfo(shippingDate)

  if (editing) {
    return (
      <input
        ref={(el) => {
          inputRef.current = el
          if (el) {
            el.focus()
            // Opens the native calendar picker right away instead of just showing a caret.
            try {
              el.showPicker?.()
            } catch {
              // showPicker isn't supported everywhere — the field still works via manual click.
            }
          }
        }}
        type="date"
        defaultValue={shippingDate ?? ''}
        onChange={(e) => {
          setEditing(false)
          if (e.target.value !== (shippingDate ?? '')) onSave(e.target.value)
        }}
        onBlur={(e) => {
          setEditing(false)
          if (e.target.value !== (shippingDate ?? '')) onSave(e.target.value)
        }}
        onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
        className="w-full h-full min-h-[28px] rounded border border-blue-500 bg-white px-1.5 py-1 text-sm text-neutral-900 outline-none"
      />
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="w-full h-full min-h-[28px] px-1.5 py-1 text-sm cursor-pointer flex items-center"
      title="Nhấp để chọn ngày"
    >
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${urgencyClasses[info.urgency]}`}
      >
        {formatDateDMY(shippingDate)} {info.daysLeft !== null && `· ${info.label}`}
      </span>
    </div>
  )
}
