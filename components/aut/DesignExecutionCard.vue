<template>
  <div class="flex flex-col w-full md:max-w-xs h-auto gap-6 p-6 bg-[#daebd0] rounded-[25px] ">
    <!-- Top Section -->
    <div class="flex flex-col gap-6 justify-between items-start">
      <!-- Icon Section -->
      <div class="w-10 h-10 flex items-center justify-center rounded-full bg-[#eafed3] p-2">
        <img src="https://dashboard.codeparrot.ai/api/image/Z8LZelj1kitRpYPc/transfor.png" alt="transform" class="w-6 h-6" />
      </div>
      <!-- Text Section -->
      <div class="text-right text-xs font-medium text-black">
        آماده‌سازی فایل
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col gap-4">
      <h2 class="text-right text-2xl font-extrabold text-black">
        طرح تو، اجرای ما!
      </h2>
      <p class="text-right text-sm font-medium text-black leading-6">
        طرحت رو داری و میخوای برای چاپ آمادش کنی؟ کافیه اونو برای طراح‌های ما آپلود کنی تا بعد از ثبت سفارش راحت و سریع برای چاپ آماده بشن.
      </p>
    </div>

    <!-- Upload Button -->
    <div class="flex justify-start mt-auto">
      <button 
        class="px-6 py-3 bg-white rounded-[25px]  hover:bg-gray-50 transition-colors duration-200"
        @click="handleUpload"
      >
        <span class="text-base font-semibold text-black">آپلود فایل طراحی</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleUpload = () => {
  // Handle file upload logic here
  console.log('Upload button clicked');
};
</script>

<style scoped>
@font-face {
  font-family: 'IRANSansX';
  src: url('/fonts/IRANSansX.woff2') format('woff2');
  font-display: swap;
}

* {
  font-family: 'IRANSansX', sans-serif;
  direction: rtl;
}
</style>
