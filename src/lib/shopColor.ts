import type { CSSProperties } from 'react'
import type { Shop } from '../types'

/**
 * 10 solid, highly saturated background colors (not light pastel tints) so shop names stay
 * clearly distinguishable from one another at a glance. White text throughout for guaranteed
 * contrast against every step. Fixed hue order, assigned by the shop's position in the list.
 */
const SHOP_COLOR_STEPS = [
  { bg: '#2563eb', border: '#1d4ed8' }, // blue
  { bg: '#ea580c', border: '#c2410c' }, // orange
  { bg: '#0d9488', border: '#0f766e' }, // teal
  { bg: '#a16207', border: '#854d0e' }, // gold
  { bg: '#db2777', border: '#be185d' }, // pink
  { bg: '#16a34a', border: '#15803d' }, // green
  { bg: '#7c3aed', border: '#6d28d9' }, // violet
  { bg: '#dc2626', border: '#b91c1c' }, // red
  { bg: '#0891b2', border: '#0e7490' }, // cyan
  { bg: '#4f46e5', border: '#4338ca' }, // indigo
]

/** Stable per-shop color, assigned by the shop's position in the (already-loaded) shop list. */
export function getShopColorStyle(shopId: string | null, shops: Shop[]): CSSProperties {
  const index = shopId ? shops.findIndex((s) => s.id === shopId) : -1
  if (index === -1) return {}
  const step = SHOP_COLOR_STEPS[index % SHOP_COLOR_STEPS.length]
  return { backgroundColor: step.bg, color: '#ffffff', borderColor: step.border }
}
