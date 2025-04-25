<template>
  <section class="rtl py-16">
    <div class="max-w-4xl mx-auto flex flex-col gap-12 overflow-visible">
      <!-- Title -->
      <h2 class="text-lg md:text-xl font-bold text-center">
        مهم نیست کار چقدر پیچیده باشه، هرجای این مسیر، ما با شما هستیم.
      </h2>

      <!-- Category Tabs -->
      <div class="relative h-10">
        <div ref="tabsContainer" class="tabs-container noscroll flex gap-1 whitespace-nowrap overflow-auto scrollbar-hide absolute -left-4 -right-4 px-4"
        >
            <button
            v-for="(cat, i) in categories"
            :key="cat.name"
            @click="selectTab(i)"
            :class="[
              'rounded-3xl border text-demibold text-xs px-6 py-3 transition-colors',
              activeTab === i
                ? 'border-[#C2D3D1] bg-[#014439]/20 text-[#014439]'
                : 'border-[#C2D3D1] text-gray-700 bg-transparent hover:bg-gray-200'
            ]"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- FAQ List -->
      <div class="divide-y  border-gray-300 -mt-6 px-6 h-[70vh] overflow-auto">
 

        <ClientOnly>
    <FaqItem
       v-for="(item, idx) in categories[activeTab].items"
       :key="item.key"
       :index="idx"
       :question="item.question"
       :answer="item.answer"
       :open="activeItem === idx"
       @toggle="activeItem = activeItem === idx ? null : idx"
     />
</ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FaqItem from '@/components/Base/BaseFaqItem.vue'

interface FaqItemType {
  question: string
  answer:   string
  key: number
}
interface Category {
  name:  string
  items: FaqItemType[]
}

const categories = ref<Category[]>([
    {
      name: 'همکاری و قراردادها',
      items: [
        {
          key: 1,
          question: 'چگونه می‌توانم سفارش خود را ثبت کنم؟',
          answer:
            'برای ثبت سفارش کافیست از طریق فرم سفارش آنلاین اطلاعات لازم را وارد کرده و ارسال نمایید. تیم ما در سریع‌ترین زمان با شما تماس خواهد گرفت.'
        },
        {
          key: 2,
          question: 'حداقل تعداد سفارش چقدر است؟',
          answer:
            'حداقل تعداد سفارش به نوع محصول و فرآیند تولید بستگی دارد. لطفاً با بخش فروش تماس بگیرید تا شرایط دقیق را بررسی کنیم.'
        },
        {
          key: 3,
          question: 'آیا امکان تغییر یا لغو سفارش وجود دارد؟',
          answer:
            'بله، امکان تغییر یا لغو سفارش وجود دارد، اما باید این درخواست را پیش از شروع فرآیند تولید ثبت کنید. پس از آغاز تولید، تغییر یا لغو ممکن است مشمول هزینه شود.'
        },
        {
          key: 4,
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
          key: 5,
          question: 'آیا امکان تغییر یا لغو سفارش وجود دارد؟',
          answer:
            'بله، امکان تغییر یا لغو سفارش وجود دارد، اما باید این درخواست را پیش از شروع فرآیند تولید ثبت کنید. پس از آغاز تولید، تغییر یا لغو ممکن است مشمول هزینه شود.'
        },
        {
          key: 6,
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
          key: 7,
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
          key: 8,
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
          key: 9,
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
          key: 10,
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
          key: 11,
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
          key: 12,
          question: 'آیا خدمات نصب دارید؟',
          answer:
            'بله، در صورت نیاز می‌توانیم تیم نصب را به محل شما اعزام کنیم (هزینه جداگانه).'
        }
      ]
    }
  ])
    


const activeTab = ref(0)
const activeItem = ref<number|null>(null)
watch(activeTab, () => { activeItem.value = null })

watch(activeTab, () => {
  activeItem.value = null
})



const tabsContainer = ref<HTMLElement|null>(null)

function selectTab(i: number) {
  activeTab.value = i
  // wait for Vue to render the new “active”
  nextTick(() => {
  const container = tabsContainer.value
  if (!container) return

  const btns = container.querySelectorAll('button')
  const btn  = btns[i] as HTMLElement | undefined
  if (!btn) return

  btn.scrollIntoView({
    behavior: 'smooth',
    block:    'nearest',  // vertical stay-put
    inline:   'start',    // scroll to left edge + our CSS margin
  })
})

}

</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.tabs-container {
  /* for horizontal scrolling */
  scroll-padding-inline-start: 16px;
  /* scroll-margin-inline-start: 10px;   */

}

</style>
