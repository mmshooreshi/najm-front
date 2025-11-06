<!-- components/scenes/SceneServicesAndCapabilities.vue -->

 <!-- ScenePrinting2.vue  -->
 <template>
  <div class="snap-start flex flex-col flex-grow  w-full h-full  gap-12  pt-12">
  
        <SceneHeading :data="data" path="sceneServicesAndCapabilities" />
    <SceneAccordionLayout  />

  </div>
</template>

<script setup lang="ts">
import SceneHeading from '~/components/scenes/SceneHeading.client.vue'
import SceneAccordionLayout from '~/components/scenes/SceneAccordionLayout.vue'

const homeUI = inject<any>('homeUI') ?? {}
const data = computed(() => homeUI?.value?.sceneServicesAndCapabilities ?? [])

const dataPrev = {
  label : "خدمات و توانایی‌ها",
  header: "بیشتر از یه چاپخونه،<mobile> یه هم‌تیمی خوب",
  description1: "از طراحی تا اجرا، همه چیز در یک مجموعه.",
  description2: "با راهکارهای خلاقانه و انعطاف‌پذیر ما اینجا هستیم تا داستان شما را تبدیل به یک تجربه‌ی ماندگار کنیم.",
}
</script>

