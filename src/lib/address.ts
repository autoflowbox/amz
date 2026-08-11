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
