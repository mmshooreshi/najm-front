// composables/useMenu.ts
import { preloadRouteComponents } from '#app'
import { useLocale } from '~/composables/useLocale'

const CORE_ROUTES = [
  '/',
  '/about',
  '/catalog',
  '/facilities',
  '/contact',
  '/blog',
  '/resources',
  '/services/printing-and-packaging',
  '/services/finishing-services',
  '/consultation',
]

export const useMenu = () => {
  const isMenuOpen = useState<boolean>('site_menu_open', () => false)
  const { localePath } = useLocale()

  const preloadMenuRoutes = () => {
    if (typeof window === 'undefined') return
    const run = () => {
      try {
        CORE_ROUTES.forEach((path) => {
          preloadRouteComponents(localePath(path)).catch(() => {})
        })
      } catch {}
    }
    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(run, { timeout: 2000 })
    } else {
      setTimeout(run, 400)
    }
  }

  const openMenu = () => {
    isMenuOpen.value = true
    preloadMenuRoutes()
  }

  const closeMenu = () => {
    isMenuOpen.value = false
  }

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
    if (isMenuOpen.value) {
      preloadMenuRoutes()
    }
  }

  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    preloadMenuRoutes,
  }
}
