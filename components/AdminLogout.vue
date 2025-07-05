<!-- components/AdminLogout.vue -->
<!-- components/AdminLogout.vue -->
<script setup lang="ts">
async function signOut() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin-login')
}
</script>

<template>
  <button @click="signOut" class="text-sm text-gray-500 hover:text-red-600">
    Logout
  </button>
</template>
