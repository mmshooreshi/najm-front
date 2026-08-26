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

const dmp = new diff_match_patch()
dmp.Diff_Timeout = 0.5

const diffHtml = computed(() => {
  const b = String(props.before ?? '')
  const a = String(props.after ?? '')
  if (!b && !a) return '<span class="text-neutral-400 italic">Empty</span>'

  const diffs = dmp.diff_main(b, a)
  dmp.diff_cleanupSemantic(diffs)

  return diffs.map(([op, text]) => {
    const esc = escapeHtml(text)
    if (op === DIFF_EQUAL) {
      return `<span>${esc}</span>`
    }
    if (op === DIFF_DELETE) {
      return `<del class="bg-rose-500/20 text-rose-300 dark:text-rose-200 line-through px-0.5 rounded border-b border-rose-500/40">${esc}</del>`
    }
    if (op === DIFF_INSERT) {
      return `<ins class="bg-emerald-500/20 text-emerald-300 dark:text-emerald-200 underline font-semibold px-0.5 rounded border-b border-emerald-500/40">${esc}</ins>`
    }
    return esc
  }).join('')
})

function pretty(v: unknown) {
  try {
    if (typeof v === 'string') return v
    return JSON.stringify(v, null, 2)
  } catch {
    return String(v)
  }
}
</script>

<template>
  <div class="text-xs leading-relaxed whitespace-pre-wrap break-words select-text">
    <template v-if="mode === 'inline'">
      <div class="p-2.5 rounded-lg bg-neutral-900/60 border border-white/5 text-neutral-200 text-[12px] leading-relaxed">
        <span v-html="diffHtml"></span>
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div class="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20">
          <div class="text-[10px] font-semibold text-rose-400 mb-1 uppercase tracking-wider">Original</div>
          <div class="text-neutral-300 text-[12px] leading-relaxed">{{ pretty(before) }}</div>
        </div>
        <div class="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
          <div class="text-[10px] font-semibold text-emerald-400 mb-1 uppercase tracking-wider">Modified</div>
          <div class="text-emerald-200 text-[12px] leading-relaxed font-medium">{{ pretty(after) }}</div>
        </div>
      </div>
    </template>
  </div>
</template>