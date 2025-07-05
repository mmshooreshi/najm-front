// middleware/admin.ts
export default defineNuxtRouteMiddleware((to) => {
  if (process.client) return

  if (!to.path.startsWith('/admin')) return
  const adminCookie = useCookie('pb_admin')
  if (!adminCookie.value) return navigateTo('/admin-login')
})


