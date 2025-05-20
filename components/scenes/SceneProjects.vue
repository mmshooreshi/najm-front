
 <!-- components/scenes/SceneProjects.vue  -->
 <template>
  <div class="snap-start flex flex-col flex-grow  w-full h-full  gap-12  pt-12">
    <SceneHeading :data="data" align="right"/>
    <!-- <ClientOnly> -->
    <EmblCards :cards="cards"/>
    
    <!-- </ClientOnly> -->
    
  </div>
</template>

<script setup lang="ts">
import SceneHeading from '~/components/scenes/SceneHeading.client.vue'
import EmblCards  from '@/components/cards/EmblCards.vue'
const data = {
  label : "پروژه‌ها",
  header: "توی نجم هر ایده‌ای رو می‌شه چاپ کرد!",
  description1: "طراحی خوب مهمه، اما ما به چیزی فراتر از طراحی فکر می‌کنیم",
  description2: "ما به اجرای دقیق و نتیجه‌گرا اهمیت می‌دیم.",
}


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
</script>

