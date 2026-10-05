<script setup lang="ts">
const { data } = await useAsyncData('test', () =>
  useSanityClient().fetch<string[]>(`*[_type == "story"].title`),
)
</script>

<template>
  <pre>{{ data }}</pre>
</template>