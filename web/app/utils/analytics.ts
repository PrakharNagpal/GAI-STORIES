export const CONSENT_KEY = 'ss-analytics-consent'
export const SESSION_KEY = 'ss-analytics-session'

export type AnalyticsEventName = 'page_view' | 'scroll_depth' | 'time_on_page'
type Props = Record<string, string | number | boolean | null>

/** Random ID that lives only for this browser tab. Not linked to any person. */
function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return 'no-storage'
  }
}

function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted'
  } catch {
    return false
  }
}

export function track(name: AnalyticsEventName, props: Props = {}): void {
  // Defence in depth: even if a caller forgets, nothing leaves the browser without consent.
  if (import.meta.server || !hasConsent()) return

  const event = {
    name,
    props,
    path: window.location.pathname,
    sessionId: sessionId(),
    ts: new Date().toISOString(),
  }
  console.info('[analytics]', name, event)

  const body = JSON.stringify(event)
  // sendBeacon survives page unload (tab close, navigation), unlike a normal fetch.
  const queued =
    typeof navigator.sendBeacon === 'function' &&
    navigator.sendBeacon('/api/events', new Blob([body], {type: 'application/json'}))
  if (!queued) {
    fetch('/api/events', {
      method: 'POST',
      body,
      headers: {'Content-Type': 'application/json'},
      keepalive: true,
    }).catch(() => {})
  }
}

export const MILESTONES = [25, 50, 75, 100] as const

/** Scroll milestones that `progress` (0..1) has reached and that are not in `reached` yet. */
export function newMilestones(progress: number, reached: ReadonlySet<number>): number[] {
  const percent = Math.round(progress * 100)
  return MILESTONES.filter((m) => percent >= m && !reached.has(m))
}

/** Global Privacy Control or Do Not Track means the browser has already said no. */
export function browserOptedOut(nav: {globalPrivacyControl?: boolean; doNotTrack?: string | null}) {
  return nav.globalPrivacyControl === true || nav.doNotTrack === '1'
}
