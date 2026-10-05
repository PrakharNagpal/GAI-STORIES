<script setup lang="ts">
import type { Story } from '~/types/sanity'

// Remount the page when moving from one story to another, so all state (and analytics) resets cleanly.
definePageMeta({ key: (route) => route.fullPath })

const route = useRoute()
const slug = String(route.params.slug)
const sanity = useSanityClient()

const { data, error } = await useAsyncData(`story:${slug}`, () =>
    sanity.fetch<Story | null>(storyQuery, { slug }),
)

if (error.value) {
    throw createError({ statusCode: 500, statusMessage: 'Could not load this story', fatal: true })
}
if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: 'Story not found', fatal: true })
}
const story: Story = data.value

const article = ref<HTMLElement | null>(null)
const progress = useReadingProgress(article)
useStoryAnalytics(story.slug, progress)
// SEO: page title, description, social preview card, canonical URL and JSON-LD structured data.
const { siteUrl } = useRuntimeConfig().public
const canonical = `${siteUrl}/stories/${story.slug}`
const ogImage = urlFor(story.featuredImage).width(1200).height(630).fit('crop').format('jpg').url()

useSeoMeta({
    title: story.title,
    description: story.summary,
    ogTitle: story.title,
    ogDescription: story.summary,
    ogType: 'article',
    ogUrl: canonical,
    ogImage,
    ogImageAlt: story.featuredImage.alt,
    twitterCard: 'summary_large_image',
    articlePublishedTime: story.publishedDate,
})

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.summary,
    image: [ogImage],
    datePublished: story.publishedDate,
    author: story.author ? { '@type': 'Person', name: story.author.name } : undefined,
    mainEntityOfPage: canonical,
}
useHead({
    link: [{ rel: 'canonical', href: canonical }],
    // Escape '<' so no content can ever close the script tag early.
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }],
})

// Share: native share sheet on phones, copy-to-clipboard on desktop.
const copied = ref(false)
async function share() {
    const url = window.location.href
    if (navigator.share) {
        try { await navigator.share({ title: story.title, url }) } catch { /* user cancelled */ }
        return
    }
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
    <div>
        <div class="progress" aria-hidden="true">
            <span :style="{ transform: `scaleX(${progress})` }" />
        </div>

        <article ref="article" class="story">
            <header class="narrow story-header">
                <NuxtLink to="/" class="back">&larr; All stories</NuxtLink>
                <ul v-if="story.tags?.length" class="story-tags" aria-label="Topics">
                    <li v-for="t in story.tags" :key="t">{{ t }}</li>
                </ul>
                <h1>{{ story.title }}</h1>
                <p class="story-summary">{{ story.summary }}</p>
                <div class="byline">
                    <StoryImage v-if="story.author?.avatar" class="avatar" :image="story.author.avatar" :aspect="1"
                        :widths="[96, 192]" sizes="48px" />
                    <div>
                        <p class="byline-name">{{ story.author?.name ?? 'Anonymous' }}</p>
                        <p class="meta">
                            <time :datetime="story.publishedDate">{{ formatDate(story.publishedDate) }}</time>
                            <span aria-hidden="true"> · </span>{{ readingTimeLabel(story.readingTime) }}
                        </p>
                    </div>
                </div>
            </header>

            <figure class="story-hero">
                <StoryImage :image="story.featuredImage" :aspect="16 / 9" :widths="[640, 960, 1280, 1600, 2000]"
                    sizes="(min-width: 1120px) 1120px, 100vw" eager />
            </figure>

            <StoryBody class="narrow" :value="story.body" />

            <footer class="narrow story-footer">
                <button type="button" class="btn btn--ghost" @click="share">
                    {{ copied ? 'Link copied' : 'Share this story' }}
                </button>
                <div v-if="story.author?.bio" class="author-card">
                    <p class="eyebrow">About the author</p>
                    <p class="author-name">{{ story.author.name }}</p>
                    <p class="meta">{{ story.author.bio }}</p>
                </div>
            </footer>
        </article>

        <section v-if="story.related?.length" class="container related" aria-labelledby="related-heading">
            <h2 id="related-heading">More stories</h2>
            <div class="related-grid">
                <StoryCard v-for="s in story.related" :key="s._id" :story="s" />
            </div>
        </section>
    </div>
</template>

<style scoped>
.progress {
    position: fixed;
    inset: 0 0 auto;
    height: 3px;
    z-index: 30;
}

.progress span {
    display: block;
    height: 100%;
    background: var(--accent);
    transform-origin: left;
    transform: scaleX(0);
}

.narrow {
    width: min(100% - 2.5rem, 720px);
    margin-inline: auto;
}

.story-header {
    padding-top: clamp(2rem, 6vw, 4rem);
}

.back {
    display: inline-block;
    margin-bottom: 1.5rem;
    text-decoration: none;
    font-weight: 500;
}

.story-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
}

.story-tags li {
    padding: 0.2rem 0.75rem;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
}

.story-header h1 {
    font-size: clamp(2.1rem, 5vw, 3.4rem);
}

.story-summary {
    font-family: var(--font-reading);
    font-size: clamp(1.15rem, 2vw, 1.35rem);
    color: var(--ink-soft);
    margin: 0 0 1.5rem;
}

.byline {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}

.byline-name {
    margin: 0;
    font-weight: 600;
}

.story-hero {
    width: min(100%, 1120px);
    margin: 2rem auto 2.5rem;
}

.story-hero :deep(img) {
    border-radius: 0;
}

@media (min-width: 1120px) {
    .story-hero :deep(img) {
        border-radius: var(--radius);
    }
}

.story-footer {
    display: grid;
    gap: 1.5rem;
    justify-items: start;
    padding-top: 1.5rem;
    border-top: 1px solid var(--line);
}

.author-card {
    background: var(--surface-warm);
    border-radius: var(--radius);
    padding: 1.25rem 1.5rem;
    width: 100%;
}

.author-name {
    font: 650 1.2rem var(--font-display);
    margin: 0 0 0.25rem;
}

.related {
    margin-top: 4rem;
}

.related-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
}
</style>