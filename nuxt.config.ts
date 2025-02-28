// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import ViteComponents from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Najm Printing',
      link: [{ rel: 'icon', type: 'image/*', href: '/favicon.svg' }]
    }
  },
  build: {
    transpile: ['gsap'],
  },

  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
    'unplugin-icons/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    // '@hypernym/nuxt-gsap',
    "v-gsap-nuxt",
    "nuxt-shiki",
    'nuxt-swiper'
  ],

  features: {
    inlineStyles: false,
  },
  // gsap: {
  //   composables: true
  // },
  vgsap: {
    presets: [],
    breakpoint: 768,
    scroller: "",  // Now correctly targeting scroll container
    composable: true
 }, 

  css: ['~/assets/css/main.css', '~/assets/css/shiki.css'],

  vite: {
    plugins: [
      require('vite-svg-loader')(),
      ViteComponents({
        resolvers: [
          IconsResolver({
            componentPrefix: ''
          })
        ],
        dts: true
      })
    ]
  },

  compatibilityDate: '2025-02-18'
})