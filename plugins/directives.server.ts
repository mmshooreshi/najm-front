// plugins/directives.server.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const ssrDirective = {
    getSSRProps() {
      return {}
    }
  }

  // All custom directives used across components, templates, and client plugins
  const customDirectives = [
    'editable',
    'media-editable',
    'floating',
    'click-outside',
    'motion',
    'motion-pop',
    'motion-pop-visible',
    'motion-pop-visible-once',
    'memotion-pop-visible',
    'memotion-pop-pop',
    'memotion-pop-spring',
    'memotion-pop-cards',
    'memotion-pop-text',
    'pop-cards',
    'pop-text',
    'pop-visible',
    'pop-pop',
    'pop-spring',
    'pop-bottom',
    'gsap',
    'saved-flash'
  ]

  for (const name of customDirectives) {
    if (!nuxtApp.vueApp.directive(name)) {
      nuxtApp.vueApp.directive(name, ssrDirective)
    }
  }

  // Fallback Proxy on directives context to guarantee 0 SSR crashes for any unrecognized directive
  if (nuxtApp.vueApp._context && nuxtApp.vueApp._context.directives) {
    const originalDirectives = nuxtApp.vueApp._context.directives
    nuxtApp.vueApp._context.directives = new Proxy(originalDirectives, {
      get(target, prop, receiver) {
        if (typeof prop === 'string' && !(prop in target)) {
          return ssrDirective
        }
        return Reflect.get(target, prop, receiver)
      }
    })
  }
})
