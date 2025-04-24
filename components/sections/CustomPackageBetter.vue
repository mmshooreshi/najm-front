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


</script>

<template>

    <div dir="rtl" class="snap-start m-2 pt-8 mb-12 overflow-visible mx-8">
        <div class="flex flex-col md:flex-row justify-between gap-4 md:gap-0">


            <h1 class="text-3xl font-bold text-d4 md:max-w-[30%]">اینجا هر کار پیچیده‌ای رو میشه ساده کرد!</h1>
            <p class="text-base text-justify md:max-w-[470px]">برای سازمان یا برند شما، تا آموزشگاه یا کارخانه شما، ما
                ملاحظات منحصر به فردی که هر صنعت نیاز دارد را درک می کنیم. بازارهایی که به آنها خدمت می کنیم.
            </p>
        </div>

    </div>

    <div class="flex-stack md:grid-121">
        <div class="bg-[#DDDDD7] rounded-3xl p-6 min-h-[500px]">Left</div>
        <div class="bg-[#DDDDD7] rounded-3xl w-[500px] min-h-[500px]">

            <div class="w-full h-full overflow-hidden">

                <BasePackageSlider :packages="packages" />
            </div>
        </div>
        <div class="flex flex-row md:flex-col gap-3 min-h-[100px]">

            <div class="flex-grow-1 bg-[#DDDDD7] rounded-3xl p-6 "></div>
            <div class="flex-grow-1  bg-[#DDDDD7] rounded-3xl p-6 "></div>
        </div>
    </div>
</template>
