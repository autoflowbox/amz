import { EditableCell } from './EditableCell'
import { parseAddress } from '../../lib/address'

export function AddressCell({
  address,
  onSave,
}: {
  address: string
  onSave: (value: string) => void
}) {
  const { lines, highlightCountry } = parseAddress(address)

  const display = (
    <div className="whitespace-pre-line leading-snug">
      {lines.length === 0 ? (
        <span className="text-white/25">—</span>
      ) : (
        lines.map((line, i) => {
          const isHighlight = highlightCountry && line === highlightCountry
          return (
            <div key={i} className={isHighlight ? '' : undefined}>
              {isHighlight ? (
                <span className="inline-block rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 text-xs font-semibold">
                  {line}
                </span>
              ) : (
                line
              )}
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <EditableCell
      value={address}
      onSave={onSave}
      type="textarea"
      display={display}
      placeholder="Địa chỉ"
    />
  )
}
