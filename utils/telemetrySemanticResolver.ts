// utils/telemetrySemanticResolver.ts

export interface ElementSemanticIdentity {
  id: string
  label: string
  category: 'auth' | 'conversion' | 'navigation' | 'search' | 'form' | 'localization' | 'action'
  tag: string
  parentContext?: string
}

/**
 * Normalizes Persian and English text by trimming, standardizing Arabic characters,
 * and stripping extra whitespace.
 */
function normalizeText(text: string): string {
  if (!text) return ''
  return text
    .replace(/\u200c/g, ' ') // replace zero-width non-joiner with space for matching
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Converts Persian/English text into a safe, concise URL/ID slug
 */
function slugify(text: string, maxLen = 30): string {
  const norm = normalizeText(text)
  const slug = norm
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
  return slug.slice(0, maxLen) || 'el'
}

/**
 * Detects the contextual location of the element in the DOM (e.g. navbar, footer, modal)
 */
function detectContext(el: HTMLElement): { prefix: string; name: string } {
  if (el.closest('header, nav, [role="navigation"], .header, .navbar')) {
    return { prefix: 'nav-', name: 'Header' }
  }
  if (el.closest('footer, .footer')) {
    return { prefix: 'footer-', name: 'Footer' }
  }
  if (el.closest('dialog, [role="dialog"], .modal, .consultation-modal, .headless-dialog')) {
    return { prefix: 'modal-', name: 'Modal' }
  }
  if (el.closest('aside, .sidebar, #sidebar')) {
    return { prefix: 'sidebar-', name: 'Sidebar' }
  }
  if (el.closest('form, .form')) {
    return { prefix: 'form-', name: 'Form' }
  }
  if (el.closest('.hero, #hero')) {
    return { prefix: 'hero-', name: 'Hero' }
  }
  return { prefix: '', name: 'Page' }
}

/**
 * Innately resolves the semantic identity, human-readable Persian/English label,
 * and category of ANY interactive or structural element on the page WITHOUT requiring a click.
 */
export function resolveElementIdentity(el: HTMLElement): ElementSemanticIdentity {
  const tag = el.tagName.toLowerCase()

  // 1. Explicit attributes have first priority
  const explicitTrack = el.getAttribute('data-track')
  const explicitLabel = el.getAttribute('data-telemetry-label')
  const explicitCat = el.getAttribute('data-telemetry-cat') as any
  if (explicitTrack) {
    return {
      id: explicitTrack,
      label: explicitLabel || explicitTrack,
      category: explicitCat || 'action',
      tag
    }
  }

  const { prefix, name: contextName } = detectContext(el)

  // 2. Check for Primary CTA or Consultation Trigger
  if (el.hasAttribute('data-cta-primary') || el.closest('[data-cta-primary]')) {
    return {
      id: 'cta-primary-consultation',
      label: 'مشاوره و استعلام تخصصی (CTA اصلی)',
      category: 'conversion',
      tag,
      parentContext: contextName
    }
  }

  // 3. Extract text content & aria attributes
  const rawText = el.innerText || el.textContent || ''
  const normText = normalizeText(rawText)
  const ariaLabel = normalizeText(el.getAttribute('aria-label') || '')
  const titleAttr = normalizeText(el.getAttribute('title') || '')
  const placeholder = normalizeText(el.getAttribute('placeholder') || '')
  const combinedText = `${normText} ${ariaLabel} ${titleAttr}`.toLowerCase()

  // 4. Link & Anchor inspection
  const anchor = el.tagName === 'A' ? (el as HTMLAnchorElement) : (el.closest('a') as HTMLAnchorElement | null)
  const href = anchor?.getAttribute('href') || anchor?.getAttribute('to') || ''
  const cleanHref = href.replace(/^(\/(fa|en|ar))?(\/|$)/i, '/').replace(/\/$/, '')

  // Match Login / Auth / Profile
  if (
    combinedText.includes('ورود') ||
    combinedText.includes('login') ||
    combinedText.includes('sign in') ||
    cleanHref === '/login' ||
    cleanHref.startsWith('/user/')
  ) {
    return {
      id: `${prefix || 'btn-'}login`,
      label: 'ورود به حساب کاربری',
      category: 'auth',
      tag,
      parentContext: contextName
    }
  }

  if (
    combinedText.includes('ثبت نام') ||
    combinedText.includes('عضویت') ||
    combinedText.includes('register') ||
    cleanHref === '/register'
  ) {
    return {
      id: `${prefix || 'btn-'}register`,
      label: 'ثبت‌نام در سامانه',
      category: 'auth',
      tag,
      parentContext: contextName
    }
  }

  if (combinedText.includes('خروج') || combinedText.includes('logout')) {
    return {
      id: `${prefix || 'btn-'}logout`,
      label: 'خروج از حساب کاربری',
      category: 'auth',
      tag,
      parentContext: contextName
    }
  }

  // Language Switcher detection
  const normLowerText = normText.toLowerCase()
  const lowerAria = ariaLabel.toLowerCase()
  if (
    normLowerText === 'fa' ||
    normLowerText === 'en' ||
    normLowerText === 'ar' ||
    lowerAria.includes('language') ||
    lowerAria.includes('زبان') ||
    combinedText.includes('language') ||
    el.closest('.language-switcher')
  ) {
    return {
      id: 'nav-lang-switcher',
      label: `تغییر زبان سایت (${normText || 'FA'})`,
      category: 'localization',
      tag,
      parentContext: contextName
    }
  }

  // Search detection
  if (
    combinedText.includes('جستجو') ||
    combinedText.includes('جست وجو') ||
    combinedText.includes('search') ||
    placeholder.includes('جستجو') ||
    el.id === 'mobile-search-input' ||
    el.querySelector('svg[class*="search"]') ||
    el.closest('.search-box, [data-search]')
  ) {
    return {
      id: `${prefix || ''}search-input`,
      label: 'جستجوی سریع در خدمات و کاتالوگ',
      category: 'search',
      tag,
      parentContext: contextName
    }
  }

  // Hamburger / Drawer Menu Trigger
  if (
    lowerAria.includes('منو') ||
    lowerAria.includes('menu') ||
    el.querySelector('.origin-center') ||
    el.classList.contains('hamburger')
  ) {
    return {
      id: `${prefix || 'btn-'}menu-toggle`,
      label: 'منوی ناوبری اصلی (Drawer)',
      category: 'navigation',
      tag,
      parentContext: contextName
    }
  }

  // Brand Logo (Only matches actual logo elements linking to home or bearing logo iconography)
  const isLogoElement =
    (anchor && (cleanHref === '/' || cleanHref === '')) &&
    (lowerAria.includes('صفحه اصلی') ||
      lowerAria.includes('logo') ||
      combinedText.includes('لوگو') ||
      el.querySelector('svg[class*="logo"]') ||
      el.classList.contains('najm-logo') ||
      el.closest('.najm-logo, [data-logo]'))

  if (isLogoElement) {
    return {
      id: `${prefix || ''}brand-logo`,
      label: 'لوگوی مجتمع چاپ و بسته‌بندی نجم',
      category: 'navigation',
      tag,
      parentContext: contextName
    }
  }

  // Conversion / Consultation / Quote CTAs
  if (
    combinedText.includes('مشاوره') ||
    combinedText.includes('استعلام') ||
    combinedText.includes('سفارش') ||
    cleanHref.includes('consultation')
  ) {
    return {
      id: 'cta-consultation',
      label: normText || 'مشاوره رایگان و استعلام قیمت',
      category: 'conversion',
      tag,
      parentContext: contextName
    }
  }

  // Dieline / Catalog Download CTAs
  if (
    combinedText.includes('کاتالوگ') ||
    combinedText.includes('دانلود') ||
    combinedText.includes('دیلاین') ||
    combinedText.includes('dieline') ||
    combinedText.includes('download') ||
    cleanHref.includes('catalog')
  ) {
    return {
      id: `${prefix || 'cta-'}catalog-download`,
      label: normText || 'دانلود کاتالوگ و قالب بسته‌بندی',
      category: 'conversion',
      tag,
      parentContext: contextName
    }
  }

  // Contact Links & Buttons
  if (
    combinedText.includes('تماس') ||
    combinedText.includes('contact') ||
    cleanHref.includes('contact')
  ) {
    return {
      id: `${prefix || 'link-'}contact`,
      label: normText || 'تماس با ما و نشانی کارخانه',
      category: 'navigation',
      tag,
      parentContext: contextName
    }
  }

  // About Links & Buttons
  if (
    combinedText.includes('درباره') ||
    combinedText.includes('about') ||
    cleanHref.includes('about')
  ) {
    return {
      id: `${prefix || 'link-'}about`,
      label: normText || 'درباره مجتمع چاپ و بسته‌بندی نجم',
      category: 'navigation',
      tag,
      parentContext: contextName
    }
  }

  // Services Links & Buttons
  if (
    combinedText.includes('خدمات') ||
    combinedText.includes('services') ||
    cleanHref.includes('services')
  ) {
    return {
      id: `${prefix || 'link-'}services`,
      label: normText || 'خدمات چاپ افست ۵ رنگ و جعبه‌سازی',
      category: 'navigation',
      tag,
      parentContext: contextName
    }
  }

  // Products Links & Buttons
  if (
    combinedText.includes('محصولات') ||
    combinedText.includes('products') ||
    cleanHref.includes('products')
  ) {
    return {
      id: `${prefix || 'link-'}products`,
      label: normText || 'انواع جعبه مقوایی و هاردباکس',
      category: 'navigation',
      tag,
      parentContext: contextName
    }
  }

  // FAQ Links & Buttons
  if (
    combinedText.includes('سوالات') ||
    combinedText.includes('پرسش') ||
    combinedText.includes('faq') ||
    cleanHref.includes('faq')
  ) {
    return {
      id: `${prefix || 'link-'}faq`,
      label: normText || 'سوالات متداول',
      category: 'navigation',
      tag,
      parentContext: contextName
    }
  }

  // Form Controls Inspection
  if (tag === 'input' || tag === 'select' || tag === 'textarea') {
    const inputEl = el as HTMLInputElement
    const inputType = inputEl.type || 'text'
    const inputName = inputEl.name || inputEl.id || ''

    if (inputType === 'tel' || inputName.includes('phone') || inputName.includes('mobile') || placeholder.includes('شماره') || placeholder.includes('موبایل')) {
      return { id: 'input-mobile-phone', label: 'شماره تماس کاربر', category: 'form', tag }
    }
    if (inputType === 'email' || inputName.includes('email') || placeholder.includes('ایمیل')) {
      return { id: 'input-email-address', label: 'آدرس ایمیل', category: 'form', tag }
    }
    if (inputName.includes('name') || placeholder.includes('نام')) {
      return { id: 'input-fullname', label: 'نام و نام خانوادگی', category: 'form', tag }
    }
    if (tag === 'textarea' || inputName.includes('msg') || inputName.includes('message')) {
      return { id: 'textarea-user-message', label: 'متن پیام یا توضیحات سفارش', category: 'form', tag }
    }
    return {
      id: `input-${inputName || inputType}`,
      label: placeholder || inputName || 'فیلد ورودی فرم',
      category: 'form',
      tag
    }
  }

  // Specific Named Paths for General Links
  if (cleanHref && cleanHref !== '#') {
    const pathSlug = cleanHref.replace(/^\//, '').replace(/\//g, '-')
    return {
      id: `${prefix || 'link-'}${pathSlug}`,
      label: normText || pathSlug,
      category: 'navigation',
      tag,
      parentContext: contextName
    }
  }

  // Short Persian / English text fallback
  if (normText && normText.length <= 40) {
    const textSlug = slugify(normText)
    return {
      id: `${prefix || 'btn-'}${textSlug}`,
      label: normText,
      category: 'action',
      tag,
      parentContext: contextName
    }
  }

  // Fallback with context and DOM ID
  const fallbackId = el.id ? el.id : `${prefix || ''}${tag}`
  return {
    id: fallbackId,
    label: ariaLabel || titleAttr || fallbackId,
    category: 'action',
    tag,
    parentContext: contextName
  }
}

/**
 * Ambient scanner that traverses the DOM and applies telemetry data-track attributes
 * to all interactive elements before any click is required.
 */
export function scanAndTagPage(root: ParentNode = document): number {
  if (typeof document === 'undefined') return 0

  const interactiveSelectors =
    'button, a, input, select, textarea, [role="button"], [data-cta-primary], [v-editable]'
  const elements = root.querySelectorAll(interactiveSelectors)
  let count = 0

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i] as HTMLElement
    // Ignore internal TelemetryLens or AdminEditBar elements
    if (el.closest('.telemetry-lens-container') || el.closest('.admin-floating-dock')) {
      continue
    }

    if (!el.hasAttribute('data-track')) {
      const identity = resolveElementIdentity(el)
      el.setAttribute('data-track', identity.id)
      el.setAttribute('data-telemetry-label', identity.label)
      el.setAttribute('data-telemetry-cat', identity.category)
      count++
    }
  }

  return count
}

