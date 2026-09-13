// utils/bidi.ts
import { toEnglishDigits, toPersianDigits, toArabicDigits } from '@/utils/digits'

/**
 * Converts all numbers in text to target digit system:
 * - 'FA': Persian (۰۱۲۳۴۵۶۷۸۹)
 * - 'AR': Arabic (٠١٢٣٤٥٦٧٨٩)
 * - 'EN': Latin/English (0123456789)
 */
export function convertTextDigits(text: string, target: 'FA' | 'AR' | 'EN'): string {
  if (!text) return ''
  switch (target) {
    case 'FA':
      return toPersianDigits(text)
    case 'AR':
      return toArabicDigits(text)
    case 'EN':
      return toEnglishDigits(text)
    default:
      return text
  }
}

/**
 * Fixes Persian/Arabic telephone numbers, ranges, and mixed BiDi strings
 * e.g. "۰۲۱-۸۸۹۸۷۰۶۷ الی ۶۹" or "021-66797911 الی 13"
 * Uses Unicode Left-to-Right Marks (\u200E) to ensure numbers and hyphens
 * maintain exact visual sequence while keeping connective Persian words (الی, تا)
 * perfectly positioned in the middle.
 */
export function fixBiDiPhoneAndRange(text: string): string {
  if (!text) return ''
  // Strip previous LRM marks to prevent stacking on repeated clicks
  const clean = text.replace(/\u200E/g, '')

  // Unified single-pass regex matching phone ranges, standalone phones, or time/value ranges
  const unifiedRegex = /([0-9۰-۹٠-٩]{2,5}[-–][0-9۰-۹٠-٩]{4,9})\s*(الی|تا|to)\s*([0-9۰-۹٠-٩]{1,5})|([0-9۰-۹٠-٩]{2,5}[-–][0-9۰-۹٠-٩]{4,9})|([0-9۰-۹٠-٩]{1,4}(?::[0-9۰-۹٠-٩]{2})?)\s*(الی|تا|to)\s*([0-9۰-۹٠-٩]{1,4}(?::[0-9۰-۹٠-٩]{2})?)/gi

  return clean.replace(unifiedRegex, (match, p1, sep1, end1, standalonePhone, rStart, sep2, rEnd) => {
    if (p1 && sep1 && end1) {
      return `\u200E${p1}\u200E ${sep1} \u200E${end1}\u200E`
    }
    if (standalonePhone) {
      return `\u200E${standalonePhone}\u200E`
    }
    if (rStart && sep2 && rEnd) {
      return `\u200E${rStart}\u200E ${sep2} \u200E${rEnd}\u200E`
    }
    return match
  })
}

/**
 * Injects Zero-Width Non-Joiner (\u200C / نیم‌فاصله) into active selection or element
 */
export function insertZwnjAtCursor(): boolean {
  if (typeof window === 'undefined') return false
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return false

  try {
    const range = sel.getRangeAt(0)
    range.deleteContents()
    const zwnjNode = document.createTextNode('\u200C')
    range.insertNode(zwnjNode)

    // Move cursor right after the inserted ZWNJ
    range.setStartAfter(zwnjNode)
    range.setEndAfter(zwnjNode)
    sel.removeAllRanges()
    sel.addRange(range)
    return true
  } catch {
    try {
      document.execCommand('insertText', false, '\u200C')
      return true
    } catch {
      return false
    }
  }
}

/**
 * Modifies direction and inline alignment on an editable element
 */
export function setElementDirection(el: HTMLElement, dir: 'rtl' | 'ltr' | 'auto') {
  if (!el) return
  el.setAttribute('dir', dir)
  el.style.direction = dir
}

export function setElementAlignment(el: HTMLElement, align: 'right' | 'left' | 'center' | 'justify') {
  if (!el) return
  el.style.textAlign = align
}

export function setElementBidiOverride(el: HTMLElement, override: 'rlo' | 'lro' | 'normal') {
  if (!el) return
  if (override === 'normal') {
    el.style.unicodeBidi = 'normal'
  } else if (override === 'rlo') {
    el.style.unicodeBidi = 'bidi-override'
    el.style.direction = 'rtl'
  } else if (override === 'lro') {
    el.style.unicodeBidi = 'bidi-override'
    el.style.direction = 'ltr'
  }
}
