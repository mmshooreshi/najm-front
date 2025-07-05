<!-- pages/__.vue -->
<!-- src/components/EmblaCarousel.vue -->
<template>
  <div class="embla" ref="emblaRef">
    <div class="embla__container">
      <div
        class="group embla__slide relative max-h-[400px] overflow-hidden rtl" 
        v-for="card in cards"
        :key="card.id"
        v-memotion-pop-spring="{ delay: (card.id+5)%5*0.1, duration: 0.8 }" 
      >
        <NuxtImg :src="card.image" :alt="`Card ${card.id}`" class="object-cover w-full h-full" />
        <div class="cursor-pointer absolute inset-0 duration-300 group-hover:bg-red-500/50 transition-all  bg-opacity-50 flex items-center justify-center p-4">
        <p class="invisible group-hover:visible duration-500 transition-all text-white text-center">
          {{ card.text }}
        </p>
      </div>
      </div>
    </div>
  </div>

  <!-- Optional Prev/Next buttons -->
  <button class="embla__button embla__button--prev" @click="scrollPrev" :disabled="!canScrollPrev">
    ‹
  </button>
  <button class="embla__button embla__button--next" @click="scrollNext" :disabled="!canScrollNext">
    ›
  </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'

const cards = [
  { id: 1,  image: '/images/sections/cards/1.png',  text: 'یه جعبه می‌خوام که از محصولم محافظت کنه تا توی انبار و هنگام ارسال آسیبی نبینه.' },
  { id: 2,  image: '/images/sections/cards/2.png',  text: 'برام مهمه که لیبل‌ها دقیق باشن، چون باید بره انبارداری مرکزی.' },
  { id: 3,  image: '/images/sections/cards/3.png',  text: 'بسته‌بندی باید در حدی تمیز و مرتب باشه که حس پرمیوم بده، بدون نیاز به بازنگری.' },
  { id: 4,  image: '/images/sections/cards/4.png',  text: 'جعبه‌ها باید مستقیم برن تو قفسه، زمان بازچینی ندارم.' },
  { id: 5,  image: '/images/sections/cards/5.png',  text: 'چاپ متن‌ها و نمودارهای آموزشی باید با دقت کامل باشه، چون مخاطب جزئی‌نگره.' },
  { id: 6,  image: '/images/sections/cards/6.png',  text: 'باید مطمئن باشم استانداردهای چاپ و بسته‌بندی بین‌المللی رعایت می‌شه.' },
  { id: 7,  image: '/images/sections/cards/7.png',  text: 'تجربه بدی داشتم، رنگ نهایی هیچ‌وقت مثل طراحی من نشده.' },
  { id: 8,  image: '/images/sections/cards/8.png',  text: 'باید با ظاهر بسته‌بندیم مخاطب جذب شه، نمی‌خوام مثل بقیه باشم.' },
  { id: 9,  image: '/images/sections/cards/9.png',  text: 'دنبال یه جعبه‌ خاص‌ام که باز شدنش حس غافلگیری بده.' },
  { id: 10, image: '/images/sections/cards/1.png', text: 'بسته‌بندی من باید هم خوش‌دست باشه هم سریع باز شه، چون مشتری عجوله.' }
]

// initialize Embla with options
const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: false,
  align: 'start',
  speed: 5
})

// reactive state for buttons
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

function updateButtons() {
  if (!emblaApi.value) return
  canScrollPrev.value = emblaApi.value.canScrollPrev()
  canScrollNext.value = emblaApi.value.canScrollNext()
}

function scrollPrev() {
  emblaApi.value && emblaApi.value.scrollPrev()
}
function scrollNext() {
  emblaApi.value && emblaApi.value.scrollNext()
}

onMounted(() => {
  emblaApi.value && emblaApi.value.on('select', updateButtons)
  updateButtons()
})
</script>

<style scoped>
.embla {
  position: relative;
  overflow: hidden;
  padding: 1rem 0;
}
.embla__container {
  display: flex;
}
.embla__slide {
  position: relative;
  flex: 0 0 80%;
  margin-inline: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  /* padding: 1rem; */
  will-change: transform;
}
.embla__slide img {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

/* Responsive: show more slides at breakpoints */
@media (min-width: 600px) {
  .embla__slide { flex: 0 0 45%; }
}
@media (min-width: 900px) {
  .embla__slide { flex: 0 0 30%; }
}

/* Prev/Next buttons */
.embla__button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.8);
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  user-select: none;
}
.embla__button:disabled {
  opacity: 0.3;
  cursor: default;
}
.embla__button--prev { left: 0.5rem; }
.embla__button--next { right: 0.5rem; }
</style>
