<!-- components/Footer2.vue -->
<template>
  <footer
    data-admin-slug="footer"
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="bg-najmgreen text-white rounded-t-2xl pt-8 md:pt-10 select-text"
  >
    <!-- Top Centered Brand Logo -->
    <div class="flex justify-center pb-5 md:pb-6">
      <component :is="activeLogoWhite" class="h-9 md:h-11 w-auto transition-transform hover:scale-105" />
    </div>

    <!-- Main 2-Column Responsive Grid -->
    <div class="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-start">
      <!-- Left Column: Accordion Navigation, Brand Intro Text, Desktop Trust Badge -->
      <div class="flex flex-col space-y-4 md:space-y-5 w-full max-w-xl mx-auto md:mx-0">
        <!-- Accordion Navigation -->
        <div class="flex flex-col space-y-1.5">
          <BaseFooterAccordion
            v-for="(section, sIdx) in accordionSections"
            :key="section?.id || sIdx"
            :id="section?.id || `sec-${sIdx}`"
            :sectionIndex="sIdx"
            :title="section?.name || ''"
            :items="section?.children || []"
            :modelValue="openAccordionId === (section?.id || `sec-${sIdx}`)"
            @toggle="handleAccordionToggle"
          />
        </div>

        <!-- Brand Story Paragraphs -->
        <div class="pt-3 space-y-2 border-t border-white/10">
          <p
            v-for="(paragraph, index) in localizedParagraphs"
            :key="index"
            class="leading-relaxed font-medium text-d4 text-xs text-white/90 break-words"
            :class="isRTL ? 'text-right' : 'text-left'"
            v-editable="`hero.paragraphs.${index}`"
          >
            {{ paragraph }}
          </p>
        </div>

        <!-- Trust Badges (Desktop) -->
        <div class="hidden md:block pt-1">
          <NuxtImg
            class="max-w-[240px] w-auto h-auto opacity-90 hover:opacity-100 transition-opacity"
            src="/images/sections/footer/trust.png"
            alt="مجوزها و نماد اعتماد"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Right Column: Contact Details, Map, Mobile Trust Badge -->
      <div class="flex flex-col space-y-4 md:space-y-5 w-full max-w-xl mx-auto md:mx-0">
        <!-- Contact Items List (Fully in-place editable) -->
        <div class="flex flex-col divide-y divide-white/10 text-xs md:text-sm">
          <div
            v-for="(item, index) in contactItemsList"
            :key="index"
            class="flex flex-col md:flex-row md:items-center justify-between py-2.5 gap-1 md:gap-2"
          >
            <span
              class="text-white/95 font-bold font-d4 shrink-0"
              v-editable="`contact.items.${index}.name`"
            >
              {{ item?.name || '' }}
            </span>
            <a
              v-if="item?.slug"
              :href="item.slug"
              class="font-mono text-emerald-200 hover:text-white transition-colors truncate"
              dir="ltr"
              v-editable="`contact.items.${index}.value`"
            >
              {{ item?.value || '' }}
            </a>
            <span
              v-else-if="item"
              class="break-words text-xs md:text-sm text-white/90"
              :class="isRTL ? 'text-right' : 'text-left'"
              v-editable="`contact.items.${index}.value`"
            >
              <div v-html="item?.value || ''" />
            </span>
          </div>
        </div>

        <!-- Interactive Map Component (Concentric container with uniform padding) -->
        <div class="w-full p-2 md:p-2.5 rounded-3xl bg-white/5 border border-white/15 shadow-inner">
          <ClientOnly>
            <Map />
          </ClientOnly>
        </div>

        <!-- Trust Badges (Mobile) -->
        <div class="block md:hidden pt-1 flex justify-center">
          <NuxtImg
            class="max-w-[220px] w-auto h-auto opacity-90"
            src="/images/sections/footer/trust.png"
            alt="مجوزها و نماد اعتماد"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Bottom Copyright & Brand Bar (Thinnest possible, responsive flex row on desktop, flex col on mobile) -->
    <div
      class="mt-8 border-t border-white/15"
      :class="[extraBottomSpace ? 'pb-24 sm:pb-28' : '']"
      :style="{ paddingBottom: extraBottomSpace ? undefined : 'max(0.65rem, env(safe-area-inset-bottom, 0.65rem))' }"
    >
      <div class="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-4 text-[11px] md:text-xs text-white/80 font-d4 leading-normal">
        <span 
          class="font-normal text-center"
          :class="isRTL ? 'md:text-right' : 'md:text-left'"
          v-editable="'copyright'"
        >
          {{ currentCopyrightText }}
        </span>
        <span class="font-mono text-[10px] md:text-[11px] shrink-0 text-center text-white/70 hover:text-white transition-colors tracking-wider" dir="ltr">
          &copy; {{ year }} ChapeNajm
        </span>
      </div>
    </div>

  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import logoWhiteFa from '~/assets/icons/najm-logo-white.svg'
