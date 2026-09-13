<!-- components/atom/ProfileButton.vue -->
<template>
  <div class="z-10 max-w-full overflow-hidden flex items-center gap-3 whitespace-nowrap">
    <NuxtLink :to="isAuthenticated && user.name ? localePath(`/user/${user.id}`) : localePath('/login')"
      class="group flex items-center gap-2">
      <button type="button"
        class="group transition-all duration-200 text-xs px-3 lg:px-4 gap-2 h-10 lg:h-11 rounded-2xl bg-white hover:bg-gray-50 active:scale-[0.98] flex items-center justify-center text-gray-700 border border-gray-200/80 font-medium cursor-pointer shadow-xs">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          class="w-4 h-4 text-gray-500 group-hover:text-najmgreen transition-colors shrink-0">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 20c2.336-2.477 5.507-4 9-4s6.664 1.523 9 4M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0" />
        </svg>
        <span class="truncate max-w-[120px]">{{ isAuthenticated && user?.name ? user.name : loginText }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-4 h-4 text-gray-400 group-hover:text-najmgreen transition-transform shrink-0"
          :class="isRTL ? 'group-hover:-translate-x-0.5' : 'rotate-180 group-hover:translate-x-0.5'"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import profileUserIcon from '~/assets/icons/profile-user-icon.svg'
import { useLocale } from '~/composables/useLocale'

const { user, isAuthenticated } = useAuth()
const { language, localePath } = useLocale()
const isRTL = computed(() => {
  const l = (language.value || 'FA').toUpperCase()
  return l === 'FA' || l === 'AR'
})

const loginText = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') return 'Login'
  if (lang === 'AR') return 'تسجيل الدخول'
  return 'ورود'
})

function handleLogin() {
  // NuxtLink handles navigation
}

defineProps<{ menuOpen?: boolean }>()
</script>