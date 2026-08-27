<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage :page-key="route => route.fullPath" />
  </NuxtLayout>
  <ClientOnly>
    <AdminEditBar />
    <AdminMediaOverlay />
    <AdminMediaStudioModal />
    <AdminMotionPill />
    <ConsultationModal />
  </ClientOnly>
</template>

<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import '@unocss/reset/normalize.css'
import '@unocss/reset/tailwind.css'
import AdminEditBar from '~/components/admin/AdminEditBar.client.vue'
import AdminMediaOverlay from '~/components/admin/AdminMediaOverlay.client.vue'
import AdminMediaStudioModal from '~/components/admin/AdminMediaStudioModal.client.vue'
import AdminMotionPill from '~/components/admin/AdminMotionPill.client.vue'
import ConsultationModal from '~/components/consultation/ConsultationModal.vue'

const route = useRoute()
provideHeadlessUseId(() => useId())
</script>