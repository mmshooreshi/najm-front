<!-- components/aut/ProductDesignCard.vue -->
<template>
  <div ref="containerRef" class="relative flex flex-col p-6 bg-white rounded-[25px] h-[492px] overflow-hidden">
    <!-- Background Image -->
    <img ref="imageRef" src="/images/aut/box-mapping.png" alt="Box Mapping" 
         class="absolute inset-0 w-full h-full object-cover object-center" @load="updateDividerPosition" />

    <!-- Divider positioned using computed left offset -->
    <div class="absolute" 
         :style="{ left: dividerLeft, top: '0', bottom: '0', width: '2px', backgroundColor: '#eceff1' }"></div>
    <div class="absolute" 
         :style="{ left: dividerLeft, top: '50%', transform: 'translate(-50%, -50%)' }">
      <div class="flex items-center justify-center w-14 h-14 bg-white rounded-[20px] border border-[#ffffff80]">
        <img src="https://dashboard.codeparrot.ai/api/image/Z8LZelj1kitRpYPc/reflect.png" alt="reflect" class="w-6 h-6" />
      </div>
    </div>

    <!-- Content Overlay -->
    <div class="relative flex flex-col h-full">
      <!-- Header Section -->
      <div class="flex flex-col gap-6">
        <div class="flex justify-start">
          <div class="flex items-center justify-center w-10 h-10 rounded-full  bg-[#eafed3]/100  p-2">
            <img src="https://dashboard.codeparrot.ai/api/image/Z8LZelj1kitRpYPc/palette.png" alt="palette" class="w-6 h-6" />
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs font-medium text-black">طراحی گرافیکی خلاقانه</p>
        </div>
        <div class="flex flex-col gap-2 text-right">
          <h1 class="text-2xl font-extrabold text-black">طرح ما، محصول تو!</h1>
          <h2 class="text-xl font-extrabold text-[#014439]">رنگ و هویتی که برندتو متمایز می‌کنه</h2>
        </div>
      </div>

      <!-- Bottom Section -->
        <div class="flex flex-row justify-between items-center mt-auto">
        <button class="flex items-center rounded-[25px] py-3 px-6 bg-white hover:bg-gray-50 transition-colors">
          <span class="text-xs sm:text-base font-semibold text-nowrap">سفارش طراحی گرافیک اختصاصی</span>
        </button>
        <div class="flex items-center rounded-[25px] py-3 px-6">
          <img src="https://dashboard.codeparrot.ai/api/image/Z8LZelj1kitRpYPc/frame-32.png" alt="frame" class="w-9 h-[21px]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';

const imageRef = ref<HTMLImageElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const dividerLeft = ref('0px');

function updateDividerPosition() {
  const img = imageRef.value;
  const container = containerRef.value;
  if (!img || !container) return;

  // Get the natural dimensions of the image
  const naturalWidth = img.naturalWidth;
  const naturalHeight = img.naturalHeight;

  // Get container dimensions
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // For object-fit: cover, the image is scaled to cover the container.
  // Calculate the scale factor for both dimensions then take the larger one.
  const scale = Math.max(containerWidth / naturalWidth, containerHeight / naturalHeight);

  // Determine the full width of the image after scaling
  const scaledImageWidth = naturalWidth * scale;

  // Calculate the horizontal cropping offset (if any)
  const offsetX = (scaledImageWidth - containerWidth) / 2;

  // Calculate the position in the scaled image that corresponds to 41% of the full image width
  const targetPosition = naturalWidth * 0.42 * scale;

  // Adjust for the cropping offset to get the position relative to the container
  const dividerPos = targetPosition - offsetX;
  dividerLeft.value = dividerPos + 'px';
}

onMounted(() => {
  nextTick(() => {
    updateDividerPosition();
    window.addEventListener('resize', updateDividerPosition);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDividerPosition);
});
</script>

<style scoped>
@font-face {
  font-family: 'IRANSansX';
  /* src: url('/fonts/IRANSansX.woff2') format('woff2'); */
  font-weight: 400;
}

* {
  font-family: 'IRANSansX', sans-serif;
  direction: rtl;
}
</style>
