<template>
    <div class="flex items-center justify-between gap-2" dir="ltr">
      <input
      @input="onInput(i, $event)"
  @paste.prevent="onPaste($event, i)"
  @keydown.backspace.prevent="onBackspace(i, $event)"
        v-for="(_, i) in length"
        :key="i"
        ref="fields"
        type="tel"
        inputmode="numeric"
        maxlength="1"
        class="h-12 w-12 rounded-xl border border-gray-300 text-center text-xl font-bold focus:border-primary-600 focus:outline-none"
        
      />
    </div>
  </template>
  


  <script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { toPersianDigits, toEnglishDigits } from '~/utils/digits'

interface Props {
  length?: number
  modelValue?: string
  /** When true, show Persian digits; otherwise show English */
  persian?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  modelValue: '',
  persian: false,
})

const emit   = defineEmits(['update:modelValue'])
const fields = ref<HTMLInputElement[]>([] as any)

function focus(idx: number) {
  fields.value[idx]?.focus()
}

onMounted(() => focus(0))

/* ---------- helpers ---------- */
function setField(idx: number, ch: string) {
  fields.value[idx].value = props.persian ? toPersianDigits(ch) : ch
}
function emitValue() {
  const val = fields.value.map(f => toEnglishDigits(f.value)).join('')
  emit('update:modelValue', val)
}
/* ----------------------------- */

/** Handles *both* normal typing and multi‑char autofill */
function onInput(idx: number, e: InputEvent) {
  const raw = toEnglishDigits((e.target as HTMLInputElement).value).replace(/\D/g, '')
  if (!raw) {                          // user deleted
    emitValue()
    return
  }

  distribute(raw, idx)
}

/** Explicit paste (same distribution logic) */
function onPaste(e: ClipboardEvent, idx: number) {
  e.preventDefault()
  const text = toEnglishDigits(e.clipboardData?.getData('text') || '').replace(/\D/g, '')
  distribute(text, idx)
}

/** Put every char of `seq` into successive inputs, starting at `idx` */
function distribute(seq: string, idx: number) {
  let cursor = idx
  for (const ch of seq) {
    if (cursor >= props.length) break
    setField(cursor, ch)
    cursor++
  }

  emitValue()

  // Put the caret on the *next* empty cell (or blur if done)
  if (cursor < props.length) {
    focus(cursor)
  } else {
    focus(cursor-1)
    // fields.value[props.length - 1].blur()
  }
}

/** Improved backspace UX */
function onBackspace(idx: number, e: KeyboardEvent) {
  e.preventDefault()

  const cur = fields.value[idx]
  if (cur.value) {
    cur.value = ''
  } else if (idx > 0) {
    const prev = fields.value[idx - 1]
    prev.value = ''
    focus(idx - 1)
  }
  emitValue()
}

watch(
  () => props.modelValue,
  (v) => {
    if (v.length === props.length) fields.value[props.length - 1].blur()
  },
)
</script>
