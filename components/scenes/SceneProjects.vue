
 <!-- ScenePrinting2.vue  -->
 <template>
  <div class="snap-start flex flex-col flex-grow  w-full h-full  gap-12  pt-12">
    <SceneHeading :data="data" align="right"/>

  </div>
</template>

<script setup lang="ts">
import SceneHeading from '~/components/scenes/SceneHeading.client.vue'

const data = {
  label : "پروژه‌ها",
  header: "توی نجم هر ایده‌ای رو می‌شه چاپ کرد!",
  description1: "طراحی خوب مهمه، اما ما به چیزی فراتر از طراحی فکر می‌کنیم",
  description2: "ما به اجرای دقیق و نتیجه‌گرا اهمیت می‌دیم.",
}


</script>

