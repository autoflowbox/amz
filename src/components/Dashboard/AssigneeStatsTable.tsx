import { formatCurrency } from '../../lib/profit'
import type { AssigneeStat } from '../../lib/dashboardQueries'

export function AssigneeStatsTable({ data }: { data: AssigneeStat[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-neutral-400 py-8 text-center">Chưa có dữ liệu.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-neutral-300">
            <th className="text-left font-semibold text-neutral-600 uppercase text-xs tracking-wide py-2 pr-3">
              Người làm đơn
            </th>
            <th className="text-right font-semibold text-neutral-600 uppercase text-xs tracking-wide py-2 px-3">
              Số đơn
            </th>
            <th className="text-right font-semibold text-neutral-600 uppercase text-xs tracking-wide py-2 px-3">
              Doanh thu
            </th>
            <th className="text-right font-semibold text-neutral-600 uppercase text-xs tracking-wide py-2 pl-3">
              Lợi nhuận
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.assigneeName} className="border-b border-neutral-200">
              <td className="py-2 pr-3 text-neutral-900 font-medium">{row.assigneeName}</td>
              <td className="py-2 px-3 text-right text-neutral-700" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {row.orderCount}
              </td>
              <td className="py-2 px-3 text-right text-neutral-700" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(row.revenue)}
              </td>
              <td
                className={`py-2 pl-3 text-right font-medium ${row.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatCurrency(row.profit)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
