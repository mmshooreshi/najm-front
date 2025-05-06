
 <!-- ScenePrinting2.vue  -->
 <template>
  <div class="snap-start flex flex-col flex-grow  w-full h-full  gap-12  pt-12">
    <SceneHeading  :data="data"/>

    <div class="w-max mx-auto cursor-pointer">
    <Button @click.prevent="toggleType('Applications')" class="mx-1 transition-all rounded-[35px]  px-6 py-[15px] text-d4 text-sm" :class="[selectedType == 'Applications' ? 'bg-[#014439] text-white' : 'hover:bg-gray-300/40 bg-transparent text-black']">کاربردها</Button>
    <Button @click.prevent="toggleType('Industries')" class="mx-1 transition-all  rounded-[35px]  px-6 py-[15px] text-d4 text-sm" :class="[selectedType == 'Industries' ? 'bg-[#014439] text-white' : 'hover:bg-gray-300/40  bg-transparent text-black']">صنعت‌ها</Button>
  </div>
    <ClientOnly>
      <EmblPackageCards ref="pkgsRef"  :selectedType="selectedType" controls="dots" position="center" :packages="filteredPackages"/>
    </ClientOnly>
    


  </div>
</template>



<script setup lang="ts">
import SceneHeading from '~/components/scenes/SceneHeading.client.vue'
import EmblPackageCards  from '@/components/cards/EmblPackageCards.vue'
import { usePackages } from '@/composables/usePackages'
const pkgsRef = ref<InstanceType<typeof EmblPackageCards> | null>(null)

const selectedType = ref("Applications")
const PosRef = ref("Start")

const { packages, examplePackages } = usePackages()

function toggleType(type: string){
  if(selectedType.value == type){
  if (PosRef.value == "Start"){
    pkgsRef.value?.scrollToEnd()
    PosRef.value="End"

  } else {
    pkgsRef.value?.scrollToStart()
    PosRef.value="Start"
  }
    
  } else {
    selectedType.value = type;
    pkgsRef.value?.scrollToStart()

  }
}
const filteredPackages = computed(() =>
  packages.value.filter(pkg => pkg.type === selectedType.value)
)

const data = {
  label : "",
  header: "بهترینِ خودت باش!<mobile> توی هر صنعتی، هر برندی، هر مناسبتی",
  description1:"چاپ و بسته‌بندی در هر پروژه‌ا‌ی و برای هر مصرفی، نیازهای خاص خودش رو داره و ما این را به خوبی درک می‌کنیم.",
  description2: "به جای محدودیت، ما به دنبال یافتن بهترین راه‌حل برای اجرای ایده‌های شما هستیم.",
}



</script>




