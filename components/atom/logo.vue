<template>
    <!-- Mobile-only logo group with dynamic width -->
    <div
      
      class="flex flex-row items-center gap-4 transition-all duration-500"
    >
      <NuxtLink to="/home" class="flex justify-center">
        <NajmLogo class="h-12 w-12" />
      </NuxtLink>
    </div>
  </template>
  
  <script setup lang="ts">
  import NajmLogo from '~/assets/icons/najm-logo.svg'
  import { NuxtLink } from '#components'
  defineProps<{ menuOpen: boolean }>()
  </script>
  