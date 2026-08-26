// plugins/directives.server.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const ssrDirective = {
    getSSRProps() {
      return {}
    }
  }

  // Directives that are registered in client-only plugins and need SSR dummy fallback
  const customDirectives = [
    'editable',
    'floating',
    'memotion-pop-visible',
    'memotion-pop-pop',
    'memotion-pop-spring',
    'memotion-pop-cards',
    'memotion-pop-text'
  ]

  for (const name of customDirectives) {
    if (!nuxtApp.vueApp._context.directives[name]) {
      nuxtApp.vueApp.directive(name, ssrDirective)
    }
  }
})
