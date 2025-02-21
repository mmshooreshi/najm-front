<template>
    <div dir="rtl" class="relative max-w-2xl mx-auto p-6 text-center rounded-3xl">
      <h2 class="text-2xl font-extrabold text-[#000000] text-d4">دقیق، کارآمد، بدون واسطه</h2>
      <p class="text-xs text mt-2">
        تمامی مراحل <span>چاپ</span> در مجموعه‌ی خود ما انجام میشه، بدون دخالت واسطه‌ها.
        
        ما فقط نمی‌فروشیم، ما <span>تولید</span> می‌کنیم و این یعنی:
      </p>



      <div class="mt-4 text-d4 flex flex-wrap flex-col justify-center items-center space-y-[7px] text-2xl font-black">
        <span class="highlight highlight-yellow">کیفیت بالاتر</span>
        <span class="highlight highlight-blue">کنترل بهتر روی جزئیات</span>
        <span class="highlight highlight-purple">قیمت منصفانه‌تر</span>
      </div>
      <div class="h-48 md:h-96 mt-6 py-6 relative flex flex-col items-center justify-center">
        <img src="/images/sections/printing-section-1.png" alt="Printing Machine" class="w-min absolute -z-1 w-full h-48 md:h-96 object-cover rounded-3xl " />
        <div class="group cursor-pointer transition-all bg-opacity-95 hover:bg-opacity-100 duration-300 hover:scale-105 hover:text-gray-900 w-max bottom-3 left-3 bg-white px-4 py-2 rounded-3xl shadow-md text-sm font-bold flex items-center mb-[29px]">
            <!-- Center the icon -->
            <div class="ml-2 flex justify-center items-center w-6 h-6 transition-transform -rotate-90" :class="{ 'rotate-180': isOpen }">
                <ChevronDownIcon class="group-hover:translate-y-2 transition-all duration-300" />
            </div>
            <div class="text text-xs text-demibold">چاپخانه اختصاصی ما</div>
        </div>
        <CarouselIndicator @cycleComplete="handleCycleComplete" />
    </div>
    </div>
  </template>
  
  <style scoped>
  .text {
    font-family: 'IRANSansX', sans-serif;
    font-style: normal;
  }
  .text-d4{
    font-family: 'IRANSansX-d4', sans-serif;
    font-style: normal;
  }
  
  .highlight {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0px 8px;
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1.2), box-shadow 0.4s ease-in-out;
    cursor: pointer;
  }
  
  .highlight-yellow { background: #F4FFD0; transform: rotate(-3deg); }
  .highlight-blue { background: #ADFAFF; transform: rotate(-4deg); }
  .highlight-purple { background: #B9ADFF; transform: rotate(3deg); }
  
  .highlight:hover { background: black; transform: rotate(0); color: white; }
  .text-demibold {
	font-weight: 600;
}
  </style>
  

  <script setup lang="ts">
    import ChevronDownIcon from "~/assets/icons/chevron-down-icon.svg";
    import CarouselIndicator from "~/components/new/CarouselIndicator.vue";

const handleCycleComplete = (): void => {
    console.log("Carousel completed a full cycle!");
  
};

const isOpen = ref(false);

  </script>