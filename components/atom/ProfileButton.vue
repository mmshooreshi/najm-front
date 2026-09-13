<!-- components/atom/ProfileButton.vue -->
<template>
  <div class="z-10 max-w-full overflow-hidden flex items-center gap-3 whitespace-nowrap">
    <NuxtLink
      :to="isAuthenticated && user.name ? localePath(`/user/${user.id}`) : localePath('/login')"
      class="group flex items-center gap-2"
    >
      <button
        @click="handleLogin"
        type="button"
        class="transition-all duration-200 text-xs px-3 lg:px-4 gap-2 h-10 lg:h-11 rounded-2xl bg-white hover:bg-gray-50 active:scale-[0.98] flex items-center justify-center text-gray-700 border border-gray-200/80 font-medium cursor-pointer shadow-xs"
      >
        <profileUserIcon class="w-4 h-4 text-gray-500 group-hover:text-najmgreen transition-colors flex-shrink-0" />

        <span class="truncate max-w-[120px]">
          {{ isAuthenticated && user.name
              ? `${user?.name} ${user?.familyName}` 
              : loginText 
          }}
        </span>

        <Icon
          name="mdi:chevron-left"
          class="transition-transform group-hover:-translate-x-1 w-4 h-4 text-gray-400 group-hover:text-najmgreen flex-shrink-0"
          :class="isRTL ? '' : 'rotate-180 group-hover:translate-x-1'"
        />
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