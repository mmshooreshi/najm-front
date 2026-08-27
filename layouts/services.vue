<!-- layouts/services.vue -->
<template>
  <div class="min-h-screen w-full relative">
    <BackgroundGradient />

    <Header
      :topLabel="topLabel"
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
      <div v-if="primaryCtaLabel || secondaryCtaLabel" class="fixed inset-x-0 bottom-0 z-40 bg-white/60 backdrop-blur-md border-t border-gray-200/50 py-3">
        <div class="w-full px-4 md:px-8">
          <div class="flex flex-row gap-3 justify-center max-w-md mx-auto">
            <NuxtLink
              v-if="primaryCtaLabel"
              to="/contact"
              class="flex-1 h-11 px-6 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center transition shadow-sm"
            >
              {{ primaryCtaLabel }}
            </NuxtLink>
            <NuxtLink
              v-if="secondaryCtaLabel"
              to="/resources"
              class="flex-1 h-11 px-6 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-bold flex items-center justify-center transition"
            >
              {{ secondaryCtaLabel }}
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

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const menuOpen = ref(false)

const route = useRoute()
const serviceSlug = computed(() => (route.params.slug as string) || '')
const { ui } = usePageUI(`services-${serviceSlug.value}`)

const topLabel = computed(
  () => ui.value?.layout?.topLabel ?? (isRTL.value ? 'خدمات تخصصی چاپ و بسته‌بندی' : 'Industrial Printing & Packaging Services')
)

const primaryCtaLabel = computed(() => {
  const p = ui.value?.layout?.bottomButtons?.primary
  if (!p) return isRTL.value ? 'استعلام و تماس با ما' : 'Inquire & Contact Us'
  return typeof p === 'string' ? p : p.label || (isRTL.value ? 'استعلام و تماس' : 'Inquire & Contact')
})

const secondaryCtaLabel = computed(() => {
  const s = ui.value?.layout?.bottomButtons?.secondary
  if (!s) return isRTL.value ? 'دانلود کاتالوگ و قالب‌ها' : 'Download Catalog & Templates'
  return typeof s === 'string' ? s : s.label || (isRTL.value ? 'دانلود کاتالوگ' : 'Download Catalog')
})
</script>

<style scoped>
.w-screen {
  max-width: 1280px;
}
</style>
