import type { Order, ProductDefinition, Shop } from '../types'
import { resolveOrderItems } from './sku'
import { parseAddressForSheet } from './address'

/** Fixed column headers of the HPW shipping template (row 1) — must stay byte-identical to it. */
export const HPW_HEADERS = [
  'ShipmentId',
  'Buyer Name',
  'Buyer Email',
  'Buyer Phone',
  'Shipping Address 1',
  'Shipping Address 2',
  'Shipping City',
  'Shipping State',
  'Shipping Postal Code',
  'Shipping Country Code',
  'Package Weight (gram)',
  'Package Length (cm) - L',
  'Package Width (cm) - W',
  'Package Height (cm) - H',
  'Item Name',
  'Item SKU',
  'Item HsCode',
  'Item Quantity',
  'Item Price',
  'Service (US Standard,US Premium,Outside US)',
  'Buy with Insurance',
  'IOSS number',
  'EORI number',
  'VAT number',
  'Chinese name',
  'Unit Weight',
]

/** Country names the app already recognizes (see address.ts) mapped to their ISO codes. */
const COUNTRY_CODES: Record<string, string> = {
  'united states': 'US',
  usa: 'US',
  canada: 'CA',
  austria: 'AT',
  belgium: 'BE',
  bulgaria: 'BG',
  croatia: 'HR',
  cyprus: 'CY',
  'czech republic': 'CZ',
  czechia: 'CZ',
  denmark: 'DK',
  estonia: 'EE',
  finland: 'FI',
  france: 'FR',
  germany: 'DE',
  greece: 'GR',
  hungary: 'HU',
  ireland: 'IE',
  italy: 'IT',
  latvia: 'LV',
  lithuania: 'LT',
  luxembourg: 'LU',
  malta: 'MT',
  netherlands: 'NL',
  poland: 'PL',
  portugal: 'PT',
  romania: 'RO',
  slovakia: 'SK',
  slovenia: 'SI',
  spain: 'ES',
  sweden: 'SE',
}

function toCountryCode(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return 'US'
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase()
  return COUNTRY_CODES[trimmed.toLowerCase()] ?? trimmed
}

/**
 * ShipmentId = last 7 digits of Order ID, shop name, product's ID-Tem, and the order note, joined
 * by "-" and capped at 35 characters (per the HPW template's own instructions).
 */
function buildShipmentId(order: Order, shopName: string, idTem: string): string {
  const last7 = order.order_id.replace(/\D/g, '').slice(-7)
  const parts = [last7, shopName, idTem, order.note.trim()].filter((p) => p !== '')
  return parts.join('-').slice(0, 35)
}

/**
 * Builds one HPW template row for an order. Multi-SKU orders are treated as a single shipped
 * package (matching the "In tem" label behavior), so package/item fields come from the first
 * resolved line's product definition.
 */
export function buildHpwRow(order: Order, shopName: string, definitions: ProductDefinition[]): string[] {
  const resolved = resolveOrderItems(order.order_items, definitions)
  const definition = resolved[0]?.definition
  const address = parseAddressForSheet(order.address ?? '')
  const countryCode = toCountryCode(address.country)

  return [
    buildShipmentId(order, shopName, definition?.id_tem ?? ''),
    address.buyerName,
    'Autoflowbox@gmail.com',
    '+1 (310) 555-0199',
    address.address1,
    address.address2,
    address.city,
    address.state,
    address.zip,
    countryCode,
    definition ? String(definition.p_weight) : '',
    definition ? String(definition.length) : '',
    definition ? String(definition.width) : '',
    definition ? String(definition.height) : '',
    definition?.note1 ?? '',
    'SKU600',
    definition?.hs_code ?? '',
    '1',
    definition ? String(definition.item_price) : '',
    countryCode === 'US' ? 'US Premium' : '',
    'No',
    '',
    '',
    '',
    '',
    definition ? String(definition.weight) : '',
  ]
}

/**
 * Tab-separated header + one row per order, ready to paste directly into the HPW CSV template
 * starting at cell A1 — the header row lands back on itself unchanged.
 */
export function buildHpwExportText(orders: Order[], shops: Shop[], definitions: ProductDefinition[]): string {
  const shopName = (shopId: string | null) => shops.find((s) => s.id === shopId)?.name ?? ''
  const rows = orders.map((order) => buildHpwRow(order, shopName(order.shop_id), definitions).join('\t'))
  return [HPW_HEADERS.join('\t'), ...rows].join('\n')
}
