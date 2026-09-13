<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage :page-key="route => route.fullPath" />
  </NuxtLayout>
  <Drawer v-if="!isDash" v-model:open="isMenuOpen" />
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
import Drawer from '~/components/Drawer.vue'
import ConsultationModal from '~/components/consultation/ConsultationModal.vue'
import { adminEditState } from '@/store/adminEditStore'
import { useMenu } from '~/composables/useMenu'
import { useLocale } from '~/composables/useLocale'

const { language, isRTL } = useLocale()
const { isMenuOpen } = useMenu()

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
const isDash = computed(() => route.path.startsWith('/dash'))
const canEdit = computed(() => {
  if (isDash.value) return false
  return adminEditState.canEdit
})
provideHeadlessUseId(() => useId())
</script>