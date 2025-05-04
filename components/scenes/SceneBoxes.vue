
   <!-- SceneBoxes4.vue  -->
   <template>
    <!-- removedd: m-2  mb-12 md:mx-8 -->
    <div dir="rtl" class="snap-start md:px-0 pb-12 pt-8 overflow-visible">
      <div class="px-2 md:px-8 flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <h1 class="text-3xl font-bold text-d4 md:max-w-[30%]">چیزی فراتر از یک جعبه!</h1>
        <p class="text-md md:text-xl text-justify md:max-w-[470px]">
          هر سبک جعبه برای نمایش محصول منحصر به فرد شما طراحی شده است. برش ها و پنجره های سفارشی را اضافه کنید.
        </p>
      </div>
      <HorizontalCategories />
      <BoxCard />
      <d />
    </div>
  </template>
  
  <script setup lang="ts">
  import HorizontalCategories from '@/components/sections/HorizontalCategories.vue'
  import BoxCard from '@/components/BoxCard.vue'
  import d from '@/components/d.vue'
  </script>
  
  