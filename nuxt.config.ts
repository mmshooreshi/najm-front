// nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { fontPreloadLinks } from './utils/font-preload';
// import ViteComponents from 'unplugin-vue-components/vite'
// import IconsResolver from 'unplugin-icons/resolver'


export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Najm Printing',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        // keep any existing ones you had (you didn't list meta before), then add:
        { name: 'description', content: 'High quality printing solutions. Najm Printing delivers impeccable prints with speed and excellence.' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
        { name: 'theme-color', content: '#ffffff' },

        // Open Graph (can be overridden per page with useHead)
        { property: 'og:site_name', content: 'Najm Printing' },
        { property: 'og:title', content: 'Najm Printing' },
        { property: 'og:description', content: 'High quality printing solutions. Najm Printing delivers impeccable prints with speed and excellence.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://yourdomain.com' }, // replace with your canonical URL

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Najm Printing' },
        { name: 'twitter:description', content: 'High quality printing solutions. Najm Printing delivers impeccable prints with speed and excellence.' },

        // you can add og:image / twitter:image later per page or globally
      ],
      link: [
        // keep your existing favicon.svg entry
        { rel: 'icon', type: 'image/*', href: '/favicon.svg' },

        // add the standard icons (ensure these files live in /public)
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },

        // preconnect hints (optional but good)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },

        // keep your font preload links
        ...fontPreloadLinks,
      ],
      script: [
        // structured data JSON-LD (organization) without removing anything else
        {
          type: 'application/ld+json',
          children: `
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Najm Printing",
            "url": "https://yourdomain.com",
            "logo": "https://yourdomain.com/logo.png",
            "sameAs": []
          }
          `,
        },
      ],
    },
  },
  build: {
    transpile: ['gsap'],
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

  
  modules: [//  'unplugin-icons/nuxt',
    'nuxt-headlessui',
  '@pinia/nuxt', '@unocss/nuxt', '@vueuse/nuxt', '@vueuse/motion/nuxt', // '@hypernym/nuxt-gsap',
  '@nuxt/icon', // 'nuxt-lodash',
  "v-gsap-nuxt", "nuxt-shiki", 'nuxt-swiper', '@nuxtjs/strapi', '@nuxt/image', 'nuxt-mapbox'],
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
  
  features: {
    inlineStyles: false,
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


  css: ['~/assets/css/fontiran.css','~/assets/css/main.css', '~/assets/css/shiki.css'],
  runtimeConfig: {
    public: {
      pbUrl: process.env.PB_URL,
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
      headlessui: {
        prefix: 'Headless'
    },

  compatibilityDate: '2025-02-18'
})