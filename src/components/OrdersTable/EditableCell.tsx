import { useEffect, useRef, useState } from 'react'

interface EditableCellProps {
  value: string | number
  onSave: (value: string) => void
  type?: 'text' | 'number' | 'date' | 'textarea'
  display?: React.ReactNode
  placeholder?: string
  className?: string
}

/** Airtable-style: double-click to edit, Enter/blur to commit, Escape to cancel. */
export function EditableCell({
  value,
  onSave,
  type = 'text',
  display,
  placeholder,
  className = '',
}: EditableCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value ?? ''))
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(String(value ?? ''))
      requestAnimationFrame(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])

  function commit() {
    setEditing(false)
    if (draft !== String(value ?? '')) {
      onSave(draft)
    }
  }

  function cancel() {
    setEditing(false)
    setDraft(String(value ?? ''))
  }

  if (editing) {
    const commonProps = {
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && type !== 'textarea') commit()
        if (e.key === 'Enter' && type === 'textarea' && e.metaKey) commit()
        if (e.key === 'Escape') cancel()
      },
      className:
        'w-full h-full min-h-[28px] rounded border border-blue-500 bg-neutral-800 px-1.5 py-1 text-sm text-white outline-none',
      placeholder,
    }

    if (type === 'textarea') {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          rows={3}
          {...commonProps}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        step={type === 'number' ? '0.01' : undefined}
        {...commonProps}
      />
    )
  }

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      className={`w-full h-full min-h-[28px] px-1.5 py-1 text-sm cursor-text ${className}`}
      title="Nhấp đúp để sửa"
    >
      {display ?? (value === '' || value === null || value === undefined ? (
        <span className="text-white/25">{placeholder ?? '—'}</span>
      ) : (
        String(value)
      ))}
    </div>
  )
}
