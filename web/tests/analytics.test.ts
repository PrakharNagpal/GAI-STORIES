import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {browserOptedOut, CONSENT_KEY, newMilestones, track} from '../app/utils/analytics'

describe('newMilestones', () => {
  it('returns nothing before the first milestone', () => {
    expect(newMilestones(0.1, new Set())).toEqual([])
  })

  it('returns every milestone passed, in order', () => {
    expect(newMilestones(0.8, new Set())).toEqual([25, 50, 75])
  })

  it('skips milestones that were already reported', () => {
    expect(newMilestones(0.8, new Set([25, 50]))).toEqual([75])
    expect(newMilestones(1, new Set([25, 50, 75, 100]))).toEqual([])
  })

  it('treats the end of the article as 100 percent', () => {
    expect(newMilestones(1, new Set([25, 50, 75]))).toEqual([100])
  })
})

describe('browserOptedOut', () => {
  it('honours Global Privacy Control', () => {
    expect(browserOptedOut({globalPrivacyControl: true})).toBe(true)
  })

  it('honours Do Not Track', () => {
    expect(browserOptedOut({doNotTrack: '1'})).toBe(true)
  })

  it('does not opt out when neither signal is set', () => {
    expect(browserOptedOut({})).toBe(false)
    expect(browserOptedOut({doNotTrack: '0', globalPrivacyControl: false})).toBe(false)
  })
})

describe('track', () => {
  const store = new Map<string, string>()
  const storage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  }
  const sendBeacon = vi.fn(() => true)

  beforeEach(() => {
    store.clear()
    sendBeacon.mockClear()
    vi.stubGlobal('localStorage', storage)
    vi.stubGlobal('sessionStorage', storage)
    vi.stubGlobal('navigator', {sendBeacon})
    vi.stubGlobal('window', {location: {pathname: '/stories/example'}})
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('sends nothing before the reader has chosen', () => {
    track('page_view')
    expect(sendBeacon).not.toHaveBeenCalled()
  })

  it('sends nothing after the reader said no', () => {
    store.set(CONSENT_KEY, 'denied')
    track('scroll_depth', {percent: 50})
    expect(sendBeacon).not.toHaveBeenCalled()
  })

  it('sends the event once the reader said yes', () => {
    store.set(CONSENT_KEY, 'granted')
    track('scroll_depth', {slug: 'example', percent: 50})
    expect(sendBeacon).toHaveBeenCalledTimes(1)
    expect(sendBeacon).toHaveBeenCalledWith('/api/events', expect.any(Blob))
  })
})
