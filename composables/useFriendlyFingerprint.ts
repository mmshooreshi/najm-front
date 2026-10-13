// composables/useFriendlyFingerprint.ts
import { ref } from 'vue'

const ALIASES_STORAGE_KEY = 'najm_fp_aliases'

// Palette of colors for user personas
const PALETTES = [
  { name: 'emerald', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', ring: 'ring-emerald-400' },
  { name: 'sky', bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', ring: 'ring-sky-400' },
  { name: 'purple', bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', ring: 'ring-purple-400' },
  { name: 'amber', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', ring: 'ring-amber-400' },
  { name: 'rose', bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', ring: 'ring-rose-400' },
  { name: 'teal', bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30', ring: 'ring-teal-400' },
  { name: 'indigo', bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30', ring: 'ring-indigo-400' }
]

export function getStoredAliases(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(ALIASES_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

export function saveFingerprintAlias(fp: string, alias: string) {
  if (typeof window === 'undefined' || !fp) return
  try {
    const aliases = getStoredAliases()
    if (alias.trim()) {
      aliases[fp] = alias.trim()
    } else {
      delete aliases[fp]
    }
    localStorage.setItem(ALIASES_STORAGE_KEY, JSON.stringify(aliases))
    window.dispatchEvent(new CustomEvent('najm:fp-alias-updated', { detail: { fp, alias } }))
  } catch {}
}

export function detectBrowserBadge(ua?: string | null): { name: string; icon: string; tooltip: string } {
  if (!ua) return { name: 'مرورگر نامشخص', icon: 'globe', tooltip: 'مرورگر وب نامشخص' }
  const lower = ua.toLowerCase()

  // In-app browsers first
  if (lower.includes('bale')) {
    return { name: 'پیام‌رسان بله', icon: 'globe', tooltip: 'مرورگر داخلی پیام‌رسان بله (Bale)' }
  }
  if (lower.includes('telegram')) {
    return { name: 'تلگرام', icon: 'globe', tooltip: 'مرورگر داخلی تلگرام (Telegram)' }
  }
  if (lower.includes('instagram')) {
    return { name: 'اینستاگرام', icon: 'globe', tooltip: 'مرورگر درون‌برنامه‌ای اینستاگرام' }
  }

  // Major Browsers
  if (lower.includes('edg/') || lower.includes('edge/')) {
    return { name: 'مایکروسافت اج (Edge)', icon: 'edge', tooltip: 'مرورگر Microsoft Edge' }
  }
  if (lower.includes('samsungbrowser')) {
    return { name: 'سامسونگ اینترنت', icon: 'globe', tooltip: 'مرورگر Samsung Internet' }
  }
  if (lower.includes('opr/') || lower.includes('opera/')) {
    return { name: 'اپرا (Opera)', icon: 'globe', tooltip: 'مرورگر Opera' }
  }
  if (lower.includes('firefox/') || lower.includes('fxios/')) {
    return { name: 'فایرفاکس (Firefox)', icon: 'firefox', tooltip: 'مرورگر Mozilla Firefox' }
  }
  // Chrome must be checked before Safari because Chrome UA contains Safari
  if (lower.includes('chrome/') || lower.includes('crios/')) {
    return { name: 'گوگل کروم (Chrome)', icon: 'chrome', tooltip: 'مرورگر Google Chrome' }
  }
  if (lower.includes('safari/')) {
    return { name: 'سافاری (Safari)', icon: 'safari', tooltip: 'مرورگر Apple Safari' }
  }

  return { name: 'مرورگر وب', icon: 'globe', tooltip: 'مرورگر وب استاندارد' }
}

export function detectDeviceBadge(ua?: string | null): {
  label: string
  icon: string
  os: string
  type: 'mobile' | 'desktop' | 'tablet'
  tooltip: string
} {
  if (!ua) {
    return { label: 'دستگاه نامشخص', icon: 'desktop', os: 'نامشخص', type: 'desktop', tooltip: 'دستگاه نامشخص' }
  }
  const lower = ua.toLowerCase()

  if (/ipad/i.test(lower)) {
    return { label: 'آیپد (iPadOS)', icon: 'apple', os: 'iPadOS', type: 'tablet', tooltip: 'تبلت اپل آیپد (iPadOS)' }
  }
  if (/iphone|ipod/i.test(lower)) {
    return { label: 'آیفون (iOS)', icon: 'apple', os: 'iOS', type: 'mobile', tooltip: 'گوشی هوشمند آیفون (Apple iOS)' }
  }
  if (/android/i.test(lower)) {
    const isTablet = !/mobile/i.test(lower)
    return {
      label: isTablet ? 'تبلت اندروید' : 'اندروید (Android)',
      icon: 'android',
      os: 'Android',
      type: isTablet ? 'tablet' : 'mobile',
      tooltip: isTablet ? 'تبلت با سیستم‌عامل اندروید' : 'گوشی همراه اندروید (Google Android)'
    }
  }
  if (/macintosh|mac os x/i.test(lower)) {
    return { label: 'مک (macOS)', icon: 'apple', os: 'macOS', type: 'desktop', tooltip: 'کامپیوتر اپل مک (Apple macOS)' }
  }
  if (/windows/i.test(lower)) {
    return { label: 'ویندوز (Windows)', icon: 'windows', os: 'Windows', type: 'desktop', tooltip: 'رایانه رومیزی ویندوز (Microsoft Windows)' }
  }
  if (/linux/i.test(lower)) {
    return { label: 'لینوکس (Linux)', icon: 'desktop', os: 'Linux', type: 'desktop', tooltip: 'سیستم‌عامل لینوکس (Linux)' }
  }

  return { label: 'مرورگر دسکتاپ', icon: 'desktop', os: 'دسکتاپ', type: 'desktop', tooltip: 'مرورگر دسکتاپ' }
}

export function formatFriendlyFingerprint(fp?: string | null, userAgent?: string | null): {
  raw: string
  shortId: string
  label: string
  hasCustomAlias: boolean
  device: ReturnType<typeof detectDeviceBadge>
  browser: ReturnType<typeof detectBrowserBadge>
  palette: typeof PALETTES[0]
  avatarChar: string
} {
  const raw = fp || 'fp_unknown'
  const aliases = getStoredAliases()
  const customAlias = aliases[raw]

  // Extract clean 4-character hex ID
  const cleanHex = raw.replace(/^fp_/, '').slice(0, 4).toUpperCase() || '????'
  const shortId = `#${cleanHex}`

  // Pick deterministic palette based on hash
  let charSum = 0
  for (let i = 0; i < raw.length; i++) {
    charSum += raw.charCodeAt(i)
  }
  const palette = PALETTES[charSum % PALETTES.length]

  const device = detectDeviceBadge(userAgent)
  const browser = detectBrowserBadge(userAgent)

  const label = customAlias || `کاربر ${shortId}`
  const avatarChar = customAlias ? customAlias.charAt(0) : cleanHex.charAt(0) || 'ک'

  return {
    raw,
    shortId,
    label,
    hasCustomAlias: Boolean(customAlias),
    device,
    browser,
    palette,
    avatarChar
  }
}

