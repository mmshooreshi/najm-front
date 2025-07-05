<!-- layouts/admin.vue -->
<!-- layouts/admin.vue -->
<script setup lang="ts">
const drawer = ref(false)           // mobile sidebar toggle
</script>

<template>
  <div class="flex h-dvh overflow-hidden bg-gray-50">
    <!-- ☰ sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 z-30 w-64 shrink-0 bg-white shadow-lg transition-transform md:static md:translate-x-0',
        drawer ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]">
      <nav class="flex h-full flex-col">
        <div class="flex items-center justify-between px-4 py-3 md:hidden">
          <h2 class="font-bold">Admin</h2>
          <button @click="drawer = false"><Icon name="mdi:close" /></button>
        </div>
        <AdminSidebar class="flex-1 overflow-y-auto" @click-link="drawer = false" />
        <div class="border-t p-4"><AdminLogout /></div>
      </nav>
    </aside>

    <!-- main -->
    <div class="flex flex-1 flex-col">
      <header class="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm md:hidden">
        <button @click="drawer = true"><Icon name="mdi:menu" /></button>
        <h1 class="text-lg font-bold">Admin</h1>
      </header>
      <main class="flex-1 overflow-y-auto p-6"><slot /></main>
    </div>
  </div>
</template>
