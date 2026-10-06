const dateFmt = new Intl.DateTimeFormat('en-SG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** '2026-09-21' -> '21 September 2026' */
export function formatDate(isoDate: string): string {
  return dateFmt.format(new Date(isoDate))
}

export function readingTimeLabel(minutes?: number | null): string {
  return `${Math.max(1, Math.round(minutes ?? 1))} min read`
}
