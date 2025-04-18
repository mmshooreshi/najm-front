<template>
        <div class="mb-6 flex gap-8 lg:gap-[352px] rtl mt-12">
          <h1 class="text-4xl font-bold">محصولات</h1>
          <p class="mt-2 text-xl text-gray-600">
            هر سبک جعبه برای نمایش محصول منحصر به فرد شما طراحی شده است. 
            برش ها و پنجره های سفارشی را اضافه کنید. 
          </p>
        </div>

        <ProductLayout>
      <template #filters>
        <!-- Filters go here -->
        <h2 class="text-xl font-semibold mb-4">فیلترها</h2>
        <ul class="space-y-2">
          <li>✔️ رنگ</li>
          <li>✔️ اندازه</li>
          <li>✔️ قیمت</li>
        </ul>
      </template>
  
      <template #products>
        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="border rounded-xl p-4 shadow">
            <h3 class="text-lg font-bold">محصول {{ n }}</h3>
            <p class="text-gray-500 mt-2">توضیح مختصر محصول.</p>
          </div>
        </div>
      </template>
    </ProductLayout>
  </template>
  
  <script setup lang="ts">
  import ProductLayout from '@/components/layout/ProductsLayout'
  </script>
  