<template>
    <div class="max-w-md mx-auto p-6 bg-white rounded-3xl shadow-lg" dir="rtl">
      <!-- Header Section -->
      <div class="w-10 h-10 bg-[#EAFED3] flex items-center justify-center rounded-full mb-6">
          <TargetIcon/>
        </div>

      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">از طراحی تا بسته‌بندی، همه زیر یه سقف!</h2>
      </div>
      <p class="text-gray-600 mt-2">چه چیزی نیاز دارید؟</p>
  
      <!-- Dropdowns -->
      <div class="mt-4 space-y-4">
        <select class="w-full p-3 border border-gray-300 rounded-lg text-gray-700">
          <option>بازار مصرفی</option>
        </select>
  
        <select class="w-full p-3 border border-gray-300 rounded-lg text-gray-700">
          <option>دسته‌بندی</option>
        </select>
      </div>
  
      <!-- Search Input -->
      <div class="relative mt-4">
        <input
          type="text"
          placeholder="جست‌وجوی محصول"
          class="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-700"
        />
        <span class="absolute left-3 top-3 text-gray-500">
          🔍
        </span>
      </div>
  
      <!-- CTA Button -->
      <div class="mt-6 bg-[#014439] rounded-xl">
        <button class="w-full text-white bg-[#014439] p-4 rounded-xl text-lg font-semibold">
          رزرو پروژه جدید
          <p class="text-center text-gray-400 text-base mt-2">شروع دهی از <span class="text-white underline">۵</span> روز دیگر</p>

        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import TargetIcon from "~/assets/icons/target-icon.svg";

  // No additional logic needed for this UI component
  </script>
  
  <style scoped>
  /* Custom styling if needed */
  </style>
  