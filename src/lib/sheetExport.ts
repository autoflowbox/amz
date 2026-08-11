import type { Order, ProductDefinition } from '../types'
import { resolveOrderItems } from './sku'
import { parseAddressForSheet } from './address'

function productSummary(order: Order, definitions: ProductDefinition[]): string {
  const resolved = resolveOrderItems(order.order_items, definitions)
  return resolved
    .map(({ item, definition }) => {
      const qtyPrefix = item.quantity > 1 ? `${item.quantity}x ` : ''
      return qtyPrefix + (definition?.product_name ?? item.sku)
    })
    .join(', ')
}

/**
 * Builds one tab-separated row matching the Google Sheet column layout:
 * Order ID | Sản phẩm | Buyer name | Address 1 | Address 2 | City | State | Zip Code | Country
 */
export function buildSheetRow(order: Order, definitions: ProductDefinition[]): string {
  const parts = parseAddressForSheet(order.address ?? '')
  const product = productSummary(order, definitions)

  return [
    order.order_id || '',
    product,
    parts.buyerName,
    parts.address1,
    parts.address2,
    parts.city,
    parts.state,
    parts.zip,
    parts.country,
  ].join('\t')
}
