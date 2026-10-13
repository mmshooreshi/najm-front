<template>
  <!-- Mobile & Desktop brand logo link -->
  <div class="flex flex-row items-center gap-4 transition-all duration-500">
    <NuxtLink
      :to="localePath('/')"
      data-track="nav-brand-logo"
      data-telemetry-label="لوگوی مجتمع چاپ و بسته‌بندی نجم"
      data-telemetry-cat="navigation"
      class="flex justify-center items-center"
      :aria-label="ariaLabel"
    >
      <img
        :src="logoSrc"
        :alt="ariaLabel"
        width="87"
        height="35"
        fetchpriority="high"
        decoding="async"
        class="h-10 w-24 object-contain select-none"
      />
      <span class="sr-only">{{ ariaLabel }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'
import { useLocale } from '~/composables/useLocale'

const { localePath, language } = useLocale()
defineProps<{ menuOpen?: boolean }>()

const logoSrc = computed(() => {
  if (language.value === 'EN') return '/najm-logo-en.svg'
  if (language.value === 'AR') return '/najm-logo-ar.svg'
  return '/najm-logo.svg'
})

const ariaLabel = computed(() => {
  if (language.value === 'EN') return 'Najm Printing & Packaging Home'
  if (language.value === 'AR') return 'الصفحة الرئيسية لمجمع نجم للطباعة والتغليف'
  return 'صفحه اصلی مجتمع چاپ و بسته‌بندی نجم - Najm Printing & Packaging'
})
</script>
  