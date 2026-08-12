import { useMemo, useState } from 'react'
import { useOrders } from '../../hooks/useOrders'
import { useShops } from '../../hooks/useShops'
import { useProductDefinitions } from '../../hooks/useProductDefinitions'
import { computeDashboardStats, getMonthStartStr, getTodayStr } from '../../lib/dashboardQueries'
import { StatCards } from './StatCards'
import { RankingBarChart } from './RankingBarChart'
import { AssigneeStatsTable } from './AssigneeStatsTable'

type Scope = 'all' | 'shop' | 'assignee'

export function Dashboard() {
  const { data: orders = [], isLoading } = useOrders()
  const { data: shops = [] } = useShops()
  const { data: definitions = [] } = useProductDefinitions()

  const [from, setFrom] = useState(getMonthStartStr)
  const [to, setTo] = useState(getTodayStr)
  const [scope, setScope] = useState<Scope>('all')
  const [shopId, setShopId] = useState<string>('')
  const [assignee, setAssignee] = useState<string>('')

  const assigneeOptions = useMemo(() => {
    const names = new Set<string>()
    orders.forEach((o) => {
      if (o.assignee.trim()) names.add(o.assignee.trim())
    })
    return [...names].sort((a, b) => a.localeCompare(b))
  }, [orders])

  const stats = useMemo(
    () =>
      computeDashboardStats(orders, definitions, shops, {
        from: from || null,
        to: to || null,
        shopId: scope === 'shop' ? shopId || null : null,
        assignee: scope === 'assignee' ? assignee || null : null,
      }),
    [orders, definitions, shops, from, to, scope, shopId, assignee],
  )

  if (isLoading) {
    return <p className="p-6 text-neutral-500 text-sm">Đang tải...</p>
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-neutral-100">
      <div className="flex items-center gap-3 flex-wrap rounded-xl border border-neutral-300 bg-white px-4 py-3">
        <div className="flex items-center gap-1.5">
          <label className="text-sm text-neutral-500">Từ ngày</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-sm text-neutral-500">Đến ngày</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          <label className="text-sm text-neutral-500">Của</label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as Scope)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
          >
            <option value="all">Toàn bộ</option>
            <option value="shop">Từng shop</option>
            <option value="assignee">Từng người làm đơn</option>
          </select>
          {scope === 'shop' && (
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            >
              <option value="">— chọn shop —</option>
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          {scope === 'assignee' && (
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 outline-none focus:border-blue-500"
            >
              <option value="">— chọn người làm đơn —</option>
              {assigneeOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <StatCards orderCount={stats.orderCount} revenue={stats.revenue} profit={stats.profit} />

      <div className="rounded-xl border border-neutral-300 bg-white p-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">
          Số đơn &amp; lợi nhuận theo người làm đơn
        </h2>
        <AssigneeStatsTable data={stats.assigneeStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-300 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">SKU bán chạy nhất (toàn bộ)</h2>
          <RankingBarChart
            data={stats.topSkus.map((s) => ({ label: `${s.sku} — ${s.productName}`, value: s.quantity }))}
            valueLabel="Số lượng"
            labelWidth={280}
          />
        </div>

        <div className="rounded-xl border border-neutral-300 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Loại sản phẩm bán chạy nhất</h2>
          <RankingBarChart
            data={stats.topProductTypes.map((p) => ({ label: p.productName, value: p.quantity }))}
            valueLabel="Số lượng"
          />
        </div>

        <div className="rounded-xl border border-neutral-300 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Xếp hạng tổng số đơn theo shop</h2>
          <RankingBarChart
            data={stats.shopRankings.map((s) => ({ label: s.shopName, value: s.orderCount }))}
            valueLabel="Số đơn"
          />
        </div>
      </div>
    </div>
  )
}
