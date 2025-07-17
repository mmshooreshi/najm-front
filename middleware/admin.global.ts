// middleware/admin.ts
export default defineNuxtRouteMiddleware((to) => {
  if (process.client) return

  const isAdminRoute = to.path.startsWith('/admin')
  const isLoginPage = to.path.startsWith('/admin-login')
  const adminCookie = useCookie('pb_admin')

  if (!isAdminRoute && !isLoginPage) return

  const redirectUrl = encodeURIComponent(to.fullPath)

  // If accessing /admin-login but already logged in, go to redirect or /admin
  if (isLoginPage) {
    if (adminCookie.value) {
      console.log(to.query)
      const redirect = to.query.redirect as string || '/admin'
      return navigateTo(redirect)
    }
    return
  }

  // If accessing /admin and NOT logged in, go to login with redirect back
  if (!adminCookie.value) {
    return navigateTo(`/admin-login?redirect=${redirectUrl}`)
  }
})
