// utils/digits.ts
import { useLocale } from '@/composables/useLocale'

const en = '0123456789'
const fa = '۰۱۲۳۴۵۶۷۸۹'
const ar = '٠١٢٣٤٥٦٧٨٩'

export const toPersianDigits = (val: string | number | null | undefined): string =>
  val == null ? '' : String(val).replace(/[0-9]/g, d => fa[+d])

export const toEnglishDigits = (val: string | number | null | undefined): string =>
  val == null ? '' : String(val)
    .replace(/[۰-۹]/g, d => en[fa.indexOf(d)])
    .replace(/[٠-٩]/g, d => en[ar.indexOf(d)])

/**
 * Convert digits based on current selected language (FA, AR, EN)
 * Automatically detects current language from useLocale()
 */
export const toLocalizedDigits = (val: string | number | null | undefined): string => {
  if (val == null) return ''
  const str = String(val)

  // Auto-detect current language
  const { language } = useLocale()
  const locale = language.value?.toUpperCase?.() ?? 'EN'

  switch (locale) {
    case 'FA':
      return str.replace(/[0-9]/g, d => fa[+d])
    case 'AR':
      return str.replace(/[0-9]/g, d => ar[+d])
    case 'EN':
    default:
      return str
  }
}
