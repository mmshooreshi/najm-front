<!-- components/sections/FaqSection.vue -->
<template>
    <section class="rtl py-16">
      <div class="max-w-4xl mx-auto flex flex-col gap-12 overflow-visible">
        <!-- Title -->
        <h2 class="text-lg md:text-xl font-bold text-center">
          مهم نیست کار چقدر پیچیده باشه، هرجای این مسیر، ما با شما هستیم.
        </h2>
  
        <!-- Category Tabs -->
        <div class="relative h-10">
          <div class="noscroll flex flex-row justify-between gap-1 whitespace-nowrap overflow-auto scrollbar-hide absolute -left-4 -right-4 px-4">
            <button
              v-for="(cat, i) in categories"
              :key="cat.name"
              @click="activeTab = i"
              :class="[
                'rounded-3xl border border-[#C2D3D1] text-demibold text-xs px-6 py-3 transition-colors',
                activeTab === i
                  ? 'bg-[#014439]/20 text-[#014439]'
                  : 'text-gray-700 bg-transparent hover:bg-gray-200'
              ]"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
  
        <!-- FAQ List -->
        <div class="divide-y border-gray-300 -mt-6 px-6 h-screen">
          <div
            v-for="(item, idx) in categories[activeTab].items"
            :key="idx"
            class="py-1 text-sm text-d4 text-demibold"
          >
            <button
              class="w-full flex bg-transparent justify-between items-center text-right focus:outline-none py-3"
              @click.prevent="toggle(idx)"
            >
              <span class="text-sm font-demibold text-[#2F3136]">{{ item.question }}</span>
              <svg
                :class="[
                  'w-3 h-3 transform transition-transform duration-300',
                  open.has(idx) ? 'rotate-45' : ''
                ]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
  
            <!-- Answer Container with grid-template-rows transition -->
            <div
              :class="[
                'grid overflow-hidden transition-all duration-500 sss',
                open.has(idx) ? 'max-h-56 grid-rows-[1fr]' : 'max-h-0 grid-rows-[0fr]'
              ]"
            >
            <transition name="blur">

              <div class="mt-2 text-xs text-gray-600 text-right leading-relaxed transition-all duration-500 mb-2"
              
              v-show="open.has(idx)"
              >
              <!-- :class="[open.has(idx) ? '' : 'max-h-0 grid-rows-[0fr]']" -->
              
                {{ item.answer }}
              </div>
            </transition>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface FaqItem {
    question: string
    answer: string
  }
  
  interface Category {
    name: string
    items: FaqItem[]
  }

  const categories = ref<Category[]>([
    {
      name: 'همکاری و قراردادها',
      items: [
        {
          question: 'چگونه می‌توانم سفارش خود را ثبت کنم؟',
          answer:
            'برای ثبت سفارش کافیست از طریق فرم سفارش آنلاین اطلاعات لازم را وارد کرده و ارسال نمایید. تیم ما در سریع‌ترین زمان با شما تماس خواهد گرفت.'
        },
        {
          question: 'حداقل تعداد سفارش چقدر است؟',
          answer:
            'حداقل تعداد سفارش به نوع محصول و فرآیند تولید بستگی دارد. لطفاً با بخش فروش تماس بگیرید تا شرایط دقیق را بررسی کنیم.'
        },
        {
          question: 'آیا امکان تغییر یا لغو سفارش وجود دارد؟',
          answer:
            'بله، امکان تغییر یا لغو سفارش وجود دارد، اما باید این درخواست را پیش از شروع فرآیند تولید ثبت کنید. پس از آغاز تولید، تغییر یا لغو ممکن است مشمول هزینه شود.'
        },
        {
          question: 'چگونه می‌توانم وضعیت سفارش خود را پیگیری کنم؟',
          answer:
            'وضعیت سفارش خود را می‌توانید از طریق پنل کاربری یا لینک پیگیری که پس از ثبت سفارش برای شما ارسال می‌شود، مشاهده کنید.'
        }
      ]
    },
    {
      name: 'پشتیبانی و خدمات پس از فروش',
      items: [
        {
          question: 'آیا امکان تغییر یا لغو سفارش وجود دارد؟',
          answer:
            'بله، امکان تغییر یا لغو سفارش وجود دارد، اما باید این درخواست را پیش از شروع فرآیند تولید ثبت کنید. پس از آغاز تولید، تغییر یا لغو ممکن است مشمول هزینه شود.'
        },
        {
          question: 'چگونه می‌توانم وضعیت سفارش خود را پیگیری کنم؟',
          answer:
            'وضعیت سفارش خود را می‌توانید از طریق پنل کاربری یا لینک پیگیری که پس از ثبت سفارش برای شما ارسال می‌شود، مشاهده کنید.'
        }
      ]
    },
    {
      name: 'مواد و کیفیت',
      items: [
        {
          question: 'چه نوع موادی استفاده می‌کنید؟',
          answer:
            'ما از باکیفیت‌ترین مواد اولیه داخلی و وارداتی استفاده می‌کنیم که استانداردهای جهانی را پاس می‌کنند.'
        }
      ]
    },
    {
      name: 'طراحی و مشاوره',
      items: [
        {
          question: 'آیا خدمات طراحی هم ارائه می‌دهید؟',
          answer:
            'بله، تیم طراحی ما آماده است تا براساس نیاز شما طرح‌های اختصاصی آماده کند و پس از تأیید شما پیش برود.'
        }
      ]
    },
    {
      name: 'قیمت‌گذاری و پرداخت',
      items: [
        {
          question: 'روش‌های پرداخت چیست؟',
          answer:
            'شما می‌توانید از طریق درگاه آنلاین، انتقال بانکی یا پرداخت در محل (در صورت امکان) هزینه سفارش را تسویه کنید.'
        }
      ]
    },
    {
      name: 'زمان و تحویل',
      items: [
        {
          question: 'مدت زمان تحویل چقدر است؟',
          answer:
            'زمان تحویل بسته به حجم و نوع سفارش متغیر است، اما معمولاً بین ۷ تا ۱۴ روز کاری است.'
        }
      ]
    },
    {
      name: 'فرآیند سفارش',
      items: [
        {
          question: 'فرآیند تولید از چه مراحلی تشکیل شده است؟',
          answer:
            'پس از ثبت سفارش: طراحی – تأیید طرح – تولید نمونه – تولید نهایی – بسته‌بندی و ارسال.'
        }
      ]
    },
    {
      name: 'خدمات مجموعه',
      items: [
        {
          question: 'آیا خدمات نصب دارید؟',
          answer:
            'بله، در صورت نیاز می‌توانیم تیم نصب را به محل شما اعزام کنیم (هزینه جداگانه).'
        }
      ]
    }
  ])
    
  const activeTab = ref(0)
  const open = ref<Set<number>>(new Set())
  
  function toggle(idx: number) {
    if (open.value.has(idx)) open.value.delete(idx)
    else open.value.add(idx)
  }
  </script>
  
  <style scoped>
  /* For Webkit-based browsers (Chrome, Safari and Opera) */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* For IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  .sss{

    transition:all 1s  cubic-bezier(0.3, 0.8, 0.3, 2.3) !important;
  }



/* 1) Duration & easing of the transition */
.blur-enter-active, .blur-leave-active {
  transition: filter 0.5s ease, opacity 0.5s ease;
}

/* 2) Initial state when component is inserted, or after removal */
.blur-enter-from, .blur-leave-to {
  filter: blur(10px);
  opacity: 0;
}

/* 3) Final state once the transition finishes */
.blur-enter-to, .blur-leave-from {
  filter: blur(0);
  opacity: 1;
}

  </style>








