// plugins/admin-edit.client.ts
import { defineNuxtPlugin } from '#app'
import { watch, watchEffect, type DirectiveBinding } from 'vue'
import {
  adminEditState as state,
  getText,
  ensureBaseline,
  setDraftValue,
  setValueSilently,
  isChanged,
  syncLanguage,
  changedCountForLang,
  revertPath,
  addArrayItem,
  removeArrayItem,
  setEditingActive,
  registerOrigin,
  openUnifiedPanel,
  closeUnifiedPanel,
  toggleUnifiedPanel,
  getVersions,
  restoreVersion
} from '@/store/adminEditStore'
import { useLocale } from '@/composables/useLocale'
import { logger } from '@/utils/logger'
import {
  convertTextDigits,
  fixBiDiPhoneAndRange,
  insertZwnjAtCursor,
  setElementDirection,
  setElementAlignment,
  setElementBidiOverride
} from '@/utils/bidi'

function isInsideAdminUI(target: HTMLElement | null): boolean {
  if (!target) return false
  return !!(
    target.closest('.admin-floating-dock') ||
    target.closest('.admin-hover-badge') ||
    target.closest('.admin-modal') ||
    target.closest('[role="dialog"]')
  )
}

/** ---------- ContentEditable helpers ---------- **/
function setEditable(el: HTMLElement, on: boolean) {
  if (on) {
    try {
      el.setAttribute('contenteditable', 'plaintext-only')
    } catch {
      el.setAttribute('contenteditable', 'true')
    }
    el.setAttribute('spellcheck', 'false')
    el.setAttribute('autocomplete', 'off')
    el.setAttribute('autocorrect', 'off')
    el.setAttribute('autocapitalize', 'off')
  } else {
    el.setAttribute('contenteditable', 'false')
  }
  el.classList.toggle('v-editable--active', on)
  if (!on && document.activeElement === el) {
    el.blur()
  }
}

function updateElementState(el: HTMLElement, path: string, lang: string) {
  const changed = isChanged(path, lang)
  el.classList.toggle('v-editable--changed', changed)
  if (changed) {
    el.setAttribute('data-admin-changed', 'true')
  } else {
    el.removeAttribute('data-admin-changed')
  }
}

/** ---------- Instant Hover Micro-Toolbar for Editable Elements ---------- **/

function createToolbarButton(
  text: string,
  title: string,
  onClick: (e: MouseEvent) => void,
  isDanger = false
): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.textContent = text
  btn.title = title
  btn.style.cssText = `
    background: ${isDanger ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'};
    color: ${isDanger ? '#fca5a5' : '#e5e7eb'};
    border: 1px solid ${isDanger ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.14)'};
    padding: 2px 6px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 10px;
    font-weight: 600;
    line-height: 1.2;
    transition: all 0.12s ease;
    user-select: none;
    outline: none;
    white-space: nowrap;
  `
  btn.addEventListener('mousedown', (e) => {
    e.preventDefault() // Prevents editable element from losing focus or text selection!
  })
  btn.addEventListener('mouseenter', () => {
    btn.style.background = isDanger ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.2)'
    btn.style.color = '#ffffff'
  })
  btn.addEventListener('mouseleave', () => {
    btn.style.background = isDanger ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'
    btn.style.color = isDanger ? '#fca5a5' : '#e5e7eb'
  })
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    onClick(e)
  })
  return btn
}

function createSeparator(): HTMLSpanElement {
  const sep = document.createElement('span')
  sep.style.cssText = 'display:inline-block;width:1px;height:12px;background:rgba(255,255,255,0.18);margin:0 2px;flex-shrink:0;'
  return sep
}

function applyDigitConversion(target: 'FA' | 'AR' | 'EN') {
  if (!currentBadgeEl) return
  const sel = window.getSelection()
  const hasSelection = !!(sel && sel.rangeCount > 0 && !sel.isCollapsed && currentBadgeEl.contains(sel.anchorNode))

  if (hasSelection) {
    const selectedText = sel!.toString()
    const converted = convertTextDigits(selectedText, target)
    try {
      document.execCommand('insertText', false, converted)
    } catch {
      currentBadgeEl.textContent = convertTextDigits(getText(currentBadgeEl), target)
    }
  } else {
    const fullText = getText(currentBadgeEl)
    const converted = convertTextDigits(fullText, target)
    currentBadgeEl.textContent = converted
  }

  currentBadgeEl.dispatchEvent(new Event('input', { bubbles: true }))
  updateElementState(currentBadgeEl, currentBadgePath, state.language)
  const labels = { FA: 'فارسی (۱۲۳)', AR: 'عربی (١٢٣)', EN: 'انگلیسی (123)' }
  toast(`اعداد به ${labels[target]} تبدیل شدند`, 'success')
}

