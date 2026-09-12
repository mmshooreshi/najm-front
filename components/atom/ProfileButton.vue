<!-- components/atom/ProfileButton.vue -->
<!-- components/ProfileButton.vue -->
<template>
  <div class="z-100 max-w-full overflow-visible flex transition-all duration-100 items-center gap-3 whitespace-nowrap ccc max-w-[300px]">
    <NuxtLink :to="isAuthenticated && user.name ? `/user/${user.id}` : '/login'" class="group ml-0 flex items-center gap-3">
      <button
        @click="handleLogin"
        class="transition-all duration-500 text-[11px] md:text-xs text-d4 px-2.5 md:px-4 gap-1.5 md:gap-3 h-10 md:h-12 rounded-2xl md:rounded-3xl bg-white hover:bg-[#A8ABAE]/20 flex items-center justify-center text-gray-700 border border-gray-200 font-medium cursor-pointer"
      >
        <profileUserIcon />

        {{ isAuthenticated && user.name
            ? `${user?.name} ${user?.familyName}` 
            : loginText 
        }}

        <Icon
          name="mdi:chevron-left"
          class="transition-transform group-hover:-translate-x-2 w-4 h-4 md:w-5 md:h-5 my-auto text-[#A8ABAE]"
        />
      </button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import profileUserIcon from '~/assets/icons/profile-user-icon.svg'
import { useMediaQuery } from '@vueuse/core'
import { useLocale } from '~/composables/useLocale'

// Tailwind “md” breakpoint is 768px:
const isDesktop = useMediaQuery('(min-width: 768px)')

const { user, isAuthenticated } = useAuth()
const { language } = useLocale()

const loginText = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') return 'Login'
  if (lang === 'AR') return 'تسجيل الدخول'
  return 'ورود'
})

function handleLogin() {
  // login logic if needed
}
defineProps<{ menuOpen: boolean }>()
</script>

<style scoped>
.ccc{
    transform-origin: left center;
}
</style>