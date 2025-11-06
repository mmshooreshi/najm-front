<!-- components/admin/DiffPreview.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { diff_match_patch, DIFF_INSERT, DIFF_DELETE, DIFF_EQUAL } from 'diff-match-patch'

const props = defineProps<{ before: unknown; after: unknown }>()

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] as string))
}

const dmp = new diff_match_patch()
dmp.Diff_Timeout = 0.5

const diffHtml = computed(() => {
  if (typeof props.before !== 'string' || typeof props.after !== 'string') return ''
  const diffs = dmp.diff_main(props.before, props.after)
  dmp.diff_cleanupSemantic(diffs)
  return diffs.map(([op, text]) => {
    const esc = escapeHtml(text)
    if (op === DIFF_EQUAL)  return esc
    if (op === DIFF_DELETE) return `<del style="color:#b91c1c;text-decoration:line-through">${esc}</del>`
    if (op === DIFF_INSERT) return `<ins style="color:#065f46;text-decoration:underline">${esc}</ins>`
    return esc
  }).join('')
})

function pretty(v: unknown) {
  try { return JSON.stringify(v, null, 2) } catch { return String(v) }
}
</script>

<template>
  <div class="text-xs leading-relaxed font-mono whitespace-pre-wrap break-words">
    <template v-if="typeof before === 'string' && typeof after === 'string'">
      <span v-html="diffHtml"></span>
    </template>
    <template v-else>
      <div class="grid grid-cols-2 gap-2">
        <pre class="bg-black/5 p-1 rounded">{{ pretty(before) }}</pre>
        <pre class="bg-black/5 p-1 rounded">{{ pretty(after) }}</pre>
      </div>
    </template>
  </div>
</template>