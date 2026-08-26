<!-- pages/products/applications/[slug].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">محصولات</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">کاربردها و پکیج‌ها</span>
      <span>/</span>
      <span class="text-gray-900 font-semibold break-words" v-editable="'title'">{{ appData.title }}</span>
    </nav>

    <!-- App Hero -->
    <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-najmborder/40">
      <div class="max-w-3xl space-y-4" :class="isRTL ? 'text-right' : 'text-left'">
        <span
          class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4 break-words"
          v-editable="'badge'"
        >
          {{ appData.badge || 'پکیج کاربردی و هدفمند' }}
        </span>
        <h1
          class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight text-d4 leading-tight break-words"
          v-editable="'title'"
        >
          {{ appData.title }}
        </h1>
        <p
          class="text-xs sm:text-base text-gray-600 leading-relaxed break-words"
          v-editable="'description'"
        >
          {{ appData.description }}
        </p>
      </div>
    </div>

    <!-- Items in package -->
    <div class="space-y-6">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-900 text-d4 break-words"
        :class="isRTL ? 'text-right' : 'text-left'"
        v-editable="'itemsTitle'"
      >
        {{ appData.itemsTitle || 'اقلام موجود در این پکیج' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <div
          v-for="(item, idx) in (appData.items || [])"
          :key="idx"
          class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          <div>
            <div class="w-10 h-10 rounded-xl bg-najmgrey text-najmgreen flex items-center justify-center mb-4">
              <Icon name="mdi:check-decagram-outline" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2 text-d4 break-words" v-editable="`items.${idx}.name`">
              {{ item.name }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 break-words" v-editable="`items.${idx}.desc`">
              {{ item.desc }}
            </p>
            <div class="p-3 bg-najmgrey/50 border border-najmborder/40 rounded-xl text-xs text-gray-700 font-medium break-words" v-editable="`items.${idx}.feature`">
              ویژگی / Spec: {{ item.feature }}
            </div>
          </div>
          <div class="pt-6 mt-4 border-t border-gray-100">
            <NuxtLink
              to="/contact"
              class="w-full block py-2.5 rounded-xl bg-najmgrey hover:bg-najmgreen hover:text-white text-gray-800 text-xs font-bold text-center transition"
            >
              سفارش این آیتم / Order
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to action -->
    <div class="bg-najmgreen text-white rounded-3xl p-6 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
      <div class="space-y-2 max-w-xl" :class="isRTL ? 'text-right' : 'text-left'">
        <h3 class="text-xl sm:text-2xl font-bold text-d4 break-words" v-editable="'cta.title'">
          {{ appData.cta?.title || 'نیاز به سفارشی‌سازی اقلام این پکیج دارید؟' }}
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed break-words" v-editable="'cta.description'">
          {{ appData.cta?.description || 'شما می‌توانید متریال، ابعاد، پوشش‌های چاپی و تیراژ هر یک از اقلام را مطابق با بودجه و هویت بصری سازمان خود تغییر دهید.' }}
        </p>
      </div>
      <NuxtLink
        to="/contact"
        class="px-7 py-3 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition shadow-xs whitespace-nowrap"
      >
        <span v-editable="'cta.button'">{{ appData.cta?.button || 'درخواست پکیج اختصاصی' }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || 'office-packaging')
const pageSlug = computed(() => `products-applications-${slug.value}`)

const { ui, allUi } = usePageUI(pageSlug.value)
useAdminEditable(pageSlug.value, allUi)

const fallbackApplication = {
  badge: 'پکیج کاربردی و هدفمند',
  title: 'پکیج سازمانی و اداری یکپارچه',
  description: 'مجموعه کامل اوراق اداری، پاکت‌ها، فولدرها و سررسیدهای یکپارچه برای تقویت هویت برند سازمانی با بالاترین ثبات رنگی.',
  itemsTitle: 'اقلام موجود در این پکیج',
  items: [
    {
      name: 'ست اداری کامل (سربرگ، پاکت، کارت ویزیت)',
      desc: 'چاپ با پنتون رنگ سازمانی بر روی کاغذهای تحریر یا کتان خارجی با کیفیت بالا.',
      feature: 'هماهنگی ۱۰۰٪ رنگی در تمامی اقلام'
    },
    {
      name: 'فولدر شرکتی و پوشه اسناد (Folders)',
      desc: 'فولدرهای مقوایی با جیب اختصاصی قرارگیری CD، بروشور و جای کارت ویزیت.',
      feature: 'سلفون مات و طلاکوب لوگو'
    },
    {
      name: 'دفتر یادداشت و سررسید سازمانی',
      desc: 'صحافی فنر دوبل یا جلد سخت سلفونی با درج لوگو در تمامی صفحات داخلی.',
      feature: 'کاغذ تحریر ۷۰ و ۸۰ گرم'
    }
  ],
  cta: {
    title: 'نیاز به سفارشی‌سازی اقلام این پکیج دارید؟',
    description: 'شما می‌توانید متریال، ابعاد، پوشش‌های چاپی و تیراژ هر یک از اقلام را مطابق با بودجه و هویت بصری سازمان خود تغییر دهید.',
    button: 'درخواست پکیج اختصاصی'
  }
}

const appData = computed(() => {
  return {
    ...fallbackApplication,
    ...(ui.value || {}),
    title: ui.value?.title || slug.value.replace(/-/g, ' ') || fallbackApplication.title
  }
})
</script>