function applyBidiPhoneFix() {
  if (!currentBadgeEl) return
  const fullText = getText(currentBadgeEl)
  const fixed = fixBiDiPhoneAndRange(fullText)
  currentBadgeEl.textContent = fixed
  currentBadgeEl.dispatchEvent(new Event('input', { bubbles: true }))
  updateElementState(currentBadgeEl, currentBadgePath, state.language)
  toast('ترتیب شماره تلفن و کلمات میانی اصلاح شد (BiDi Phone Fix)', 'success')
}

function applyZwnj() {
  if (!currentBadgeEl) return
  if (document.activeElement !== currentBadgeEl) {
    currentBadgeEl.focus()
  }
  const ok = insertZwnjAtCursor()
  if (ok) {
    currentBadgeEl.dispatchEvent(new Event('input', { bubbles: true }))
    updateElementState(currentBadgeEl, currentBadgePath, state.language)
    toast('نیم‌فاصله درج شد (ZWNJ / \\u200C)', 'info')
  }
}

function toggleDirection() {
  if (!currentBadgeEl) return
  const currentDir = currentBadgeEl.getAttribute('dir') || window.getComputedStyle(currentBadgeEl).direction
  const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl'
  setElementDirection(currentBadgeEl, nextDir as any)
  toast(`جهت متن: ${nextDir.toUpperCase()}`, 'info')
}

function applyAlignment(align: 'right' | 'center' | 'left') {
  if (!currentBadgeEl) return
  setElementAlignment(currentBadgeEl, align as any)
  toast(`چینش متن: ${align}`, 'info')
}

function toggleBidiOverride() {
  if (!currentBadgeEl) return
  const isRlo = currentBadgeEl.style.unicodeBidi === 'bidi-override'
  if (isRlo) {
    setElementBidiOverride(currentBadgeEl, 'normal')
    toast('حالت BiDi Override عادی شد', 'info')
  } else {
    setElementBidiOverride(currentBadgeEl, 'rlo')
    toast('حالت BiDi Override (راست به چپ) فعال شد', 'info')
  }
}

let hoverBadgeEl: HTMLDivElement | null = null
let hoverBadgeMainRow: HTMLDivElement | null = null
let hoverBadgeVersionsRow: HTMLDivElement | null = null
let hoverBadgeDot: HTMLSpanElement | null = null
let hoverBadgeText: HTMLSpanElement | null = null
let hoverBadgeRevert: HTMLButtonElement | null = null
let hoverBadgeVersionsToggle: HTMLButtonElement | null = null
let hoverBadgeColor: HTMLButtonElement | null = null
let hoverBadgeRot: HTMLButtonElement | null = null
let currentBadgePath = ''
let currentBadgeEl: HTMLElement | null = null
let hoverActiveTarget: HTMLElement | null = null
let hideBadgeTimer: any = null
let isHoveringBadge = false
let activeEditingEl: HTMLElement | null = null
let showVersionsRow = true

