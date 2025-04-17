<template>
    <div class="flex items-center justify-between gap-0.5 md:gap-2" dir="ltr">
      <input
        v-for="(_, i) in length"
        :key="i"
        ref="fields"
        type="text"
        maxlength="1"
        class="h-12 w-8 md:w-12 rounded-xl border border-gray-300 text-center text-xl font-bold focus:border-primary-600 focus:outline-none"
        @input="onInput(i, $event)"
        @paste.prevent="onPaste($event, i)"
        @keydown.backspace.prevent="onBackspace(i, $event)"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { toPersianDigits, toEnglishDigits } from '~/utils/digits'
  
  interface Props {
    length?: number
    modelValue?: string
    /** When true, show Persian digits; otherwise show English */
    persian?: boolean
    numberOnly?: boolean

  }
  
  const props = withDefaults(defineProps<Props>(), {
    length: 6,
    modelValue: '',
    persian: false,
    numberOnly: false,
  })
  
  const emit = defineEmits(['update:modelValue'])
  const fields = ref<HTMLInputElement[]>([] as any)
  
  /** Focus input at given index */
  function focus(idx: number) {
    fields.value[idx]?.focus()
  }
  
  onMounted(() => {
    focus(0)
  })
  
  /* ---------- helpers ---------- */
  function setField(idx: number, ch: string) {
    const field = fields.value[idx]
    if (field) {
      field.value = props.persian ? toPersianDigits(ch) : ch
    }
  }
  
  function clearField(idx: number) {
    const field = fields.value[idx]
    if (field) {
      field.value = ''
    }
  }
  
  function emitValue() {
    const val = fields.value.map(f => toEnglishDigits(f.value)).join('')
    emit('update:modelValue', val)
  }
  /* ----------------------------- */
  
/** Handles normal typing and multi‑char autofill */
function onInput(idx: number, e: InputEvent) {
  const field = e.target as HTMLInputElement

  // 1) normalize & strip
  let raw = toEnglishDigits(field.value).replace(/\D/g, '')

  // 2) if there's something valid, distribute; otherwise clear this single field
  if (raw) {
    distribute(raw, idx)
  } else {
    // clear only the current input when user types a non‐digit
    field.value = ''
    emitValue()
  }
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
  
    // Focus next empty or last
    if (cursor < props.length) {
      focus(cursor)
    } else {
      focus(props.length - 1)
    }
  }
  
  /** Improved backspace UX */
  function onBackspace(idx: number, e: KeyboardEvent) {
    e.preventDefault()
    const cur = fields.value[idx]
    if (cur?.value) {
      cur.value = ''
    } else if (idx > 0) {
      const prev = fields.value[idx - 1]
      if (prev) {
        prev.value = ''
      }
      focus(idx - 1)
    }
    emitValue()
  }
  
  /** Watch external model changes: update fields and focus */
  watch(
    () => props.modelValue,
    async (newVal = '') => {
      // Wait for DOM refs to be in place
      await nextTick()
  
      const digits = newVal.split('').map(ch => toEnglishDigits(ch))
      // Populate or clear each field
      for (let i = 0; i < props.length; i++) {
        if (i < digits.length) {
          setField(i, digits[i])
        } else {
          clearField(i)
        }
      }
      // Determine focus index: next empty or last filled
      const nextIdx = digits.length < props.length ? digits.length : props.length - 1
      focus(nextIdx)
    },
    { immediate: true }
  )
  </script>
  