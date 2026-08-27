<!-- pages/services/[slug].vue -->
<template>
  <main class="py-6 md:py-10 max-w-4xl mx-auto px-4 sm:px-6" :dir="isRTL ? 'rtl' : 'ltr'">
    <section class="space-y-8 md:space-y-10">
      <!-- Hero / intro -->
      <header class="space-y-4" :class="isRTL ? 'text-right' : 'text-left'">
        <!-- Image Container -->
        <div
          v-if="hero?.topImage"
          class="rounded-2xl w-full max-w-full max-h-xs mx-auto aspect-square bg-gray-100 flex items-center justify-center overflow-hidden"
        >
          <img :src="hero.topImage" class="object-cover w-full h-full" alt="Service Hero" />
        </div>

        <p
          v-if="hero?.eyebrow"
          class="text-xs md:text-sm font-medium text-gray-500 break-words"
          v-editable="'hero.eyebrow'"
        >
          {{ hero.eyebrow }}
        </p>

        <h1
          class="text-2xl sm:text-4xl font-bold leading-tight text-gray-900 break-words text-d4"
          v-editable="'hero.title'"
        >
          {{ hero?.title || fallbackTitle }}
        </h1>

        <p
          v-if="hero?.subtitle"
          class="text-base sm:text-lg font-bold max-w-2xl text-gray-800 break-words"
          v-editable="'hero.subtitle'"
        >
          {{ hero.subtitle }}
        </p>

        <p
          v-if="hero?.description"
          class="text-sm md:text-base text-gray-700 leading-relaxed max-w-3xl !my-4 sm:!my-6 break-words"
          v-editable="'hero.description'"
        >
          {{ hero.description }}
        </p>

        <div
          v-if="hero?.highlights?.length"
          class="flex flex-wrap gap-2 mt-3"
        >
          <span
            v-for="(chip, idx) in hero.highlights"
            :key="idx"
            class="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-xs md:text-sm border border-gray-200 break-words"
            v-editable="`hero.highlights.${idx}`"
          >
            {{ chip }}
          </span>
        </div>
      </header>

      <!-- “What this service includes” section -->
      <section v-if="serviceIncludes" :class="isRTL ? 'text-right' : 'text-left'">
        <div class="space-y-4 md:space-y-6">
          <h2
            v-if="serviceIncludes.title"
            class="text-xl md:text-2xl font-semibold text-gray-900 break-words text-d4"
            v-editable="'serviceIncludes.title'"
          >
            {{ serviceIncludes.title }}
          </h2>

          <p
            v-if="serviceIncludes.description"
            class="text-sm md:text-base text-gray-700 max-w-3xl break-words"
            v-editable="'serviceIncludes.description'"
          >
            {{ serviceIncludes.description }}
          </p>

          <div class="grid gap-4 md:gap-6 md:grid-cols-2">
            <article
              v-for="(group, idx) in serviceIncludes.groups"
              :key="idx"
              class="relative rounded-2xl bg-white/80 p-4 md:p-5 shadow-sm border border-gray-100"
            >
              <!-- Card Action [+] / [-] -->
              <AdminArrayItemActions path="serviceIncludes.groups" :index="idx" />

              <h3
                class="text-sm md:text-base font-semibold mb-2 text-gray-900 break-words text-d4"
                v-editable="`serviceIncludes.groups.${idx}.title`"
              >
                {{ group.title }}
              </h3>
              <p
                v-if="group.description"
                class="text-xs md:text-sm text-gray-600 mb-3 break-words"
                v-editable="`serviceIncludes.groups.${idx}.description`"
              >
                {{ group.description }}
              </p>
              <ul class="space-y-1.5 text-xs md:text-sm text-gray-700 list-disc" :class="isRTL ? 'pr-5' : 'pl-5'">
                <li
                  v-for="(item, i) in group.items"
                  :key="i"
                  class="break-words"
                  v-editable="`serviceIncludes.groups.${idx}.items.${i}`"
                >
                  {{ item }}
                </li>
              </ul>
            </article>

            <AdminAddCardPlaceholder path="serviceIncludes.groups" label="افزودن گروه قابلیت جدید" customClass="min-h-[160px]" />
          </div>
        </div>
      </section>

      <!-- Mid-page CTA block -->
      <section v-if="midCta">
        <div
          class="rounded-2xl bg-black text-white p-5 md:p-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          <div class="space-y-2 md:space-y-3 max-w-xl">
            <p
              v-if="midCta.eyebrow"
              class="text-lg sm:text-xl font-extrabold break-words text-d4"
              v-editable="'midCta.eyebrow'"
            >
              {{ midCta.eyebrow }}
            </p>
            <p
              v-if="midCta.title"
              class="text-xs sm:text-sm text-white/80 uppercase tracking-wide break-words"
              v-editable="'midCta.title'"
            >
              {{ midCta.title }}
            </p>            
            <p
              v-if="midCta.description"
              class="text-xs md:text-sm text-white/80 break-words"
              v-editable="'midCta.description'"
            >
              {{ midCta.description }}
            </p>
          </div>
          <div class="flex flex-col gap-2 mt-3 md:mt-0 md:flex-row">
            <NuxtLink
              to="/contact"
              class="h-10 md:h-11 px-5 rounded-xl !bg-najmgrey text-black text-xs sm:text-sm font-semibold flex items-center justify-center whitespace-nowrap"
            >
              <span v-editable="'midCta.primaryCta.label'">{{ midCta.primaryCta?.label || 'استعلام و مشاوره' }}</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Packages + industries / use-cases -->
      <section
        v-if="packages?.items?.length || industries?.items?.length"
        class="space-y-6 md:space-y-8"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <div
          v-if="packages?.items?.length"
          class="space-y-3 md:space-y-4"
        >
          <h2 class="text-lg md:text-xl font-semibold text-gray-900 break-words text-d4" v-editable="'packages.title'">
            {{ packages.title }}
          </h2>
          <p
            v-if="packages.description"
            class="text-sm md:text-base text-gray-700 break-words"
            v-editable="'packages.description'"
          >
            {{ packages.description }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tag, idx) in packages.items"
              :key="tag.key || idx"
              class="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-xs md:text-sm border border-gray-200 break-words"
              v-editable="`packages.items.${idx}.label`"
            >
              {{ tag.label || tag }}
            </span>
          </div>
        </div>

        <div
          v-if="industries?.items?.length"
          class="space-y-3 md:space-y-4"
        >
          <h2 class="text-lg md:text-xl font-semibold text-gray-900 break-words text-d4" v-editable="'industries.title'">
            {{ industries.title }}
          </h2>
          <p
            v-if="industries.description"
            class="text-sm md:text-base text-gray-700 break-words"
            v-editable="'industries.description'"
          >
            {{ industries.description }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tag, idx) in industries.items"
              :key="tag.key || idx"
              class="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-xs md:text-sm border border-gray-200 break-words"
              v-editable="`industries.items.${idx}.label`"
            >
              {{ tag.label || tag }}
            </span>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section v-if="faq?.items?.length" class="space-y-4 md:space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
        <div class="space-y-2">
          <h2 class="text-lg md:text-xl font-semibold text-gray-900 break-words text-d4" v-editable="'faq.title'">
            {{ faq.title }}
          </h2>
          <p
            v-if="faq.description"
            class="text-sm md:text-base text-gray-600 break-words"
            v-editable="'faq.description'"
          >
            {{ faq.description }}
          </p>
        </div>

        <div class="space-y-3">
          <details
            v-for="(item, idx) in faq.items"
            :key="idx"
            class="relative rounded-2xl bg-white/80 p-4 md:p-5 border border-gray-100 group"
          >
            <!-- In-place Item Action [+] / [-] -->
            <AdminArrayItemActions path="faq.items" :index="idx" />

            <summary class="cursor-pointer text-sm md:text-base font-medium text-gray-900 break-words" v-editable="`faq.items.${idx}.question`">
              {{ item.question }}
            </summary>
            <p class="mt-2 text-xs md:text-sm text-gray-700 leading-relaxed break-words" v-editable="`faq.items.${idx}.answer`">
              {{ item.answer }}
            </p>
          </details>

          <AdminAddCardPlaceholder path="faq.items" label="افزودن پرسش و پاسخ جدید" customClass="min-h-[70px] p-3" />
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import { usePageUI } from '@/composables/ui/usePageUI'
import { useLocale } from '@/composables/useLocale'
import { useAdminEditable } from '@/composables/useAdminEditable'

