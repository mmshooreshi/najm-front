// nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { fontPreloadLinks } from './utils/font-preload'
// import ViteComponents from 'unplugin-vue-components/vite'
// import IconsResolver from 'unplugin-icons/resolver'

export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: false,
    head: {
      title: 'مجتمع چاپ و بسته‌بندی نجم | چاپ افست ۵ رنگ هایدلبرگ و جعبه‌سازی صنعتی',
      htmlAttrs: {
        lang: 'fa-IR',
        dir: 'rtl'
      },
      meta: [
        {
          name: 'description',
          content:
            'مجتمع چاپ و بسته‌بندی نجم؛ طراحی و تولید انواع جعبه‌های مقوایی، هاردباکس و بسته‌بندی‌های لوکس با بالاترین کیفیت چاپ در تهران.'
        },
        { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        { name: 'theme-color', content: '#115247' },
        { name: 'author', content: 'مجتمع چاپ و بسته‌بندی نجم' },

        // Open Graph (for social media)
        { property: 'og:site_name', content: 'مجتمع چاپ و بسته‌بندی نجم' },
        {
          property: 'og:title',
          content: 'مجتمع چاپ و بسته‌بندی نجم | چاپ افست و جعبه‌سازی'
        },
        {
          property: 'og:description',
          content:
            'مجتمع چاپ و بسته‌بندی نجم؛ طراحی و تولید انواع جعبه‌های مقوایی، هاردباکس و بسته‌بندی‌های لوکس با بالاترین استانداردهای چاپ.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://chapenajm.com' },
        {
          property: 'og:image',
          content: 'https://chapenajm.com/social-image.png'
        },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'مجتمع چاپ و بسته‌بندی نجم | چاپ افست و جعبه‌سازی'
        },
        {
          name: 'twitter:description',
          content:
            'مجتمع چاپ و بسته‌بندی نجم؛ طراحی و ساخت انواع جعبه مقوایی، هاردباکس و بسته‌بندی لوکس با کیفیت ممتاز در تهران.'
        },
        {
          name: 'twitter:image',
          content: 'https://chapenajm.com/social-image.png'
        }
      ],
      link: [
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLM Knowledge File' },
        { rel: 'icon', type: 'image/*', href: '/favicon.svg' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png'
        },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          href: '/android-chrome-192x192.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '512x512',
          href: '/android-chrome-512x512.png'
        },

        // Font Preload Links (optimized utility)
        ...fontPreloadLinks
      ]
    }
  },
  sourcemap: {
    server: false,
    client: false
  },

  nitro: {
    preset: 'vercel',
    compressPublicAssets: true,
    prerender: {
      crawlLinks: false
    }
  },

  routeRules: {
    '/': { isr: 3600 },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/videos/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  },

  build: {
    transpile: ['gsap']
  },

  modules: [
    'nuxt-headlessui',
    '@pinia/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/icon',
    'v-gsap-nuxt',
    'nuxt-swiper',
    '@nuxt/image',
    'nuxt-mapbox'
  ],
  proxy: {
    '/najm/': {
      target: 'http://65.108.80.205:8090'
    }
  },

  features: {
    inlineStyles: true
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  css: [
    '~/assets/css/fontiran.css',
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      pbUrl: process.env.PB_URL,
      motion: {
        directives: {
          'pop-bottom': {
            initial: {
              scale: 0,
              opacity: 0,
              y: 100
            },
            visible: {
              scale: 1,
              opacity: 1,
              y: 0
            }
          }
        }
      }
    }
  },
  icon: {
    serverBundle: {
      collections: ['mdi', 'carbon', 'tabler']
    },
    clientBundle: {
      scan: true,
      sizeLimitKb: 256
    }
  },
  mapbox: {
    accessToken:
      'pk.eyJ1IjoibW1zaG9vcmVzaGkiLCJhIjoiY205eGJla2tyMTB3ejJrc2Vma2VwY2VlaiJ9.PGekyHty46Af6FxyKY3HIw'
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 2000,
      cssMinify: 'esbuild'
    },

    optimizeDeps: {
      include: ['gsap/ScrollSmoother'] // Ensure GSAP plugins are included
    },
    plugins: [
      require('vite-svg-loader')()
      // ViteComponents({
      //   dts: true
      // })
    ]
  },
  image: {
    // Options
  },
  headlessui: {
    prefix: 'Headless'
  },

  compatibilityDate: '2025-02-18'
})
