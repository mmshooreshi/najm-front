<!-- components/Footer2.vue -->
<template>
  <footer :dir="isRTL ? 'rtl' : 'ltr'" class="bg-najmgreen text-white rounded-t-2xl pt-14 pb-20">
    <!-- Top Centered Brand Logo -->
    <div class="flex justify-center pb-10">
      <logoWhite class="h-10 sm:h-12 w-auto" />
    </div>

    <!-- Main 2-Column Responsive Grid -->
    <div class="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
      <!-- Left Column: Accordion Navigation, Brand Intro Text, Desktop Trust Badge -->
      <div class="flex flex-col space-y-6 w-full max-w-xl mx-auto md:mx-0">
        <!-- Accordion Navigation -->
        <div class="flex flex-col space-y-1.5">
          <BaseFooterAccordion
            v-for="(section, sIdx) in accordionSections"
            :key="section.id || sIdx"
            :id="section.id"
            :sectionIndex="sIdx"
            :title="section.name"
            :items="section.children"
            :modelValue="openAccordionId === section.id"
            @toggle="handleAccordionToggle"
          />
        </div>

        <!-- Brand Story Paragraphs -->
        <div class="pt-4 space-y-3 border-t border-white/10">
          <p
            v-for="(paragraph, index) in localizedParagraphs"
            :key="index"
            class="leading-relaxed font-medium text-d4 text-xs text-white/90 break-words"
            :class="isRTL ? 'text-right' : 'text-left'"
          >
            {{ paragraph }}
          </p>
        </div>

        <!-- Trust Badges (Desktop) -->
        <div class="hidden md:block pt-2">
          <NuxtImg
            class="max-w-[260px] w-auto h-auto opacity-95 hover:opacity-100 transition-opacity"
            src="/images/sections/footer/trust.png"
            alt="مجوزها و نماد اعتماد"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Right Column: Contact Details, Map, Mobile Trust Badge -->
      <div class="flex flex-col space-y-6 w-full max-w-xl mx-auto md:mx-0">
        <!-- Contact Items List -->
        <div class="flex flex-col divide-y divide-white/10 text-xs sm:text-sm">
          <div
            v-for="(item, index) in contactItemsList"
            :key="index"
            class="flex items-center justify-between py-3 gap-2"
          >
            <span class="text-white/95 font-bold font-d4 shrink-0">
              {{ item.name }}
            </span>
            <a
              v-if="item.slug"
              :href="item.slug"
              class="font-mono text-emerald-200 hover:text-white transition-colors truncate"
              dir="ltr"
            >
              {{ item.value }}
            </a>
            <span
              v-else
              class="break-words text-xs sm:text-sm text-white/90 truncate"
              :class="isRTL ? 'text-right' : 'text-left'"
            >
              <div v-html="item.value" />
            </span>
          </div>
        </div>

        <!-- Interactive Map Component -->
        <div class="w-full">
          <ClientOnly>
            <Map />
          </ClientOnly>
        </div>

        <!-- Trust Badges (Mobile) -->
        <div class="block md:hidden pt-2 flex justify-center">
          <NuxtImg
            class="max-w-[240px] w-auto h-auto opacity-95"
            src="/images/sections/footer/trust.png"
            alt="مجوزها و نماد اعتماد"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Divider Line -->
    <div class="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-12 my-6">
      <div class="h-px bg-white/20 w-full"></div>
    </div>

    <!-- Bottom Copyright & Brand Bar (Always Guaranteed Visible) -->
    <div class="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/90 font-d4">
      <span 
        class="text-center sm:text-right leading-relaxed font-medium break-words" 
        v-editable="'copyright'"
      >
        {{ currentCopyrightText || 'تمامی حقوق متعلق به مجتمع چاپ و بسته‌بندی نجم می‌باشد.' }}
      </span>
      <span class="font-mono text-xs shrink-0 text-center sm:text-left font-semibold text-white/90" dir="ltr">
        &copy; {{ year }} ChapNajm
      </span>
    </div>

  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import logoWhite from '~/assets/icons/najm-logo-white.svg'
import BaseFooterAccordion from '@/components/Base/BaseFooterAccordion.vue'
import { useLocale } from '~/composables/useLocale'
import { usefooterUIData } from '~/composables/ui/footerUI' // Use your UI Composable
import Map from '~/components/map.vue'

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const activeLang = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
})

// 1. Fetch the data dynamically from backend (falls back to local JSON)
const { footerUIData } = usefooterUIData()

// 2. Select the specific data tree for the current active language
const currentUiData = computed(() => {
  // Try to grab the data for the active language, fallback to 'fa'
  return footerUIData.value[activeLang.value] || footerUIData.value.fa
})

// 3. Map the data directly to the computed properties for the template
const accordionSections = computed(() => currentUiData.value.sections || [])
const localizedParagraphs = computed(() => currentUiData.value.hero?.paragraphs || [])
const contactItemsList = computed(() => currentUiData.value.contact?.items || [])
const currentCopyrightText = computed(() => currentUiData.value.copyright || '')

const openAccordionId = ref<string | null>(null)

function handleAccordionToggle(id: string) {
  openAccordionId.value = openAccordionId.value === id ? null : id
}

const year = new Date().getFullYear()
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #ffffff55;
  border-radius: 3px;
}
</style>