import logoWhiteEn from '~/assets/icons/najm-logo-white-en.svg'
import logoWhiteAr from '~/assets/icons/najm-logo-white-ar.svg'
import BaseFooterAccordion from '@/components/Base/BaseFooterAccordion.vue'
import { useLocale } from '~/composables/useLocale'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useMenu } from '~/composables/useMenu'
import { toLocalizedDigits } from '~/utils/digits'
import { getLocalSchema } from '~/composables/ui/schemaRegistry'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Map from '~/components/map.vue'

const props = withDefaults(
  defineProps<{
    extraBottomSpace?: boolean
  }>(),
  {
    extraBottomSpace: false
  }
)

const { language } = useLocale()
const { preloadMenuRoutes } = useMenu()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const isArabic = computed(() => language.value === 'AR')

// In idle CPU time, preload core navigation routes so footer link clicks are instant
onMounted(() => {
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(() => preloadMenuRoutes(), { timeout: 2500 })
    } else {
      setTimeout(() => preloadMenuRoutes(), 600)
    }

    // Refresh scroll triggers to guarantee exact scroll height on desktop & mobile
    setTimeout(() => {
      try {
        ScrollTrigger.refresh()
      } catch {}
    }, 350)
  }
})

const activeLogoWhite = computed(() => {
  if (language.value === 'EN') return logoWhiteEn
  if (language.value === 'AR') return logoWhiteAr
  return logoWhiteFa
})

// Connect directly to live content engine with dual local + remote persistence
const { ui } = usePageUI('footer')

const fallbackHero = [
  'در دنیای پررقابت امروز، بسته‌بندی دیگر تنها یک محافظ کالا نیست، بلکه شناسنامه بصری برند شماست.',
  'از طراحی ساختاری و مهندسی خطوط تیغ تا چاپ ۵ رنگ افست هایدلبرگ و خدمات تکمیلی مدرن؛ همه زیر یک سقف در مجتمع چاپ و بسته‌بندی نجم.'
]

const fallbackContact = [
  { name: 'تلفن مستقیم', value: '۰۲۱-۶۶۷۹۷۹۱۱ الی ۱۳', slug: 'tel:+982166797911' },
  { name: 'فکس و خط دوم', value: '۰۲۱-۶۶۷۸۹۵۷۷', slug: 'tel:+982166789577' },
  { name: 'همراه و مشاوره', value: '۰۹۹۰۳۴۰۰۰۷۴', slug: 'tel:+989903400074' },
  { name: 'نشانی کارخانه', value: 'بزرگراه فتح، نبش کوچه تلفن‌خانه، پلاک ۱۶۶', slug: 'https://maps.app.goo.gl/z4fFFJ4UwzQSuiEDA' },
  { name: 'پست الکترونیک', value: 'info@chapenajm.com', slug: 'mailto:info@chapenajm.com' }
]

const accordionSections = computed(() => {
  const sec = ui.value?.sections
  if (Array.isArray(sec) && sec.length > 0) {
    const valid = sec.filter((s: any) => s && typeof s === 'object')
    if (valid.length > 0) return valid
  }
  const local = getLocalSchema('footer')
  const lang = (language.value || 'FA').toLowerCase()
  const fallbackSecs = local?.[lang]?.sections || local?.['fa']?.sections || []
  return fallbackSecs
})

const localizedParagraphs = computed(() => {
  const p = ui.value?.hero?.paragraphs
  if (Array.isArray(p) && p.length > 0) return p
  return fallbackHero
})

const contactItemsList = computed(() => {
  const items = ui.value?.contact?.items
  if (Array.isArray(items) && items.length > 0) {
    const valid = items.filter((it: any) => it && typeof it === 'object')
    if (valid.length > 0) return valid
  }
  return fallbackContact
})

const currentCopyrightText = computed(() => {
  if (ui.value?.copyright) return ui.value.copyright
  if (isArabic.value) return 'جميع الحقوق محفوظة لمجمع نجم المتخصص للطباعة والتغليف الصناعي.'
  if (isRTL.value) return 'تمامی حقوق متعلق به مجتمع چاپ و بسته‌بندی نجم می‌باشد.'
  return 'All rights reserved by Najm Printing and Packaging Complex.'
})

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