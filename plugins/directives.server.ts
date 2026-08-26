// plugins/directives.server.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const ssrDirective = {
    getSSRProps() {
      return {}
    }
  }

  const directiveNames = [
    'editable',
    'memotion-pop-visible',
    'floating',
    'motion',
    'pop-visible',
    'motion-pop',
    'motion-pop-visible',
    'motion-fade',
    'motion-slide',
    'pop-up'
  ]

  for (const name of directiveNames) {
    nuxtApp.vueApp.directive(name, ssrDirective)
  }
})