/**
 * Non-blocking idle scanner for Google PageSpeed / Core Web Vitals optimization.
 * Slices DOM processing into idle micro-chunks so the main thread is never blocked (> 0 long tasks).
 */
export function scheduleIdleScanAndTag(root: ParentNode = document, onComplete?: (count: number) => void): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const interactiveSelectors =
    'button, a, input, select, textarea, [role="button"], [data-cta-primary], [v-editable]'

  const requestIdle =
    (window as any).requestIdleCallback ||
    ((cb: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void) =>
      setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 30))

  requestIdle((deadline: any) => {
    try {
      const elements = Array.from(root.querySelectorAll(interactiveSelectors)) as HTMLElement[]
      let idx = 0
      let taggedCount = 0

      function processChunk() {
        while (idx < elements.length && (deadline.timeRemaining() > 3 || deadline.didTimeout)) {
          const el = elements[idx]
          idx++

          if (el.closest('.telemetry-lens-container') || el.closest('.admin-floating-dock')) {
            continue
          }

          if (!el.hasAttribute('data-track')) {
            const identity = resolveElementIdentity(el)
            el.setAttribute('data-track', identity.id)
            el.setAttribute('data-telemetry-label', identity.label)
            el.setAttribute('data-telemetry-cat', identity.category)
            taggedCount++
          }
        }

        if (idx < elements.length) {
          requestIdle(processChunk)
        } else if (onComplete) {
          onComplete(taggedCount)
        }
      }

      processChunk()
    } catch {
      // Fallback to sync scan if error
      const count = scanAndTagPage(root)
      if (onComplete) onComplete(count)
    }
  })
}
