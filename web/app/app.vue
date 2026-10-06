<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} | In Their Words` : 'In Their Words: personal stories from across Asia'),
})
</script>

<template>
  <NuxtLoadingIndicator color="#a94b24" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <ConsentBanner />
  </ClientOnly>
</template>
