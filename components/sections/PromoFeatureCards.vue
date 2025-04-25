<!-- components/PromoFeatureCards.vue -->
<script setup lang="ts">
interface FeatureCard {
  id: number
  title: string
  buttonLabel: string
  /** optional copy block (only the 3rd card needs it) */
  description?: string
  /** local path / public URL of the background image */
  bgImage: string
  /** dashed-border style for the “upload” card */
  dashed?: boolean
  /** explicit height pulled from Figma so the pictures keep their aspect */
  height: string            // e.g. h-[200px]
}

/* content & visual specs straight from Figma */
const cards: FeatureCard[] = [
  {
    id: 1,
    title: 'طراحی ما، محصول تو!',
    buttonLabel: 'طراحی گرافیکی سفارشی',
    bgImage: '/images/sections/promo-feature-cards/opened-boxes.gif',
    height: 'h-[200px]'
  },
  {
    id: 2,
    title: 'ساختار ما، بسته‌بندی تو!',
    buttonLabel: 'طراحی ساختار سفارشی',
    bgImage: '/images/sections/promo-feature-cards/box.gif',
    height: 'h-[200px]'
  },
  {
    id: 3,
    title: 'ایده‌ی تو، اجرای ما!',
    buttonLabel: 'طراحی ساختار سفارشی',
    description:
      'طرحت رو داری و میخوای برای چاپ آمادش کنی؟ کافیه اونو برای طراح‌های ما آپلود کنی تا بعد از ثبت سفارش راحت و سریع برای چاپ آماده بشن.',
    bgImage: '/images/sections/promo-feature-cards/packaging-items.png',
    dashed: true,
    height: 'h-[243px]'
  }
]
</script>

<template>
  <!-- outer wrapper keeps everything RTL and centred -->
  <section dir="rtl" class="mx-auto max-w-screen-xl px-4 py-16">
    <!-- stacks on mobile, 3-column grid from md-up -->
    <div
      class="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8"
    >
      <div
        v-for="card in cards"
        :key="card.id"
        class="relative flex flex-col  w-full max-w-[343px] md:max-w-none rounded-[25px] overflow-hidden p-6 justify-between"
        :class="[
          card.height,
          card.dashed
            ? ' dashed-border  bg-opacity-20'
            : 'bg-[#E9E9E1]',
          card.id === 3 ? 'bg-[#E9E9E1]' : '', // fallback color
        ]"
        :style="[
          card.id === 3
            ? ''
            : `background-image:url('${card.bgImage}');background-size:cover;background-position:center ${card.id === 1 || card.id === 2 ? 'left -40px' : ''};`,
        ]"

      >
        <!-- heading -->
        <h2
          class="w-fit text-xl leading-[30px] font-extrabold text-[#014439] text-right max-w-[110px]"
        >
          {{ card.title }}
        </h2>

        <!-- optional body copy (only shown on the 3rd card) -->
        <p
          v-if="card.description"
          class="w-[295px] text-sm leading-[21px] text-demibold text-black text-right"
        >
          {{ card.description }}
        </p>

        <!-- CTA button -->
        <button
          class="flex items-center justify-center gap-2 rounded-[15px] bg-white px-6 py-3 w-[181px] text-[14px] leading-[21px] font-semibold"
        >
          {{ card.buttonLabel }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dash25 {
  /* optional fill behind the border */
  /* background-color: rgba(233,233,225,.2); */

  border-radius: 25px;        /* rounded container */
  background-repeat: no-repeat;
  background-size: 100% 100%; /* stretch border to any size */
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'\
viewBox='0 0 100 100' preserveAspectRatio='none'%3E\
  %3Crect x='1.25' y='1.25'            /* inset by ½ stroke */\
        width='97.5' height='97.5'     /* 100 − stroke */\
        rx='25' ry='25'                /* 25 px rounded corners */\
        fill='none'\
        stroke='%23B5B5B5'             /* #B5B5B5 */\
        stroke-width='2.5'\
        stroke-dasharray='5 5'         /* dash 5 / gap 5 */\
        stroke-linecap='butt'          /* square ends */\
        stroke-linejoin='miter'        /* sharp corners */\
        stroke-miterlimit='28.96'\
        vector-effect='non-scaling-stroke'/%3E\
%3C/svg%3E");
}



</style>