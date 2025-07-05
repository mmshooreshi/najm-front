<!-- pages/cards_scale.client.vue -->
<!-- src/components/EmblaCarouselScale.vue -->
<template>
  <div class="embla" ref="emblaRef">
    <div class="embla__container">
      <div
        class="embla__slide scale-slide"
        v-for="card in cards"
        :key="card.id"
      >
        <NuxtImg
          :src="card.image"
          :alt="`Card ${card.id}`"
          class="object-cover w-full h-full"
          lazy
        />
        <div class="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center p-4">
          <p class="text-white text-center">{{ card.text }}</p>
        </div>
      </div>
    </div>

    <button class="embla__button embla__button--prev" @click="scrollPrev" :disabled="!canScrollPrev">‹</button>
    <button class="embla__button embla__button--next" @click="scrollNext" :disabled="!canScrollNext">›</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: false,
  align: 'start',
})

const canScrollPrev = ref(false)
const canScrollNext = ref(false)

function updateButtons() {
  canScrollPrev.value = emblaApi.value.canScrollPrev()
  canScrollNext.value = emblaApi.value.canScrollNext()
}

function scrollPrev() { emblaApi.value.scrollPrev() }
function scrollNext() { emblaApi.value.scrollNext() }

onMounted(() => {
  emblaApi.value.on('scroll', () => {
    const center = emblaApi.value.slideNodes().length / 2
    emblaApi.value.slidesInView().forEach((slide) => {
      const distance = Math.abs(emblaApi.value.slideNodes().indexOf(slide) - emblaApi.value.selectedScrollSnap())
      const scale = 1 - Math.min(distance * 0.1, 0.2)
      slide.style.transform = `scale(${scale})`
    })
  })

  emblaApi.value.on('select', updateButtons)
  updateButtons()
})
</script>

<style scoped>
.embla { position: relative; overflow: hidden; padding: 1rem 0 }
.embla__container { display: flex }
.scale-slide { transition: transform 0.3s ease }
.embla__button { /* same as your base */ }
/* breakpoints… */
</style>
