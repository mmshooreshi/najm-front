<template>
  <div dir="rtl" class="relative overflow-x-visible  pr-10  absolute py-0">
    <div class="overflow-visible w-full" ref="viewportRef">
      <!-- <button @click="downloadAllJson()" class="z-10 m-4 pt-2 px-2 py-0 bg-green-600/20 hover:bg-green-600 text-white rounded-xl">
      <Icon name="mdi:download"/>
    </button> -->

      <div class="flex">


        <div
          v-for="(pkg, idx) in packages"
          :key="pkg.id"
           v-floating="{ distance: 8, duration: 4 }"
          
          class="tak z-40 hover:z-50 relative flex-none w-4/5 mr-2.5 min-w-[400px] min-h-[400px] max-w-[400px] rounded-[1.5rem] overflow-visible rtl"
        >
        <!-- <div  class="takcon z-10"> -->

              <div
      class="takcon z-10"
      :style="{
        '--tc-base': pkg.color,
        '--tc-shade1': adjustColor(pkg.color, -0.2),
        '--tc-shade2': adjustColor(pkg.color, +0.2),
        backgroundColor: pkg.color
      }"
    >


        <CardOverlayWrapper  :style="{ backgroundColor: pkg.color }" :name="pkg.name" :items="pkg.items">


          <NuxtImg v-if="pkg.image"
            :src="pkg.image"
            :alt="pkg.name"
            v-memotion-pop-visible="{ ystart:100, delay: idx*0.3, duration: 0.8 }"
            class="object-cover h-full w-full scale-100 rounded-[1.5rem]"
          />
        
          
          
          
          <!-- <div v-memotion-pop-visible="{ ystart: -20, delay: idx*0.1, duration: 0.3, ease: 'power3.out' }" class="absolute bottom-6 right-6 bg-[#D6E6E3] px-3 py-2 rounded-[1.5625rem] rounded-br-[0.3125rem] max-h-[85px] max-w-[260px] text-sm font-medium text-d4"> -->
            <!-- {{ pkg.name }} {{ idx }} -->
          <!-- </div> -->

        </CardOverlayWrapper>
      </div>
        </div>
      </div>
    </div>


  <div :class="['flex items-center mt-4', wrapperClass]">
    <!-- arrows -->
    <div v-if="showArrows" class="flex gap-2">
      <button
        class="bg-white/60 active:scale-105 active:bg-white hover:bg-white rounded-xl p-3 disabled:opacity-30 disabled:cursor-default"
        :disabled="!canScrollPrev"
        @click="scrollPrev"
        aria-label="Prev Slide"
      >
        <!-- prev SVG -->
      </button>
      <button
        class="bg-white/60 active:scale-105 active:bg-white hover:bg-white rounded-xl p-3 disabled:opacity-10 disabled:cursor-default"
        :disabled="!canScrollNext"
        @click="scrollNext"
        aria-label="Next Slide"
      >
        <!-- next SVG -->
      </button>
    </div>

    <div v-if="showDots" class="flex gap-2">
  <button
    v-for="(pkg, idx) in pkg"
    :key="pkg.id"
    @pointerin="scrollTo(idx)"
    @mouseenter="scrollTo(idx)"
    @touchstart.prevent="scrollTo(idx)"
    :style="{ backgroundColor: pkg.color }"
    :class="[
      'w-8 h-8 rounded-2xl border-none cursor-pointer transition-all hover:w-14',
      selectedIndex === idx ? ' w-14' : '!bg-gray-300/40'
    ]"
    :aria-label="`Go to slide ${idx + 1}`"
  >
  </button>
</div>

  </div>

  </div>
</template>

<script setup>

import EmblaCarousel from 'embla-carousel'
// import DescriptionBubble if needed
import CardOverlayWrapper from '@/components/CardOverlayWrapper.vue'

const props = defineProps({
  packages: {
    type: Array,
    required: true,
    // expects something like { text: '...' }
  },
  controls: {
    type: String,
    default: 'all',
    validator: v => ['all','arrows','dots','none'].includes(v)
  },
  // layout: 'default' (dots left, arrows right), 'reverse', or 'center'
  position: {
    type: String,
    default: 'default',
    validator: v => ['default','reverse','center'].includes(v)
  }

})


