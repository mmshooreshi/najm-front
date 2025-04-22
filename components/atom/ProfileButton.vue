<!-- components/ProfileButton.vue -->
<template>
  <div     :class="[
      'overflow-hidden flex items-center gap-3 whitespace-nowrap',
      'transition-all duration-500 ccc',
      isDesktop || menuOpen
        ? 'max-w-[300px] scale-100  mx-0'
        : 'max-w-0 scale-0 -mx-1'
    ]"
class="z-100">
    <NuxtLink :to="isAuthenticated ? `/user/${user.id}` : '/login'" class="group ml-0 flex items-center gap-3">
      <button
        @click="handleLogin"
        class="transition-all text-xs text-d4 px-4 gap-3 h-12 rounded-3xl bg-white transition-all duration-1000 hover:bg-[#A8ABAE]/20 flex row items-center justify-center text-gray-700 border border-gray-200 transition-transform  font-medium cursor-pointer"
        :class="menuOpen ? 'right-[28vw]' : ''"
      >
        <profileUserIcon />

    {{ isAuthenticated 
        ? `${user.name} ${user.familyName}` 
        : 'مهدی شورشی' 
    }}

            <Icon
          name="mdi:chevron-left"
          class="transition-all group-hover:-translate-x-2 w-5 h-5 my-auto text-[#A8ABAE]"
        />
      </button>
    </NuxtLink>
  </div>
</template>



<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import profileUserIcon from '~/assets/icons/profile-user-icon.svg'
import { useMediaQuery } from '@vueuse/core'

// Tailwind “md” breakpoint is 768px:
const isDesktop = useMediaQuery('(min-width: 768px)')

const { user, isAuthenticated } = useAuth()
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