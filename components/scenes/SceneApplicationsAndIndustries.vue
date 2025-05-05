
 <!-- ScenePrinting2.vue  -->
 <template>
  <div class="snap-start flex flex-col flex-grow  w-full h-full  gap-12  pt-12">
    <SceneHeading  :data="data"/>

  </div>
</template>

<script setup lang="ts">
import SceneHeading from '@/components/scenes/SceneHeading.vue'

const data = {
  label : "",
  header: "بهترینِ خودت باش!<mobile> توی هر صنعتی، هر برندی، هر مناسبتی",
  description1:"چاپ و بسته‌بندی در هر پروژه‌ا‌ی و برای هر مصرفی، نیازهای خاص خودش رو داره و ما این را به خوبی درک می‌کنیم.",
  description2: "به جای محدودیت، ما به دنبال یافتن بهترین راه‌حل برای اجرای ایده‌های شما هستیم.",
}
</script>



