<script setup lang="ts">
import { h } from 'vue'
import { PortableText, type PortableTextComponents } from '@portabletext/vue'
import type { PortableTextBlock } from '@portabletext/types'
import StoryImage from './StoryImage.vue'
import type { SanityImage } from '~/types/sanity'

const props = defineProps<{ value: PortableTextBlock[] }>()

// Editors often leave blank paragraphs (an extra Enter, pasted text).
// Drop them so spacing stays consistent and the drop cap lands on real text.
function isEmptyParagraph(block: PortableTextBlock): boolean {
    if (block._type !== 'block' || (block.style ?? 'normal') !== 'normal') return false
    const children = (block.children ?? []) as Array<{ text?: string }>
    return children.every((child) => !child.text?.trim())
}

const blocks = computed(() => props.value.filter((block) => !isEmptyParagraph(block)))
// Custom renderers for content types the default renderer does not know about.
const components: PortableTextComponents = {
    types: {
        image: ({ value }: { value: SanityImage }) =>
            h('figure', { class: 'body-figure' }, [
                h(StoryImage, { image: value, widths: [480, 800, 1200], sizes: '(min-width: 760px) 680px, 100vw' }),
                value.caption ? h('figcaption', value.caption) : null,
            ]),
    },
    marks: {
        link: ({ value }, { slots }) => {
            const href: string = value?.href ?? '#'
            const external = /^https?:\/\//.test(href)
            return h(
                'a',
                external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href },
                slots.default?.(),
            )
        },
    },
}
</script>

<template>
    <div class="prose">
        <PortableText :value="value" :components="components" />
    </div>
</template>

<style scoped>
.prose {
    font-family: var(--font-reading);
    font-size: clamp(1.1rem, 1.6vw, 1.2rem);
    line-height: 1.75;
    color: var(--ink);
}

.prose :deep(p) {
    margin: 0 0 1.4em;
}

.prose :deep(p:first-of-type)::first-letter {
    float: left;
    font: 650 3.4em/0.85 var(--font-display);
    padding: 0.08em 0.1em 0 0;
    color: var(--accent);
}

.prose :deep(h2) {
    font-size: 1.6rem;
    margin: 2em 0 0.6em;
}

.prose :deep(h3) {
    font-size: 1.3rem;
    margin: 1.6em 0 0.5em;
}

.prose :deep(blockquote) {
    margin: 2em 0;
    padding: 0.25em 0 0.25em 1.25em;
    border-left: 3px solid var(--accent);
    font-style: italic;
    font-size: 1.2em;
    color: var(--ink-soft);
}

.prose :deep(.body-figure) {
    margin: 2em 0;
}

.prose :deep(.body-figure img) {
    border-radius: var(--radius);
}

.prose :deep(figcaption) {
    margin-top: 0.5rem;
    font: 0.88rem var(--font-ui);
    color: var(--ink-soft);
    text-align: center;
}
</style>