// nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { fontPreloadLinks } from './utils/font-preload'
// import ViteComponents from 'unplugin-vue-components/vite'
// import IconsResolver from 'unplugin-icons/resolver'

export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    // pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Najm Printing & Packaging | Quality Printing Solutions',
      htmlAttrs: {
        lang: 'en' // Default language, this can be dynamically updated
      },
      meta: [
        {
          name: 'description',
          content:
            'Najm Printing & Packaging offers high-quality printing solutions and customized packaging for businesses in Tehran, Iran.'
        },
        { name: 'robots', content: 'index, follow' },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1,maximum-scale=1'
        },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'author', content: 'Najm Printing & Packaging' },

        // Open Graph (for social media)
        { property: 'og:site_name', content: 'Najm Printing & Packaging' },
        {
          property: 'og:title',
          content: 'Najm Printing & Packaging | Quality Printing Solutions'
        },
        {
          property: 'og:description',
          content:
            'Najm Printing & Packaging offers high-quality printing solutions and customized packaging for businesses in Tehran, Iran.'
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
          content: 'Najm Printing & Packaging | Quality Printing Solutions'
        },
        {
          name: 'twitter:description',
          content:
            'Najm Printing & Packaging offers high-quality printing solutions and customized packaging for businesses in Tehran, Iran.'
        },
        {
          name: 'twitter:image',
          content: 'https://chapenajm.com/social-image.png'
        },

        // Hreflang for multiple languages
        { rel: 'alternate', hreflang: 'en', href: 'https://chapenajm.com/en' },
        { rel: 'alternate', hreflang: 'ar', href: 'https://chapenajm.com/ar' },
        { rel: 'alternate', hreflang: 'fa', href: 'https://chapenajm.com/fa' },

        // Structured Data (Organization)
        {
          type: 'application/ld+json',
          children: `
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Najm Printing & Packaging",
          "url": "https://chapenajm.com",
          "logo": "https://chapenajm.com/najm-logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+98 21 6679 7911",
            "contactType": "customer service",
            "areaServed": "IR",
            "availableLanguage": "Persian, English"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kooy-e-Mehrzad, M8F5+CC8",
            "addressLocality": "Tehran",
            "addressRegion": "Tehran Province",
            "postalCode": "12345678", // Optional, adjust if necessary
            "addressCountry": "IR"
          },
          "sameAs": [
            "https://www.facebook.com/NajmPrinting",
            "https://twitter.com/NajmPrinting",
            "https://www.linkedin.com/company/najmprinting"
          ]
        }
        `
        }
      ],
      link: [
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

        // Preconnect for external services
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },

        // Font Preload Links (existing utility)
        ...fontPreloadLinks
      ]
    }
  },

  build: {
    transpile: ['gsap']
  },
  // routeRules: {
  //     // Homepage pre-rendered at build time
  //     '/': { prerender: true },
  //   // apply to all files under /images
  //   '**/_ipx/**': {
  //     headers: {
  //       'cache-control': 'public, max-age=31536000, immutable'
  //     }
  //   },
  //   '**/main/**': {
  //     headers: {
  //       'cache-control': 'public, max-age=31536000, immutable'
  //     }
  //   },
  //   // you can add other static folders too:
  //   '/fonts/**': {
  //     headers: {
  //       'cache-control': 'public, max-age=31536000, immutable'
  //     }
  //   }
  // },

  modules: [
    //  'unplugin-icons/nuxt',
    'nuxt-headlessui',
    '@pinia/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt', // '@hypernym/nuxt-gsap',
    '@nuxt/icon', // 'nuxt-lodash',
    'v-gsap-nuxt',
    'nuxt-shiki',
    'nuxt-swiper',
    '@nuxtjs/strapi',
    '@nuxt/image',
    'nuxt-mapbox'
  ],
  strapi: {
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
      target: 'http://65.108.80.205:8090'
    }
  },

  features: {
    inlineStyles: false
  },
  // gsap: {
  //   composables: true
  // },
  //   vgsap: {
  //     presets: [],
  //     breakpoint: 768,
  //     scroller: "",  // Now correctly targeting scroll container
  //     composable: true
  //  },
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  css: [
    '~/assets/css/fontiran.css',
    '~/assets/css/main.css',
    '~/assets/css/shiki.css'
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
  // nuxt.config.ts
  icon: {
    serverBundle: {
      collections: ['mdi', 'carbon', 'mage'] // Only the ones you actually use
    }
  },
  mapbox: {
    accessToken:
      'pk.eyJ1IjoibW1zaG9vcmVzaGkiLCJhIjoiY205eGJla2tyMTB3ejJrc2Vma2VwY2VlaiJ9.PGekyHty46Af6FxyKY3HIw'
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
