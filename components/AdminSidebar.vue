<!-- components/AdminSidebar.vue -->
<!-- components/AdminSidebar.vue -->
<script setup lang="ts">
const pb  = usePB()
const { data: collections } = await useAsyncData('pb-cols', () =>
  pb.collections.getFullList({ sort: '+name' })
)
</script>

<template>
  <ul class="space-y-1 px-4 py-2">
    <li v-for="c in collections" :key="c.id">
      <NuxtLink
        :to="`/admin/c/${c.name}`"
        class="block rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100"
        active-class="bg-gray-200 font-semibold">
        {{ c.name }}
      </NuxtLink>
    </li>
  </ul>
</template>
