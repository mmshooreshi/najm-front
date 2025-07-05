<!-- components/StackedCardPart.vue -->
<!-- components/PersianChatBubble.vue -->
<template>
  <!-- Full‑width wrapper to keep the bubble centered on the page -->
  <section class="rtl w-full  flex items-center justify-center bg-white">
    <!-- Rotate the whole block to achieve the skewed look -->
    <div class="relative flex flex-col items-center ">
      <!-- Speech bubble (HTML comes straight from the card data) -->
      <div
        class="speech-bubble text-white text-xs"
        v-html="bubble"
      />

      <!-- Overlapping round badge with your existing SVG icon inside -->
      <span
        class="absolute -top-1 right-[5%] -translate-x-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-[#014439]"
      >
        <CheckIconSvg class="" />
      </span>

      <!-- Decorative blob underneath (your own SVG) -->
      <DecorBlobSvg class="animdur -mt-3 -ml-9 h-14 w-full" />
    </div>
  </section>
</template>

<script setup lang="ts">
// Accepts the bubble text (HTML) as a prop
// Example usage: <PersianChatBubble :bubble="card.bubble" />

defineProps<{ bubble: string }>()

// Import your existing SVG components (names are placeholders)
import CheckIconSvg from '~/assets/svg/CheckIcon.svg'
import DecorBlobSvg from '~/assets/svg/DecorBlob.vue'
</script>

<!-- Styling is handled entirely with UnoCSS utility classes → no extra CSS here -->


<style scoped>
.speech-bubble {/* Frame 507 */
/* Frame 507 */

/* Auto layout */
display: flex;
flex-direction: row;
align-items: center;
padding: 11px 16px;
gap: 4px;

position: relative;
width: 181px;
height: 76px;
top: 12px;

background: #826DFB;
box-shadow: 0px 80px 32px rgba(80, 5, 255, 0.01), 0px 45px 27px rgba(80, 5, 255, 0.05), 0px 20px 20px rgba(80, 5, 255, 0.09), 0px 5px 11px rgba(80, 5, 255, 0.1);
border-radius: 25px 5px 25px 25px;
transform: rotate(6deg);

}


</style>