// plugins/i18n.ts
import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(async ({ vueApp }) => {
  // Prevent duplicate directive 't' registration warning during SSR / HMR
  if (vueApp.directive('t') || (vueApp as any)._context?.directives?.t) {
    return
  }

  const locales = ['en', 'zh-CN', 'ja']

  const messages: any = {}

  for (const locale of locales) {
    try {
      const mod = await import(`../locales/${locale}.json`)
      messages[locale] = mod.default || mod
    } catch {
      messages[locale] = {}
    }
  }
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages
  })

  vueApp.use(i18n)
})
