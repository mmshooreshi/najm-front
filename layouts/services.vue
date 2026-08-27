<!-- layouts/services.vue -->
<template>
  <div class="min-h-screen w-full relative">
    <BackgroundGradient />

    <Header
      :menu-open="menuOpen"
      @update:menu-open="menuOpen = $event"
      class="fixed top-0 left-0 w-full z-50"
    />

    <div :dir="isRTL ? 'rtl' : 'ltr'" class="relative min-h-screen pt-16 pb-24 bg-najmback">
      <!-- Main content -->
      <div class="w-full px-4 md:px-8 mt-4 pb-32">
        <slot />
      </div>

      <!-- Bottom fixed CTA bar -->
      <div v-if="primaryCtaLabel || secondaryCtaLabel" class="fixed inset-x-0 bottom-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-200/60 py-3 shadow-md">
        <div class="w-full px-4 md:px-8">
          <div class="flex flex-row gap-3 justify-center max-w-md mx-auto">
            <NuxtLink
              v-if="primaryCtaLabel"
              :to="primaryCtaHref"
              class="flex-1 h-11 px-6 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center transition shadow-sm text-center cursor-pointer"
            >
              <span v-editable="primaryCtaPath">{{ primaryCtaLabel }}</span>
            </NuxtLink>
            <NuxtLink
              v-if="secondaryCtaLabel"
              :to="secondaryCtaHref"
              class="flex-1 h-11 px-6 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-bold flex items-center justify-center transition text-center cursor-pointer"
            >
              <span v-editable="secondaryCtaPath">{{ secondaryCtaLabel }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from '#imports'
import BackgroundGradient from '~/components/BackgroundGradient.vue'
import Header from '~/components/Header.vue'
import { usePageUI } from '@/composables/ui/usePageUI'
import { useLocale } from '@/composables/useLocale'
import { useAdminEditable } from '@/composables/useAdminEditable'

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const menuOpen = ref(false)

const route = useRoute()
const serviceSlug = computed(() => (route.params.slug as string) || 'design-and-layout')
const pageKey = computed(() => `services-${serviceSlug.value}`)
const { ui, allUi } = usePageUI(pageKey.value)
useAdminEditable(pageKey.value, allUi)

const primaryCtaPath = computed(() => {
  const p = ui.value?.layout?.bottomButtons?.primary
  if (p && typeof p === 'object' && p.label) return 'layout.bottomButtons.primary.label'
  return 'layout.bottomButtons.primary'
})

const secondaryCtaPath = computed(() => {
  const s = ui.value?.layout?.bottomButtons?.secondary
  if (s && typeof s === 'object' && s.label) return 'layout.bottomButtons.secondary.label'
  return 'layout.bottomButtons.secondary'
})

const primaryCtaLabel = computed(() => {
  const p = ui.value?.layout?.bottomButtons?.primary
  if (p && typeof p === 'string' && p.trim()) return p
  if (p && p.label) return p.label
  return isRTL.value ? 'استعلام و تماس با ما' : 'Inquire & Contact Us'
})

const primaryCtaHref = computed(() => {
  const p = ui.value?.layout?.bottomButtons?.primary
  if (p && typeof p === 'object' && p.href) return p.href
  return '/contact'
})

const secondaryCtaLabel = computed(() => {
  const s = ui.value?.layout?.bottomButtons?.secondary
  if (s && typeof s === 'string' && s.trim()) return s
  if (s && s.label) return s.label
  return isRTL.value ? 'دانلود کاتالوگ و قالب‌ها' : 'Download Catalog & Templates'
})

const secondaryCtaHref = computed(() => {
  const s = ui.value?.layout?.bottomButtons?.secondary
  if (s && typeof s === 'object' && s.href) return s.href
  return '/resources'
})
</script>

<style scoped>
.w-screen {
  max-width: 1280px;
}
</style>
