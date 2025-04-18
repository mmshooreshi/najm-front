<template>
  <div class="space-y-6 pt-12">
        <div class="flex flex-col md:flex-row gap-8 lg:gap-[352px] rtl">
          <h1 class="text-4xl text-d4 font-bold">محصولات</h1>
          <p class="text-xl text-d4 font-regular text-black">
            هر سبک جعبه برای نمایش محصول منحصر به فرد شما طراحی شده است. 
            برش ها و پنجره های سفارشی را اضافه کنید. 
          </p>
        </div>

        <div class="grid grid-cols-12 gap-6 rtl">
          <div class="col-span-12 sm:col-span-6  md:col-span-3 font-bold text-md my-auto invisible md:visible">فیلتر محصولات</div>
          <div class="col-span-12 sm:col-span-6  md:col-span-9 flex justify-between ">
            <div @click="isSortOptionsOpen = !isSortOptionsOpen" class="bg-transparent border border-1 border-[#C2D3D1] cursor-pointer hover:bg-[#C2D3D1]/20 rounded-3xl flex items-center gap-1 p-2 h-max my-auto md:px-4 md:gap-2 md:py-2 text-xs md:text-base">
              مرتب سازی

              <div  class="flex justify-center items-center w-6 h-6 transition-transform" :class="{ 'rotate-180': isSortOptionsOpen }">
                <ChevronDownIcon class="transition-all duration-300" />
            </div>
            </div>
            <div v-if="views?.length" class="flex w-max items-center justify-between md:p-0.5 p-1 rounded-3xl border border-gray-300 text-xs">
              <button
              v-for="view in views"
              :key="view.key"
              class="p-1 px-2 md:py-2 md:px-3 rounded-3xl font-medium text-center hover:bg-[#CBCBFB]/20 transition-all duration-300 bg-transparent text-black"
              :class="activeView === view.key ? '!bg-[#CBCBFB]' : ''"
              @click="activeView = view.key"
            >
              <component :is="view.icon" class="scale-75" />

            </button>

            </div>

          </div>



        </div>
        <ProductLayout>
      <template #filters>
        <!-- Filters go here -->
        <h2 class="text-xl font-semibold mb-4">فیلترها</h2>
        <ul class="space-y-2">
          <li>✔️ رنگ</li>
          <li>✔️ اندازه</li>
          <li>✔️ قیمت</li>
        </ul>
      </template>
  
      <template #products>
        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ProductCard
      v-for="product in products"
      :key="product.id"
      :imageSrc="product.image"
      :title="product.name"
      :subtitle="product.subtitle"
      :buttonText="product.buttonText"
    />
        </div>
      </template>
    </ProductLayout>
  </div>
  </template>
  
  <script setup lang="ts">
  import ProductLayout from '@/components/layout/ProductsLayout'
  import ViewRowsIcon from '@/assets/icons/Views/view-rows-icon.svg'
  import ViewSquareIcon from '@/assets/icons/Views/view-square-icon.svg'
  import ChevronDownIcon from "~/assets/icons/chevron-down-icon.svg";
  import ProductCard from '@/components/products/ProductCard.vue'

const isSortOptionsOpen = ref(false)
  const views = ref(     [
      { key: 'view-square', label: 'square' , icon: ViewSquareIcon },
      { key: 'view-rows', label: 'rows' , icon: ViewRowsIcon }
    ]
)
const activeView = ref ('view-square')
interface Product {
  id: number
  image: string
  name: string
  subtitle?: string
  buttonText?: string
}

const products: Product[] = [
  {
    id: 1,
    image: '/images/products/test.png',
    name: 'محصول ۱',
    subtitle: 'حداقل ۵۰۰+ عدد',
    price: 'قیمت: ۲۰۰,۰۰۰ تومان',
    buttonText: 'نمایش ابعاد'
  },
  {
    id: 2,
    image: '/images/products/test.png',
    name: 'محصول ۲',
    subtitle: 'حداقل ۵۰۰+ عدد',
    price: 'قیمت: ۲۰۰,۰۰۰ تومان',
    buttonText: 'نمایش ابعاد'
  },
  {
    id: 3,
    image: '/images/products/test.png',
    name: 'محصول ۲',
    subtitle: 'حداقل ۵۰۰+ عدد',
    price: 'قیمت: ۲۰۰,۰۰۰ تومان',
    buttonText: 'نمایش ابعاد'
  },
  {
    id: 4,
    image: '/images/products/test.png',
    name: 'محصول ۲',
    subtitle: 'حداقل ۵۰۰+ عدد',
    price: 'قیمت: ۲۰۰,۰۰۰ تومان',
    buttonText: 'نمایش ابعاد'
  },
  {
    id: 5,
    image: '/images/products/test.png',
    name: 'محصول ۲',
    subtitle: 'حداقل ۵۰۰+ عدد',
    price: 'قیمت: ۲۰۰,۰۰۰ تومان',
    buttonText: 'نمایش ابعاد'
  },
  {
    id: 6,
    image: '/images/products/test.png',
    name: 'محصول ۲',
    subtitle: 'حداقل ۵۰۰+ عدد',
    price: 'قیمت: ۲۰۰,۰۰۰ تومان',
    buttonText: 'نمایش ابعاد'
  },
  {
    id: 7,
    image: '/images/products/test.png',
    name: 'محصول ۲',
    subtitle: 'حداقل ۵۰۰+ عدد',
    price: 'قیمت: ۲۰۰,۰۰۰ تومان',
    buttonText: 'نمایش ابعاد'
  },
  {
    id: 8,
    image: '/images/products/test.png',
    name: 'محصول ۲',
    subtitle: 'حداقل ۵۰۰+ عدد',
    price: 'قیمت: ۲۰۰,۰۰۰ تومان',
    buttonText: 'نمایش ابعاد'
  },
  {
    id: 9,
    image: '/images/products/test.png',
    name: 'محصول ۲',
    subtitle: 'حداقل ۵۰۰+ عدد',
    price: 'قیمت: ۲۰۰,۰۰۰ تومان',
    buttonText: 'نمایش ابعاد'
  }
  // …more products
]

</script>
  