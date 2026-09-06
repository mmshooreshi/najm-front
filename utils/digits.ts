// utils/digits.ts
import { useLocale } from '@/composables/useLocale'

const en = '0123456789'
const fa = '۰۱۲۳۴۵۶۷۸۹'
const ar = '٠١٢٣٤٥٦٧٨٩'

export const toEnglishDigits = (val: string | number | null | undefined): string => {
  if (val == null) return ''
  return String(val)
    .replace(/[۰-۹]/g, d => en[fa.indexOf(d)])
    .replace(/[٠-٩]/g, d => en[ar.indexOf(d)])
}

export const toPersianDigits = (val: string | number | null | undefined): string => {
  if (val == null) return ''
  const str = toEnglishDigits(val)
  return str.replace(/[0-9]/g, d => fa[+d])
}

export const toArabicDigits = (val: string | number | null | undefined): string => {
  if (val == null) return ''
  const str = toEnglishDigits(val)
  return str.replace(/[0-9]/g, d => ar[+d])
}

/**
 * Convert digits based on current selected language (FA, AR, EN)
 * Automatically detects current language from useLocale()
 */
export const toLocalizedDigits = (val: string | number | null | undefined, customLang?: string): string => {
  if (val == null) return ''
  const str = toEnglishDigits(val)

  let locale = customLang
  if (!locale) {
    try {
      const { language } = useLocale()
      locale = language?.value
    } catch {
      locale = 'FA'
    }
  }
  const upper = (locale || 'FA').toUpperCase()

  switch (upper) {
    case 'FA':
      return str.replace(/[0-9]/g, d => fa[+d])
    case 'AR':
      return str.replace(/[0-9]/g, d => ar[+d])
    case 'EN':
    default:
      return str
  }
}

