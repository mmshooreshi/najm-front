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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48x48.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png'
        },
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
        { rel: 'manifest', href: '/site.webmanifest' },

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
    preset: process.env.VERCEL ? 'vercel' : undefined,
    compressPublicAssets: true,
    prerender: {
      crawlLinks: false,
      routes: ['/']
    }
  },

  experimental: {
    inlineSSRStyles: true
  },

  routeRules: {
    '/': { isr: 3600 },
    '/en': { isr: 3600 },
    '/ar': { isr: 3600 },
    '/admin': { redirect: { to: '/dash', statusCode: 301 } },
    '/admin/**': { redirect: { to: '/dash', statusCode: 301 } },
    '/dashboard': { redirect: { to: '/dash', statusCode: 301 } },
    '/dashboard/**': { redirect: { to: '/dash', statusCode: 301 } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/videos/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  },

  hooks: {
    'pages:extend'(pages) {
      const prefixes = ['en', 'ar'] as const
      const newPages: typeof pages = []

      const shouldSkip = (path: string) => {
        return (
          path.startsWith('/dash') ||
          path.startsWith('/admin') ||
          path.startsWith('/dashboard') ||
          path.startsWith('/login') ||
          path.startsWith('/verify') ||
          path.startsWith('/api') ||
          path.startsWith('/en') ||
          path.startsWith('/ar') ||
          path === '/NotFound' ||
          path === '/:catchAll(.*)*'
        )
      }

      for (const page of pages) {
        if (shouldSkip(page.path)) continue

        for (const prefix of prefixes) {
          const clonedPath = page.path === '/' ? `/${prefix}` : `/${prefix}${page.path.startsWith('/') ? page.path : '/' + page.path}`
          const clonedName = page.name ? `${prefix}-${String(page.name)}` : `${prefix}-${page.path.replace(/[^a-zA-Z0-9_-]/g, '_')}`

          const cloned: any = {
            ...page,
            name: clonedName,
            path: clonedPath,
            meta: {
              ...(page.meta || {}),
              locale: prefix.toUpperCase(),
              isLocalePrefixed: true
            }
          }

          if (page.children && page.children.length > 0) {
            cloned.children = page.children.map((child: any) => ({
              ...child,
              name: child.name ? `${prefix}-${String(child.name)}` : undefined,
              meta: {
                ...(child.meta || {}),
                locale: prefix.toUpperCase(),
                isLocalePrefixed: true
              }
            }))
          }

          newPages.push(cloned)
        }
      }

      pages.push(...newPages)
    }
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
    'nuxt-delay-hydration',
    '@nuxtjs/fontaine',
    '@vercel/analytics',
    '@vercel/speed-insights'

  ],
  delayHydration: {
    mode: 'init', // delays hydration until idle or first interaction
    debug: process.env.NODE_ENV === 'development'
  },
  fontMetrics: {
    fonts: ['IRANSansX'] // matches fallback font metrics to prevent any font-swap CLS
  },


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
      scrollBehaviorType: 'auto'
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
  vite: {
    build: {
      chunkSizeWarningLimit: 2000,
      cssMinify: 'esbuild',
      cssCodeSplit: false
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
    format: ['webp', 'avif'],
    quality: 80
  },
  headlessui: {
    prefix: 'Headless'
  },

  compatibilityDate: '2025-02-18'
})
