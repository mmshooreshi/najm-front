<!-- components/sections/PromoFeatureCards2.vue -->
<!-- components/PromoFeatureCards.vue -->
<script setup lang="ts">
  import BaseArrow from '@/components/Base/BaseArrow.vue'

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
  minHeight: string         // e.g. h-[300px]
}

const cards: FeatureCard[] = [
  {
    id: 1,
    title: 'طراحی ما، محصول تو!',
    buttonLabel: 'طراحی گرافیکی سفارشی',
    bgImage: '/images/sections/promo-feature-cards/opened-boxes.webp',
    minHeight: 'min-h-[300px]'
  },
  {
    id: 2,
    title: 'ساختار ما، بسته‌بندی تو!',
    buttonLabel: 'طراحی ساختار سفارشی',
    bgImage: '/images/sections/promo-feature-cards/box.webp',
    minHeight: 'min-h-[300px]]'
  },
  {
    id: 3,
    title: 'ایده‌ی تو، اجرای ما!',
    buttonLabel: 'آپلود فایل طراحی',
    description:
      'طرحت رو داری و میخوای برای چاپ آمادش کنی؟ کافیه اونو برای طراح‌های ما آپلود کنی تا بعد از ثبت سفارش راحت و سریع برای چاپ آماده بشن.',
    bgImage: '/images/sections/promo-feature-cards/packaging-items.png',
    dashed: true,
    minHeight: 'h-[243px]'
  }
  
]

function bgUtility (card: FeatureCard) {
  // These utility names are registered once in uno.config.ts → see docs
  if (card.id === 1) return 'bg-[#E9E9E1]/100 bg-cover bg-no-repeat bg-card-1-m md:bg-card-1-d'
  if (card.id === 2) return 'scale-x-[-1]  bg-[#E9E9E1]/100  !bg-cover bg-no-repeat bg-card-2-m md:bg-card-2-d'
  return 'bg-cover bg-no-repeat bg-card-3'
}
</script>

<template>
  <!-- RTL wrapper -------------------------------------------------- -->
  <section dir="rtl" class="mx-auto max-w-screen-xl  py-16">
    <!-- Stack on mobile → 3‑col grid ≥ md ------------------------- -->
    <div class="grid gap-1 md:grid-cols-3 md:gap-4">
      <article
        v-for="card in cards"
        :key="card.id"
        class="relative flex flex-col overflow-hidden rounded-3xl p-6 min-h-[300px] md:min-h-[300px]"
        :class="[
          'min-h-[300px]',               // mobile minimum
          card.minHeight,                   // explicit figma aspect helpers
          card.dashed && 'border-dashed border-[2.5px] border-[#B5B5B5]'
        ]"
      >
        <!-- 🔹 background ----------------------------------------- -->
        <div
          class="absolute inset-0 z-0"
          :class="bgUtility(card)"
          :style="`background-image: url('${card.bgImage}'); opacity: ${card.id === 3 ? 0.2: 1};`"
        ></div>

        <!-- 🔹 foreground (fills full card height) ------------------ -->
        <header class="relative z-10 flex  flex-col justify-between gap-3 h-full">
          <!-- title + optional description wrapped so they stick together -->
            <h2 class="text-xl font-extrabold leading-[30px] text-najmgreen max-w-[110px]">
              {{ card.title }}
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

.bg-card-1-m{
  /* background-position: -110px -135px; */
  background-position: -35vw -30vw;


}

.bg-card-2-m{
  /* inja hamechio barax bexan: chon scale-x-[-1] dare */
  /* background-position: 40px -40px; */
  background-position: 5vw -10vw;

  
}

.bg-card-3-m{
  background-position: 0px 0px;
  
}

.bg-card-1-d{
  background-position: -90px -50px;
  
}

.bg-card-2-d{
  background-position: 0px -40px;
  
}

.bg-card-3-d{
  background-position: 0px 0px;  
}

</style>