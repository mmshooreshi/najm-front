// plugins/pb.client.ts
import PocketBase from 'pocketbase'
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  let pbUrl = config.public?.pbUrl || 'http://65.108.80.205:8090'

  // If loaded in browser over HTTPS and PocketBase is HTTP, use same-origin proxy to eliminate Mixed Content errors
  if (process.client && typeof window !== 'undefined') {
    if (window.location.protocol === 'https:' && pbUrl.startsWith('http://')) {
      pbUrl = `${window.location.origin}/api/pb`
    }
  }

  const pb = new PocketBase(pbUrl)

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
