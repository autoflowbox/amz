import { useMemo } from 'react'
import { useOrders } from '../../hooks/useOrders'
import { useShops } from '../../hooks/useShops'
import { useProductDefinitions } from '../../hooks/useProductDefinitions'
import { computeDashboardStats } from '../../lib/dashboardQueries'
import { StatCards } from './StatCards'
import { RankingBarChart } from './RankingBarChart'

export function Dashboard() {
  const { data: orders = [], isLoading } = useOrders()
  const { data: shops = [] } = useShops()
  const { data: definitions = [] } = useProductDefinitions()

  const stats = useMemo(
    () => computeDashboardStats(orders, definitions, shops),
    [orders, definitions, shops],
  )

  if (isLoading) {
    return <p className="p-6 text-white/50 text-sm">Đang tải...</p>
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <StatCards
        ordersThisMonth={stats.ordersThisMonth}
        revenueThisMonth={stats.revenueThisMonth}
        profitThisMonth={stats.profitThisMonth}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-neutral-900 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Top 10 SKU bán chạy nhất</h2>
          <RankingBarChart
            data={stats.topSkus.map((s) => ({ label: s.skuCode, value: s.quantity }))}
            valueLabel="Số lượng"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-900 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Loại sản phẩm bán chạy nhất</h2>
          <RankingBarChart
            data={stats.topProductTypes.map((p) => ({ label: p.productName, value: p.quantity }))}
            valueLabel="Số lượng"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-900 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white mb-4">Xếp hạng tổng số đơn theo shop</h2>
          <RankingBarChart
            data={stats.shopRankings.map((s) => ({ label: s.shopName, value: s.orderCount }))}
            valueLabel="Số đơn"
          />
        </div>
      </div>
    </div>
  )
}
