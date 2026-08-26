<!-- pages/products/industries/[slug].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">محصولات</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">راهکارهای تخصصی صنایع</span>
      <span>/</span>
      <span class="text-gray-900 font-semibold break-words" v-editable="'title'">{{ industry.title }}</span>
    </nav>

    <!-- Industry Hero -->
    <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-najmborder/40">
      <div class="max-w-3xl space-y-4" :class="isRTL ? 'text-right' : 'text-left'">
        <span
          class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4 break-words"
          v-editable="'badge'"
        >
          {{ industry.badge || 'راهکار بسته‌بندی ویژه صنعت' }}
        </span>
        <h1
          class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight text-d4 leading-tight break-words"
          v-editable="'title'"
        >
          {{ industry.title }}
        </h1>
        <p
          class="text-xs sm:text-base text-gray-600 leading-relaxed break-words"
          v-editable="'description'"
        >
          {{ industry.description }}
        </p>
      </div>
    </div>

    <!-- Tailored Solutions Grid -->
    <div class="space-y-6">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-900 text-d4 break-words"
        :class="isRTL ? 'text-right' : 'text-left'"
        v-editable="'packagesTitle'"
      >
        {{ industry.packagesTitle || 'اقلام و پکیج‌های پیشنهادی برای این صنعت' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <div
          v-for="(item, idx) in (industry.packages || [])"
          :key="idx"
          class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          <div>
            <div class="w-10 h-10 rounded-xl bg-najmgrey text-najmgreen flex items-center justify-center mb-4">
              <Icon name="mdi:package-variant-closed" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2 text-d4 break-words" v-editable="`packages.${idx}.title`">
              {{ item.title }}
            </h3>
            <p class="text-xs text-gray-600 leading-relaxed mb-4 break-words" v-editable="`packages.${idx}.desc`">
              {{ item.desc }}
            </p>
            <div class="flex flex-wrap gap-1.5 mb-6">
              <span
                v-for="(spec, sIdx) in (item.specs || [])"
                :key="sIdx"
                class="px-2.5 py-1 rounded-lg bg-najmgrey border border-najmborder/40 text-[11px] text-gray-700 font-medium font-mono break-words"
                v-editable="`packages.${idx}.specs.${sIdx}`"
              >
                {{ spec }}
              </span>
            </div>
          </div>
          <NuxtLink
            to="/contact"
            class="w-full py-2.5 rounded-xl bg-najmgrey hover:bg-najmgreen hover:text-white text-gray-800 text-xs font-bold text-center transition"
          >
            مشاوره این پکیج / Consult
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Standards & Hygiene note -->
    <div class="bg-najmgreen text-white rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
      <div class="space-y-2 max-w-xl" :class="isRTL ? 'text-right' : 'text-left'">
        <h3 class="text-lg sm:text-xl font-bold text-d4 break-words" v-editable="'standards.title'">
          {{ industry.standards?.title || 'استانداردهای بهداشتی و ایمنی تماس با محصول' }}
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed break-words" v-editable="'standards.description'">
          {{ industry.standards?.description || 'کلیه بسته‌بندی‌های تولیدی در خطوط نجم با متریال فودگرید (Food Grade)، مقوای ایندربرد بهداشتی و مرکب‌های بدون بو تولید می‌گردند.' }}
        </p>
      </div>
      <NuxtLink
        to="/contact"
        class="px-7 py-3 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition whitespace-nowrap shadow-xs"
      >
        <span v-editable="'standards.button'">{{ industry.standards?.button || 'استعلام سفارش تولید' }}</span>
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
const slug = computed(() => (route.params.slug as string) || 'food-beverage-restaurant')
const pageSlug = computed(() => `products-industries-${slug.value}`)

const { ui, allUi } = usePageUI(pageSlug.value)
useAdminEditable(pageSlug.value, allUi)

const fallbackIndustry = {
  badge: 'راهکار بسته‌بندی ویژه صنعت',
  title: 'صنایع غذایی، نوشیدنی و رستوران',
  description: 'بسته‌بندی‌های بهداشتی، مقاوم در برابر رطوبت و چربی با قابلیت قرارگیری در زنجیره سرد و خطوط پرکنی صنعتی.',
  packagesTitle: 'اقلام و پکیج‌های پیشنهادی برای این صنعت',
  packages: [
    {
      title: 'جعبه‌های مقوایی فودگرید',
      desc: 'مناسب شکلات، شیرینی، فست‌فود، چای و فرآورده‌های منجمد با پوشش بهداشتی ضد چربی.',
      specs: ['ایندربرد ۲۸۰ تا ۳۵۰ گرم', 'پوشش پلی‌اتیلن / فودگرید', 'قفل لاک‌باتم']
    },
    {
      title: 'ساک و پاکت‌های کاغذی کرافت',
      desc: 'پاکت‌های بیرون‌بر رستورانی و کافه‌ها با چاپ اختصاصی و مقاومت در برابر پاره شدن.',
      specs: ['کرافت سنگین', 'دسته‌های تقویت‌شده', 'مرکب پایه‌گیاهی']
    },
    {
      title: 'لیبل و برچسب‌های ضدآب رول',
      desc: 'برچسب بطری نوشیدنی‌ها، سس‌ها و شیشه‌های مواد غذایی با چسبندگی قوی در یخچال.',
      specs: ['متالایز', 'یووی ضدخش', 'پلی‌پروپیلن PP']
    }
  ],
  standards: {
    title: 'استانداردهای بهداشتی و ایمنی تماس با محصول',
    description: 'کلیه بسته‌بندی‌های تولیدی در خطوط نجم با متریال فودگرید (Food Grade)، مقوای ایندربرد بهداشتی و مرکب‌های بدون بو تولید می‌گردند.',
    button: 'استعلام سفارش تولید'
  }
}

const industry = computed(() => {
  return {
    ...fallbackIndustry,
    ...(ui.value || {}),
    title: ui.value?.title || slug.value.replace(/-/g, ' ') || fallbackIndustry.title
  }
})
</script>