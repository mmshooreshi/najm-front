<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage :page-key="route => route.fullPath" />
  </NuxtLayout>
  <ClientOnly>
    <AdminEditBar />
    <ConsultationModal />
  </ClientOnly>
</template>

<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import '@unocss/reset/normalize.css'
import '@unocss/reset/tailwind.css'
import AdminEditBar from '~/components/admin/AdminEditBar.client.vue'
import ConsultationModal from '~/components/consultation/ConsultationModal.vue'

const route = useRoute()
provideHeadlessUseId(() => useId())
</script>