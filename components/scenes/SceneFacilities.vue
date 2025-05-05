
 <!-- ScenePrinting2.vue  -->
 <template>
  <div class="snap-start flex flex-col flex-grow  w-full h-full  gap-12  pt-12">
    <SceneHeading :data="data"/>

  </div>
</template>

<script setup lang="ts">
import SceneHeading from '@/components/scenes/SceneHeading.vue'

const data = {
  label : "امکانات و تجهیزات",
  header:"کیفیت و دقتی که درباره اون صحبت می‌کنیم رو از نزدیک ببینید",
  description1: "یه تیم یکپارچه به شما این امکان رو می‌ده که تمام مراحل تولید، از طراحی تا چاپ و بسته‌بندی رو با یک پارتنر پیش ببرید و به جای مدیریت چندین تأمین‌کننده جداگانه فقط بر کار خودتون متمرکز بشید.",
  description2: ""
}
</script>

