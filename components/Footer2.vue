<!-- components/Footer2.vue -->
<template>
  <footer dir="rtl" class="bg-najmgreen/100 rounded-t-[15px] text-center items-center text-white/100 pt-16 pb-16">

    <div class=" grid-cols-2 grid w-full">
      <logoWhite class="col-span-2  mx-auto " />
    </div>

    <div class="max-w-screen-xl px-0 grid grid-cols-1 md:grid-cols-2 items-baseline">

      <div class="col-span-1 px-10 md:mt-16 md:max-h-[60vh] ">
        <div class="max-w-xl mx-auto md:px-10 flex flex-col-reverse md:flex-col gap-1">
          <BaseFooterAccordion
            v-for="section in accordionSections"
            :key="section.id"
            :id="section.id"
            :title="section.name"
            :items="section.children"
            :modelValue="openAccordionId === section.id"
            @toggle="handleAccordionToggle"
          />

          <div class="grid gap-8 pt-12 pb-0">
            <div class="flex flex-col gap-4 h-[50%] mb-8 md:mb-0">
              <p
                v-for="(paragraph, index) in footerUIData.hero.paragraphs"
                :key="index"
                class="leading-5 font-medium text-d4 text-xs text-right"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>

        </div>

        <NuxtImg v-if="isDesktop" class="invisible md:visible md:max-h-full max-w-sm mx-auto w-[80%] mt-4 mb-4 px-2 py-0" src="/images/sections/footer/trust.png" />

      </div>

      <div class="max-w-screen-xl overflow-hidden col-span-1 px-10">
        <div class="flex flex-col w-full max-w-xl mx-auto md:px-10  gap-0 text-sm  pt-12 pb-2">
          <div
            v-for="(item, index) in footerUIData.contact.items"
            :key="index"
            class="flex flex-col"
          >
            <div class="flex w-full justify-between border-b border-white/10 border-b-0.5 py-3">
              <span class="text-demibold text-d4 text-sm">{{ item.name }}</span>
              <a
                v-if="item.slug"
                :href="item.slug"
                class="ltr:font-mono text-demibold text-d4 text-sm"
                :class="[item.ltr ? 'ltr' : 'rtl']"
              >
                {{ item.value }}
              </a>
              <span v-else>
                <div  class="text-left" v-html="item.value"/>


              </span>
            </div>
          </div>
        </div>

        <!-- <MarkerIcon class="absolute top-[48%] left-[48%] z-10" /> -->
        <ClientOnly>
        <Map/>
      </ClientOnly>
<!-- 
        <ClientOnly>
        <NeshanMap/>
      </ClientOnly> -->
        <!-- <div class="relative mx-0 md:mx-8 mt-0 h-[300px] md:h-[500px] rounded-3xl overflow-hidden">
          
          <MapboxMap
            style="position: absolute; width: 100%;"
            map-id="<MAP_ID>"
            :options="{
              style: 'mapbox://styles/mmshooreshi/cm9xbga9n009p01sictvq5wgu',
              
              center: [51.306003, 35.6735325],
              zoom: 11
            }"
          />
        </div> -->
        
        <NuxtImg class="md:invisible md:hidden visible max-w-sm mx-auto w-full mt-4 mb-4 px-2 py-0" src="/images/sections/footer/trust.png" />

      </div>



    </div>

    <div class="max-w-sm md:max-w-screen mx-12 overflow-hidden h-px bg-white/20 mx-auto"></div>

    <div class="mx-12 flex flex-col items-center justify-between gap-2 py-4 text-xs md:flex-row">
      <span>کلیه حقوق این سایت متعلق به مجموعه‌ی چاپ نجم می‌باشد.</span>
      <span class="ltr">&copy; {{ year }} ChapNajm</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logoWhite from '~/assets/icons/najm-logo-white.svg'
import BaseFooterAccordion from '@/components/Base/BaseFooterAccordion.vue'
import { usefooterUIData } from '@/composables/ui/footerUI'
import MarkerIcon from '~/assets/icons/marker-icon.svg'
import Map from '~/components/map.vue'
import NeshanMap from '~/components/neshan-container.client.vue'

const openAccordionId = ref<string | null>(null)
const { footerUIData } = usefooterUIData()

const accordionSections = computed(() =>
  (footerUIData.value.sections ?? []).filter(section => section.type === 'accordion')
)

function handleAccordionToggle(id: string) {
  openAccordionId.value = openAccordionId.value === id ? null : id
}

const year = new Date().getFullYear()
const isDesktop = useMediaQuery('(min-width: 768px)')

</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #ffffff55;
  border-radius: 3px;
}
</style>
