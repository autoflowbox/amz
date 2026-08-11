import { useMemo, useState } from 'react'
import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import type { Order } from '../../types'
import { useOrders, useCreateOrder, useUpdateOrder, useUpdateOrderStatus, useDeleteOrder, useReplaceOrderItems } from '../../hooks/useOrders'
import { useShops } from '../../hooks/useShops'
import { useProductDefinitions } from '../../hooks/useProductDefinitions'
import { EditableCell } from './EditableCell'
import { ShopCell } from './ShopCell'
import { SkuCell } from './SkuCell'
import { QuantityCell } from './QuantityCell'
import { AddressCell } from './AddressCell'
import { ProfitCell } from './ProfitCell'
import { ShippingDateCell } from './ShippingDateCell'
import { StatusBadge } from './StatusBadge'
import { FileAttachCell } from './FileAttachCell'
import { PrintCell } from './PrintCell'
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu'
import { DraggableColumnHeader } from './DraggableColumnHeader'
import { ProductDefinitionsModal } from './ProductDefinitionsModal'
import { getShippingDateInfo, urgencyRank, type ShippingUrgency } from '../../lib/shippingDate'

const DEFAULT_COLUMN_ORDER = [
  'shop', 'order_id', 'sku', 'quantity', 'address', 'note',
  'price', 'profit', 'shipping_date', 'file_attached', 'status', 'assignee', 'print',
]

const COLUMN_LABELS: Record<string, string> = {
  shop: 'Shop',
  order_id: 'Order ID',
  sku: 'SKU',
  quantity: 'Quantity',
  address: 'Address',
  note: 'Note',
  price: 'Giá bán',
  profit: 'Profit',
  shipping_date: 'Shipping Date',
  file_attached: 'File attached',
  status: 'Status',
  assignee: 'Người làm đơn',
  print: 'Print',
}

type ShipDateFilter = 'all' | ShippingUrgency

const SHIP_DATE_FILTER_LABELS: Record<ShipDateFilter, string> = {
  all: 'Tất cả ship date',
  overdue: 'Quá hạn',
  orange: 'Sắp đến hạn (1-2 ngày)',
  yellow: 'Sắp đến hạn (3-5 ngày)',
  default: 'Còn nhiều thời gian',
  none: 'Chưa đặt lịch',
}

function orderMatchesSearch(order: Order, query: string): boolean {
  if (order.order_id.toLowerCase().includes(query)) return true
  if (order.address.toLowerCase().includes(query)) return true
  if (order.note.toLowerCase().includes(query)) return true
  if (order.assignee.toLowerCase().includes(query)) return true
  return (order.order_items ?? []).some(
    (item) =>
      item.sku.toLowerCase().includes(query) || item.sku_code.toLowerCase().includes(query),
  )
}

function loadColumnOrder(): string[] {
  try {
    const raw = localStorage.getItem('ordersTable.columnOrder')
    if (!raw) return DEFAULT_COLUMN_ORDER
    const parsed: string[] = JSON.parse(raw)
    const valid = parsed.filter((id) => DEFAULT_COLUMN_ORDER.includes(id))
    const missing = DEFAULT_COLUMN_ORDER.filter((id) => !valid.includes(id))
    return [...valid, ...missing]
  } catch {
    return DEFAULT_COLUMN_ORDER
  }
}