definePageMeta({
  layout: 'services'
})

const route = useRoute()
const serviceSlug = computed(() => (route.params.slug as string) || 'design-and-layout')
const pageKey = computed(() => `services-${serviceSlug.value}`)

const { ui, allUi } = usePageUI(pageKey.value)
useAdminEditable(pageKey.value, allUi)

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const fallbackServiceTitlesFa: Record<string, string> = {
  'design-and-layout': 'طراحی، ماکت‌سازی و فرم‌بندی',
  'lithography-and-plates': 'لیتوگرافی و زینک حرارتی CTP',
  'printing-and-packaging': 'چاپ افست و چاپ بسته‌بندی',
  'finishing-services': 'خدمات تکمیلی، سلفون، طلاکوب و دایکات',
  'storage-and-warehousing': 'نگهداری، بسته‌بندی و انبارداری'
}

const fallbackServiceTitlesEn: Record<string, string> = {
  'design-and-layout': 'Design, Prototyping & Layout',
  'lithography-and-plates': 'CTP Lithography & Laser Plates',
  'printing-and-packaging': 'Offset Printing & Packaging',
  'finishing-services': 'Post-Press, Foiling, Lamination & Die-Cutting',
  'storage-and-warehousing': 'Warehousing, Packing & Logistics'
}

