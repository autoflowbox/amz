import type { Order, ProductDefinition, Shop } from '../types'
import { computeProfit } from './profit'
import { findProductDefinition } from './sku'

export interface SkuRanking {
  skuCode: string
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

export interface DashboardStats {
  topSkus: SkuRanking[]
  topProductTypes: ProductTypeRanking[]
  ordersThisMonth: number
  revenueThisMonth: number
  profitThisMonth: number
  shopRankings: ShopRanking[]
}

/** "Tháng qua" = current calendar month to date, from day 1. */
export function isThisMonth(dateStr: string): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

export function computeDashboardStats(
  orders: Order[],
  definitions: ProductDefinition[],
  shops: Shop[],
): DashboardStats {
  const skuTotals = new Map<string, { productName: string; quantity: number }>()
  const productTypeTotals = new Map<string, number>()
  const shopOrderCounts = new Map<string, number>()

  let ordersThisMonth = 0
  let revenueThisMonth = 0
  let profitThisMonth = 0

  for (const order of orders) {
    const shopName = shops.find((s) => s.id === order.shop_id)?.name ?? 'Không rõ shop'
    shopOrderCounts.set(shopName, (shopOrderCounts.get(shopName) ?? 0) + 1)

    for (const item of order.order_items ?? []) {
      const def = findProductDefinition(item.sku_code, definitions)
      const productName = def?.product_name ?? item.sku_code ?? 'Chưa xác định'

      const skuKey = item.sku_code || item.sku
      const existing = skuTotals.get(skuKey)
      skuTotals.set(skuKey, {
        productName,
        quantity: (existing?.quantity ?? 0) + item.quantity,
      })

      productTypeTotals.set(productName, (productTypeTotals.get(productName) ?? 0) + item.quantity)
    }

    if (isThisMonth(order.created_at)) {
      ordersThisMonth += 1
      revenueThisMonth += order.price || 0
      profitThisMonth += computeProfit(order.price, order.order_items, definitions)
    }
  }

  const topSkus: SkuRanking[] = [...skuTotals.entries()]
    .map(([skuCode, v]) => ({ skuCode, productName: v.productName, quantity: v.quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)

  const topProductTypes: ProductTypeRanking[] = [...productTypeTotals.entries()]
    .map(([productName, quantity]) => ({ productName, quantity }))
    .sort((a, b) => b.quantity - a.quantity)

  const shopRankings: ShopRanking[] = [...shopOrderCounts.entries()]
    .map(([shopName, orderCount]) => ({ shopName, orderCount }))
    .sort((a, b) => b.orderCount - a.orderCount)

  return {
    topSkus,
    topProductTypes,
    ordersThisMonth,
    revenueThisMonth,
    profitThisMonth,
    shopRankings,
  }
}
