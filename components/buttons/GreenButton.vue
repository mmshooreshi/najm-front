<script setup lang="ts">

const props = defineProps({
  label:     { type: String,  default: 'Click me' },
  fullWidth: { type: Boolean, default: false },
  bgColor:   { type: String,  default: 'transparent' },
  textColor: { type: String,  default: 'black' }
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(e: MouseEvent) {
  emit('click', e)
}

</script>

<template>
  <div v-motion :initial="{scale: 0,}" :visible="{scale: 1,}"   class="curwor-pointer  space-y-6 flex flex-col items-center">
    <!-- Animated Element -->
     
    <div
    
      class="group  active:scale-100 hover:scale-110  transition-all bg-[#014439] text-white cursor-pointer inline-flex items-center justify-center h-12 px-6 mx-auto rounded-2xl  outline-none"
    >
    <div class="text-sm group-hover:scale-102 text-demibold text-d4 group-active:scale-100 transition-all">
    {{ label }}
    </div>
  </div>
    <!-- rounded-3xl border-8 border-indigo-400 bg-indigo-500 shadow-xl cursor-pointer -->

  </div>
</template>



<!-- 



<template>
  <div
    v-if="isMounted"
    ref="btnn"
    v-motion
    :initial="{ opacity: 0, y: 100 }"
    :enter="{ opacity: 1, y: 0, scale: 1 }"
    :variants="{ custom: { scale: 2 } }"
    :hovered="{ scale: 1.2 }"
    :delay="200"
    :duration="1200"

    class="hover:bg-[#014439] bg-[#014439]/90 text-white cursor-pointer inline-flex items-center justify-center h-12 px-6 mx-auto rounded-2xl text-sm font-semibold border border-black outline-none z-10"
    @click="handleClick"
  >
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue'

const btnn = ref<HTMLElement | null>(null)
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const props = defineProps({
  label:     { type: String,  default: 'Click me' },
  fullWidth: { type: Boolean, default: false },
  bgColor:   { type: String,  default: 'transparent' },
  textColor: { type: String,  default: 'black' }
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(e: MouseEvent) {
  emit('click', e)
}
</script> -->
