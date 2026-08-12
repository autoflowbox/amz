import type { OrderStatus } from '../../types'
import { Dropdown } from './Dropdown'

/**
 * Progress-flow statuses (Chờ ship → Chờ in → Đã gửi → DONE) get a white→dark-green gradient so the
 * badge color itself signals how far along an order is. 'Lưu ý' stays red (it's an attention flag,
 * not a step) and 'Hủy đơn' stays neutral gray (cancelled isn't "further along" than DONE).
 */
const STATUS_STYLES: Record<OrderStatus, string> = {
  '': 'bg-neutral-50 text-neutral-400 border-neutral-300 border-dashed',
  'Chờ ship': 'bg-white text-neutral-700 border-neutral-300',
  'Chờ in': 'bg-green-100 text-green-800 border-green-300',
  'Đã gửi': 'bg-green-300 text-green-900 border-green-400',
  'Lưu ý': 'bg-red-100 text-red-700 border-red-300',
  DONE: 'bg-green-700 text-white border-green-800',
  'Hủy đơn': 'bg-neutral-200 text-neutral-500 border-neutral-300 line-through',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  '': 'Chưa có status',
  'Chờ ship': '0 – New',
  'Chờ in': '1 – Cần in',
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
              className={`w-full text-left px-3 py-1.5 text-sm whitespace-nowrap hover:bg-neutral-100 ${
                s === status ? 'text-blue-600 font-medium' : 'text-neutral-700'
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