function getOrCreateHoverBadge(): HTMLDivElement {
  if (hoverBadgeEl) return hoverBadgeEl
  hoverBadgeEl = document.createElement('div')
  hoverBadgeEl.className = 'admin-hover-badge'
  hoverBadgeEl.style.cssText = `
    position: fixed;
    z-index: 999999;
    pointer-events: auto;
    display: none;
    flex-direction: column;
    gap: 4px;
    padding: 5px 8px;
    font-size: 11px;
    font-weight: 500;
    background: rgba(15, 23, 42, 0.96);
    color: #f3f4f6;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(18px);
    transition: opacity 0.12s ease;
    opacity: 0;
    user-select: none;
    max-width: 95vw;
    box-sizing: border-box;
  `

  // Main Action Row
  hoverBadgeMainRow = document.createElement('div')
  hoverBadgeMainRow.style.cssText = 'display:flex;align-items:center;gap:4px;overflow-x:auto;white-space:nowrap;scrollbar-width:none;'

  hoverBadgeDot = document.createElement('span')
  hoverBadgeDot.style.cssText = 'display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;flex-shrink:0;'

  hoverBadgeText = document.createElement('span')
  hoverBadgeText.style.cssText = 'opacity:0.9;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;font-family:monospace;flex-shrink:0;'

  // 1. Digits group
  const btnFa = createToolbarButton('۱۲۳', 'تبدیل اعداد به فارسی (Persian Digits)', () => applyDigitConversion('FA'))
  const btnAr = createToolbarButton('١٢٣', 'تبدیل اعداد به عربی (Arabic Digits)', () => applyDigitConversion('AR'))
  const btnEn = createToolbarButton('123', 'تبدیل اعداد به انگلیسی (Latin Digits)', () => applyDigitConversion('EN'))

  // 2. Persian ZWNJ & BiDi Phone/Range Fixer
  const btnZwnj = createToolbarButton('‌ نیم‌فاصله', 'درج نیم‌فاصله (Shift+Space)', () => applyZwnj())
  const btnPhone = createToolbarButton('📞 تلفن/بازه', 'اصلاح ترتیب تلفن و کلمات میانی نظیر الی/تا (۰۲۱-۸۸۹۸۷۰۶۷ الی ۶۹)', () => applyBidiPhoneFix())

  // 3. Direction & Alignment
  const btnDir = createToolbarButton('RTL/LTR', 'تغییر جهت (RTL ⇄ LTR)', () => toggleDirection())
  const btnAlignR = createToolbarButton('⇤', 'چینش راست', () => applyAlignment('right'))
  const btnAlignC = createToolbarButton('↔', 'چینش وسط', () => applyAlignment('center'))
  const btnAlignL = createToolbarButton('⇥', 'چینش چپ', () => applyAlignment('left'))
  const btnRlo = createToolbarButton('RLO', 'تغییر وضعیت BiDi Override اجباری', () => toggleBidiOverride())

  // 4. Highlight Styling Controls (Color & Rotation)
  hoverBadgeColor = createToolbarButton('🎨 رنگ', 'تغییر رنگ پس‌زمینه هایلایت', () => {
    if (!currentBadgeEl || !currentBadgePath) return
    const parentPath = currentBadgePath.replace(/\.(label|sentence)$/, '')
    const colors = ['#6D28D9', '#2563EB', '#059669', '#DC2626', '#D97706', '#0F172A']
    const currBg = currentBadgeEl.style.getPropertyValue('--base-bg') || currentBadgeEl.style.backgroundColor || '#6D28D9'
    const nextIdx = (colors.indexOf(currBg) + 1) % colors.length
    const nextColor = colors[nextIdx]
    currentBadgeEl.style.setProperty('--base-bg', nextColor)
    currentBadgeEl.style.backgroundColor = nextColor
    const slug = currentBadgeEl.dataset.adminSlug || state.slug || 'home'
    setDraftValue(`${parentPath}.bgColor`, state.language || 'FA', nextColor, slug, true)
    toast('رنگ هایلایت تغییر کرد', 'success')
  })
  hoverBadgeColor.style.display = 'none'

  hoverBadgeRot = createToolbarButton('↻ زاویه', 'تغییر زاویه چرخش هایلایت', () => {
    if (!currentBadgeEl || !currentBadgePath) return
    const parentPath = currentBadgePath.replace(/\.(label|sentence)$/, '')
    const rotations = ['0deg', '-3deg', '3deg', '-6deg', '6deg']
    const currRot = currentBadgeEl.style.getPropertyValue('--base-rot') || '0deg'
    const nextIdx = (rotations.indexOf(currRot) + 1) % rotations.length
    const nextRot = rotations[nextIdx]
    currentBadgeEl.style.setProperty('--base-rot', nextRot)
    const slug = currentBadgeEl.dataset.adminSlug || state.slug || 'home'
    setDraftValue(`${parentPath}.rotation`, state.language || 'FA', nextRot, slug, true)
    toast(`زاویه هایلایت: ${nextRot}`, 'info')
  })
  hoverBadgeRot.style.display = 'none'

  // 5. Utility: Copy, Revert & Versions
  const btnCopy = createToolbarButton('📋', 'کپی آدرس فیلد', (e) => {
    if (currentBadgePath && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(currentBadgePath)
      toast(`آدرس کپی شد: ${currentBadgePath}`, 'success')
    }
  })

  hoverBadgeRevert = createToolbarButton('↺ بازگردانی', 'بازگردانی این فیلد به مقدار اصلی سرور', (e) => {
    if (currentBadgePath) {
      revertPath(currentBadgePath, state.language || 'fa')
      if (currentBadgeEl) {
        showHoverBadge(currentBadgeEl, currentBadgePath)
      }
      toast(`فیلد "${currentBadgePath}" به نسخه اولیه بازگردانی شد`, 'info')
    }
  }, true)
  hoverBadgeRevert.style.display = 'none'

  hoverBadgeVersionsToggle = createToolbarButton('🕒 تاریخچه', 'نمایش یا پنهان‌سازی ردیف نسخه‌های این فیلد', () => {
    showVersionsRow = !showVersionsRow
    if (hoverBadgeVersionsRow) {
      hoverBadgeVersionsRow.style.display = showVersionsRow ? 'flex' : 'none'
    }
  })

  hoverBadgeMainRow.appendChild(hoverBadgeDot)
  hoverBadgeMainRow.appendChild(hoverBadgeText)
  hoverBadgeMainRow.appendChild(createSeparator())
  hoverBadgeMainRow.appendChild(btnFa)
  hoverBadgeMainRow.appendChild(btnAr)
  hoverBadgeMainRow.appendChild(btnEn)
  hoverBadgeMainRow.appendChild(createSeparator())
  hoverBadgeMainRow.appendChild(btnZwnj)
  hoverBadgeMainRow.appendChild(btnPhone)
  hoverBadgeMainRow.appendChild(createSeparator())
  hoverBadgeMainRow.appendChild(btnDir)
  hoverBadgeMainRow.appendChild(btnAlignR)
  hoverBadgeMainRow.appendChild(btnAlignC)
  hoverBadgeMainRow.appendChild(btnAlignL)
  hoverBadgeMainRow.appendChild(btnRlo)
  hoverBadgeMainRow.appendChild(createSeparator())
  hoverBadgeMainRow.appendChild(hoverBadgeColor)
  hoverBadgeMainRow.appendChild(hoverBadgeRot)
  hoverBadgeMainRow.appendChild(btnCopy)
  hoverBadgeMainRow.appendChild(hoverBadgeRevert)
  hoverBadgeMainRow.appendChild(hoverBadgeVersionsToggle)

  // Dedicated Built-in Versions Row
  hoverBadgeVersionsRow = document.createElement('div')
  hoverBadgeVersionsRow.style.cssText = 'display:none;align-items:center;gap:4px;overflow-x:auto;white-space:nowrap;padding-top:4px;border-top:1px solid rgba(255,255,255,0.1);scrollbar-width:none;'

  hoverBadgeEl.appendChild(hoverBadgeMainRow)
  hoverBadgeEl.appendChild(hoverBadgeVersionsRow)

  // Prevent clicks on toolbar from stealing focus or text selection from the active editable element
  hoverBadgeEl.addEventListener('mousedown', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })

  hoverBadgeEl.addEventListener('mouseenter', () => {
    isHoveringBadge = true
    if (hideBadgeTimer) {
      clearTimeout(hideBadgeTimer)
      hideBadgeTimer = null
    }
  })

  hoverBadgeEl.addEventListener('mouseleave', () => {
    isHoveringBadge = false
    if (!activeEditingEl) {
      hideHoverBadge()
    }
  })

  document.body.appendChild(hoverBadgeEl)
  return hoverBadgeEl
}

