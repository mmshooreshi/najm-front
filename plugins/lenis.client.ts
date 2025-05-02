// plugins/lenis.client.ts
import Lenis from '@studio-freight/lenis'
import type { LenisOptions } from '@studio-freight/lenis'

import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
//   const options: LenisOptions & { smoothTouch?: boolean } = {
//     duration: 1.1,
//     gestureOrientation: 'vertical',
//     smoothTouch: true           // <— still works at runtime
//   }

//   const lenis = new Lenis(options)

//   // keep GSAP in sync
//   lenis.on('scroll', ScrollTrigger.update)
//   gsap.ticker.add((t) => lenis.raf(t * 1000))
//   gsap.ticker.lagSmoothing(0)

//   /** expose through Nuxt inject */
//   nuxtApp.provide('lenis', lenis)
})

/* ── type augmentation ─────────────────────────────────────────── */
declare module '#app' {
  interface NuxtApp {
    $lenis: Lenis
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $lenis: Lenis
  }
}
