<!-- components/ProductList.vue -->
<template>
    <section class="products px-4 py-6 mt-28 rtl">
      <h2 class="text-xl font-bold mb-4">محصولات</h2>
  
      <div v-if="pending" class="text-center py-8">در حال بارگذاری...</div>
      <div v-else-if="error" class="text-red-600 text-center py-8">
        خطا: {{ error.message }}
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="prod in products"
          :key="prod.id"
          class="  rounded overflow-hidden flex flex-col max-w-80"
        >
          <div class="">
            <!-- :src="fileUrl(prod.id, prod.media[0])" -->
            <!-- v-if="prod.media?.[0]" -->

            <img
              src="/images/products/test.png"
              class="w-full h-full object-contain"
              alt=""
            />
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="text-lg font-medium">{{ prod.name }}</h3>
            <p class="text-sm text-gray-600 flex-1">{{ prod.shortDescription }}</p>
            <div class="mt-4">
              <span class="font-bold text-green-700">
                {{ prod.price }} {{ prod.currency }}
              </span>
              <NuxtLink
                :to="`/products/${prod.slug}`"
                class="block mt-2 px-4 py-2 bg-green-600 text-white text-center rounded"
              >
                مشاهده جزئیات
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
  
      <!-- simple pagination -->
      <div class="mt-8 flex justify-center items-center gap-4">
        <button @click="prevPage" :disabled="meta.page <= 1">« قبلی</button>
        <span>صفحه {{ meta.page }} از {{ meta.totalPages }}</span>
        <button @click="nextPage" :disabled="meta.page >= meta.totalPages">بعدی »</button>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { useProductsUI } from '@/composables/ui/productsUI'
  
  const currentPage = ref(1)
  const perPage = 30
  
  // use the composable
  const { products, pending, error, meta } = useProductsUI(currentPage.value, perPage)
  
  // when page changes, re-fetch
  watch(currentPage, (newPage) => {
    useProductsUI(newPage, perPage)
  })
  
  function prevPage() {
    if (currentPage.value > 1) currentPage.value--
  }
  function nextPage() {
    if (currentPage.value < meta.value.totalPages!) currentPage.value++
  }
  
  // helper to build file URL
  const PB_HOST = 'http://65.108.80.205:8090'
  function fileUrl(recordId: string, filename: string) {
    return `${PB_HOST}/api/files/products/${recordId}/${filename}`
  }
  </script>
  
  <style scoped>
  /* add any additional styling here */
  </style>
  