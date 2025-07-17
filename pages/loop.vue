<template>
  <main class="flex justify-center py-10 w-full ">
            <!-- <AnimatedImageStrip :fps="6" debug :ramp="0.7" /> -->

      <div class="flex flex-wrap  h-screen overflow-auto w-full justify-center gap-4">
        <!-- Generate AnimatedImageStrip components for media paths 01 through 50 -->
        <div class="w-60" v-for="i in 50">
        <AnimatedImageStrip
          :fps="3"
          :ramp="0.4"
          :key="i"
          :autoplay="false"
          :hover-play="true"
          :path="`media/${String(i).padStart(2, '0')}/avif-big`"
        />
        {{`media/${String(i).padStart(2, '0')}/avif-big`}}
        </div>
      </div>
  </main>
</template>

<script lang="ts" setup>
import AnimatedImageStrip from '@/components/loop/AnimatedImageStrip.vue'

definePageMeta({ layout: 'raw' })
</script>

<style scoped>
main {
  min-height: 100vh;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
