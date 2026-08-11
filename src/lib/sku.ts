import type { OrderItem, ProductDefinition } from '../types'

/** Kept for the sku_code column (used as a display/ranking key) — text before the first dash, e.g. "2xMP-mpWISHpq1..." -> "2xMP" */
export function parseSkuCode(rawSku: string): string {
  const trimmed = rawSku.trim()
  const dashIndex = trimmed.indexOf('-')
  if (dashIndex === -1) return trimmed
  return trimmed.slice(0, dashIndex).trim()
}

/** Splits a definition's "Keyword SKU" field into its individual comma-separated keywords. */
export function splitKeywords(code: string): string[] {
  return code
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
}

/**
 * Recognizes a product by keyword: a definition matches when any of its `code` field's
 * comma-separated keywords appears anywhere inside the raw SKU string, case-insensitive. When
 * more than one keyword matches (within or across definitions), the longest keyword wins (it's
 * the more specific match).
 */
export function findProductDefinition(
  rawSku: string,
  definitions: ProductDefinition[],
): ProductDefinition | undefined {
  const normalized = rawSku.trim().toLowerCase()
  if (!normalized) return undefined

  let best: ProductDefinition | undefined
  let bestKeywordLength = 0
  for (const def of definitions) {
    for (const keyword of splitKeywords(def.code)) {
      const lower = keyword.toLowerCase()
      if (normalized.includes(lower) && lower.length > bestKeywordLength) {
        best = def
        bestKeywordLength = lower.length
      }
    }
  }
  return best
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
      definition: findProductDefinition(item.sku, definitions),
    }))
}
