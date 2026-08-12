import type { Order, ProductDefinition, Shop } from '../types'
import { computeProfit } from './profit'
import { findProductDefinition } from './sku'

export interface SkuRanking {
  sku: string
  productName: string
  quantity: number
}

export interface ProductTypeRanking {
  productName: string
  quantity: number
}

export interface ShopRanking {
  shopName: string
  orderCount: number
}

export interface AssigneeStat {
  assigneeName: string
  orderCount: number
  revenue: number
  profit: number
}

export interface DashboardStats {
  topSkus: SkuRanking[]
  topProductTypes: ProductTypeRanking[]
  orderCount: number
  revenue: number
  profit: number
  shopRankings: ShopRanking[]
  assigneeStats: AssigneeStat[]
}

export interface DashboardFilters {
  /** Inclusive "YYYY-MM-DD" bounds on order.created_at. Null means unbounded on that side. */
  from: string | null
  to: string | null
  /** Null means every shop; otherwise restrict to this shop id. */
  shopId: string | null
  /** Null means every assignee; otherwise restrict to orders made by this person. */
  assignee: string | null
}

/** First day of the current calendar month, as "YYYY-MM-DD". */
export function getMonthStartStr(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

/** Today's date, as "YYYY-MM-DD". */
export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function orderMatchesFilters(order: Order, filters: DashboardFilters): boolean {
  if (filters.shopId && order.shop_id !== filters.shopId) return false
  if (filters.assignee && order.assignee.trim() !== filters.assignee) return false
  const orderDate = order.created_at.slice(0, 10)
  if (filters.from && orderDate < filters.from) return false
  if (filters.to && orderDate > filters.to) return false
  return true
}

export function computeDashboardStats(
  orders: Order[],
  definitions: ProductDefinition[],
  shops: Shop[],
  filters: DashboardFilters,
): DashboardStats {
  const skuTotals = new Map<string, { productName: string; quantity: number }>()
  const productTypeTotals = new Map<string, number>()
  const shopOrderCounts = new Map<string, number>()
  const assigneeTotals = new Map<string, { orderCount: number; revenue: number; profit: number }>()

  let orderCount = 0
  let revenue = 0
  let profit = 0

  for (const order of orders) {
    if (!orderMatchesFilters(order, filters)) continue

    const shopName = shops.find((s) => s.id === order.shop_id)?.name ?? 'Không rõ shop'
    shopOrderCounts.set(shopName, (shopOrderCounts.get(shopName) ?? 0) + 1)

    const assigneeName = order.assignee.trim() || 'Chưa gán'
    const orderProfit = computeProfit(order.price, order.order_items, definitions)
    const assigneeExisting = assigneeTotals.get(assigneeName)
    assigneeTotals.set(assigneeName, {
      orderCount: (assigneeExisting?.orderCount ?? 0) + 1,
      revenue: (assigneeExisting?.revenue ?? 0) + (order.price || 0),
      profit: (assigneeExisting?.profit ?? 0) + orderProfit,
    })

    for (const item of order.order_items ?? []) {
      const def = findProductDefinition(item.sku, definitions)
      const productName = def?.product_name ?? item.sku_code ?? 'Chưa xác định'

      // Group by the full SKU string (not the truncated sku_code) so the dashboard shows the
      // complete product identifier, e.g. "VN-3xSPOONSi-ATJobV101-D10-1123".
      const skuKey = item.sku
      const existing = skuTotals.get(skuKey)
      skuTotals.set(skuKey, {
        productName,
        quantity: (existing?.quantity ?? 0) + item.quantity,
      })

      productTypeTotals.set(productName, (productTypeTotals.get(productName) ?? 0) + item.quantity)
    }

    orderCount += 1
    revenue += order.price || 0
    profit += orderProfit
  }

  const topSkus: SkuRanking[] = [...skuTotals.entries()]
    .map(([sku, v]) => ({ sku, productName: v.productName, quantity: v.quantity }))
    .sort((a, b) => b.quantity - a.quantity)

  const topProductTypes: ProductTypeRanking[] = [...productTypeTotals.entries()]
    .map(([productName, quantity]) => ({ productName, quantity }))
    .sort((a, b) => b.quantity - a.quantity)

  const shopRankings: ShopRanking[] = [...shopOrderCounts.entries()]
    .map(([shopName, orderCount]) => ({ shopName, orderCount }))
    .sort((a, b) => b.orderCount - a.orderCount)

  const assigneeStats: AssigneeStat[] = [...assigneeTotals.entries()]
    .map(([assigneeName, v]) => ({ assigneeName, ...v }))
    .sort((a, b) => b.orderCount - a.orderCount)

  return {
    topSkus,
    topProductTypes,
    orderCount,
    revenue,
    profit,
    shopRankings,
    assigneeStats,
  }
}
