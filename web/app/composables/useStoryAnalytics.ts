import type {Ref} from 'vue'

const MILESTONES = [25, 50, 75, 100] as const

export function useStoryAnalytics(slug: string, progress: Readonly<Ref<number>>) {
  const {consent} = useConsent()
  const reached = new Set<number>()
  let active = false
  let summarySent = false
  let activeMs = 0
  let resumedAt: number | null = null

  // Active time: the clock only runs while the tab is visible.
  const resume = () => {
    if (resumedAt === null && document.visibilityState === 'visible') resumedAt = performance.now()
  }
  const pause = () => {
    if (resumedAt !== null) {
      activeMs += performance.now() - resumedAt
      resumedAt = null
    }
  }
  const onVisibility = () => (document.visibilityState === 'visible' ? resume() : pause())

  function checkDepth(p: number) {
    if (!active) return
    const percent = Math.round(p * 100)
    for (const m of MILESTONES) {
      if (percent >= m && !reached.has(m)) {
        reached.add(m)
        track('scroll_depth', {slug, percent: m})
      }
    }
  }

  function sendSummary() {
    if (!active || summarySent) return
    summarySent = true
    pause()
    track('time_on_page', {
      slug,
      activeSeconds: Math.round(activeMs / 1000),
      maxDepth: reached.size ? Math.max(...reached) : 0,
    })
  }

  function start() {
    if (active) return
    active = true
    resume()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', sendSummary) // tab close, reload, mobile app switch
    checkDepth(progress.value)
  }

  function stop(send: boolean) {
    if (!active) return
    if (send) sendSummary()
    active = false
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pagehide', sendSummary)
  }

  watch(progress, checkDepth)
  // React to consent given or withdrawn while the reader is on the page.
  watch(consent, (value) => (value === 'granted' ? start() : stop(false)))
  onMounted(() => {
    if (consent.value === 'granted') start()
  })
  onBeforeUnmount(() => stop(true)) // in-app navigation away from the story
}