const showArrows = computed(() =>
  props.controls === 'all' || props.controls === 'arrows'
)
const showDots   = computed(() =>
  props.controls === 'all' || props.controls === 'dots'
)
const wrapperClass = computed(() => {
  if (props.position === 'center')      return 'justify-center flex-row'
  if (props.position === 'reverse')     return 'justify-between flex-row-reverse'
  /* default */                          return 'justify-between flex-row'
})



const viewportRef = ref(null)
const embla = ref(null)



const selectedIndex = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

const scrollPrev = () => embla.value && embla.value.scrollPrev()
const scrollNext = () => embla.value && embla.value.scrollNext()
const scrollTo = (index) => embla.value && embla.value.scrollTo(index)

const onSelect = () => {
  selectedIndex.value = embla.value.selectedScrollSnap()
  canScrollPrev.value = embla.value.canScrollPrev()
  canScrollNext.value = embla.value.canScrollNext()
}


const currentPackage = computed(() => props.packages[selectedIndex.value])


const shade1 = computed(() => adjustColor(currentPackage.value.color, -0.2))
const shade2 = computed(() => adjustColor(currentPackage.value.color, +0.2))

function adjustColor(hex, amount) {
  const c = hex.replace('#',''),
        num = parseInt(c,16),
        r = (num >> 16) & 0xFF,
        g = (num >> 8) & 0xFF,
        b = num & 0xFF
  const clamp = v => Math.max(0, Math.min(255, Math.floor(v + amount*255)))
  return `#${((1<<24)+(clamp(r)<<16)+(clamp(g)<<8)+clamp(b))
    .toString(16).slice(1)}`
}

function downloadJson(pkg) {
  const dataStr = JSON.stringify(pkg, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `package-${pkg.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}
// WITH THIS:
function downloadAllJson() {
  // 1) Bundle every package into one big array
  const dataStr = JSON.stringify(props.packages, null, 2)
  // 2) Create a blob and download as “all-packages.json”
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `all-packages.json`
  a.click()
  URL.revokeObjectURL(url)
}


onMounted(() => {
  embla.value = EmblaCarousel(viewportRef.value, {
    containScroll: 'keepSnaps',
    draggable: true,
    speed: 100,
    delay: 100,
    align: 'start',
    dragFree: true,
    direction: 'rtl',
    loop: false
  })
  embla.value.on('init', onSelect)
  embla.value.on('select', onSelect)
})
</script>






<style scoped>
.tak {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* width: 320px; */
  border-radius: 24px;
  line-height: 1.6;

  transition: all 0.88s cubic-bezier(0.23, 1, 0.32, 1);
}

.takcon {
  

  width: -webkit-fill-available;
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  /* padding: 36px; */
  border-radius: 22px;
  color: #ffffff;
  overflow: hidden;
  /* background: #0a3cff; */
  transition: all 0.88s cubic-bezier(0.23, 1, 0.32, 1);
}

.takcon::before {
  z-index: 0;
  position: absolute;
  content: "";
  /* top: -4%; */
  top: 0%;
  left: 50%;
  width: 90%;
  height: 90%;
  transform: translate(-50%);
  /* background: #ced8ff; */
  background-color: var(--tc-shade1);

  
  transform-origin: bottom;

  border-radius: inherit;
  transition: all 0.88s cubic-bezier(0.23, 1, 0.32, 1);
}

.takcon::after {
  z-index: 0;
  position: absolute;
  content: "";
  /* top: -8%; */
  top: 0%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%);
  /* background: #e7ecff; */
  background-color: var(--tc-shade1);
  
  transform-origin: bottom;
  border-radius: inherit;
  transition: all 0.88s cubic-bezier(0.23, 1, 0.32, 1);
}

.takcon svg {
  width: 48px;
  height: 48px;
}

.takcon .para {
  
  opacity: 1;
  font-size: 18px;
  transition: all 0.88s cubic-bezier(0.23, 1, 0.32, 1);
}

.takcon .link {
  
  color: #fea000;
  text-decoration: none;
  font-family: inherit;
  font-size: 16px;
  transition: all 0.88s cubic-bezier(0.23, 1, 0.32, 1);
}

.takcon .link:hover {
  text-decoration: underline;
}

.tak:hover {
  transform: translate(-6px, -16px);
  margin-inline: 10px;

}

.tak:hover .takcon::before {
  rotate: -8deg;
  top: 0;
  width: 100%;
  height: 100%;
}

.tak:hover .takcon::after {
  rotate: 8deg;
  top: 0;
  width: 100%;
  height: 100%;
}

</style>