// middleware/admin.global.ts
export default defineNuxtRouteMiddleware((to) => {
  if (process.client) return

  const isAdminRoute = to.path.startsWith('/admin') || to.path.startsWith('/dashboard')
  const isLoginPage = to.path.startsWith('/admin-login')
  const adminCookie = useCookie('pb_admin')

  if (!isAdminRoute && !isLoginPage) return

  const redirectUrl = encodeURIComponent(to.fullPath)

  // If accessing /admin-login but already logged in, redirect to target or /dashboard
  if (isLoginPage) {
    if (adminCookie.value) {
      const redirect = (to.query.redirect as string) || '/dashboard'
      return navigateTo(redirect)
    }
    return
  }

  // If accessing protected admin/dashboard route and NOT logged in, redirect to login page
  if (!adminCookie.value) {
    return navigateTo(`/admin-login?redirect=${redirectUrl}`)
  }
})

