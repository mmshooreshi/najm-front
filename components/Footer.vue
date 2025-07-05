<!-- components/Footer.vue -->
<template>
    <footer
      class="bg-white border-t border-gray-200 py-8 px-4 md:px-8 2xl:px-28 mt-8 text-gray-800"
      dir="rtl"
    >
      <div
        class="w-full mx-auto flex flex-col gap-8 md:flex-row md:justify-between md:items-start"
      >
        <!-- Column 1: Services -->
        <div class="flex flex-col gap-2 max-w-xs">
          <h2 class="text-xl font-bold mb-2">خدمات</h2>
          <ul class="space-y-1 text-sm">
            <li>مشاوره</li>
            <li>طراحی</li>
            <li>چاپ</li>
            <li>بسته‌بندی</li>
            <li>وبسایت</li>
          </ul>
        </div>
  
        <!-- Column 2: Customer Service -->
        <div class="flex flex-col gap-2 max-w-xs">
          <h2 class="text-xl font-bold mb-2">سرویس مشتریان</h2>
          <ul class="space-y-1 text-sm">
            <li>پشتیبانی آنلاین</li>
            <li>مرجوعی کالا</li>
            <li>گارانتی</li>
            <li>سوالات متداول</li>
            <li>قوانین سایت</li>
          </ul>
        </div>
  
        <!-- Column 3: آخرین‌ها -->
        <div class="flex flex-col gap-2 max-w-xs">
          <h2 class="text-xl font-bold mb-2">آخرین‌ها</h2>
          <ul class="space-y-1 text-sm">
            <li>نمونه‌کارهای جدید</li>
            <li>وبلاگ</li>
            <li>رویدادها</li>
            <li>مقالات آموزشی</li>
          </ul>
        </div>
  
        <!-- Column 4: تماس با ما -->
        <div class="flex flex-col gap-2 max-w-xs">
          <h2 class="text-xl font-bold mb-2">ارتباط با ما</h2>
          <p class="text-sm">
            تلفن: +98 21 1234 5678
            <br />
            ایمیل: <a href="mailto:chappim@gmail.com" class="underline">chappim@gmail.com</a>
          </p>
          <div class="w-full h-32 mt-2">
            <!-- Example map or placeholder for your map image -->
            <img
              src="/images/map-sample.png"
              alt="Map"
              class="w-full h-full object-cover rounded"
            />
          </div>
        </div>
      </div>
  
      <!-- Footer bottom line -->
      <div
        class="border-t border-gray-200 text-center pt-4 mt-8 text-sm text-gray-500"
      >
        کلیه حقوق این سایت متعلق به مجموعه چاپ پیمی می‌باشد
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  // No specific script logic needed if it's a static footer
  </script>
  
  <style scoped>
  /* Optional: Add custom styles if needed */
  </style>
  