const fallbackServiceTitlesAr: Record<string, string> = {
  'design-and-layout': 'التصميم وهندسة الهياكل',
  'lithography-and-plates': 'الليثوغرافيا الرقمية وصفائح CTP',
  'printing-and-packaging': 'طباعة الأوفست والتغليف',
  'finishing-services': 'خدمات ما بعد الطباعة والسلفنة والتذهيب',
  'storage-and-warehousing': 'التخزين والخدمات اللوجستية'
}

const fallbackTitle = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') return fallbackServiceTitlesEn[serviceSlug.value] || serviceSlug.value.replace(/-/g, ' ')
  if (lang === 'AR') return fallbackServiceTitlesAr[serviceSlug.value] || serviceSlug.value.replace(/-/g, ' ')
  return fallbackServiceTitlesFa[serviceSlug.value] || serviceSlug.value.replace(/-/g, ' ')
})

const hero = computed(() => {
  if (ui.value?.hero) return ui.value.hero
  const isEn = language.value === 'EN'
  const isAr = language.value === 'AR'
  return {
    eyebrow: isEn ? 'Najm Technical Printing & Packaging' : (isAr ? 'خدمات مطبعة وتغليف نجم' : 'خدمات تخصصی چاپ و بسته‌بندی نجم'),
    title: fallbackTitle.value,
    subtitle: isEn ? 'Industrial excellence with advanced Heidelberg presses & Bobst converting' : (isAr ? 'جودة صناعية فائقة مع أحدث ماكينات هايدلبرغ' : 'بالاترین کیفیت تولید با خطوط مدرن هایدلبرگ و تجهیزات پس از چاپ'),
    description: isEn ? 'Comprehensive pre-press, offset printing and luxury post-press finishing executed to ISO color standards.' : (isAr ? 'خدمات شاملة لما قبل الطباعة والأوفست والتشطيب وفق المعايير العالمية.' : 'ارائه کلیه خدمات پیش از چاپ، چاپ و پس از چاپ با رعایت استانداردهای کیفی بین‌المللی و دقت میکرونی.'),
    highlights: isEn ? ['Rapid Turnaround', 'Certified Color Stability', 'Free Technical Consulting'] : (isAr ? ['سرعة التسليم', 'ثبات لوني معتمد', 'استشارة فنية مجانية'] : ['سرعت در تحویل', 'تضمین ثبات رنگ', 'مشاوره فنی رایگان']),
    topImage: null,
    secondaryImage: null
  }
})

const serviceIncludes = computed(() => ui.value?.serviceIncludes ?? null)
const packages = computed(() => ui.value?.packages ?? null)
const industries = computed(() => ui.value?.industries ?? null)
const midCta = computed(() => {
  if (ui.value?.midCta) return ui.value.midCta
  const isEn = language.value === 'EN'
  const isAr = language.value === 'AR'
  return {
    eyebrow: isEn ? 'Technical Consultation & Estimates' : (isAr ? 'استشارة فنية واستعلام الأسعار' : 'مشاوره فنی و استعلام قیمت'),
    title: fallbackTitle.value,
    description: isEn ? 'Contact our technical sales team for estimates and structural consulting.' : (isAr ? 'تواصل مع فريق المبيعات للحصول على عرض سعر واستشارة متخصصة.' : 'برای دریافت برآورد قیمت و مشاوره تخصصی در زمینه این خدمت با کارشناسان ما تماس بگیرید.'),
    primaryCta: { label: isEn ? 'Contact Sales Unit' : (isAr ? 'اتصل بفريق المبيعات' : 'تماس با واحد فروش') }
  }
})
const faq = computed(() => ui.value?.faq ?? null)
</script>
