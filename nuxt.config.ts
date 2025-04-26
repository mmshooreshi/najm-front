// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
// import ViteComponents from 'unplugin-vue-components/vite'
// import IconsResolver from 'unplugin-icons/resolver'

export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Najm Printing',
      link: [
        { rel: 'icon', type: 'image/*', href: '/favicon.svg' },
        { rel: 'preload', href: '/fonts/woff2/IRANSansX-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/woff2/IRANSansX-Bold.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/woff2/IRANSansX-Medium.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/woff2/IRANSansX-Light.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
      ]

    }
  },
  build: {
    transpile: ['gsap'],
  },

  
  modules: [ '@pinia/nuxt', //  'unplugin-icons/nuxt',
  '@vueuse/nuxt', '@vueuse/motion/nuxt', '@nuxt/icon', // '@hypernym/nuxt-gsap',
  "v-gsap-nuxt", // 'nuxt-lodash',
  "nuxt-shiki", 'nuxt-swiper', '@nuxtjs/strapi', '@nuxt/image', 'nuxt-mapbox','@unocss/nuxt'],
  strapi:{
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    token: process.env.STRAPI_TOKEN || undefined,
    prefix: '/api',
    admin: '/admin',
    version: 'v5',
    cookie: {},
    cookieName: 'strapi_jwt'
  },
  proxy: {
    '/najm/': {
        target: "http://65.108.80.205:8090"
    }
},
  unocss: {
    configFile: './unocss.config.ts'
  
  },
  
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
 router: {
  options: {
    scrollBehaviorType: 'smooth'
  }
},


  css: ['~/assets/css/fontiran.css','~/assets/css/main.css', '~/assets/css/shiki.css'],
  runtimeConfig: {
    public: {
      motion: {
        directives: {
          'pop-bottom': {
            initial: {
              scale: 0,
              opacity: 0,
              y: 100,
            },
            visible: {
              scale: 1,
              opacity: 1,
              y: 0,
            }
          }
        }
      }
    }
  },
// nuxt.config.ts
icon: {
  serverBundle: {
  collections: ['mdi', 'carbon', 'mage'] // Only the ones you actually use
  }
},
mapbox: {
  accessToken: 'pk.eyJ1IjoibW1zaG9vcmVzaGkiLCJhIjoiY205eGJla2tyMTB3ejJrc2Vma2VwY2VlaiJ9.PGekyHty46Af6FxyKY3HIw'
},
  vite: {
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('nuxt')) return 'nuxt-vendor'
                if (id.includes('vue')) return 'vue-vendor'
                if (id.includes('gsap')) return 'gsap'
                return 'vendor'
              }
            }
          }
        }
      },
    
    optimizeDeps: {
      include: ["gsap/ScrollSmoother"] // Ensure GSAP plugins are included
    },
    plugins: [
      require('vite-svg-loader')(),
      // ViteComponents({
      //   dts: true
      // })
    ]
  },
  image: {
    // Options
  },
  compatibilityDate: '2025-02-18'
})