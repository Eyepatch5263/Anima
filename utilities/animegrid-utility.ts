export function cleanDescription(html: string | null | undefined): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

export const YEARS = Array.from({ length: 2027 - 1940 + 1 }, (_, i) => String(2027 - i))
