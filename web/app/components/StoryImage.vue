<script setup lang="ts">
import type { SanityImage } from '~/types/sanity'

const props = withDefaults(
    defineProps<{
        image: SanityImage
        widths?: number[]
        sizes?: string
        /** width / height. Omit to keep the original ratio. */
        aspect?: number
        eager?: boolean
    }>(),
    { widths: () => [400, 640, 960, 1280, 1600], sizes: '100vw', aspect: undefined, eager: false },
)

const ratio = computed(() => props.aspect ?? props.image.dimensions?.aspectRatio ?? 3 / 2)

function build(w: number): string {
    let b = urlFor(props.image).width(w).auto('format').quality(80)
    if (props.aspect) b = b.height(Math.round(w / props.aspect)).fit('crop')
    return b.url()
}

const largest = computed(() => props.widths[props.widths.length - 1] ?? 1600)
const src = computed(() => build(props.widths[2] ?? largest.value))
const srcset = computed(() => props.widths.map((w) => `${build(w)} ${w}w`).join(', '))
const height = computed(() => Math.round(largest.value / ratio.value))
const placeholder = computed(() =>
    props.image.lqip ? { backgroundImage: `url(${props.image.lqip})` } : undefined,
)
</script>

<template>
    <img class="story-image" :src="src" :srcset="srcset" :sizes="sizes" :width="largest" :height="height"
        :alt="image.alt ?? ''" :loading="eager ? 'eager' : 'lazy'" decoding="async" :style="placeholder">
</template>

<style scoped>
.story-image {
    width: 100%;
    height: auto;
    background-color: var(--surface-warm);
    background-size: cover;
    background-position: center;
}
</style>