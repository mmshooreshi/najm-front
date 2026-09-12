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
    </template>
    <ConsultationModal />
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import '@unocss/reset/tailwind-compat.css'
import ConsultationModal from '~/components/consultation/ConsultationModal.vue'
import { adminEditState } from '@/store/adminEditStore'

import { useLocale } from '~/composables/useLocale'

const { language, isRTL } = useLocale()

useHead({
  htmlAttrs: {
    lang: computed(() => (language.value === 'EN' ? 'en-US' : language.value === 'AR' ? 'ar-SA' : 'fa-IR')),
    dir: computed(() => (isRTL.value ? 'rtl' : 'ltr'))
  }
})

const AdminEditBar = defineAsyncComponent(() => import('~/components/admin/AdminEditBar.client.vue'))
const AdminMediaOverlay = defineAsyncComponent(() => import('~/components/admin/AdminMediaOverlay.client.vue'))
const AdminMediaStudioModal = defineAsyncComponent(() => import('~/components/admin/AdminMediaStudioModal.client.vue'))

const route = useRoute()
const canEdit = computed(() => {
  if (route.path.startsWith('/dash')) return false
  return adminEditState.canEdit
})
provideHeadlessUseId(() => useId())
</script>