import type { OrderItem, ProductDefinition } from '../types'
import { findProductDefinition } from './sku'

/**
 * Profit = (price * 80%) - sum over SKU lines of (quantity * (cost + shipping))
 * Unrecognized SKU codes (no matching product_definitions row) contribute 0 cost — they still
 * count toward revenue but can't be costed until someone adds a definition for that code.
 */
export function computeProfit(
  price: number,
  items: OrderItem[] | undefined,
  definitions: ProductDefinition[],
): number {
  const revenue = (price || 0) * 0.8
  const cost = (items || []).reduce((sum, item) => {
    const def = findProductDefinition(item.sku, definitions)
    if (!def) return sum
    return sum + item.quantity * (def.cost + def.shipping)
  }, 0)
  return revenue - cost
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
