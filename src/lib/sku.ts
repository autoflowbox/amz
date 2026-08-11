import type { OrderItem, ProductDefinition } from '../types'

/** The recognized "definition code" is the text before the first dash, e.g. "2xMP-mpWISHpq1..." -> "2xMP" */
export function parseSkuCode(rawSku: string): string {
  const trimmed = rawSku.trim()
  const dashIndex = trimmed.indexOf('-')
  if (dashIndex === -1) return trimmed
  return trimmed.slice(0, dashIndex).trim()
}

export function findProductDefinition(
  skuCode: string,
  definitions: ProductDefinition[],
): ProductDefinition | undefined {
  const normalized = skuCode.trim().toLowerCase()
  if (!normalized) return undefined
  return definitions.find((d) => d.code.trim().toLowerCase() === normalized)
}

export interface SkuLineResolved {
  item: OrderItem
  definition: ProductDefinition | undefined
}

export function resolveOrderItems(
  items: OrderItem[] | undefined,
  definitions: ProductDefinition[],
): SkuLineResolved[] {
  if (!items) return []
  return [...items]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      item,
      definition: findProductDefinition(item.sku_code, definitions),
    }))
}
