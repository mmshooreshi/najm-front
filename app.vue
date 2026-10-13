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
    <TelemetryLens v-if="hasAdmin" />
    <ConsultationModal v-if="isModalOpen" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import '@unocss/reset/tailwind-compat.css'
import Drawer from '~/components/Drawer.vue'
import { adminEditState } from '@/store/adminEditStore'
import { useMenu } from '~/composables/useMenu'
import { useLocale } from '~/composables/useLocale'
import { useConsultation } from '~/composables/useConsultation'

const { language, isRTL } = useLocale()
const { isMenuOpen } = useMenu()
const { isModalOpen } = useConsultation()

const ConsultationModal = defineAsyncComponent(() => import('~/components/consultation/ConsultationModal.vue'))

useHead({
  htmlAttrs: {
    lang: computed(() => (language.value === 'EN' ? 'en-US' : language.value === 'AR' ? 'ar-SA' : 'fa-IR')),
    dir: computed(() => (isRTL.value ? 'rtl' : 'ltr'))
  }
})

const AdminEditBar = defineAsyncComponent(() => import('~/components/admin/AdminEditBar.client.vue'))
const AdminMediaOverlay = defineAsyncComponent(() => import('~/components/admin/AdminMediaOverlay.client.vue'))
const AdminMediaStudioModal = defineAsyncComponent(() => import('~/components/admin/AdminMediaStudioModal.client.vue'))
const TelemetryLens = defineAsyncComponent(() => import('~/components/admin/telemetry/TelemetryLens.client.vue'))

const route = useRoute()
const isDash = computed(() => route.path.startsWith('/dash'))
const adminCookie = useCookie('pb_admin')
const hasAdmin = computed(() => {
  if (isDash.value) return false
  return !!adminCookie.value || (typeof document !== 'undefined' && document.cookie.includes('pb_admin='))
})
const canEdit = computed(() => {
  if (isDash.value) return false
  return adminEditState.canEdit
})
provideHeadlessUseId(() => useId())
</script>