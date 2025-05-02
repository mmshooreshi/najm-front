<template>
  <div class="page-container">
    <h1></h1>
    <div class="container ">
      <div class="cards text-d4">

        <div
          v-for="card in cards"
          :key="card.id"
          :ref="el => setCardRef(el, card.id - 1)"
        >
        <div class="card-outer bg-white h-[420px] px-8 py-0 border border-lime-400/40 rounded-3xl   max-w-sm">

          <!-- {{ card.id }} -->

              <!-- Content same as before -->

    <div class="my-8 rtl flex flex-col items-center text-center px-2">
      <div class="flex items-center justify-center w-8 h-6 px-3 py-2 pt-3 border border-black rounded-full text-xs font-medium">
        {{ card.step }}
      </div>
      <h2 class="text-md  font-extrabold text-gray-900 mt-6 leading-relaxed" v-html="card.title" />
    </div>
    <StackedCardPart :bubble="card.bubble" />
    <p class="mt-6 sm:mt-12 rtl text-d4 font-medium text-xs text-black" v-html="card.description" />
</div>
</div>
      </div>
    </div>
    <div class="container2"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cardCount  = 4;
const finalGap   = 24;   // <- gap after stacking
const initialGap = 500;  // <- gap before scrolling

const cardRefs = ref<HTMLElement[]>([]);
function setCardRef(el: HTMLElement | null, index: number) {
  if (el) cardRefs.value[index] = el;
}

  interface Card {
    id: number
    step: string
    title: string
    bubble: string
    description: string
  }
  
  const cards: Card[] = [
    {
      id: 1,
      step: '۱',
      title: 'اول از همه، فقط بگو دنبال چی هستی.',
      bubble: 'جلد کتابام ضخیمه، دنبال یه راهی‌ام که جلد خم نشه تو بسته‌بندی',
      description:
        'یه نیاز مشخص، یه دغدغه، یا حتی فقط یه ایده خام؟ از همین‌جا شروع می‌کنیم. ما گوش می‌دیم، سوال می‌پرسیم، و کمک می‌کنیم تصویر واضح‌تری از اون چیزی که می‌خوای شکل بگیره.'
    },
    {
      id: 2,
      step: '۲',
      title: 'بعد، ما همه‌چیز رو متناسب با هدفت طراحی می‌کنیم.',
      bubble: 'تجربه بدی داشتم، رنگ نهایی هیچ‌وقت مثل طراحی من نشده',
      description:
        'طراحی فقط ظاهر نیست؛ انتخاب متریال، روش تولید، اندازه، ساختار بسته‌بندی یا نوع چاپ... همه‌چیز رو با دقت و بر اساس نیاز تو برنامه‌ریزی می‌کنیم.'
    },
    {
      id: 3,  
      step: '۳',
      title: 'حالا وقت اجراست. دقیق، مرحله‌به‌مرحله، با کنترل کیفیت.',
      bubble: 'یه جعبه می‌خوام که از محصولم محافظت کنه تا توی انبار و هنگام ارسال آسیبی نبینه',
      description:
        'از لیتوگرافی تا چاپ و فرآیندهای تکمیلی، کار با تجهیزات تخصصی و نیروهای حرفه‌ای انجام می‌شه تا خروجی نه فقط زیبا، بلکه استاندارد و قابل اتکا باشه.'
    },
    {
      id: 4,
      step: '۴',
      title: 'و در نهایت، آماده‌ی تحویل!',
      bubble: 'محصول نهایی همون‌طور که باید باشه. تمیز، دقیق، و آماده برای استفاده.',
      description:
        'بعد از تأیید نهایی، تولید انبوه رو شروع می‌کنیم و طبق زمان‌بندی بهت تحویل می‌دیم.'
    }
  ]



  const getRandomRotation = () => gsap.utils.random(-5, 1);

onMounted(() => {
  ScrollTrigger.defaults({ markers: false });

  const cards = cardRefs.value;
  const start = 'center center';           // pin when card reaches centre
  const moveDistance = 1600;                // scroll distance to finish stacking

  cards.forEach((card, i) => {
    // 1. start every card 200 px lower than the previous one
    // gsap.set(card, { y: i * initialGap });

    const outer = card.querySelector('.card-outer') as HTMLElement;
    if (!outer) return;
    // const Rot = (-1) ** i * 2;
    const Rot = (-1) ** i * 2;
    
    // const finalRotation = getRandomRotation();

    gsap.set(outer, { y: i * initialGap ,     rotation: Rot    });
    // Set initial stack spacing

    // Animate to final stacked spacing
    gsap.to(outer, {
      y: i * finalGap,
      
      scrollTrigger: {
        trigger: card,
        start,
        scrub: true,
        markers: false,
      },
    });



    // 3. pin each card at the centre while it animates
    ScrollTrigger.create({
      trigger: card,
      start: 'top 120px',
      endTrigger: `.container2`,
      end: 'top 120px',
      pin: true,
      scrub: false,
      pinSpacing: false,
      markers: false,
    });
  });
});

</script>

<style scoped lang="css">
@import url('https://fonts.googleapis.com/css?family=Signika+Negative:300,400&display=swap');

.page-container {
  font-family: 'Signika Negative', sans-serif;
  font-weight: 300;
  margin: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: #f4f4f4; */
}

h1 {
  margin-bottom: 80vh;
}

.container {
  display: flex;
}



.container2 {
  margin-top: 0vh;
  width: 100%;
  height: 80vh;
  /* border-top: 1px solid red; */
}

.card-stack {
}
</style>
