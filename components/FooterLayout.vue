<template>
    <div dir="rtl" class="flex flex-col bg-[#e4edf0] rounded-[25px] p-9 w-full items-start">
      <!-- <div class="flex flex-row gap-12 items-start" > -->
        <div class="flex flex-row flex-wrap gap-12 items-start justify-center">

        <FooterComponent :title="contactTitle" :items="contactItems" />
        <FooterComponent :title="servicesTitle" :items="servicesItems" />
        <FooterComponent :title="najmTitle" :items="najmItems" />
        <FooterComponent :title="customerServiceTitle" :items="customerServiceItems" />
        <FooterComponent :title="latestTitle" :items="latestItems" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import FooterComponent from '~/components/FooterComponent.vue';
  
  const contactTitle = ref('ارتباط با ما');
  const contactItems = ref([
    'تلفن: +98 21 0053 6712',
    'فکس: +98 21 0053 6712',
    'ایمیل: www.chapnajm.gmail.com',
    'ساعت‌های کاری: شنبه تا چهارشنبه: 9:00 صبح تا 7:00 بعدازظهر',
    'پنج‌شنبه‌ها: تا ساعت 4:00 بعدازظهر'
  ]);
  
  const servicesTitle = ref('خدمات');
  const servicesItems = ref([
    'مشاوره',
    'طراحی گرافیکی',
    'طراحی ساختار',
    'لیتوگرافی و زینک',
    'ساخت قالب',
    'چاپ افست',
    'چاپ کامل بسته‌بندی',
    'خدمات تکمیلی چاپ',
    'نگهداری و انبار',
    'ارسال و تحویل',
    'پشتیبای بعد از تحویل'
  ]);
  
  const najmTitle = ref('مجموعه‌ نجم');
  const najmItems = ref([
    'محصولات',
    'درباره ما',
    'تجهیزات و ماشین‌آلات',
    'نمونه‌کارها',
    'کاتالوگ',
    'مرکز دانلود'
  ]);
  
  const customerServiceTitle = ref('سرویس مشتریان');
  const customerServiceItems = ref([
    'سوالات متداول',
    'فرآیند سفارش',
    'شرایط گارانتی',
    'قوانین و مقررات'
  ]);
  
  const latestTitle = ref('آخرین‌ها');
  const latestItems = ref([
    'وبلاگ',
    'اخبار'
  ]);
  

  </script>
  
  <style scoped>
  /* Add any additional scoped styles here */
  </style>
  