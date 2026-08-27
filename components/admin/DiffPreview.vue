<!-- components/admin/DiffPreview.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { diff_match_patch, DIFF_INSERT, DIFF_DELETE, DIFF_EQUAL } from 'diff-match-patch'

const props = withDefaults(defineProps<{
  before: unknown
  after: unknown
  mode?: 'inline' | 'split'
}>(), {
  mode: 'inline'
})

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] as string))
}

const isMediaDiff = computed(() => {
  const b = String(props.before ?? '').trim()
  const a = String(props.after ?? '').trim()
  const imgRegex = /\.(png|jpe?g|webp|avif|gif|svg|bmp)(\?.*)?$/i
  const isDataOrBlob = (s: string) => s.startsWith('data:image/') || s.startsWith('blob:') || s.startsWith('/images/') || s.startsWith('/api/files/')
  return (imgRegex.test(b) || isDataOrBlob(b)) || (imgRegex.test(a) || isDataOrBlob(a))
})

const beforeSrc = computed(() => String(props.before ?? ''))
const afterSrc = computed(() => String(props.after ?? ''))

const dmp = new diff_match_patch()
dmp.Diff_Timeout = 0.5

const computedDiffs = computed(() => {
  const b = String(props.before ?? '')
  const a = String(props.after ?? '')
  const diffs = dmp.diff_main(b, a)
  dmp.diff_cleanupSemantic(diffs)
  return diffs
})

const diffHtml = computed(() => {
  const b = String(props.before ?? '')
  const a = String(props.after ?? '')
  if (!b && !a) return '<span class="text-neutral-400 italic">Empty</span>'

  return computedDiffs.value.map(([op, text]) => {
    const esc = escapeHtml(text)
    if (op === DIFF_EQUAL) {
      return `<span>${esc}</span>`
    }
    if (op === DIFF_DELETE) {
      return `<del class="inline-block bg-rose-500/35 text-rose-100 font-semibold px-1 py-0.2 rounded border border-rose-500/70 line-through mr-0.5">${esc}</del>`
    }
    if (op === DIFF_INSERT) {
      return `<ins class="inline-block bg-emerald-500/40 text-emerald-50 font-bold px-1 py-0.2 rounded border border-emerald-400/80 no-underline shadow-xs mr-0.5">${esc}</ins>`
    }
    return esc
  }).join('')
})

const beforeSplitHtml = computed(() => {
  const b = String(props.before ?? '')
  if (!b) return '<span class="text-neutral-500 italic">Empty</span>'
  return computedDiffs.value
    .filter(([op]) => op !== DIFF_INSERT)
    .map(([op, text]) => {
      const esc = escapeHtml(text)
      if (op === DIFF_DELETE) {
        return `<del class="inline-block bg-rose-500/40 text-rose-100 font-semibold px-1 py-0.2 rounded border border-rose-500/70 line-through">${esc}</del>`
      }
      return `<span>${esc}</span>`
    })
    .join('')
})

const afterSplitHtml = computed(() => {
  const a = String(props.after ?? '')
  if (!a) return '<span class="text-neutral-500 italic">Empty</span>'
  return computedDiffs.value
    .filter(([op]) => op !== DIFF_DELETE)
    .map(([op, text]) => {
      const esc = escapeHtml(text)
      if (op === DIFF_INSERT) {
        return `<ins class="inline-block bg-emerald-500/45 text-emerald-50 font-bold px-1 py-0.2 rounded border border-emerald-400/80 no-underline shadow-xs">${esc}</ins>`
      }
      return `<span>${esc}</span>`
    })
    .join('')
})
</script>

<template>
  <div class="text-xs leading-relaxed whitespace-pre-wrap break-words select-text">
    <!-- Visual Image Diff Comparison -->
    <div v-if="isMediaDiff" class="grid grid-cols-2 gap-3 p-2 bg-zinc-900/90 rounded-xl border border-white/10">
      <div class="flex flex-col gap-1.5">
        <span class="text-[10px] font-bold uppercase text-rose-400">Original Baseline</span>
        <div class="aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center p-1">
          <img v-if="beforeSrc" :src="beforeSrc" alt="Original Baseline" class="w-full h-full object-contain" />
          <span v-else class="text-[10px] text-zinc-500 italic">None</span>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <span class="text-[10px] font-bold uppercase text-emerald-400">Modified Draft</span>
        <div class="aspect-video bg-black/40 rounded-lg overflow-hidden border border-emerald-500/30 flex items-center justify-center p-1">
          <img v-if="afterSrc" :src="afterSrc" alt="Modified Draft" class="w-full h-full object-contain" />
          <span v-else class="text-[10px] text-zinc-500 italic">None</span>
        </div>
      </div>
    </div>

    <!-- Text Diff Preview -->
    <template v-else>
      <template v-if="mode === 'inline'">
        <div class="p-3 rounded-xl bg-neutral-900/80 border border-white/10 text-neutral-200 text-[12.5px] leading-relaxed shadow-inner">
          <span v-html="diffHtml"></span>
        </div>
      </template>
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div class="p-3 rounded-xl bg-rose-950/25 border border-rose-500/30">
            <div class="flex items-center justify-between text-[10.5px] font-bold text-rose-400 mb-1.5 uppercase tracking-wider">
              <span>Original (Baseline)</span>
              <span class="w-2 h-2 rounded-full bg-rose-500/70"></span>
            </div>
            <div class="text-neutral-200 text-[12px] leading-relaxed" v-html="beforeSplitHtml"></div>
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/30">
            <div class="flex items-center justify-between text-[10.5px] font-bold text-emerald-400 mb-1.5 uppercase tracking-wider">
              <span>Modified (Draft)</span>
              <span class="w-2 h-2 rounded-full bg-emerald-500/70"></span>
            </div>
            <div class="text-emerald-100 text-[12px] leading-relaxed font-medium" v-html="afterSplitHtml"></div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>