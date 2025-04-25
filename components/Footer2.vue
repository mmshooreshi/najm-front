<template>
  <footer
    dir="rtl"
    class="bg-[#014439]/100 rounded-[15px] text-center items-center text-white/100 pt-16 pb-7 "
  >
    <div class="mx-auto max-w-screen-xl px-0 grid grid-cols-1 md:grid-cols-2">
      <div class="sm:visible md:invisible mb-8 w-max mx-auto">
        <logoWhite />
      </div>

      <div class="col-span-1 px-10 ">



        <div class="max-w-xl mx-auto px-4 flex  flex-col gap-1" dir="rtl">
          <!-- 1️⃣ accordion sections -->
          <BaseFooterAccordion
            v-for="section in accordionSections"
            :key="section.id"
            :id="section.id"
            :title="section.name"
            :items="section.children"
            :modelValue="openAccordionId === section.id"
            @toggle="handleAccordionToggle"
          />

 

          <!-- <iframe
  src="https://api.mapbox.com/styles/v1/mapbox/streets-v11.html?title=false&zoomwheel=true&access_token=pk.eyJ1IjoibW1zaG9vcmVzaGkiLCJhIjoiY205eGJla2tyMTB3ejJrc2Vma2VwY2VlaiJ9.PGekyHty46Af6FxyKY3HIw"
  width="100%"
  height="400"
  style="border-radius: 12px;"
></iframe> -->

                  <!-- ——— Top area ——— -->
        <div class="grid gap-8 py-12">
          <!-- 🟢 Brand story ------------------ -->
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-4">
              <p
                v-for="(paragraph, index) in footerUIData.hero.paragraphs"
                :key="index"
                class="leading-5 font-medium text-d4 text-xs  text-right"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>


          <NuxtImg
            class="md:invisible !visible mb-16"
            src="/images/sections/footer/trust.png"
          />
        </div>
      </div>


        <div class="col-span-1 px-10">
          <!-- 🟢 Contact ----------------------- -->
          <div class="md:col-span-1 flex flex-col gap-0 text-sm">
            <div
              v-for="(item, index) in footerUIData.contact.items"
              :key="index"
              class="flex flex-col"
            >
              <div
                class="flex w-full justify-between border-b border-white/10 border-b-0.5 py-3"
              >
                <span class="font-bold">{{ item.name }}: </span>
                <a
                  v-if="item.slug"
                  :href="item.slug"
                  class="ltr:font-mono"
                  :class="[item.ltr ? 'ltr' : 'rtl']"
                >
                  {{ item.value }}
                </a>
                <span v-else>{{ item.value }}</span>
              </div>
            </div>

          </div>
          <div class="bg-red relative w-full h-82 mt-16 rounded-3xl overflow-hidden">  
  <MarkerIcon class="absolute top-[48%] left-[48%] z-10"/>
  <MapboxMap
   style="position: absolute; " 
      map-id="{ID}"
      :options="{
        style: 'mapbox://styles/mapbox/light-v11', // style URL
        center: [51.306003, 35.6735325], // starting position
        zoom: 11 // starting zoom
      }"/>

    </div>
          <!-- <NuxtImg class="w-full mt-16" src="/images/sections/footer/map.png" /> -->

      </div>
      <!-- ——— Divider ——— -->
    </div>
    <div class="my-6 h-px bg-white/20"></div>

    <!-- ——— Bottom line ——— -->
    <div
      class="flex flex-col items-center justify-between gap-2 pb-6 text-xs md:flex-row"
    >
      <span>کلیه حقوق این سایت متعلق به مجموعه‌ی چاپ نجم می‌باشد.</span>
      <span>&copy; {{ year }} ChapNajm</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface SectionItem {
  label: string
  models?: number
}
interface Section {
  title: string
  items: SectionItem[]
}

import logoWhite from '~/assets/icons/logo-white.svg'
import BaseFooterAccordion from '@/components/Base/BaseFooterAccordion.vue'
import { usefooterUIData } from '@/composables/ui/footerUI'
import map from '@/components/map.vue'
import MarkerIcon from '~/assets/icons/marker-icon.svg'

const openAccordionId = ref<string | null>(null)

const { footerUIData } = usefooterUIData()

const sections = computed(() => footerUIData.value.sections ?? [])

const accordionSections = computed(() =>
  sections.value.filter(s => s.type === 'accordion')
)

const labelSections = computed(() =>
  sections.value.filter(s => s.type === 'label')
)

// const hiddenSections = computed(() =>
//   sections.value.filter(s => s.type === 'hidden')
// )

function handleAccordionToggle(id: string) {
  openAccordionId.value = openAccordionId.value === id ? null : id
  console.log(openAccordionId.value, id)
}

const year: number = new Date().getFullYear()
</script>

<style scoped>
/* custom scrollbar (optional) */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #ffffff55;
  border-radius: 3px;
}
</style>