function showHoverBadge(el: HTMLElement, path: string) {
  if (!state.canEdit || !state.editMode) return
  if (!el || isInsideAdminUI(el)) return

  // If user is currently editing an element, lock toolbar to that element!
  if (activeEditingEl && activeEditingEl !== el) {
    return
  }

  if (hideBadgeTimer) {
    clearTimeout(hideBadgeTimer)
    hideBadgeTimer = null
  }
  hoverActiveTarget = el
  currentBadgePath = path
  currentBadgeEl = el

  const badge = getOrCreateHoverBadge()
  const lang = state.language
  const changed = isChanged(path, lang)

  if (hoverBadgeDot) hoverBadgeDot.style.background = changed ? '#f59e0b' : '#10b981'
  if (hoverBadgeText) hoverBadgeText.textContent = path
  if (hoverBadgeRevert) hoverBadgeRevert.style.display = changed ? 'inline-block' : 'none'

  const isHighlightItem = path.includes('highlight') || el.classList.contains('hero-highlight-pill')
  if (hoverBadgeColor) hoverBadgeColor.style.display = isHighlightItem ? 'inline-block' : 'none'
  if (hoverBadgeRot) hoverBadgeRot.style.display = isHighlightItem ? 'inline-block' : 'none'

  // Populate built-in version history row
  const versions = getVersions(path, lang)
  if (hoverBadgeVersionsRow) {
    hoverBadgeVersionsRow.innerHTML = ''
    if (versions && versions.length > 0 && showVersionsRow) {
      const titleSpan = document.createElement('span')
      titleSpan.style.cssText = 'color:#94a3b8;font-size:10px;font-weight:600;display:inline-flex;align-items:center;gap:3px;flex-shrink:0;margin-left:2px;'
      titleSpan.textContent = 'سابقه فیلد:'
      hoverBadgeVersionsRow.appendChild(titleSpan)

      const currentText = getText(el)
      versions.forEach((v, vIdx) => {
        const vBtn = document.createElement('button')
        vBtn.type = 'button'
        const isCurrent = v.value === currentText
        vBtn.style.cssText = `
          background: ${isCurrent ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'};
          color: ${isCurrent ? '#6ee7b7' : '#cbd5e1'};
          border: 1px solid ${isCurrent ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.12)'};
          padding: 2px 6px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          transition: all 0.12s ease;
          white-space: nowrap;
        `
        const typeLabel = v.type === 'original' ? 'سرور (اصلی)' : `نسخه ${vIdx + 1}`
        vBtn.title = `کلیک برای بازگردانی فیلد به: «${v.value}»`
        vBtn.innerHTML = `<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${v.type === 'original' ? '#38bdf8' : '#fbbf24'};"></span><span>${typeLabel}</span>`
        vBtn.addEventListener('mousedown', (e) => e.preventDefault())
        vBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          restoreVersion(path, lang, v.value)
          if (currentBadgeEl) {
            currentBadgeEl.textContent = v.value
            updateElementState(currentBadgeEl, path, lang)
            showHoverBadge(currentBadgeEl, path)
          }
          toast(`فیلد به «${typeLabel}» بازگردانی شد`, 'success')
        })
        hoverBadgeVersionsRow.appendChild(vBtn)
      })
      hoverBadgeVersionsRow.style.display = 'flex'
      if (hoverBadgeVersionsToggle) hoverBadgeVersionsToggle.style.display = 'inline-block'
    } else {
      hoverBadgeVersionsRow.style.display = 'none'
      if (hoverBadgeVersionsToggle) hoverBadgeVersionsToggle.style.display = 'none'
    }
  }

  // Tidy, viewport-aware positioning centered over element
  badge.style.display = 'flex'
  const rect = el.getBoundingClientRect()
  const badgeWidth = Math.min(hoverBadgeEl?.offsetWidth || 440, window.innerWidth - 24)
  const badgeHeight = hoverBadgeEl?.offsetHeight || 50

  let left = rect.left + (rect.width / 2) - (badgeWidth / 2)
  left = Math.max(12, Math.min(window.innerWidth - badgeWidth - 12, left))

  let top = rect.top - badgeHeight - 8
  if (top < 52) {
    top = rect.bottom + 8
  }
  top = Math.max(8, Math.min(window.innerHeight - badgeHeight - 8, top))

  badge.style.top = `${Math.round(top)}px`
  badge.style.left = `${Math.round(left)}px`
  badge.style.opacity = '1'
}

