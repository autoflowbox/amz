import type { OrderStatus } from '../../types'

const STATUS_STYLES: Record<OrderStatus, string> = {
  'Chờ ship': 'bg-white/10 text-white border-white/25',
  'Đã gửi': 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  DONE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  'Lưu ý': 'bg-red-500/20 text-red-300 border-red-500/50',
}

const STATUSES: OrderStatus[] = ['Chờ ship', 'Đã gửi', 'DONE', 'Lưu ý']

export function StatusBadge({
  status,
  onChange,
}: {
  status: OrderStatus
  onChange: (status: OrderStatus) => void
}) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className={`text-xs font-medium rounded-full border px-2.5 py-1 outline-none cursor-pointer ${STATUS_STYLES[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-neutral-900 text-white">
          {s}
        </option>
      ))}
    </select>
  )
}
