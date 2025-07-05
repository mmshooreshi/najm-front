<!-- components/sections/PromoFeatureCards.vue -->
<!-- components/PromoFeatureCards.vue -->
<script setup lang="ts">
  import BaseArrow from '@/components/Base/BaseArrow.vue'
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// ------------------------------------------------------------------
//  Type & sample data ------------------------------------------------
// ------------------------------------------------------------------
interface FeatureCard {
  id: number
  title: string
  buttonLabel: string
  description?: string
  bgImage: string
  dashed?: boolean
  minHeight: string         // e.g. h-[280px]
}


const props = defineProps<{
  cards: FeatureCard[]
}>()

const cardsPrev: FeatureCard[] = [
  {
    id: 1,
    title: 'طراحی ما، محصول تو!',
    buttonLabel: 'طراحی گرافیکی سفارشی',
    bgImage: '/images/sections/promo-feature-cards/opened-boxes.gif',
    minHeight: 'min-h-[270px]'
  },
  {
    id: 2,
    title: 'ساختار ما، بسته‌بندی تو!',
    buttonLabel: 'طراحی ساختار سفارشی',
    bgImage: '/images/sections/promo-feature-cards/box.gif',
    minHeight: 'min-h-[270px]]'
  },
  {
    id: 3,
    title: 'ایده‌ی تو، اجرای ما!',
    buttonLabel: 'آپلود فایل طراحی',
    description:
      'طرحت رو داری و میخوای برای چاپ آمادش کنی؟ کافیه اونو برای طراح‌های ما آپلود کنی تا بعد از ثبت سفارش راحت و سریع برای چاپ آماده بشن.',
    // bgImage: '/images/sections/promo-feature-cards/packaging-items.png',
    bgImage: '',
    dashed: true,
    minHeight: 'h-[213px] snap-end'
  }
  
]

function bgUtility (card: FeatureCard) {
  // These utility names are registered once in uno.config.ts → see docs
  if (card.id === 1) return 'bg-[#E9E9E1]/100 bg-cover bg-no-repeat bg-card-1 bg-position-[center_bottom_10rem]  md:bg-card-1'
  if (card.id === 2) return 'scale-x-[-1]  bg-[#E9E9E1]/100  bg-cover bg-no-repeat bg-card-2 sm:bg-card-2-bet md:bg-card-2'
  return 'bg-cover bg-no-repeat bg-card-3'
}
</script>

<template>
  <!-- RTL wrapper -------------------------------------------------- -->
  <section       :dir="isRTL ? 'rtl' : 'ltr'" :class="[isRTL ? 'rtl text-right' : 'ltr text-left']"  class="mx-auto max-w-screen-xl  px-0 py-0 my-auto">
    <!-- Stack on mobile → 3‑col grid ≥ md ------------------------- -->
    <div class="grid gap-2 md:grid-cols-3 md:gap-4">
      <article
      v-motion
  :initial="{ opacity: 0, y: 40 }"
  :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }"

        v-for="card in cards"
        :key="card.id"
        class="relative flex flex-col overflow-hidden rounded-3xl p-6 min-h-[280px] md:min-h-[280px] " 
        :class="[
          'min-h-[280px]',               // mobile minimum
          card.minHeight,                   // explicit figma aspect helpers
          card.dashed && 'border-dashed border-[2.5px] border-[#B5B5B5]'
        ]"
      >
        <!-- 🔹 background ----------------------------------------- -->
        <div
          class="absolute cliplip inset-0 z-0"
          :class="bgUtility(card)"
          :style="`background-image: url('${card.bgImage}'); opacity: ${card.id === 3 ? 0.2: 1};`"
        ></div>

        <!-- 🔹 foreground (fills full card height) ------------------ -->
        <header class="relative z-10 flex  flex-col justify-between gap-3 h-full">
          <!-- title + optional description wrapped so they stick together -->
        <h2 class="text-xl font-extrabold leading-[30px] text-[#014439] max-w-[150px]">
          <span v-for="(line, i) in card.title" :key="i" class="block">
            {{ line }}
          </span>
        </h2>


            <p v-if="card.description" class=" text-sm leading-[21px] font-medium">
              {{ card.description }}
            </p>

          <!-- call‑to‑action button bottom‑aligned                   -->
           <div class="flex flex-row w-full flex-2 justify-between">
          <div
            class="flex h-12 items-center justify-center gap-2 rounded-[15px] bg-white/0 px-6 py-0 text-[14px] font-semibold leading-[21px]"
          >
            {{ card.buttonLabel }}
          </div>
          <BaseArrow/>
        </div>
        </header>
      </article>
    </div>
  </section>
</template>

<style scoped>


.bg-card-1{
  /* background-position: center center; */
  /* background-position: -30vw 0vw; */
  /* background-position: center center; */


}

.bg-card-1-bet{
  /* background-position: center center; */

}

.bg-card-2{
  /* inja hamechio barax bexan: chon scale-x-[-1] dare */
  /* background-position: 40px -40px; */
  background-position:  center center;

  
}

.bg-card-3-m{
  background-position: 0px 0px;
  
}

.bg-card-2-bet{

  /* background-position: -900px -50px; */
  
}


.bg-card-3-d{
  background-position: 0px 0px;  
}

.cliplip{
  /* clip-path: inset(0px 0px 50px 0px); */
}

</style>