function hideHoverBadge(force = false) {
  if (hideBadgeTimer) clearTimeout(hideBadgeTimer)
  hideBadgeTimer = setTimeout(() => {
    // If active element is focused or currently being edited, maintain the micro-toolbar
    if (!force && (activeEditingEl || (currentBadgeEl && (currentBadgeEl as any)._isFocused) || isHoveringBadge)) {
      return
    }
    if (hoverBadgeEl) {
      hoverBadgeEl.style.opacity = '0'
      setTimeout(() => {
        if (hoverBadgeEl && hoverBadgeEl.style.opacity === '0') {
          hoverBadgeEl.style.display = 'none'
        }
      }, 100)
    }
    hoverActiveTarget = null
  }, 150)
}

/** ---------- Notification Toast Host ---------- **/
let toastHost: HTMLDivElement | null = null
function toast(text: string, type: 'success' | 'error' | 'info' = 'info') {
  if (!toastHost) {
    toastHost = document.createElement('div')
    toastHost.style.cssText = 'position:fixed;z-index:9999999;right:20px;bottom:20px;display:flex;flex-direction:column;gap:8px;pointer-events:none;'
    document.body.appendChild(toastHost)
  }
  const el = document.createElement('div')
  const bg = type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#27272a'
  el.style.cssText = `
    background: ${bg};
    color: white;
    padding: 9px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 12px 30px rgba(0,0,0,0.4);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    transform: translateY(12px) scale(0.95);
    opacity: 0;
    pointer-events: auto;
  `
  el.textContent = text
  toastHost.appendChild(el)

  requestAnimationFrame(() => {
    el.style.opacity = '1'
    el.style.transform = 'translateY(0) scale(1)'
  })

  setTimeout(() => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(8px) scale(0.95)'
    setTimeout(() => el.remove(), 250)
  }, 2500)
}


