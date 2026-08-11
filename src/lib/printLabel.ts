import type { Order, ProductDefinition } from '../types'
import { resolveOrderItems } from './sku'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Opens a print dialog for a single 100x150mm shipping label for this order. */
export function printOrderLabel(order: Order, shopName: string, definitions: ProductDefinition[]) {
  const resolved = resolveOrderItems(order.order_items, definitions)
  const skuLines =
    resolved.length > 0
      ? resolved.map(({ item, definition }) => {
          const qtyPrefix = item.quantity > 1 ? `${item.quantity}x ` : ''
          const name = definition?.product_name ?? 'Chưa xác định sản phẩm'
          return `${qtyPrefix}${item.sku} = ${name}`
        })
      : ['— chưa có SKU —']

  const addressLines = (order.address ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const win = window.open('', '_blank', 'width=420,height=620')
  if (!win) return

  win.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Tem đơn hàng ${escapeHtml(order.order_id || '')}</title>
<style>
  @page { size: 100mm 150mm; margin: 5mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #000; margin: 0; }
  .label { display: flex; flex-direction: column; min-height: 140mm; }
  .header { font-size: 16pt; font-weight: 700; margin-bottom: 3mm; }
  .sku-line { font-size: 12pt; margin-bottom: 1.5mm; }
  .address-title { font-size: 11pt; font-weight: 700; margin-top: 4mm; margin-bottom: 1.5mm; }
  .address-line { font-size: 13pt; line-height: 1.4; }
  .spacer { flex: 1; }
  .footer { font-size: 10pt; text-align: center; border-top: 1px solid #000; padding-top: 2mm; }
</style>
</head>
<body>
  <div class="label">
    <div class="header">${escapeHtml(shopName)} - ${escapeHtml(order.order_id || '(chưa có order ID)')}</div>
    ${skuLines.map((l) => `<div class="sku-line">${escapeHtml(l)}</div>`).join('')}
    <div class="address-title">Address:</div>
    ${
      addressLines.length > 0
        ? addressLines.map((l) => `<div class="address-line">${escapeHtml(l)}</div>`).join('')
        : '<div class="address-line">&nbsp;</div>'
    }
    <div class="spacer"></div>
    <div class="footer">Đơn hàng gửi từ AutoFlow Team - ĐT: 0774.388.999</div>
  </div>
  <script>
    window.onload = function () {
      window.focus();
      window.print();
    };
  </script>
</body>
</html>`)
  win.document.close()
}
