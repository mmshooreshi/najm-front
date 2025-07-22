// plugins/pb.client.ts
import PocketBase from 'pocketbase'
import { defineNuxtPlugin, useCookie } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const pb = new PocketBase(useRuntimeConfig().public.pbUrl)

  if (process.client) {
    const token = useCookie<string>('pb_admin')
    if (token.value) {
      pb.authStore.save(token.value, null)

      try {
        // await pb.collection('_superusers').authRefresh()
      } catch (err) {
        console.warn('authRefresh failed', err)
        pb.authStore.clear()
        token.value = ''
      }
    }
  }

  nuxtApp.provide('pb', pb)
})


export const usePocketBase = () =>
  useNuxtApp().$pb as PocketBase
