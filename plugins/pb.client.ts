// plugins/pb.client.ts
import PocketBase from 'pocketbase'
export default defineNuxtPlugin((nuxtApp) => {
  const runtime = useRuntimeConfig()
  const pb = new PocketBase(runtime.public.pbUrl)

  // On the client we can restore the admin cookie
  if (process.client) {
    const adminCookie = useCookie('pb_admin').value
    if (adminCookie) pb.authStore.save(adminCookie, null) // token, model
  }

  nuxtApp.provide('pb', pb)
})


