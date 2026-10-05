<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)

useHead({ title: is404.value ? 'Page not found' : 'Something went wrong' })
</script>

<template>
  <NuxtLayout>
    <section class="container error">
      <p class="eyebrow">Error {{ error.statusCode }}</p>
      <h1>{{ is404 ? 'We could not find that story' : 'Something went wrong on our side' }}</h1>
      <p class="meta">
        {{ is404 ? 'It may have been moved or unpublished.' : 'Please try again in a moment.' }}
      </p>
      <button type="button" class="btn" @click="clearError({ redirect: '/' })">Back to all stories</button>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error { padding: clamp(4rem, 12vw, 8rem) 0; text-align: center; display: grid; justify-items: center; gap: 0.75rem; }
.error h1 { font-size: clamp(2rem, 5vw, 3rem); max-width: 20ch; }
</style>