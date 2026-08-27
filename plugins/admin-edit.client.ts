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
  setEditingActive
} from '@/store/adminEditStore'
import { useLocale } from '@/composables/useLocale'
import { logger } from '@/utils/logger'

/** ---------- ContentEditable helpers ---------- **/
function setEditable(el: HTMLElement, on: boolean) {
  el.setAttribute('contenteditable', on ? 'true' : 'false')
  el.setAttribute('spellcheck', 'false')
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

/** ---------- Instant Hover Badge for Editable Elements ---------- **/
let hoverBadgeEl: HTMLDivElement | null = null
let hoverActiveTarget: HTMLElement | null = null
let hideBadgeTimer: any = null

function getOrCreateHoverBadge(): HTMLDivElement {
  if (hoverBadgeEl) return hoverBadgeEl
  hoverBadgeEl = document.createElement('div')
  hoverBadgeEl.className = 'admin-hover-badge'
  hoverBadgeEl.style.cssText = `
    position: fixed;
    z-index: 999999;
    pointer-events: auto;
    display: none;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 500;
    background: rgba(18, 18, 20, 0.95);
    color: #f3f4f6;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    transition: opacity 0.1s ease, transform 0.1s ease;
    transform: translateY(0);
    opacity: 0;
    user-select: none;
  `

  hoverBadgeEl.addEventListener('mouseenter', () => {
    if (hideBadgeTimer) {
      clearTimeout(hideBadgeTimer)
      hideBadgeTimer = null
    }
  })

  hoverBadgeEl.addEventListener('mouseleave', () => {
    hideHoverBadge()
  })

  document.body.appendChild(hoverBadgeEl)
  return hoverBadgeEl
}

function showHoverBadge(el: HTMLElement, path: string) {
  if (!state.canEdit || !state.editMode) return
  if (
    !el ||
    el.closest('[data-admin-ui="true"]') ||
    el.closest('.admin-media-overlay-hud') ||
    el.closest('.media-hud') ||
    el.closest('.admin-edit-bar') ||
    el.closest('.admin-floating-dock') ||
    el.closest('.admin-item-actions') ||
    el.closest('.admin-add-placeholder') ||
    el.closest('.admin-hover-badge')
  ) {
    return
  }
  if (hideBadgeTimer) {
    clearTimeout(hideBadgeTimer)
    hideBadgeTimer = null
  }
  hoverActiveTarget = el
  const badge = getOrCreateHoverBadge()
  const lang = state.language
  const changed = isChanged(path, lang)

  badge.innerHTML = `
    <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${changed ? '#f59e0b' : '#10b981'};flex-shrink:0;"></span>
    <span style="opacity:0.95;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;">${path}</span>
    <button id="admin-hover-copy" style="background:rgba(255,255,255,0.08);color:#d1d5db;border:1px solid rgba(255,255,255,0.12);padding:1px 6px;border-radius:4px;cursor:pointer;font-size:10px;margin-left:2px;">Copy</button>
    ${changed ? `<button id="admin-hover-revert" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4);padding:1px 6px;border-radius:4px;cursor:pointer;font-size:10px;">Revert</button>` : ''}
  `

  const copyBtn = badge.querySelector('#admin-hover-copy')
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(path)
        window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `Copied path: ${path}` } }))
      }
    })
  }

  const revertBtn = badge.querySelector('#admin-hover-revert')
  if (revertBtn) {
    revertBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      revertPath(path, lang)
      showHoverBadge(el, path)
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: `Reverted "${path}"` } }))
    })
  }

  const rect = el.getBoundingClientRect()
  badge.style.display = 'inline-flex'
  badge.style.top = `${Math.max(8, rect.top - 32)}px`
  badge.style.left = `${Math.max(8, rect.left)}px`
  badge.style.opacity = '1'
}

function hideHoverBadge() {
  if (hideBadgeTimer) clearTimeout(hideBadgeTimer)
  hideBadgeTimer = setTimeout(() => {
    if (hoverBadgeEl) {
      hoverBadgeEl.style.opacity = '0'
      setTimeout(() => {
        if (hoverBadgeEl && hoverBadgeEl.style.opacity === '0') {
          hoverBadgeEl.style.display = 'none'
        }
      }, 100)
    }
    hoverActiveTarget = null
  }, 120)
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

  // Initialize admin capability from cookie or dev mode
  const adminCookie = useCookie('pb_admin')
  state.canEdit = !!adminCookie.value || (typeof document !== 'undefined' && document.cookie.includes('pb_admin=')) || process.dev

  if (process.dev) {
    logger.info('Admin:Auth', `Superuser Session: ${state.canEdit ? '✓ Active (canEdit=true)' : '○ Inactive (Visitor Mode)'}`)
  }

  // Keep language in sync
  watch(language, (lang) => {
    if (lang) syncLanguage(lang)
  }, { immediate: true })

  // Toggle contenteditable across all editable elements
  watch(() => [state.canEdit, state.editMode], ([canEdit, editMode]) => {
    const on = !!(canEdit && editMode)
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
  })

  // Update page title badge for unsaved changes
  const baseTitle = typeof document !== 'undefined' ? document.title : ''
  watch(() => changedCountForLang(state.language), (count) => {
    if (typeof document !== 'undefined') {
      document.title = (count > 0 ? `(${count}) ● ` : '') + (baseTitle.replace(/^\(\d+\)\s*●\s*/, ''))
    }
  })

  // Directive: v-editable="path"
  nuxtApp.vueApp.directive('editable', {
    mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
      const path = binding.value
      if (!path || path.startsWith('undefined') || path.startsWith('null')) return

      el.dataset.editPath = path
      el.classList.add('v-editable')

      // Set initial editable state
      setEditable(el, state.canEdit && state.editMode)
      ensureBaseline(path, state.language, getText(el))
      updateElementState(el, path, state.language)

      // Clean, non-destructive input handler
      let inputTimer: any = null
      const onInput = () => {
        const text = getText(el)
        setDraftValue(path, state.language, text)
        updateElementState(el, path, state.language)

        if (hoverActiveTarget === el) {
          showHoverBadge(el, path)
        }
      }

      const onFocus = () => {
        if (state.canEdit && state.editMode) {
          setEditingActive(path, true)
        }
      }

      const onBlur = () => {
        setEditingActive(null, false)
        const text = getText(el)
        if (state.editMode) {
          setDraftValue(path, state.language, text)
        } else {
          setValueSilently(path, state.language, text)
        }
        updateElementState(el, path, state.language)
      }

      const onMouseEnter = () => {
        if (state.canEdit && state.editMode) {
          showHoverBadge(el, path)
        }
      }

      const onMouseLeave = () => {
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

      ;(el as any)._adminCleanup = () => {
        clearTimeout(inputTimer)
        el.removeEventListener('input', onInput)
        el.removeEventListener('focus', onFocus)
        el.removeEventListener('blur', onBlur)
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
        el.removeEventListener('mousedown', onMouseDown)
        el.removeEventListener('click', onClick)
        el.removeEventListener('paste', onPaste)
      }
    },


    updated(el: HTMLElement, binding: DirectiveBinding<string>) {
      const path = binding.value
      if (!path) return
      el.dataset.editPath = path
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
        e.preventDefault()
        state.editMode = !state.editMode
        toast(state.editMode ? 'Edit Mode Activated' : 'Preview Mode', 'info')
        return
      }

      // Save draft: ⌘/Ctrl + S
      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('admin-save'))
        return
      }

      // Command palette / Inspector: ⌘/Ctrl + K
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        state.paletteOpen = !state.paletteOpen
        return
      }

      // Discard / Close modals: Escape
      if (e.key === 'Escape') {
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

