// composables/usePB.ts
import PocketBase from 'pocketbase'
export function usePB () {
  // Nuxt’s inject/provide is attached to nuxtApp.provide('pb', pb)
  const { $pb } = useNuxtApp() as { $pb: PocketBase }
  if (!$pb) throw new Error('PocketBase plugin missing')
  return $pb
}




