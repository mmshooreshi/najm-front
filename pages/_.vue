<!-- pages/_.vue -->
<template>
  <div class="carousel">
    <div
      class="card relative max-h-[400px] overflow-hidden rtl"
      v-for="card in cards"
      :key="card.id"
    >
      <NuxtImg
        :src="card.image"
        :alt="`Card ${card.id}`"
        class="object-cover w-full h-full"
      />
      <!-- full-cover overlay -->
      <div class="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center p-4">
        <p class="text-white text-center">
          {{ card.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const cards = [
  { id: 1, image: '/images/sections/cards/1.png', text: 'یه جعبه می‌خوام که از محصولم محافظت کنه تا توی انبار و هنگام ارسال آسیبی نبینه.' },
  { id: 2, image: '/images/sections/cards/2.png', text: 'برام مهمه که لیبل‌ها دقیق باشن، چون باید بره انبارداری مرکزی.' },
  { id: 3, image: '/images/sections/cards/3.png', text: 'بسته‌بندی باید در حدی تمیز و مرتب باشه که حس پرمیوم بده، بدون نیاز به بازنگری.' },
  { id: 4, image: '/images/sections/cards/4.png', text: 'جعبه‌ها باید مستقیم برن تو قفسه، زمان بازچینی ندارم.' },
  { id: 5, image: '/images/sections/cards/5.png', text: 'چاپ متن‌ها و نمودارهای آموزشی باید با دقت کامل باشه، چون مخاطب جزئی‌نگره.' },
  { id: 6, image: '/images/sections/cards/6.png', text: 'باید مطمئن باشم استانداردهای چاپ و بسته‌بندی بین‌المللی رعایت می‌شه.' },
  { id: 7, image: '/images/sections/cards/7.png', text: 'تجربه بدی داشتم، رنگ نهایی هیچ‌وقت مثل طراحی من نشده.' },
  { id: 8, image: '/images/sections/cards/8.png', text: 'باید با ظاهر بسته‌بندیم مخاطب جذب شه، نمی‌خوام مثل بقیه باشم.' },
  { id: 9, image: '/images/sections/cards/9.png', text: 'دنبال یه جعبه‌ خاص‌ام که باز شدنش حس غافلگیری بده.' },
  { id: 10, image: '/images/sections/cards/1.png', text: 'بسته‌بندی من باید هم خوش‌دست باشه هم سریع باز شه، چون مشتری عجوله.' }
]
</script>

<style scoped>
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 1rem;
}
.card {
  flex: 0 0 80%;
  scroll-snap-align: start;
  margin-right: 1rem;
  background: #fff;
  border-radius: 15px;
  /* box-shadow: 0 2px 6px rgba(0,0,0,0.1); */
  /* padding: 1rem; */
}
.card img {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
/* Responsive: show more cards on wider screens */
@media (min-width: 600px) {
  .card { flex: 0 0 45%; }
}
@media (min-width: 900px) {
  .card { flex: 0 0 30%; }
}
</style>
