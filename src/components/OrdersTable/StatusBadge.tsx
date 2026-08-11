import type { OrderStatus } from '../../types'
import { Dropdown } from './Dropdown'

const STATUS_STYLES: Record<OrderStatus, string> = {
  '': 'bg-white/5 text-white/40 border-white/15 border-dashed',
  'Chờ ship': 'bg-white/10 text-white border-white/25',
  'Chờ in': 'bg-purple-500/15 text-purple-300 border-purple-500/40',
  'Đã gửi': 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  'Lưu ý': 'bg-red-500/20 text-red-300 border-red-500/50',
  DONE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  'Hủy đơn': 'bg-neutral-500/20 text-neutral-400 border-neutral-500/40 line-through',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  '': 'Chưa có status',
  'Chờ ship': '0 – Chờ Ship',
  'Chờ in': '1 – Chờ in',
  'Đã gửi': '2 – Đã gửi',
  'Lưu ý': '3 – Lưu ý',
  DONE: '4 – DONE',
  'Hủy đơn': '5 – Hủy đơn',
}

const STATUSES: OrderStatus[] = ['', 'Chờ ship', 'Chờ in', 'Đã gửi', 'Lưu ý', 'DONE', 'Hủy đơn']

export function StatusBadge({
  status,
  onChange,
}: {
  status: OrderStatus
  onChange: (status: OrderStatus) => void
}) {
  return (
    <Dropdown
      trigger={() => (
        <span
          className={`inline-flex items-center text-xs font-medium rounded-full border px-2.5 py-1 cursor-pointer whitespace-nowrap ${STATUS_STYLES[status] ?? STATUS_STYLES['']}`}
        >
          {STATUS_LABELS[status] ?? (status || 'Chưa có status')}
        </span>
      )}
    >
      {(close) => (
        <div className="py-1">
          {STATUSES.map((s) => (
            <button
              key={s || '__none__'}
              type="button"
              onClick={() => {
                onChange(s)
                close()
              }}
              className={`w-full text-left px-3 py-1.5 text-sm whitespace-nowrap hover:bg-white/10 ${
                s === status ? 'text-blue-400 font-medium' : 'text-white/80'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  )
}
