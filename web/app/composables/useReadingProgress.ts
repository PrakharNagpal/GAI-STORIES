import type { Ref } from 'vue'

/**
 * Returns a 0..1 value for how far the reader has scrolled through `target`.
 * 0 = top of the article at the top of the viewport, 1 = end of the article visible.
 * Shared by the progress bar (UI) and scroll-depth analytics (Phase 8).
 */
export function useReadingProgress(target: Ref<HTMLElement | null>) {
  const progress = ref(0)
  let frame = 0

  function update() {
    frame = 0
    const el = target.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const scrollable = rect.height - window.innerHeight
    progress.value = scrollable <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / scrollable))
  }

  // requestAnimationFrame throttles work to at most once per frame, keeping scrolling smooth.
  function onScroll() {
    if (!frame) frame = requestAnimationFrame(update)
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (frame) cancelAnimationFrame(frame)
  })

  return readonly(progress)
}