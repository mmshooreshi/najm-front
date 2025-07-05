<!-- components/Base/Delay2.vue -->
<script setup lang="ts">
import { useMotions } from '@vueuse/motion'
import { useToggle } from '@vueuse/core'

const [show, toggleShow] = useToggle(true)


const motions = useMotions()
</script>

<template>
    <div class="gap-2 flex flex-col items-center justify-around">
        <button class="rounded-lg bg-indigo-600 px-4 py-2 hover:bg-indigo-400" @click="() => toggleShow()">
        Toggle
      </button>
      <transition :css="false" @leave="(_: any, done: any) => motions.transition.leave(done)">
        <div
          v-if="show"
          v-motion="'transition'"
          :initial="{
            y: 400,
            opacity: 0,
          }"
          :enter="{
            y: 0,
            opacity: 1,
          }"
          :leave="{
            y: -400,
            opacity: 0,
          }"
          class="h-24 w-24 cursor-pointer rounded-3xl border-8 border-indigo-400 bg-indigo-500 shadow-xl"
        />
      </transition>

    <div>
 
    </div>
</div>
</template>