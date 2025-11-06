// plugins/admin-edit.client.ts
import { defineNuxtPlugin } from '#app'
import { watchEffect, type DirectiveBinding } from 'vue'
import {
  adminEditState as state,
  getText,
  ensureBaseline,
  setDraftValue,
  setValueSilently,
  isChanged,
  syncLanguage,
  getVersions,
  changedCountForLang,
} from '@/store/adminEditStore'
import { useLocale } from '@/composables/useLocale'
import { toLocalizedDigits } from '~/utils/digits'
import AdminTip from '@/components/admin/AdminTip.vue'
import { createApp, ref } from 'vue'

/** ---------- ContentEditable helpers ---------- **/
function setEditable(el: HTMLElement, on: boolean) {
  el.setAttribute('contenteditable', on ? 'plaintext-only' : 'false')
  el.classList.toggle('v-editable--active', on)
  if (!on) el.blur()
}
function paintChanged(el: HTMLElement, changed: boolean) {
  el.classList.toggle('v-editable--changed', changed)
  el.classList.toggle('v-editable--hint', !changed)
}

/** ---------- Tooltip ---------- **/
let tip: HTMLDivElement | null = null
let tipApp: any = null
const tipRows = ref<string>('')

function showTip(el: HTMLElement, path: string, lang: string) {
  if (!tip) {
    tip = document.createElement('div')
    tip.style.cssText =
      'position:fixed;z-index:999999;max-width:520px;background:rgba(0,0,0,.92);color:#fff;font:12px/1.45 monospace;padding:10px 12px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.35);pointer-events:none;white-space:pre-wrap;opacity:0;transition:opacity .12s'
    document.body.appendChild(tip)
    tipApp = createApp(AdminTip, { rows: tipRows })
    tipApp.mount(tip)
  }
  watchEffect(() => {
    const vers = getVersions(path, lang).slice(-3)
    const rec = state.changes[path]?.[lang]
    const orig = rec?.original ?? ''
    const curr = rec?.draft ?? rec?.value ?? getText(el)
    const changed = isChanged(path, lang)
    const trim = (s: string, n = 100) => (s.length > n ? s.slice(0, n) + '…' : s || '—')
    tipRows.value = [
      `【${lang}】 ${path}`,
      changed ? '● changed' : '✓ clean',
      '',
      `orig: ${trim(toLocalizedDigits(orig) || orig)}`,
      `curr: ${trim(curr)}`,
      '',
      ...vers.map(v => `• ${v.type} · ${new Date(v.date).toLocaleTimeString()} · ${trim(v.value, 80)}`),
    ].join('\n')
  })
  const r = el.getBoundingClientRect()
  tip.style.left = `${Math.max(8, Math.min(window.innerWidth - 368, r.left))}px`
  tip.style.top = `${r.bottom + 6}px`
  tip.style.opacity = '1'
}
function hideTip() { if (tip) tip.style.opacity = '0' }

/** ---------- Diff highlighting ---------- **/
function saveCaret(el: HTMLElement) {
  const sel = window.getSelection()
  if (!sel?.rangeCount || !el.contains(sel.anchorNode)) return -1
  const range = sel.getRangeAt(0).cloneRange()
  range.selectNodeContents(el)
  range.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset)
  return range.toString().length
}
function restoreCaret(el: HTMLElement, pos: number) {
  const sel = window.getSelection()
  // if (!sel) return
  if (!sel || pos < 0) return

  const range = document.createRange()
  let idx = 0
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const next = idx + node.length
    if (pos <= next) {
      range.setStart(node, pos - idx)
      break
    }
    idx = next
  }
  if ((range as any).startContainer === document) { range.selectNodeContents(el); range.collapse(false) }
  if (document.activeElement !== el) el.focus()
  sel.removeAllRanges(); sel.addRange(range)
}

function highlightDiffP(orig: string, curr: string) {
  const m = orig.length, n = curr.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = orig[i] === curr[j]
        ? 1 + dp[i + 1][j + 1]
        : Math.max(dp[i + 1][j], dp[i][j + 1])

  let out = '', i = 0, j = 0
  let buf = '' // collect consecutive changed chars

  const flush = () => {
    if (buf) {
      out += `<span class="v-changed-char">${buf}</span>`
      buf = ''
    }
  }

  while (i < m && j < n) {
    if (orig[i] === curr[j]) {
      flush()
      out += curr[j]
      i++; j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++
    } else {
      buf += curr[j++]
    }
  }

  while (j < n) buf += curr[j++]
  flush()

  return out
}


function highlightDiff(orig: string, curr: string) {
  const origWords = orig.split(/(\s+)/) // keep spaces as tokens
  const currWords = curr.split(/(\s+)/)

  const m = origWords.length, n = currWords.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  // LCS table
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = origWords[i] === currWords[j]
        ? 1 + dp[i + 1][j + 1]
        : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  // reconstruct diff
  let out = ''
  let i = 0, j = 0
  while (i < m && j < n) {
    if (origWords[i] === currWords[j]) {
      out += currWords[j] // unchanged word/space
      i++; j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++ // skip word from orig
    } else {
      out += `<span class="v-changed-block">${currWords[j]}</span>`
      j++
    }
  }
  while (j < n) {
    out += `<span class="v-changed-block">${currWords[j]}</span>`
    j++
  }

  return out
}

