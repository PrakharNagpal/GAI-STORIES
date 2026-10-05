<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} | Shared Stories` : 'Shared Stories: real health journeys'),
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
