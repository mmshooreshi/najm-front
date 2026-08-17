<!-- pages/services/[type]/[slug].vue -->
<template>
  <main dir="rtl" class="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <nav class="flex items-center gap-2 text-xs text-gray-500">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/services/design-and-layout" class="hover:text-najmgreen">خدمات</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">{{ typeTitle }}</span>
      <span>/</span>
      <span class="text-gray-900 font-semibold">{{ serviceTitle }}</span>
    </nav>

    <!-- Hero Card -->
    <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 space-y-4">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-najmgreen">
        خدمات تخصصی چاپ نجم
      </span>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
        {{ serviceTitle }}
      </h1>
      <p class="text-base text-gray-600 leading-relaxed max-w-3xl">
        ارائه خدمات صنعتی در بالاترین سطح استاندارد با تکیه بر تجهیزات مدرن هایدلبرگ، لیتوگرافی دیجیتال CTP و خطوط پس از چاپ تمام‌اتوماتیک.
      </p>

      <div class="pt-4 flex flex-wrap gap-3">
        <NuxtLink
          to="/contact"
          class="px-6 py-3 rounded-2xl bg-najmgreen text-white font-semibold text-sm hover:bg-emerald-800 transition shadow-sm"
        >
          مشاوره و استعلام سفارش
        </NuxtLink>
        <NuxtLink
          to="/resources"
          class="px-6 py-3 rounded-2xl bg-gray-100 text-gray-800 font-semibold text-sm hover:bg-gray-200 transition"
        >
          راهنماهای فنی و کاتالوگ
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'services',
  name: 'nested-service-detail'
})

const route = useRoute()
const typeParam = computed(() => (route.params.type as string) || '')
const slugParam = computed(() => (route.params.slug as string) || '')

const typeTitle = computed(() => typeParam.value.replace(/-/g, ' '))
const serviceTitle = computed(() => slugParam.value.replace(/-/g, ' '))
</script>