function patch(el: HTMLElement, orig: string, curr: string) {
  const caret = saveCaret(el)
  el.innerHTML = highlightDiff(orig, curr)
  // restoreCaret(el, caret)
  if (caret >= 0) restoreCaret(el, caret)

}

/** ---------- Toasts ---------- **/
let toastHost: HTMLDivElement | null = null
function toast(text: string, type: 'success' | 'error' | 'info' = 'info') {
  if (!toastHost) {
    toastHost = document.createElement('div')
    toastHost.style.cssText = 'position:fixed;z-index:100000;right:12px;bottom:12px;display:grid;gap:8px'
    document.body.appendChild(toastHost)
  }
  const el = document.createElement('div')
  el.style.cssText =
    `background:${type==='success'?'rgba(16,185,129,.95)':type==='error'?'rgba(239,68,68,.95)':'rgba(55,65,81,.95)'};color:white;padding:8px 10px;border-radius:10px;box-shadow:0 8px 16px rgba(0,0,0,.25);font:13px/1.3 system-ui`
  el.textContent = text
  toastHost.appendChild(el)
  setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(6px)';setTimeout(()=>el.remove(),200)},2000)
}

/** ---------- Nuxt Plugin ---------- **/
export default defineNuxtPlugin(nuxtApp => {
  const { language } = useLocale()
  state.canEdit = !!document.cookie.split('; ').find(c => c.startsWith('pb_admin='))
  watchEffect(() => syncLanguage(language.value))
  watchEffect(() => {
    const on = state.canEdit && state.editMode
    document.querySelectorAll<HTMLElement>('[data-edit-path]').forEach(el => setEditable(el, on))
  })
  watchEffect(() => {
    for (const [path] of Object.entries(state.changes)) {
      const changed = isChanged(path, state.language)
      document.querySelectorAll<HTMLElement>(`[data-edit-path="${CSS.escape(path)}"]`).forEach(el =>
        paintChanged(el, changed))
    }
  })
  const baseTitle = document.title
  watchEffect(() => { document.title = (changedCountForLang(state.language) ? '● ' : '') + baseTitle })

  nuxtApp.vueApp.directive('editable', {
    mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
      const path = binding.value
      if (!path || path.startsWith('undefined') || path.startsWith('null')) return
      el.dataset.editPath = path
      el.classList.add('v-editable')
      setEditable(el, state.canEdit && state.editMode)
      ensureBaseline(path, state.language, getText(el))
      paintChanged(el, isChanged(path, state.language))
      const onInput = () => {
        setDraftValue(path, state.language, getText(el))
        const rec = state.changes[path]?.[state.language]
        if (rec) patch(el, rec.original, rec.draft ?? rec.value)
      }
      el.addEventListener('input', onInput)
      const mo = new MutationObserver(() => {
        const now = getText(el)
        ensureBaseline(path, state.language, now)
        if (state.editMode && document.activeElement === el) setDraftValue(path, state.language, now)
        else setValueSilently(path, state.language, now)
        paintChanged(el, isChanged(path, state.language))
      })
      mo.observe(el, { childList: true, characterData: true, subtree: true })
      el.addEventListener('mouseenter', () => showTip(el, path, state.language))
      el.addEventListener('mouseleave', hideTip)
      ;(el as any)._cleanup = () => { el.removeEventListener('input', onInput); mo.disconnect() }
    },
updated(el, binding) {
  const rec = state.changes[binding.value]?.[state.language]
  if (!rec || el === document.activeElement) return

  const changed = isChanged(binding.value, state.language)

  clearTimeout((el as any)._stableTimer)

  if (changed) {
    // still changed → show highlight
    ;(el as any)._stableTimer = setTimeout(() => {
      patch(el, rec.original, rec.draft ?? rec.value)
    }, 500)
  } else {
    // 🔥 became clean → strip any old highlight spans
    el.textContent = rec.value ?? rec.original ?? ''
  }
},

    unmounted(el: any) { el._cleanup?.(); hideTip() },
  })

  window.addEventListener('keydown', e => {
    const meta = e.metaKey || e.ctrlKey
    if (meta && e.key.toLowerCase() === 'e') { e.preventDefault(); window.dispatchEvent(new CustomEvent('admin-toggle-edit')) }
    if (meta && e.key.toLowerCase() === 's') { e.preventDefault(); window.dispatchEvent(new CustomEvent('admin-save')) }
    if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); window.dispatchEvent(new CustomEvent('admin-command-palette')) }
    if (e.key === 'Escape' && (e.target as HTMLElement)?.tagName !== 'INPUT') window.dispatchEvent(new CustomEvent('admin-discard'))
    if (e.key === '?' && (e.shiftKey || (e.target as HTMLElement)?.getAttribute('contenteditable'))) { e.preventDefault(); window.dispatchEvent(new CustomEvent('admin-help')) }
  })
  window.addEventListener('toast', (e: any) => toast(e.detail?.text || 'Okay', e.detail?.type || 'info'))
  console.log('[AdminEdit] plugin ready (simplified)')
})