/** ---------- Nuxt Plugin ---------- **/
export default defineNuxtPlugin(nuxtApp => {
  const { language } = useLocale()
  const route = useRoute()

  // Initialize admin capability from cookie
  const adminCookie = useCookie('pb_admin')
  const hasSuperuser = computed(() => {
    return !!adminCookie.value || (typeof document !== 'undefined' && document.cookie.includes('pb_admin='))
  })

  // Activate visual editor ONLY if superuser has explicitly requested edit mode:
  // 1) Via ?edit=true URL query (from /dash "ویرایش بصری سایت"), OR
  // 2) Via sessionStorage active flag (toggled by ⌘+E)
  const isExplicitlyEditing = computed(() => {
    if (!hasSuperuser.value) return false
    if (typeof window === 'undefined') return false
    if (route.path.startsWith('/dash')) return false
    if (route.query.edit === 'true' || route.query.edit === '1') {
      try { sessionStorage.setItem('admin_editor_active', 'true') } catch {}
      return true
    }
    try {
      return sessionStorage.getItem('admin_editor_active') === 'true'
    } catch {
      return false
    }
  })

  state.canEdit = isExplicitlyEditing.value
  state.editMode = isExplicitlyEditing.value

  watch(isExplicitlyEditing, (active) => {
    state.canEdit = active
    state.editMode = active
  })

  if (process.dev) {
    logger.info('Admin:Auth', `Superuser Session: ${hasSuperuser.value ? (state.canEdit ? '✓ Active (In-Place Edit)' : '○ Present (Visitor Mode - press ⌘E to edit)') : '○ Inactive'}`)
  }

  // Keep language in sync
  watch(language, (lang) => {
    if (lang) syncLanguage(lang)
  }, { immediate: true })

  // Toggle contenteditable across all editable elements
  watch(() => [state.canEdit, state.editMode], ([canEdit, editMode]) => {
    const on = !!(hasSuperuser.value && canEdit && editMode)
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('admin-edit-active', on)
    }
    const elements = document.querySelectorAll<HTMLElement>('[data-edit-path]')
    elements.forEach(el => {
      setEditable(el, on)
    })
    if (!on) {
      hideHoverBadge()
    }
    if (process.dev) {
      if (on) {
        logger.success('Admin:Edit', `Edit Mode ENGAGED on ${elements.length} editable DOM nodes`)
      } else {
        logger.info('Admin:Edit', 'Edit Mode DISENGAGED (Preview mode active)')
      }
    }
  }, { immediate: true })

  // Update page title badge for unsaved changes
  const baseTitle = typeof document !== 'undefined' ? document.title : ''
  watch(() => changedCountForLang(state.language), (count) => {
    if (typeof document !== 'undefined') {
      document.title = (count > 0 ? `(${count}) ● ` : '') + (baseTitle.replace(/^\(\d+\)\s*●\s*/, ''))
    }
  })

  // Outside-click handling to clear activeEditingEl and hide toolbar when clicking away
  if (typeof window !== 'undefined') {
    window.addEventListener('pointerdown', (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (hoverBadgeEl && hoverBadgeEl.contains(target)) return
      if (activeEditingEl && activeEditingEl.contains(target)) return

      if (activeEditingEl) {
        activeEditingEl = null
        hideHoverBadge(true)
      }
    }, { capture: true, passive: true })
  }

  // Directive: v-editable="path"
  nuxtApp.vueApp.directive('editable', {
    mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
      // Non-admin / default users must NEVER see v-editable attributes, classes, or dirty states
      if (!hasSuperuser.value) {
        el.removeAttribute('contenteditable')
        el.removeAttribute('data-edit-path')
        el.removeAttribute('data-admin-slug')
        el.removeAttribute('data-admin-changed')
        el.classList.remove('v-editable', 'v-editable--active', 'v-editable--changed')
        return
      }

      const rawPath = binding.value
      if (!rawPath || rawPath.startsWith('undefined') || rawPath.startsWith('null')) return

      let path = rawPath
      let targetSlug =
        el.dataset.adminSlug ||
        el.closest('[data-admin-slug]')?.getAttribute('data-admin-slug') ||
        (el.closest('footer') ? 'footer' : null) ||
        (el.closest('header, nav, [data-menu]') ? 'menu' : null) ||
        state.slug ||
        'home'

      // Allow inline path with slug prefix like "footer:contact.items.0.value"
      if (rawPath.includes(':')) {
        const parts = rawPath.split(':')
        targetSlug = parts[0]
        path = parts.slice(1).join(':')
      }

      el.dataset.editPath = path
      el.dataset.adminSlug = targetSlug
      el.classList.add('v-editable')

      registerOrigin(path, { slug: targetSlug }, el)

      // Set initial editable state
      setEditable(el, state.canEdit && state.editMode)
      ensureBaseline(path, state.language, getText(el), targetSlug)

      // Restore existing draft from LocalStorage if present
      const existingDraft = state.changes[path]?.[state.language]?.draft
      if (existingDraft !== undefined && existingDraft !== null) {
        if (getText(el) !== existingDraft) {
          el.textContent = existingDraft
        }
      }
      updateElementState(el, path, state.language)

      // Zero-lag, non-destructive input handler
      let inputDebounceTimer: any = null

      const onInput = () => {
        // Fast in-memory text reading without forced innerText layout reflow
        const text = getText(el)

        // Mark local visual dirty state instantly
        el.classList.add('v-editable--changed')
        el.setAttribute('data-admin-changed', 'true')

        // Debounce store updates so rapid keystrokes (e.g. "aaaaaa") have 0ms latency and 0 CPU thrashing
        if (inputDebounceTimer) clearTimeout(inputDebounceTimer)
        inputDebounceTimer = setTimeout(() => {
          setDraftValue(path, state.language, text, targetSlug, false)
        }, 200)
      }

      const onKeyDown = (e: KeyboardEvent) => {
        // Intercept Shift+Space to insert true Persian ZWNJ (\u200C / نیم‌فاصله)
        if (e.shiftKey && (e.code === 'Space' || e.key === ' ')) {
          e.preventDefault()
          insertZwnjAtCursor()
          onInput()
        }
      }

      const onFocus = () => {
        (el as any)._isFocused = true
        activeEditingEl = el

        // GSAP SplitText revert bridge: safely revert any split spans before typing
        if ((el as any)._split) {
          (el as any)._hadSplit = true
          ;(el as any)._split.revert()
          (el as any)._split = null
        } else if (el.querySelector('.split-word, .split-line, .split-char')) {
          (el as any)._hadSplit = true
          el.textContent = getText(el)
        }

        if (state.canEdit && state.editMode) {
          setEditingActive(path, true)
          showHoverBadge(el, path)
        }
      }

      const onBlur = () => {
        if (inputDebounceTimer) {
          clearTimeout(inputDebounceTimer)
          inputDebounceTimer = null
        }
        (el as any)._isFocused = false
        setEditingActive(null, false)
        const text = getText(el)
        if (state.editMode) {
          // On blur, sync to clientOverrides so reactive inspectors & other components update safely
          setDraftValue(path, state.language, text, targetSlug, true)
        } else {
          setValueSilently(path, state.language, text, targetSlug)
        }
        updateElementState(el, path, state.language)

        if ((el as any)._hadSplit) {
          (el as any)._hadSplit = false
          el.dispatchEvent(new CustomEvent('admin:split-rebuild', { bubbles: true }))
        }

        // Allow clicking toolbar buttons without losing active lock
        setTimeout(() => {
          if (document.activeElement !== el && !isHoveringBadge) {
            if (activeEditingEl === el) {
              activeEditingEl = null
            }
            hideHoverBadge()
          }
        }, 150)
      }

      const onMouseEnter = () => {
        if (state.canEdit && state.editMode) {
          // If another element is currently being edited, do NOT let mouseover hijack the toolbar!
          if (activeEditingEl && activeEditingEl !== el) return
          if (!(el as any)._isFocused && document.activeElement !== el) {
            showHoverBadge(el, path)
          }
        }
      }

      const onMouseLeave = () => {
        // If this element is currently being edited, keep the toolbar visible!
        if (activeEditingEl === el || (el as any)._isFocused || document.activeElement === el) {
          return
        }
        hideHoverBadge()
      }

      const onMouseDown = (e: MouseEvent) => {
        if (state.canEdit && state.editMode) {
          e.stopPropagation()
        }
      }

      const onClick = (e: MouseEvent) => {
        if (state.canEdit && state.editMode) {
          e.stopPropagation()
          el.focus()
        }
      }

      const onPaste = (e: ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData?.getData('text/plain') || ''
        document.execCommand('insertText', false, text)
      }

      el.addEventListener('input', onInput)
      el.addEventListener('focus', onFocus)
      el.addEventListener('blur', onBlur)
      el.addEventListener('mouseenter', onMouseEnter)
      el.addEventListener('mouseleave', onMouseLeave)
      el.addEventListener('mousedown', onMouseDown)
      el.addEventListener('click', onClick)
      el.addEventListener('paste', onPaste)
      el.addEventListener('keydown', onKeyDown)

      ;(el as any)._adminCleanup = () => {
        if (inputDebounceTimer) clearTimeout(inputDebounceTimer)
        el.removeEventListener('input', onInput)
        el.removeEventListener('focus', onFocus)
        el.removeEventListener('blur', onBlur)
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
        el.removeEventListener('mousedown', onMouseDown)
        el.removeEventListener('click', onClick)
        el.removeEventListener('paste', onPaste)
        el.removeEventListener('keydown', onKeyDown)
      }
    },

    updated(el: HTMLElement, binding: DirectiveBinding<string>) {
      if (!hasSuperuser.value) {
        el.removeAttribute('contenteditable')
        el.removeAttribute('data-edit-path')
        el.removeAttribute('data-admin-slug')
        el.removeAttribute('data-admin-changed')
        el.classList.remove('v-editable', 'v-editable--active', 'v-editable--changed')
        return
      }

      const rawPath = binding.value
      if (!rawPath) return

      let path = rawPath
      let targetSlug =
        el.dataset.adminSlug ||
        el.closest('[data-admin-slug]')?.getAttribute('data-admin-slug') ||
        (el.closest('footer') ? 'footer' : null) ||
        (el.closest('header, nav, [data-menu]') ? 'menu' : null) ||
        state.slug ||
        'home'

      if (rawPath.includes(':')) {
        const parts = rawPath.split(':')
        targetSlug = parts[0]
        path = parts.slice(1).join(':')
      }

      el.dataset.editPath = path
      el.dataset.adminSlug = targetSlug

      registerOrigin(path, { slug: targetSlug }, el)

      setEditable(el, state.canEdit && state.editMode)
      updateElementState(el, path, state.language)
    },

    unmounted(el: any) {
      el._adminCleanup?.()
      if (hoverActiveTarget === el) {
        hideHoverBadge()
      }
    }
  })

  // Global Keyboard Shortcuts
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      const target = e.target as HTMLElement
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.getAttribute('contenteditable') === 'true' || target?.getAttribute('contenteditable') === 'plaintext-only'

      // Toggle edit mode: ⌘/Ctrl + E
      if (meta && e.key.toLowerCase() === 'e') {
        if (!hasSuperuser.value) return
        e.preventDefault()
        const next = !state.canEdit
        state.canEdit = next
        state.editMode = next
        if (next) {
          try { sessionStorage.setItem('admin_editor_active', 'true') } catch {}
          toast('Visual Editor Activated', 'success')
        } else {
          try { sessionStorage.removeItem('admin_editor_active') } catch {}
          toast('Visual Editor Closed (Visitor Mode)', 'info')
        }
        return
      }

      // Save draft: ⌘/Ctrl + S
      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('admin-save'))
        return
      }

      // Unified Panel / Inspector: ⌘/Ctrl + K
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggleUnifiedPanel()
        return
      }

      // Discard / Close panels: Escape
      if (e.key === 'Escape') {
        if (state.unifiedPanelOpen) {
          closeUnifiedPanel()
          return
        }
        if (state.paletteOpen) {
          state.paletteOpen = false
          return
        }
        if (state.inspectorOpen) {
          state.inspectorOpen = false
          return
        }
        if (state.historyOpen) {
          state.historyOpen = false
          return
        }
        if (!isInput && changedCountForLang(state.language) > 0) {
          window.dispatchEvent(new CustomEvent('admin-discard'))
        }
      }
    })

    window.addEventListener('toast', (e: any) => {
      toast(e.detail?.text || 'Notification', e.detail?.type || 'info')
    })
  }
})

