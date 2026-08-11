import { useEffect, useRef, useState } from 'react'

/**
 * Generic click-to-open floating dropdown. Built as a self-contained React component (not a
 * native <select>) so it opens reliably on a single click and gives us full control over styling
 * — used for Status (fixed options) and Assignee (creatable options).
 */
export function Dropdown({
  trigger,
  children,
  align = 'left',
  className = '',
}: {
  trigger: (open: boolean) => React.ReactNode
  children: (close: () => void) => React.ReactNode
  align?: 'left' | 'right'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="block w-full text-left outline-none"
      >
        {trigger(open)}
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-1 min-w-[180px] max-h-64 overflow-y-auto rounded-md border border-white/10 bg-neutral-900 shadow-xl ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}
