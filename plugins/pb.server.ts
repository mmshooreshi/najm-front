// plugins/pb.server.ts
import PocketBase from 'pocketbase'
import { getCookie } from 'h3'         // 👈  add this

export default defineNuxtPlugin((nuxtApp) => {
  const runtime = useRuntimeConfig()
  const pb = new PocketBase(runtime.public.pbUrl)

  // Nuxt injects the Nitro event on SSR requests
  const event = nuxtApp.ssrContext?.event       // undefined during SPA hydration
  if (event) {
    const token = getCookie(event, 'pb_admin')  // returns undefined if cookie missing
    if (token) pb.authStore.save(token, null)
  }

  nuxtApp.provide('pb', pb)
})
