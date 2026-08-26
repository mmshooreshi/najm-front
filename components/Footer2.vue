<!-- components/Footer2.vue -->
<template>
  <footer :dir="isRTL ? 'rtl' : 'ltr'" class="bg-najmgreen/100 rounded-t-[15px] text-center items-center text-white/100 pt-16 pb-16">
    <div class="grid-cols-2 grid w-full">
      <logoWhite class="col-span-2 mx-auto" />
    </div>

    <div class="max-w-screen-xl px-0 grid grid-cols-1 md:grid-cols-2 items-baseline mx-auto">
      <div class="col-span-1 px-6 sm:px-10 md:mt-16 md:max-h-[60vh]">
        <div class="max-w-xl mx-auto md:px-10 flex flex-col-reverse md:flex-col gap-1">
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

          <div class="grid gap-8 pt-8 md:pt-12 pb-0">
            <div class="flex flex-col gap-4 mb-8 md:mb-0">
              <p
                v-for="(paragraph, index) in footerData.hero?.paragraphs"
                :key="index"
                class="leading-relaxed font-medium text-d4 text-xs break-words"
                :class="isRTL ? 'text-right' : 'text-left'"
                v-editable="`hero.paragraphs.${index}`"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>

        <NuxtImg v-if="isDesktop" class="invisible md:visible md:max-h-full max-w-sm mx-auto w-[80%] mt-4 mb-4 px-2 py-0" src="/images/sections/footer/trust.png" />
      </div>

      <div class="max-w-screen-xl overflow-hidden col-span-1 px-6 sm:px-10">
        <div class="flex flex-col w-full max-w-xl mx-auto md:px-10 gap-0 text-sm pt-8 md:pt-12 pb-2">
          <div
            v-for="(item, index) in footerData.contact?.items"
            :key="index"
            class="flex flex-col"
          >
            <div class="flex w-full justify-between items-center border-b border-white/10 border-b-0.5 py-3 gap-2">
              <span class="text-demibold text-d4 text-xs sm:text-sm whitespace-nowrap" v-editable="`contact.items.${index}.name`">{{ item.name }}</span>
              <a
                v-if="item.slug"
                :href="item.slug"
                class="font-mono text-demibold text-d4 text-xs sm:text-sm break-all"
                :class="[item.ltr ? 'ltr' : 'rtl']"
                v-editable="`contact.items.${index}.value`"
              >
                {{ item.value }}
              </a>
              <span v-else class="break-words text-xs sm:text-sm" :class="isRTL ? 'text-right' : 'text-left'" v-editable="`contact.items.${index}.value`">
                <div v-html="item.value" />
              </span>
            </div>
          </div>
        </div>

        <ClientOnly>
          <Map />
        </ClientOnly>

        <NuxtImg class="md:invisible md:hidden visible max-w-sm mx-auto w-full mt-4 mb-4 px-2 py-0" src="/images/sections/footer/trust.png" />
      </div>
    </div>

    <div class="max-w-sm md:max-w-screen mx-12 overflow-hidden h-px bg-white/20 mx-auto mt-6"></div>

    <div class="max-w-screen-xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-between gap-2 py-4 text-xs md:flex-row">
      <span class="break-words" v-editable="'copyright'">{{ footerData.copyright || 'کلیه حقوق این سایت متعلق به مجتمع چاپ و بسته‌بندی نجم می‌باشد.' }}</span>
      <span class="ltr font-mono">&copy; {{ year }} NajmPrint Complex</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import logoWhite from '~/assets/icons/najm-logo-white.svg'
import BaseFooterAccordion from '@/components/Base/BaseFooterAccordion.vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'
import Map from '~/components/map.vue'

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const { ui, allUi } = usePageUI('footer')
useAdminEditable('footer', allUi)

const fallbackFooter = {
  hero: {
    paragraphs: [
      'در دنیای رقابتی امروز، چاپ و بسته‌بندی دیگر فقط یک مرحله از تولید نیست؛ بلکه اولین نقطه تماس برند شما با مشتریان است. ما باور داریم که هر پروژه یک داستان است. داستانی که باید به‌طور ویژه و با دقت روایت شود.',
      'از طراحی تا اجرا، همه چیز در یک مجموعه. با راهکارهای خلاقانه و انعطاف‌پذیر ما اینجا هستیم تا داستان شما را تبدیل به یک تجربه‌ی ماندگار کنیم.'
    ]
  },
  sections: [
    {
      id: 'services',
      name: 'خدمات',
      type: 'accordion',
      children: [
        { id: 'packaging', name: 'بسته‌بندی و جعبه‌سازی', slug: '/services/printing-and-packaging' },
        { id: 'printing', name: 'چاپ افست ۵ رنگ', slug: '/services/printing-and-packaging' },
        { id: 'finishing', name: 'خدمات تکمیلی و طلاکوب', slug: '/services/finishing-services' }
      ]
    },
    {
      id: 'najm-collection',
      name: 'مجموعه نجم',
      type: 'accordion',
      children: [
        { id: 'about', name: 'درباره ما', slug: '/about' },
        { id: 'contact', name: 'تماس با ما', slug: '/contact' },
        { id: 'catalog', name: 'کاتالوگ جامع', slug: '/catalog' }
      ]
    },
    {
      id: 'customer-service',
      name: 'سرویس مشتریان',
      type: 'accordion',
      children: [
        { id: 'faq', name: 'سؤالات متداول', slug: '/contact' },
        { id: 'guides', name: 'راهنماهای فنی چاپ', slug: '/guides' }
      ]
    },
    {
      id: 'latest',
      name: 'منابع و فایل‌ها',
      type: 'accordion',
      children: [
        { id: 'resources', name: 'مرکز دانلود قالب‌ها', slug: '/resources' },
        { id: 'cmyk', name: 'پروفایل رنگی CMYK', slug: '/resources/guide-cmyk-color-profile' }
      ]
    }
  ],
  contact: {
    items: [
      { id: 'phone', name: 'تلفن مستقیم', value: '+98 21 6679 7911', slug: 'tel:+982166797911', ltr: true },
      { id: 'fax', name: 'فکس کارخانه', value: '+98 21 0053 6712', slug: 'fax:+982100536712', ltr: true },
      { id: 'email', name: 'پست الکترونیک', value: 'info@najmprint.com', slug: 'mailto:info@najmprint.com', ltr: true },
      { id: 'hours1', name: 'ساعت‌های کاری', value: 'شنبه تا چهارشنبه: ۹ الی ۱۸ | پنج‌شنبه‌ها: ۹ الی ۱۴' }
    ]
  },
  copyright: 'کلیه حقوق مادی و معنوی این وب‌سایت متعلق به مجتمع چاپ و بسته‌بندی نجم می‌باشد.'
}

const footerData = computed(() => {
  return {
    ...fallbackFooter,
    ...(ui.value || {})
  }
})

const openAccordionId = ref<string | null>(null)

const accordionSections = computed(() =>
  (footerData.value.sections ?? []).filter((section: any) => section.type === 'accordion' || !section.type)
)

function handleAccordionToggle(id: string) {
  openAccordionId.value = openAccordionId.value === id ? null : id
}

const year = new Date().getFullYear()
const isDesktop = useMediaQuery('(min-width: 768px)')
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
