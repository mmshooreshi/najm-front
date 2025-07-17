<!-- pages/admin/index.vue -->
<script setup lang="ts">
/**
 * Admin landing page – shows a card per collection with a record count.
 * Uses the same server proxy so the admin JWT stays safe.
 */
definePageMeta({
  layout: 'admin'
})
const { data: collections } = await useAsyncData('pb-stats', () =>
  $fetch<{ name: string; count: number }[]>('/api/admin/pb/stats')
)
</script>

<template>
  <h1 class="mb-6 text-2xl font-bold">Dashboard</h1>

  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <NuxtLink
      v-for="c in collections"
      :key="c.name"
      :to="`/admin/c/${c.name}`"
      class="block rounded-xl border bg-white p-6 shadow hover:shadow-lg transition">
      <h2 class="text-lg font-semibold">{{ c.name }}</h2>
      <p class="mt-2 text-4xl font-bold">{{ c.count }}</p>
    </NuxtLink>
  </div>
</template>