function loadColumnVisibility(): VisibilityState {
  try {
    const raw = localStorage.getItem('ordersTable.columnVisibility')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function OrdersTable() {
  const { data: orders = [], isLoading } = useOrders()
  const { data: shops = [] } = useShops()
  const { data: definitions = [] } = useProductDefinitions()

  const createOrder = useCreateOrder()
  const updateOrder = useUpdateOrder()
  const updateStatus = useUpdateOrderStatus()
  const deleteOrder = useDeleteOrder()
  const replaceItems = useReplaceOrderItems()

  const [columnOrder, setColumnOrder] = useState<string[]>(loadColumnOrder)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(loadColumnVisibility)
  const [showShipped, setShowShipped] = useState(false)
  const [shopFilter, setShopFilter] = useState<string>('all')
  const [shipDateFilter, setShipDateFilter] = useState<ShipDateFilter>('all')
  const [search, setSearch] = useState('')
  const [showDefsModal, setShowDefsModal] = useState(false)

  function persistColumnOrder(next: string[]) {
    setColumnOrder(next)
    localStorage.setItem('ordersTable.columnOrder', JSON.stringify(next))
  }

  function persistColumnVisibility(next: VisibilityState) {
    setColumnVisibility(next)
    localStorage.setItem('ordersTable.columnVisibility', JSON.stringify(next))
  }

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === 'Chờ ship').length,
    [orders],
  )

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = orders.filter((o) => {
      if (!showShipped && o.status === 'DONE') return false
      if (shopFilter !== 'all' && o.shop_id !== shopFilter) return false
      if (query && !orderMatchesSearch(o, query)) return false
      const urgency = getShippingDateInfo(o.shipping_date).urgency
      if (shipDateFilter !== 'all' && urgency !== shipDateFilter) return false
      return true
    })
    return filtered.sort(
      (a, b) =>
        urgencyRank[getShippingDateInfo(a.shipping_date).urgency] -
        urgencyRank[getShippingDateInfo(b.shipping_date).urgency],
    )
  }, [orders, showShipped, shopFilter, search, shipDateFilter])

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: 'shop',
        header: COLUMN_LABELS.shop,
        cell: ({ row }) => (
          <ShopCell
            shopId={row.original.shop_id}
            shops={shops}
            onChange={(shopId) => updateOrder.mutate({ id: row.original.id, patch: { shop_id: shopId } })}
          />
        ),
      },
      {
        id: 'order_id',
        header: COLUMN_LABELS.order_id,
        cell: ({ row }) => (
          <EditableCell
            value={row.original.order_id}
            onSave={(v) => updateOrder.mutate({ id: row.original.id, patch: { order_id: v } })}
            placeholder="Order ID"
          />
        ),
      },
      {
        id: 'sku',
        header: COLUMN_LABELS.sku,
        cell: ({ row }) => (
          <SkuCell
            items={row.original.order_items ?? []}
            definitions={definitions}
            onSave={(lines) => replaceItems.mutate({ orderId: row.original.id, items: lines })}
          />
        ),
      },
      {
        id: 'quantity',
        header: COLUMN_LABELS.quantity,
        size: 64,
        cell: ({ row }) => <QuantityCell items={row.original.order_items ?? []} />,
      },
      {
        id: 'address',
        header: COLUMN_LABELS.address,
        cell: ({ row }) => (
          <AddressCell
            address={row.original.address}
            onSave={(v) => updateOrder.mutate({ id: row.original.id, patch: { address: v } })}
          />
        ),
      },
      {
        id: 'note',
        header: COLUMN_LABELS.note,
        cell: ({ row }) => (
          <EditableCell
            value={row.original.note}
            onSave={(v) => updateOrder.mutate({ id: row.original.id, patch: { note: v } })}
            type="textarea"
            placeholder="Ghi chú"
          />
        ),
      },
      {
        id: 'price',
        header: COLUMN_LABELS.price,
        cell: ({ row }) => (
          <EditableCell
            value={row.original.price}
            onSave={(v) => updateOrder.mutate({ id: row.original.id, patch: { price: Number(v) || 0 } })}
            type="number"
            placeholder="0.00"
          />
        ),
      },
      {
        id: 'profit',
        header: COLUMN_LABELS.profit,
        cell: ({ row }) => (
          <ProfitCell
            price={row.original.price}
            items={row.original.order_items ?? []}
            definitions={definitions}
          />
        ),
      },
      {
        id: 'shipping_date',
        header: COLUMN_LABELS.shipping_date,
        cell: ({ row }) => (
          <ShippingDateCell
            shippingDate={row.original.shipping_date}
            onSave={(v) => updateOrder.mutate({ id: row.original.id, patch: { shipping_date: v || null } })}
          />
        ),
      },
      {
        id: 'file_attached',
        header: COLUMN_LABELS.file_attached,
        size: 84,
        cell: ({ row }) => (
          <FileAttachCell orderId={row.original.id} files={row.original.order_files ?? []} />
        ),
      },
      {
        id: 'status',
        header: COLUMN_LABELS.status,
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.status}
            onChange={(status) => updateStatus.mutate({ id: row.original.id, status })}
          />
        ),
      },
      {
        id: 'assignee',
        header: COLUMN_LABELS.assignee,
        cell: ({ row }) => (
          <EditableCell
            value={row.original.assignee}
            onSave={(v) => updateOrder.mutate({ id: row.original.id, patch: { assignee: v } })}
            placeholder="Người làm đơn"
          />
        ),
      },
      {
        id: 'print',
        header: COLUMN_LABELS.print,
        size: 96,
        cell: ({ row }) => (
          <PrintCell order={row.original} shops={shops} definitions={definitions} />
        ),
      },
    ],
    [shops, definitions, updateOrder, updateStatus, replaceItems],
  )

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { columnOrder, columnVisibility },
    onColumnOrderChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnOrder) : updater
      persistColumnOrder(next)
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnVisibility) : updater
      persistColumnVisibility(next)
    },
    getCoreRowModel: getCoreRowModel(),
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = columnOrder.indexOf(String(active.id))
    const newIndex = columnOrder.indexOf(String(over.id))
    if (oldIndex === -1 || newIndex === -1) return
    persistColumnOrder(arrayMove(columnOrder, oldIndex, newIndex))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-white/10 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => createOrder.mutate()}
            disabled={createOrder.isPending}
            className="rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-3 py-1.5 text-sm font-medium text-white"
          >
            + Thêm đơn hàng
          </button>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm đơn hàng (Order ID, SKU, địa chỉ, ghi chú, người làm đơn)..."
              className="rounded-md border border-white/15 bg-neutral-900 pl-2.5 pr-7 py-1.5 text-sm text-white outline-none placeholder:text-white/30 w-72"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-sm"
                title="Xóa tìm kiếm"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={shopFilter}
            onChange={(e) => setShopFilter(e.target.value)}
            className="rounded-md border border-white/15 bg-neutral-900 px-2.5 py-1.5 text-sm text-white outline-none"
          >
            <option value="all">Tất cả shop</option>
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={shipDateFilter}
            onChange={(e) => setShipDateFilter(e.target.value as ShipDateFilter)}
            className="rounded-md border border-white/15 bg-neutral-900 px-2.5 py-1.5 text-sm text-white outline-none"
            title="Lọc theo ship date — quá hạn luôn được xếp lên đầu bảng"
          >
            {(Object.keys(SHIP_DATE_FILTER_LABELS) as ShipDateFilter[]).map((key) => (
              <option key={key} value={key}>
                {SHIP_DATE_FILTER_LABELS[key]}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 text-sm text-white/70 px-1">
            <input
              type="checkbox"
              checked={showShipped}
              onChange={(e) => setShowShipped(e.target.checked)}
            />
            Hiện đơn HOÀN THÀNH
          </label>

          <button
            onClick={() => setShowDefsModal(true)}
            className="text-sm text-white/70 hover:text-white border border-white/15 rounded-md px-3 py-1.5 hover:bg-white/5"
          >
            Thư viện SKU
          </button>
        </div>

        <ColumnVisibilityMenu
          columns={DEFAULT_COLUMN_ORDER.map((id) => ({ id, label: COLUMN_LABELS[id] }))}
          visibility={columnVisibility}
          onChange={persistColumnVisibility}
        />
      </div>

      <div className="px-6 py-2 border-b border-white/10 bg-blue-500/10 text-sm text-blue-200">
        Bạn có <span className="font-semibold">{pendingCount}</span> đơn hàng chờ xử lý (số đơn hàng chờ ship)
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <p className="p-6 text-white/50 text-sm">Đang tải...</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <tr>
                  <th className="sticky top-0 z-10 bg-neutral-900 border-b border-white/10 text-left px-1.5 py-2 w-12">
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">STT</span>
                  </th>
                  <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                    {table.getHeaderGroups()[0].headers.map((header) => (
                      <DraggableColumnHeader key={header.id} header={header} />
                    ))}
                  </SortableContext>
                  <th className="sticky top-0 z-10 bg-neutral-900 border-b border-white/10 text-left px-1.5 py-2 w-10" />
                </tr>
              </DndContext>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`border-b border-white/5 align-top hover:bg-white/[0.03] ${
                    row.original.status === 'Lưu ý' ? 'bg-red-500/[0.06]' : ''
                  }`}
                >
                  <td className="px-1.5 py-1 text-sm text-white/40 align-top">{index + 1}</td>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="align-top border-l border-white/5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-1.5 py-1 align-top">
                    <button
                      onClick={() => {
                        if (confirm('Xóa đơn hàng này?')) deleteOrder.mutate(row.original.id)
                      }}
                      className="text-white/30 hover:text-red-400 text-sm"
                      title="Xóa đơn"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center text-white/40 text-sm py-10">
                    {search.trim() ? 'Không tìm thấy đơn hàng nào khớp với tìm kiếm.' : 'Chưa có đơn hàng nào.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showDefsModal && <ProductDefinitionsModal onClose={() => setShowDefsModal(false)} />}
    </div>
  )
}
