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

  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
    'unplugin-icons/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    // '@hypernym/nuxt-gsap',
    "v-gsap-nuxt",
    "nuxt-shiki"
  ],

  features: {
    inlineStyles: false,
  },

  vgsap: {
    presets: [],
    breakpoint: 768,
    scroller: '',
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