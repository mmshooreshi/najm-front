<!-- layouts/services.vue -->
<template>
  <BackgroundGradient />

  <Header
    :menu-open="menuOpen"
    @update:menu-open="menuOpen = $event"
    class="fixed top-0 left-0 w-full z-50"
  />

  <ClientOnly fallback="">
    <div  :dir="isRTL ? 'rtl' : 'ltr'"  class="relative min-h-screen pt-16 pb-24 bg-[#e4eaeb]">
      <!-- Top label from backend (localized) -->
      <div class="w-full">
        <div class="containerCustom mx-auto px-4 md:px-8 mt-4">
          <span
            class="inline-flex items-center rounded-full bg-white/80 text-xs md:text-sm font-medium px-3 py-1 shadow-sm"
          >
            {{ topLabel }}
          </span>
        </div>
      </div>

      <!-- Main content -->
      <div class="containerCustom mx-auto px-4 md:px-8 mt-4 pb-32">
        <slot />
      </div>

      <!-- <Footer2 /> -->

      <!-- Bottom fixed CTA bar -->
      <div class="fixed inset-x-0 bottom-0 z-40">
        <div class="containerCustom mx-auto px-4 md:px-8 pb-4">
          <div
            class="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-3 flex flex-col gap-2 sm:flex-row sm:gap-3"
          >
            <button
              type="button"
              class="flex-1 h-11 md:h-12 rounded-xl !bg-najmgreen hover:!bg-najmgreen/90 text-white text-sm md:text-base font-semibold flex items-center justify-center"
            >
              <NuxtLink to="" >{{ primaryCta.label }}</NuxtLink>
            </button>
            <button
              type="button"
              class="flex-1 h-11 md:h-12 rounded-xl border border-black/10 !bg-najmgreen hover:!bg-najmgreen/90 text-white text-sm md:text-base font-semibold flex items-center justify-center"
            >
            <NuxtLink to="" >{{ secondaryCta.label }}</NuxtLink>
              
            </button>
          </div>
        </div>
      </div>
    </div  :dir="isRTL ? 'rtl' : 'ltr'" >

    <AdminEditBar />
    <HistoryModal :open="state.editMode ?? false" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from '#imports'
import BackgroundGradient from '~/components/BackgroundGradient.vue'
import Header from '~/components/Header.vue'
// import Footer2 from '~/components/Footer2.vue'
import AdminEditBar from '~/components/admin/AdminEditBar.client.vue'
import HistoryModal from '~/components/admin/HistoryModal.client.vue'
import { adminEditState as state } from '@/store/adminEditStore'
import { usePageUI } from '@/composables/ui/usePageUI'
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const menuOpen = ref(false)

// Same slug convention as the page component
const route = useRoute()
const serviceSlug = route.params.slug as string
const { ui } = usePageUI(`services-${serviceSlug}`)

// Expected in each service-*.json per language:
// "layout": {
//   "topLabel": "خدمات",
//   "bottomButtons": {
//     "primary": "تماس",
//     "secondary": "آپلود فایل طراحی"
//   }
// }

const topLabel = computed(
  () => ui.value?.layout?.topLabel ?? 'Services'
)

const primaryCta = computed(
  () =>
    ui.value?.layout?.bottomButtons?.primary || '' 
)

const secondaryCta = computed(
  () => ui.value?.layout?.bottomButtons?.secondary || ''
)

</script>

<style scoped>
.containerCustom {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 640px) {
  .containerCustom {
    max-width: 640px;
  }
}
@media (min-width: 768px) {
  .containerCustom {
    max-width: 768px;
  }
}
@media (min-width: 1024px) {
  .containerCustom {
    max-width: 1024px;
  }
}
@media (min-width: 1280px) {
  .containerCustom {
    max-width: 1280px;
  }
}
@media (min-width: 1536px) {
  .containerCustom {
    max-width: 1280px;
  }
}
</style>
