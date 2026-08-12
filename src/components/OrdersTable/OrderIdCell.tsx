import { useEffect, useRef, useState } from 'react'
import type { OrderItem } from '../../types'

/**
 * Order ID cell. Since the product info now lives on the SKU column, a single click edits the
 * Order ID directly (no need to reserve double-click for entering edit mode), and double-click
 * instead copies the order's SKU text to the clipboard for quick pasting elsewhere.
 */
export function OrderIdCell({
  value,
  items,
  onSave,
}: {
  value: string
  items: OrderItem[]
  onSave: (value: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(value)
      requestAnimationFrame(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])

  function commit() {
    setEditing(false)
    if (draft !== value) onSave(draft)
  }

  function cancel() {
    setEditing(false)
    setDraft(value)
  }

  async function copySku() {
    const skuText = [...items]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => item.sku)
      .filter(Boolean)
      .join(', ')
    if (!skuText) return
    try {
      await navigator.clipboard.writeText(skuText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // Clipboard access can be denied by the browser — silently ignore.
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') cancel()
        }}
        placeholder="Order ID"
        className="w-full h-full min-h-[28px] rounded border border-blue-500 bg-white px-1.5 py-1 text-sm text-neutral-900 outline-none"
      />
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      onDoubleClick={(e) => {
        e.stopPropagation()
        copySku()
      }}
      className="w-full h-full min-h-[28px] px-1.5 py-1 text-sm cursor-text"
      title="Nhấp để sửa · Nhấp đúp để copy SKU"
    >
      {copied ? (
        <span className="text-emerald-600">✓ Đã copy SKU</span>
      ) : value === '' ? (
        <span className="text-neutral-400">Order ID</span>
      ) : (
        value
      )}
    </div>
  )
}
