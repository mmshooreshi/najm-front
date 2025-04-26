<template>

<div dir="rtl" class="my-8 md:mx-8 flex flex-col md:flex-row justify-between gap-4 md:gap-0">
    <h1 class="text-3xl font-bold text-d4 md:max-w-[40%]">پیدا کردن یک چاپگر آسان است، اما پیدا کردن یک شریک چاپ سخت است.</h1>
        <p class="text-md md:text-xl text-justify md:max-w-[470px]">شما لایق شریکی هستید که رسیدن به اهدافتان را آسان کند
          از سبک های ساده تا بسیار پیچیده، ما طیف کاملی از محصولات و قابلیت ها را برای برآوردن هر نیازی داریم.
        </p>
      </div>

    <div  class="flex w-full h-auto gap-4 p-4">
      <!-- Left Sidebar - Calendar Section -->

      <div 
        class="flex-1 w-[20%] h-auto p-0 bg-cover rounded-[25px]"
      >
        <CalendarTypesComponent />
      </div>
  
      <!-- Right Main Content -->
      <div class="flex-3 w-[70%] h-auto flex flex-col gap-4">
        <OfficePackageComponent />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import CalendarTypesComponent from '~/components/aut/CalendarTypesComponent.vue';
  import OfficePackageComponent from '~/components/aut/OfficePackageComponent.vue';
  </script>
  
  <style scoped>
  /* Improved Styles */
  .flex {
    display: flex;
  }
  .w-full {
    width: 100%;
  }
  .h-auto {
    height: auto;
  }
  .gap-4 {
    gap: 1rem;
  }
  .bg-cover {
    background-size: cover;
    background-position: center;
  }
  .rounded-[25px] {
    border-radius: 25px;
  }
  </style>
  