import {browserOptedOut, CONSENT_KEY, SESSION_KEY} from '~/utils/analytics'

export type Consent = 'granted' | 'denied'

export function useConsent() {
  // null = not asked yet. useState shares one value across all components.
  const consent = useState<Consent | null>('analytics-consent', () => null)
  const loaded = useState('analytics-consent-loaded', () => false)

  if (import.meta.client && !loaded.value) {
    loaded.value = true
    try {
      const saved = localStorage.getItem(CONSENT_KEY)
      if (saved === 'granted' || saved === 'denied') consent.value = saved
      else if (browserOptedOut(navigator)) consent.value = 'denied'
    } catch {
      // Storage blocked (strict privacy mode): stay undecided and simply never track.
    }
  }

  function set(value: Consent) {
    consent.value = value
    try {
      localStorage.setItem(CONSENT_KEY, value)
      if (value === 'denied') sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
  }

  return {
    consent: readonly(consent),
    grant: () => set('granted'),
    deny: () => set('denied'),
  }
}
