import { useEffect, useRef, useState } from 'react'

interface EditableCellProps {
  value: string | number
  onSave: (value: string) => void
  type?: 'text' | 'number' | 'date' | 'textarea'
  display?: React.ReactNode
  placeholder?: string
  className?: string
  /** 'click' enters edit mode on a single click anywhere in the cell; 'doubleClick' (default) is the Airtable-style behavior. */
  editTrigger?: 'click' | 'doubleClick'
}

/** Airtable-style by default: double-click to edit, Enter/blur to commit, Escape to cancel. */
export function EditableCell({
  value,
  onSave,
  type = 'text',
  display,
  placeholder,
  className = '',
  editTrigger = 'doubleClick',
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
        'w-full h-full min-h-[28px] rounded border border-blue-500 bg-white px-1.5 py-1 text-sm text-neutral-900 outline-none',
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

  const activate = () => setEditing(true)

  return (
    <div
      onClick={editTrigger === 'click' ? activate : undefined}
      onDoubleClick={editTrigger === 'doubleClick' ? activate : undefined}
      className={`absolute inset-0 min-h-[28px] px-1.5 py-1 text-sm cursor-text overflow-auto ${className}`}
      title={editTrigger === 'click' ? 'Nhấp để sửa' : 'Nhấp đúp để sửa'}
    >
      {display ?? (value === '' || value === null || value === undefined ? (
        <span className="text-neutral-400">{placeholder ?? '—'}</span>
      ) : (
        String(value)
      ))}
    </div>
  )
}
