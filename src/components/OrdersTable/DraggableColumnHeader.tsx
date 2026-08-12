import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Header } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { Order } from '../../types'

export function DraggableColumnHeader({ header }: { header: Header<Order, unknown> }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: header.column.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: header.getSize(),
    zIndex: isDragging ? 10 : undefined,
  }

  const isSku = header.column.id === 'sku'

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={`sticky top-0 z-10 border-b-2 text-left px-1.5 py-2 select-none ${
        isSku ? 'bg-blue-100 border-blue-300' : 'bg-neutral-50 border-neutral-300'
      }`}
    >
      <div className="flex items-center gap-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 px-0.5"
          title="Kéo để sắp xếp cột"
        >
          ⠿
        </button>
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            isSku ? 'text-blue-700' : 'text-neutral-600'
          }`}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
      </div>
    </th>
  )
}
