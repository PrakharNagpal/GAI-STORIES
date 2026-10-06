import {describe, expect, it} from 'vitest'
import {formatDate, readingTimeLabel} from '../app/utils/format'

describe('formatDate', () => {
  it('formats an ISO date without shifting the day across time zones', () => {
    expect(formatDate('2026-09-21')).toBe('21 September 2026')
    expect(formatDate('2026-01-01')).toBe('1 January 2026')
  })
})

describe('readingTimeLabel', () => {
  it('rounds to whole minutes', () => {
    expect(readingTimeLabel(3.4)).toBe('3 min read')
  })

  it('never shows less than one minute', () => {
    expect(readingTimeLabel(0)).toBe('1 min read')
    expect(readingTimeLabel(0.2)).toBe('1 min read')
  })

  it('falls back to one minute when the value is missing', () => {
    expect(readingTimeLabel(undefined)).toBe('1 min read')
    expect(readingTimeLabel(null)).toBe('1 min read')
  })
})
