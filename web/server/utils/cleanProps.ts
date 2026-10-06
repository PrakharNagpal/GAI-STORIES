type Primitive = string | number | boolean | null

/** Keep only short, flat, primitive props. Never trust what the browser sends. */
export function cleanProps(input: unknown): Record<string, Primitive> {
  const out: Record<string, Primitive> = {}
  if (!input || typeof input !== 'object') return out
  for (const [key, value] of Object.entries(input).slice(0, 10)) {
    if (!/^[a-zA-Z]{1,32}$/.test(key)) continue
    if (typeof value === 'string') out[key] = value.slice(0, 200)
    else if (typeof value === 'number' && Number.isFinite(value)) out[key] = value
    else if (typeof value === 'boolean' || value === null) out[key] = value
  }
  return out
}
