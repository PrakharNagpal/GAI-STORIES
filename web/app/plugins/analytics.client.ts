export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const { consent } = useConsent()
    let previous: string | null = null

    // page:finish fires after the first page renders and after every client-side navigation.
    nuxtApp.hook('page:finish', () => {
        const current = router.currentRoute.value.path
        if (current === previous) return
        if (consent.value === 'granted') track('page_view', { from: previous })
        previous = current
    })
})