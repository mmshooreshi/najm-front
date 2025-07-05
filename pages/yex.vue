<!-- pages/yex.vue -->
<template>
  <div class="w-screen -mx-4">
    <ClientOnly>
      <TexPop
  :highlights="[
    { label: 'یه نیاز خاص',       sentence: 'داری؟',                bgColor: '#B9ADFF', textColor: 'black', rotation: '3deg' },
    { indent: '5px', label: 'یه هدف مشخص', sentence: 'داری؟',         bgColor: '#F4FFD0', textColor: 'black', rotation: '-4deg' },
    { label: 'break' },
    { indent: '30px', label: '',    sentence: 'یا حتی فقط',            bgColor: 'transparent', textColor: 'black', rotation: '0deg' },
    { label: 'یه تصویر ذهنی',       sentence: 'دارید؟',             bgColor: '#A5E4EB', textColor: 'black', rotation: '5deg' },

    // 10 اضافه جدید
    { indent: '10px', label: 'ایدهٔ ناب',          sentence: 'چطور؟',            bgColor: '#FFD3B6', textColor: 'black', rotation: '-2deg' },
    { label: 'کیفیت برتر',       sentence: 'می‌خوای؟',         bgColor: '#FFAAA5', textColor: 'white', rotation: '4deg' },
    { indent: '15px', label: 'تجربهٔ کاربری',    sentence: 'چی؟',              bgColor: '#C3F584', textColor: 'black', rotation: '-3deg' },
    { label: 'هویت بصری',         sentence: 'چگونه؟',           bgColor: '#FFEE93', textColor: 'black', rotation: '6deg' },
    { indent: '20px', label: 'قیمت مناسب',       sentence: 'می‌پسندید؟',       bgColor: '#AEDFF7', textColor: 'black', rotation: '-5deg' },
    { label: 'تحویل سریع',        sentence: 'مهمه؟',            bgColor: '#FFA8DF', textColor: 'black', rotation: '2deg' },
    { indent: '25px', label: 'پشتیبانی ۲۴/۷',  sentence: 'می‌خوای؟',         bgColor: '#D0F4DE', textColor: 'black', rotation: '-1.5deg' },
    { label: 'انعطاف‌پذیری',       sentence: 'نسبت به چی؟',      bgColor: '#FCCDE2', textColor: 'black', rotation: '3.5deg' },
    { indent: '30px', label: 'خلاقیت',          sentence: 'دوست داری؟',       bgColor: '#FFC8A2', textColor: 'black', rotation: '-4.5deg' },
    { label: 'بسته‌بندی شیک',     sentence: 'می‌پسندی؟',        bgColor: '#B5EAEA', textColor: 'black', rotation: '5.2deg' }
  ]"
  :paragraphes="[
    { sentence: 'ما از اولین فکر تا آخرین بسته‌بندی کنارت هستیم!' },
    { delay: '100ms', sentence: 'طراحی، چاپ، و پشتیبانی؛ همه‌چیز با تیم حرفه‌ای ما، دقیق و هماهنگ، مطابق با خواسته‌های تو انجام می‌شه.' }
  ]"
  :bounce-scale="1.1"
  :bounce-duration="0.2"
  :type-speed="20"
  animation-type="split"
  :scrub="false"
/>
</ClientOnly>

  </div>
</template>

<script lang="ts" setup>
import TexPop from '@/components/Main/TexPop.vue'
</script>

<style>

</style>