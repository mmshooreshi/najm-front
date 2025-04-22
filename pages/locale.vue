<script setup lang="ts">
// see ./composables/locale.ts for the implementation
import {useLocales, useLocale, useLocaleDate} from '@/composables/locale'
const locales = useLocales()
const locale = useLocale()
const date = useLocaleDate(new Date('2016-10-26') /* NUXT_BIRTHDAY */)
</script>

<template>
  <NuxtExample dir="advanced/locale">
    <div class="flex justify-center gap-8 items-center mt-28">
      <USelect
        v-model="locale"
        :options="locales"
        icon="i-heroicons-calendar-days"
      />
      <p class="lg">
        {{locales}} <br>
        {{locale}} <br>
        {{ date }}
      </p>
    </div>
  </NuxtExample>
</template>
