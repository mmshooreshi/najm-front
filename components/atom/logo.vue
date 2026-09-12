<!-- components/atom/logo.vue -->
<template>
  <!-- Mobile-only logo group with dynamic width -->
  <div class="flex flex-row items-center gap-4 transition-all duration-500">
    <NuxtLink :to="localePath('/')" class="flex justify-center" :aria-label="ariaLabel">
      <component :is="activeLogo" class="h-10 w-24" />
      <span class="sr-only">{{ ariaLabel }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NajmLogoFa from '~/assets/icons/najm-logo.svg'
import NajmLogoEn from '~/assets/icons/najm-logo-en.svg'
import NajmLogoAr from '~/assets/icons/najm-logo-ar.svg'
import { NuxtLink } from '#components'
import { useLocale } from '~/composables/useLocale'

const { localePath, language } = useLocale()
defineProps<{ menuOpen: boolean }>()

const activeLogo = computed(() => {
  if (language.value === 'EN') return NajmLogoEn
  if (language.value === 'AR') return NajmLogoAr
  return NajmLogoFa
})

const ariaLabel = computed(() => {
  if (language.value === 'EN') return 'Najm Printing & Packaging Home'
  if (language.value === 'AR') return 'الصفحة الرئيسية لمجمع نجم للطباعة والتغليف'
  return 'صفحه اصلی مجتمع چاپ و بسته‌بندی نجم - Najm Printing & Packaging'
})
</script>
  