<script setup lang="ts">
import type {StoryCard} from '~/types/sanity'

const props = withDefaults(
  defineProps<{
    story: StoryCard
    variant?: 'default' | 'feature' | 'compact'
    headingLevel?: 'h2' | 'h3'
    eager?: boolean
  }>(),
  {variant: 'default', headingLevel: 'h3', eager: false},
)

const sizes = computed(() =>
  props.variant === 'feature'
    ? '(min-width: 960px) 640px, 100vw'
    : '(min-width: 960px) 360px, (min-width: 640px) 50vw, 100vw',
)
</script>

<template>
  <article class="card" :class="`card--${variant}`">
    <div class="card-media">
      <StoryImage
        :image="story.featuredImage"
        :aspect="variant === 'feature' ? 16 / 10 : 3 / 2"
        :sizes="sizes"
        :eager="eager"
      />
    </div>
    <div class="card-body">
      <p class="meta">
        <time :datetime="story.publishedDate">{{ formatDate(story.publishedDate) }}</time>
        <span aria-hidden="true"> · </span>{{ readingTimeLabel(story.readingTime) }}
      </p>
      <component :is="headingLevel" class="card-title">
        <NuxtLink :to="`/stories/${story.slug}`" class="card-link">{{ story.title }}</NuxtLink>
      </component>
      <p class="card-summary">{{ story.summary }}</p>
      <p v-if="story.authorName" class="meta card-author">By {{ story.authorName }}</p>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgb(43 37 34 / 12%);
}

.card:focus-within {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.1rem 1.25rem 1.4rem;
  flex: 1;
}

.card-title {
  font-size: 1.3rem;
  margin: 0;
}

.card-link {
  color: var(--ink);
  text-decoration: none;
}

/* Stretch the link over the whole card so the entire card is clickable,
   while screen readers still hear one clear link: the story title. */
.card-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.card-link:focus-visible {
  outline: none;
}

.card-summary {
  margin: 0;
  color: var(--ink-soft);
  font-family: var(--font-reading);
  font-size: 1.05rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-author {
  margin-top: auto;
  padding-top: 0.25rem;
}

.card--feature .card-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.card--feature .card-summary {
  -webkit-line-clamp: 4;
  font-size: 1.15rem;
}

.card--compact {
  flex-direction: row;
}

.card--compact .card-media {
  flex: 0 0 38%;
}

.card--compact .card-media :deep(img) {
  height: 100%;
  object-fit: cover;
}

.card--compact .card-title {
  font-size: 1.1rem;
}

.card--compact .card-summary {
  -webkit-line-clamp: 2;
  font-size: 0.98rem;
}
</style>
