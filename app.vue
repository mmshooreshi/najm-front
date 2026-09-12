<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage :page-key="route => route.fullPath" />
  </NuxtLayout>
  <ClientOnly>
    <template v-if="canEdit">
      <AdminEditBar />
      <AdminMediaOverlay />
      <AdminMediaStudioModal />
      <AdminMotionPill />
    </template>
    <ConsultationModal />
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import '@unocss/reset/tailwind-compat.css'
import ConsultationModal from '~/components/consultation/ConsultationModal.vue'
import { adminEditState } from '@/store/adminEditStore'

const AdminEditBar = defineAsyncComponent(() => import('~/components/admin/AdminEditBar.client.vue'))
const AdminMediaOverlay = defineAsyncComponent(() => import('~/components/admin/AdminMediaOverlay.client.vue'))
const AdminMediaStudioModal = defineAsyncComponent(() => import('~/components/admin/AdminMediaStudioModal.client.vue'))
const AdminMotionPill = defineAsyncComponent(() => import('~/components/admin/AdminMotionPill.client.vue'))

const route = useRoute()
const canEdit = computed(() => {
  if (route.path.startsWith('/dash')) return false
  return adminEditState.canEdit
})
provideHeadlessUseId(() => useId())
</script>