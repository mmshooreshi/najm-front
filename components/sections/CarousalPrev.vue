<template>
    <div class="h-48 md:h-96 mt-6 py-6 relative flex flex-col items-center justify-center">
    <img src="/images/sections/printing/printing-section-1.png" alt="Printing Machine" class="w-min absolute -z-1 w-full h-48 md:h-96 object-cover rounded-3xl " />
    <div class="group cursor-pointer transition-all bg-opacity-95 hover:bg-opacity-100 duration-300 hover:scale-105 hover:text-gray-900 w-max bottom-3 left-3 bg-white px-4 py-2 rounded-3xl shadow-md text-sm font-bold flex items-center mb-[29px]">
        <!-- Center the icon -->
        <div class="text text-xs text-demibold">چاپخانه اختصاصی ما</div>

        <div class="ml-2 flex justify-center items-center w-6 h-6 transition-transform -rotate-90" :class="{ 'rotate-180': isOpen }">
            <ChevronDownIcon class="group-hover:translate-y-2 transition-all duration-300" />
        </div>
    </div>
    <CarouselIndicator @cycleComplete="handleCycleComplete" />
</div>
</template>

  

<script setup lang="ts">
import ChevronDownIcon from "~/assets/icons/chevron-down-icon.svg";
import CarouselIndicator from "~/components/new/CarouselIndicator.vue";

const handleCycleComplete = (): void => {
console.log("Carousel completed a full cycle!");

};

const isOpen = ref(false);

</script>