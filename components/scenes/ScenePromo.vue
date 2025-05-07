
   <!-- ScenePromo6.vue  -->
   <template>
        <div class="rtl snap-start flex flex-col flex-grow w-full h-full gap-12 pt-12">

          <SceneHeading :data="data" align="center" />

      <PromoFeatureCards />
   </div>

  </template>
  
  <script setup lang="ts">
  import PromoFeatureCards from '@/components/sections/PromoFeatureCards.vue'
  import SceneHeading from '~/components/scenes/SceneHeading.client.vue'


  const data = {
  label: 'خدمات طراحی',
  header: 'رنگ و هویتی که برندتو متمایز می‌کنه، فرم و ساختاری که عملکرد محصولتو تضمین می‌کنه',
  description1: 'تمامی مراحل چاپ در مجموعه‌ی خود ما انجام میشه، بدون دخالت واسطه‌ها. ما فقط نمی‌فروشیم، ما تولید می‌کنیم و این یعنی؟',
  description2: '',
}

  </script>
  
  