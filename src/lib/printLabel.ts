import type { Order, ProductDefinition } from '../types'
import { resolveOrderItems } from './sku'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Opens a preview window for a 100x150mm shipping label — the user reviews the label, then clicks
 * the on-screen "In" button to print it. The toolbar itself is excluded from the print output.
 */
export function printOrderLabel(order: Order, shopName: string, definitions: ProductDefinition[]) {
  const resolved = resolveOrderItems(order.order_items, definitions)
  const note = order.note.trim()

  const itemBlocks =
    resolved.length > 0
      ? resolved
          .map(({ item, definition }) => {
            const qtyPrefix = item.quantity > 1 ? `${item.quantity}x ` : ''
            const name = definition?.product_name ?? 'Chưa xác định sản phẩm'
            // A single-item order shows its note right alongside the product type; multi-item
            // orders show the shared order-level note once, after all the SKU lines.
            const inlineNote = resolved.length === 1 && note ? ` — ${escapeHtml(note)}` : ''
            return `<div class="sku-line">${escapeHtml(qtyPrefix + item.sku)}</div>
    <div class="type-line"><b>${escapeHtml(name)}</b>${inlineNote}</div>`
          })
          .join('')
      : '<div class="sku-line">— chưa có SKU —</div>'

  const addressLines = (order.address ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const win = window.open('', '_blank', 'width=440,height=680')
  if (!win) return

  win.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Tem đơn hàng ${escapeHtml(order.order_id || '')}</title>
<style>
  @page { size: 100mm 150mm; margin: 5mm; }
  * { box-sizing: border-box; }
  html, body { background: #e8e8e6; margin: 0; }
  body { font-family: Arial, Helvetica, sans-serif; color: #000; }

  .toolbar {
    position: sticky; top: 0; z-index: 10;
    display: flex; gap: 8px; justify-content: center;
    padding: 10px; background: #cfcfcb; border-bottom: 1px solid #a9a9a5;
  }
  .toolbar button {
    font-size: 13px; font-weight: 600; padding: 7px 16px; border-radius: 6px;
    border: 1px solid #888; cursor: pointer; background: #fff;
  }
  .toolbar button.primary { background: #2563eb; border-color: #2563eb; color: #fff; }

  .sheet { display: flex; justify-content: center; padding: 14px; }
  .label {
    width: 100mm; min-height: 150mm; padding: 5mm;
    background: #fff; box-shadow: 0 1px 6px rgba(0,0,0,0.25);
    display: flex; flex-direction: column;
  }
  .header { font-size: 16pt; font-weight: 700; margin-bottom: 3mm; }
  .sku-line { font-size: 12pt; margin-bottom: 0.5mm; }
  .type-line { font-size: 11pt; margin-bottom: 2.5mm; }
  .divider-dashed { border-top: 1px dashed #000; margin: 3mm 0; }
  .divider-double { border-top: 3px double #000; margin: 3mm 0; }
  .address-title { font-size: 12pt; font-weight: 700; text-decoration: underline; margin-bottom: 1.5mm; }
  .address-line { font-size: 15pt; font-weight: 700; line-height: 1.4; }
  .spacer { flex: 1; }
  .footer { font-size: 10pt; text-align: center; }

  @media print {
    html, body { background: #fff; }
    .toolbar { display: none; }
    .sheet { padding: 0; }
    .label { box-shadow: none; padding: 0; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <button class="primary" onclick="window.print()">🖨 In tem</button>
    <button onclick="window.close()">Đóng</button>
  </div>
  <div class="sheet">
    <div class="label">
      <div class="header">${escapeHtml(shopName)}-${escapeHtml(order.order_id || '(chưa có order ID)')}</div>
      ${itemBlocks}
      ${resolved.length > 1 && note ? `<div class="type-line">${escapeHtml(note)}</div>` : ''}
      <div class="divider-dashed"></div>
      <div class="address-title">Address:</div>
      ${
        addressLines.length > 0
          ? addressLines.map((l) => `<div class="address-line">${escapeHtml(l)}</div>`).join('')
          : '<div class="address-line">&nbsp;</div>'
      }
      <div class="divider-double"></div>
      <div class="spacer"></div>
      <div class="footer">Gửi từ AutoFlowTeam – 0774.388.999</div>
    </div>
  </div>
</body>
</html>`)
  win.document.close()
}
