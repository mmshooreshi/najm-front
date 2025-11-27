<!-- pages/services/[slug].vue -->
<template>
  <main class="py-6 md:py-10 max-w-4xl mx-auto">
    <section class="space-y-8 md:space-y-10">
      <!-- Hero / intro -->
      <header class="space-y-4">
        <!-- Image Container -->
        <div class="rounded-2xl w-full max-w-full max-h-xs mx-auto aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          <img :src="hero.topImage" class="object-cover w-full h-full"/>
        </div>

        <p
          v-if="hero?.eyebrow"
          class="text-xs md:text-sm font-medium text-gray-500"
        >
          {{ hero.eyebrow }}
        </p>

        <h1 class="text-xl  font-bold leading-tight">
          {{ hero?.title || fallbackTitle }}
        </h1>

        <p
          v-if="hero?.subtitle"
          class="text-base font-bold max-w-2xl"
        >
          {{ hero.subtitle }}
        </p>

        <p
          v-if="hero?.description"
          class="text-sm md:text-base text-gray-700 leading-relaxed max-w-3xl !my-9"
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
            class="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-xs md:text-sm border border-gray-200"
          >
            {{ chip }}
          </span>
        </div>
      </header>

      

      <!-- “What this service includes” section -->
      <section v-if="serviceIncludes">

        <div class="space-y-4 md:space-y-6">
          <h2
            v-if="serviceIncludes.title"
            class="text-xl md:text-2xl font-semibold"
          >
            {{ serviceIncludes.title }}
          </h2>

          <p
            v-if="serviceIncludes.description"
            class="text-sm md:text-base text-gray-700 max-w-3xl"
          >
            {{ serviceIncludes.description }}
          </p>

          <div class="grid gap-4 md:gap-6 md:grid-cols-2">
            <article
              v-for="(group, idx) in serviceIncludes.groups"
              :key="idx"
              class="rounded-2xl bg-white/80 p-4 md:p-5 shadow-sm border border-gray-100"
            >
              <h3 class="text-sm md:text-base font-semibold mb-2">
                {{ group.title }}
              </h3>
              <p
                v-if="group.description"
                class="text-xs md:text-sm text-gray-600 mb-3"
              >
                {{ group.description }}
              </p>
              <ul class="space-y-1.5 text-xs md:text-sm text-gray-700 list-disc" :class="isRTL ? 'pr-5' : 'pl-5'">
                <li v-for="(item, i) in group.items" :key="i">
                  {{ item }}
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

            <!-- Mid-page CTA block -->
      <section v-if="midCta">
        <div
          class="rounded-2xl bg-black text-white p-5 md:p-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <div class="space-y-2 md:space-y-3 max-w-xl">
            <p
              v-if="midCta.eyebrow"
              class="text-xl font-extrabold"
            >
              {{ midCta.eyebrow }}
            </p>
            <p
              v-if="midCta.title"
              class="text-sm text-white/80 uppercase tracking-wide"
            >
              {{ midCta.title }}
            </p>            
            <p
              v-if="midCta.description"
              class="text-xs md:text-sm text-white/80"
            >
              {{ midCta.description }}
            </p>
          </div>
          <div class="flex flex-col gap-2 mt-3 md:mt-0 md:flex-row">
            <button
              v-if="midCta.primaryCta.label"
              type="button"
              class="h-10 md:h-11 px-4 rounded-xl !bg-najmgrey text-black text-sm font-semibold"
            >
              {{ midCta.primaryCta.label }}
            </button>
          </div>
        </div>
      </section>


      <!-- Packages + industries / use-cases -->
      <section
        v-if="packages?.items?.length || industries?.items?.length"
        class="space-y-6 md:space-y-8"
      >

                <!-- Image Container -->
        <div class="rounded-2xl w-full max-w-full max-h-xs mx-auto aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          <img :src="hero.secondaryImage" class="object-cover w-full h-full"/>
        </div>

        <div
          v-if="packages?.items?.length"
          class="space-y-3 md:space-y-4"
        >
          <h2 class="text-lg md:text-xl font-semibold">
            {{ packages.title }}
          </h2>
          <p
            v-if="packages.description"
            class="text-sm md:text-base text-gray-700"
          >
            {{ packages.description }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tag, idx) in packages.items"
              :key="tag.key"
              class="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-xs md:text-sm border border-gray-200"
            >
              {{ tag.label }}
            </span>
          </div>
        </div>

        <div
          v-if="industries?.items?.length"
          class="space-y-3 md:space-y-4"
        >
          <h2 class="text-lg md:text-xl font-semibold">
            {{ industries.title }}
          </h2>
          <p
            v-if="industries.description"
            class="text-sm md:text-base text-gray-700"
          >
            {{ industries.description }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tag, idx) in industries.items"
              :key="tag.key"
              class="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-xs md:text-sm border border-gray-200"
            >
              {{ tag.label }}
            </span>
          </div>
        </div>
      </section>


      

      <!-- FAQ -->
      <section v-if="faq?.items?.length" class="space-y-4 md:space-y-6">
        <div class="space-y-2">
          <h2 class="text-lg md:text-xl font-semibold">
            {{ faq.title }}
          </h2>
          <p
            v-if="faq.description"
            class="text-sm md:text-base text-gray-600"
          >
            {{ faq.description }}
          </p>
        </div>

        <div class="space-y-3">
          <details
            v-for="(item, idx) in faq.items"
            :key="idx"
            class="rounded-2xl bg-white/80 p-4 md:p-5 border border-gray-100"
          >
            <summary class="cursor-pointer text-sm md:text-base font-medium">
              {{ item.question }}
            </summary>
            <p class="mt-2 text-xs md:text-sm text-gray-700 leading-relaxed">
              {{ item.answer }}
            </p>
          </details>
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

// route slug, e.g. "design-and-layout"
const route = useRoute()
const serviceSlug = route.params.slug as string

// Each service has its own UI JSON:
//   services-design-and-layout-ui.json
//   services-lithography-and-plates-ui.json
//   ...
// And a corresponding backend record with slug = "services-design-and-layout"
const { ui } = usePageUI(`services-${serviceSlug}`)

// locale (if you need it for RTL, etc.)
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const hero = computed(() => ui.value?.hero ?? null)
const serviceIncludes = computed(() => ui.value?.serviceIncludes ?? null)
const packages = computed(() => ui.value?.packages ?? null)
const industries = computed(() => ui.value?.industries ?? null)
const midCta = computed(() => ui.value?.midCta ?? null)
const faq = computed(() => ui.value?.faq ?? null)

const fallbackTitle = computed(
  () => ui.value?.fallbackTitle || serviceSlug.replace(/-/g, ' ')
)

definePageMeta({
  layout: 'services',
  name: 'service-detail',
})

// connect to admin edit system for this service
const { state } = useAdminEditable(`services-${serviceSlug}`)
</script>
