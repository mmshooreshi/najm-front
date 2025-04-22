<!-- components/ProfileButton.vue -->
<template>
  <div class="z-100">
    <NuxtLink :to="isAuthenticated ? `/user/${user.id}` : '/login'" class="group ml-0 flex items-center gap-3">
      <button
        @click="handleLogin"
        class="transition-all text-xs text-d4 px-4 gap-3 h-12 rounded-3xl bg-white hover:bg-[#A8ABAE]/20 flex row items-center justify-center text-gray-700 border border-gray-200 transition-transform duration-200 ease-in-out font-medium cursor-pointer"
        :class="menuOpen ? 'right-[28vw]' : ''"
      >
        <profileUserIcon />
        <div>{{ isAuthenticated ? `${user.name} ${user.familyName}` : 'ورود' }}</div>
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

const { user, isAuthenticated } = useAuth()
function handleLogin() {
  // login logic if needed
}
defineProps<{ menuOpen: boolean }>()
</script>
