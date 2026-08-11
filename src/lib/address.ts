const EU_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Czechia',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland',
  'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland',
  'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
]

const HIGHLIGHT_COUNTRIES = new Set(
  ['Canada', ...EU_COUNTRIES].map((c) => c.toLowerCase()),
)

export interface ParsedAddress {
  lines: string[]
  highlightCountry: string | null
}

/** Detects a Canada / EU country name on its own line so the UI can flag it. */
export function parseAddress(address: string): ParsedAddress {
  const lines = address
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const highlightLine = lines.find((line) => HIGHLIGHT_COUNTRIES.has(line.toLowerCase()))

  return {
    lines,
    highlightCountry: highlightLine ?? null,
  }
}

export interface SheetAddressParts {
  buyerName: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
}

/** Matches a "City, ST 12345" or "City, ST 12345-6789" line. */
const CITY_STATE_ZIP_RE = /^(.+?),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/

/**
 * Splits a pasted Amazon address block into the columns of a Google Sheet import row: buyer name
 * on the first line, one or two street-address lines, then a "City, ST ZIP" line, and an optional
 * trailing country line (absent means US).
 */
export function parseAddressForSheet(address: string): SheetAddressParts {
  const { lines } = parseAddress(address)

  const cityLineIndex = lines.findIndex((line) => CITY_STATE_ZIP_RE.test(line))

  if (cityLineIndex === -1) {
    return {
      buyerName: lines[0] ?? '',
      address1: lines.slice(1).join(', '),
      address2: '-',
      city: '',
      state: '',
      zip: '',
      country: 'US',
    }
  }

  const buyerName = lines[0] ?? ''
  const streetLines = lines.slice(1, cityLineIndex)
  const address1 = streetLines[0] ?? ''
  const address2 = streetLines[1] ?? '-'

  const match = lines[cityLineIndex].match(CITY_STATE_ZIP_RE)!
  const city = match[1].trim()
  const state = match[2].trim().toUpperCase()
  const zip = match[3].trim()

  const trailing = lines.slice(cityLineIndex + 1).join(' ').trim()
  const country = trailing || 'US'

  return { buyerName, address1, address2, city, state, zip, country }
}
