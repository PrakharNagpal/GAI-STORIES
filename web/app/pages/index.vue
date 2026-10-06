<script setup lang="ts">
import type { HomeData, StoryCard } from '~/types/sanity'

const sanity = useSanityClient()
const { data, error } = await useAsyncData('home', () => sanity.fetch<HomeData>(homeQuery))

const stories = computed(() => data.value?.stories ?? [])

// If editors have not featured anything, fall back to the newest stories so the hero is never empty.
const featured = computed<StoryCard[]>(() =>
    data.value?.featured?.length ? data.value.featured : stories.value.slice(0, 3),
)
const lead = computed(() => featured.value[0])
const secondary = computed(() => featured.value.slice(1, 3))

// Client-side search and topic filter. Fine for tens of stories; see README for scaling notes.
const search = ref('')
const activeTag = ref<string | null>(null)
const tags = computed(() => [...new Set(stories.value.flatMap((s) => s.tags ?? []))].sort())
const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    return stories.value.filter((s) => {
        const matchesText = !q || [s.title, s.summary, s.authorName ?? ''].some((t) => t.toLowerCase().includes(q))
        const matchesTag = !activeTag.value || (s.tags ?? []).includes(activeTag.value)
        return matchesText && matchesTag
    })
})
function clearFilters() {
    search.value = ''
    activeTag.value = null
}

// Fallbacks only apply if the Site settings document is missing or a field is empty.
const HERO_FALLBACK = {
    eyebrow: 'Personal stories from across Asia',
    heading: 'Stories told by the people who lived them',
    intro: 'First-person accounts from people across Asia. Some are about big changes, some about ordinary days.',
}

const hero = computed(() => ({
    eyebrow: data.value?.settings?.eyebrow?.trim() || HERO_FALLBACK.eyebrow,
    heading: data.value?.settings?.heading?.trim() || HERO_FALLBACK.heading,
    intro: data.value?.settings?.intro?.trim() || HERO_FALLBACK.intro,
}))

const { siteUrl } = useRuntimeConfig().public
useSeoMeta({
    description: () => hero.value.intro,
    ogTitle: 'In Their Words',
    ogDescription: () => hero.value.intro,
    ogType: 'website',
    ogUrl: siteUrl,
    ogImage: () =>
        lead.value ? urlFor(lead.value.featuredImage).width(1200).height(630).fit('crop').url() : undefined,
    twitterCard: 'summary_large_image',
})
</script>

<template>
    <div>
        <section class="hero">
            <div class="container hero-inner">
                <p class="eyebrow">{{ hero.eyebrow }}</p>
                <h1>{{ hero.heading }}</h1>
                <p class="lede">{{ hero.intro }}</p>
                <a href="#all-stories" class="btn btn--ghost">See all stories</a>
            </div>
        </section>

        <div v-if="error" class="container state" role="alert">
            <p>We could not load stories right now. Please refresh the page in a moment.</p>
        </div>

        <template v-else>
            <section v-if="lead" class="container featured" aria-labelledby="featured-heading">
                <h2 id="featured-heading" class="section-title">Featured stories</h2>
                <div class="featured-grid">
                    <StoryCard :story="lead" variant="feature" eager />
                    <div v-if="secondary.length" class="featured-side">
                        <StoryCard v-for="s in secondary" :key="s._id" :story="s" variant="compact" />
                    </div>
                </div>
            </section>

            <section id="all-stories" class="container all" aria-labelledby="all-heading">
                <div class="all-header">
                    <h2 id="all-heading" class="section-title">All stories</h2>
                    <label class="search">
                        <span class="visually-hidden">Search stories</span>
                        <input v-model="search" type="search" placeholder="Search by title, summary or author">
                    </label>
                </div>

                <div v-if="tags.length" class="tags" role="group" aria-label="Filter by topic">
                    <button type="button" class="tag" :aria-pressed="activeTag === null" @click="activeTag = null">
                        All
                    </button>
                    <button v-for="t in tags" :key="t" type="button" class="tag" :aria-pressed="activeTag === t"
                        @click="activeTag = activeTag === t ? null : t">
                        {{ t }}
                    </button>
                </div>

                <p class="visually-hidden" aria-live="polite">{{ filtered.length }} stories shown</p>

                <div v-if="filtered.length" class="grid">
                    <StoryCard v-for="s in filtered" :key="s._id" :story="s" />
                </div>
                <div v-else-if="stories.length" class="state">
                    <p>No stories match your search.</p>
                    <button type="button" class="btn btn--ghost" @click="clearFilters">Clear filters</button>
                </div>
                <p v-else class="state">No stories have been published yet.</p>
            </section>
        </template>
    </div>
</template>

<style scoped>
.hero {
    background:
        radial-gradient(60rem 30rem at 85% -10%, var(--accent-soft), transparent 60%),
        linear-gradient(var(--bg), var(--bg));
    padding: clamp(3rem, 8vw, 6rem) 0 clamp(2rem, 5vw, 3.5rem);
}

.hero h1 {
    font-size: clamp(2.2rem, 5.5vw, 3.8rem);
    max-width: 18ch;
}

.lede {
    font-family: var(--font-reading);
    font-size: clamp(1.1rem, 2vw, 1.3rem);
    color: var(--ink-soft);
    max-width: 52ch;
    margin: 0 0 1.5rem;
}

.section-title {
    font-size: clamp(1.5rem, 3vw, 2rem);
}

.featured {
    margin-top: 1rem;
}

.featured-grid {
    display: grid;
    gap: 1.5rem;
}

.featured-side {
    display: grid;
    gap: 1.5rem;
    align-content: start;
}

@media (min-width: 960px) {
    .featured-grid {
        grid-template-columns: 1.6fr 1fr;
    }
}

.all {
    margin-top: 4rem;
    scroll-margin-top: 80px;
}

.all-header {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: baseline;
    justify-content: space-between;
}

.search input {
    width: min(100%, 22rem);
    padding: 0.65rem 1rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--surface);
    font: inherit;
    color: var(--ink);
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0 1.5rem;
}

.tag {
    padding: 0.35rem 0.9rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink-soft);
    font: 500 0.88rem var(--font-ui);
    text-transform: capitalize;
    cursor: pointer;
}

.tag[aria-pressed='true'] {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
}

.grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
}

.state {
    padding: 2rem 0;
    color: var(--ink-soft);
}
</style>