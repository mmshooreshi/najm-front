<!-- CustomPackageBetter.vue -->
<script setup lang="ts">
import BasePackageSlider from '@/components/Base/BasePackageSlider.vue'
import type { Package } from '~/types'

const packages = ref<Package[]>([
  {
    id: 1,
    products: [
      {
        id: 11,
        name: 'Open Paper Box',
        image: '/images/main/4.png',
        specs: {
          width: '145',
          height: '152',
          left: '-52',
          top: '91',
          rotate: '-20',
          zIndex: '1'
        }
      },
      {
        id: 12,
        name: 'Kraft Paper Mailing Box',
        image: '/images/main/2.png',
        specs: {
          width: '239',
          height: '210',
          left: '74',
          top: '-4',
          rotate: '12',
          zIndex: '2'
        }
      },
      {
        id: 13,
        name: 'Free Coffee Branding',
        image: '/images/main/7.png',
        specs: {
          width: '167',
          height: '167',
          left: '180',
          top: '106',
          rotate: '-8',
          zIndex: '3'
        }
      },
      {
        id: 14,
        name: 'Free Coffee Cup Paper Holder',
        image: '/images/main/1.png',
        specs: {
          width: '158',
          height: '189',
          left: '264',
          top: '66',
          rotate: '5',
          zIndex: '4'
        }
      },
      {
        id: 15,
        name: 'Free Lunch Kraft Paper Bag',
        image: '/images/main/9.png',
        specs: {
          width: '122',
          height: '216',
          left: '429',
          top: '42',
          rotate: '10',
          zIndex: '5'
        }
      }
    ]
  },
  {
    id: 2,
    products: [
      {
        id: 21,
        name: 'Free Facial Tissue Box',
        image: '/images/main/6.png',
        specs: {
          width: '181',
          height: '153',
          left: '460',
          top: '140',
          rotate: '7',
          zIndex: '6'
        }
      },
      {
        id: 22,
        name: 'Free Coffee Cup Paper Holder (purple)',
        image: '/images/free-kraft-paper-shopping-bag-mockup-1.png',
        specs: {
          width: '123',
          height: '220',
          left: '588',
          top: '37',
          rotate: '-6',
          zIndex: '7'
        }
      },
      {
        id: 23,
        name: 'Floating Square Gift Box',
        image: '/images/main/3.png',
        specs: {
          width: '156',
          height: '152',
          left: '720',
          top: '132',
          rotate: '-10',
          zIndex: '8'
        }
      },
      {
        id: 24,
        name: 'Cardboard Paper Box with Handle',
        image: '/images/main/10.png',
        specs: {
          width: '178',
          height: '168',
          left: '768',
          top: '42',
          rotate: '5',
          zIndex: '9'
        }
      },
      {
        id: 25,
        name: 'Free Floating Hardcover Book',
        image: '/images/main/5.png',
        specs: {
          width: '140',
          height: '194',
          left: '916',
          top: '100',
          rotate: '20',
          zIndex: '10'
        }
      }
    ]
  },
  {
    id: 3,
    products: [
      {
        id: 31,
        name: 'Open Paper Box',
        image: '/images/main/4.png',
        specs: {
          width: '144',
          height: '151',
          left: '1002',
          top: '175',
          rotate: '-20',
          zIndex: '11'
        }
      },
      {
        id: 32,
        name: 'Free Coffee Cup Paper Holder (purple)',
        image: '/images/free-kraft-paper-shopping-bag-mockup-1.png',
        specs: {
          width: '141',
          height: '221',
          left: '1120',
          top: '18',
          rotate: '2',
          zIndex: '12'
        }
      },
      {
        id: 33,
        name: 'Free Coffee Branding',
        image: '/images/main/7.png',
        specs: {
          width: '168',
          height: '167',
          left: '1269',
          top: '117',
          rotate: '-6',
          zIndex: '13'
        }
      },
      {
        id: 34,
        name: 'Floating Square Gift Box',
        image: '/images/main/3.png',
        specs: {
          width: '156',
          height: '152',
          left: '1331',
          top: '20',
          rotate: '-12',
          zIndex: '14'
        }
      },
      {
        id: 35,
        name: 'Kraft Paper Mailing Box',
        image: '/images/main/2.png',
        specs: {
          width: '216',
          height: '190',
          left: '1406',
          top: '49',
          rotate: '8',
          zIndex: '15'
        }
      }
    ]
  }
])

const sideHidden = ref(false)
</script>
<template>
    <section class="wrapper">
      <!-- header collapses vertically (just fades) -->
      <header class="intro" :class="{ on: sideHidden }">
        <h1>اینجا هر کار پیچیده‌ای رو میشه ساده کرد!</h1>
        <p>برای سازمان یا برند شما …</p>
      </header>
  
      <!--
        Mobile‑first (column stack).
        From the md breakpoint up it becomes a classic 1‑2‑1 flex‑row.
        Keeping pure flexbox preserves the smooth flex‑basis animation while
        still giving us a fully responsive layout.
      -->
      <div class="row gap-4" :class="{ full: sideHidden }">
        <!-- side panes shrink to zero width -->
        <aside class="side" :class="{ off: sideHidden }">Left</aside>
  
        <div
          class="slider-box h-[500px]"
          :class="{ full: sideHidden }"
        >
          <BasePackageSlider
            :packages="packages"
            class="h-full"
            @expanded-change="sideHidden = $event"
          />
        </div>
  
        <aside class="side" :class="{ off: sideHidden }">Right</aside>
      </div>
    </section>
  </template>
  
  <style scoped>
  /* ---------------- layout helpers ---------------- */
  .row {
    display: flex;
    flex-direction: column;       /* mobile (stack) */
    align-items: stretch;
  }
  @media (min-width: 768px) {
    .row {
      flex-direction: row;       /* 1‑2‑1 layout from md */
    }
  }
  
  .wrapper {
    width: 100%;
  }
  
  /* ------------- panes & slider ------------------- */
  .side {
    flex: 1 0 220px;              /* basis 220px, can grow a bit */
    max-width: 220px;
    background: #DDDDD7;
    border-radius: 1rem;
    transition: flex-basis 0.5s ease, max-width 0.5s ease, opacity 0.4s ease;
  }
  
  /* Make side panes full‑width in the stacked mobile layout */
  @media (max-width: 767px) {
    .side {
      flex-basis: auto;
      max-width: none;
      width: 100%;
    }
  }
  
  .side.off {
    flex-basis: 0;
    max-width: 0;
    opacity: 0;
    pointer-events: none;
  }
  
  .slider-box {
    /* flex: 2 1 0; */
    min-width: 300px;                 /* allow shrink */
    background: #DDDDD7;
    border-radius: 1rem;
    overflow: hidden;
    transition: flex-grow 0.5s ease;
  }
  .slider-box.full {
    flex-grow: 999;               /* gobble up free space smoothly */
  }
  
  /* ----------------- header fade ------------------ */
  .intro {
    margin-bottom: 2rem;
    transition: opacity 0.4s ease, height 0.4s ease;
  }
  .intro.off {
    opacity: 0;
    height: 0;
    overflow: hidden;
  }
  .intro h1 {
    font-size: 1.8rem;
    font-weight: 700;
  }
  </style>
  