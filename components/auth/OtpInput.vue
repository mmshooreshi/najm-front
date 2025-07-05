<!-- components/auth/OtpInput.vue -->
<template>
    <div class="flex items-center gap-2 w-full" dir="ltr">
      <input
        v-for="(_, i) in length"
        :key="i"
        ref="fields"
        type="text"
        maxlength="1"
        autocomplete="one-time-code"
        inputmode="numeric"
        class="flex-1 basis-0 min-w-0 h-12 rounded-xl border border-gray-300 text-center text-lg px-3 py-4 font-bold focus:border-primary-600 focus:outline-none"
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
  
  // defer focus to next frame to batch DOM writes
  function focus(idx: number) {
    const el = fields.value[idx]
    if (el) requestAnimationFrame(() => el.focus())
  }
  
  onMounted(() => focus(0))
  
  /** read current values as English digits */
  function readValue(): string {
    return fields.value
      .map(f => toEnglishDigits(f.value))
      .join('')
  }
  
  /** write a single digit into a field (with Persian conversion) */
  function writeField(idx: number, ch: string) {
    const f = fields.value[idx]
    if (f) f.value = props.persian ? toPersianDigits(ch) : ch
  }
  
  /** clear a single field */
  function clearField(idx: number) {
    const f = fields.value[idx]
    if (f) f.value = ''
  }
  
  /** emit combined value */
  function emitValue() {
    emit('update:modelValue', readValue())
  }
  
  /** distribute a sequence of digits starting at idx */
  function distribute(seq: string, idx: number) {
    // slice to max length
    const max = props.length - idx
    const digits = toEnglishDigits(seq).replace(/\D/g, '').slice(0, max).split('')
    digits.forEach((d, i) => writeField(idx + i, d))
    emitValue()
    const next = idx + digits.length
    focus(next < props.length ? next : props.length - 1)
  }
  
  function onInput(idx: number, e: InputEvent) {
    const f = e.target as HTMLInputElement
    let v = f.value
  
    // strip non-digits immediately
    v = toEnglishDigits(v).replace(/\D/g, '')
    if (!v) {
      // nothing valid → clear and emit
      f.value = ''
      emitValue()
      return
    }
  
    if (v.length === 1) {
      // quick path: single digit
      writeField(idx, v)
      emitValue()
      focus(idx + 1 < props.length ? idx + 1 : idx)
    } else {
      // multi-digit or autofill
      distribute(v, idx)
    }
  }
  
  function onPaste(e: ClipboardEvent, idx: number) {
    const text = e.clipboardData?.getData('text') || ''
    distribute(text, idx)
  }
  
  function onBackspace(idx: number, e: KeyboardEvent) {
    const cur = fields.value[idx]
    if (cur?.value) {
      cur.value = ''
      emitValue()
      focus(idx)
    } else if (idx > 0) {
      fields.value[idx - 1].value = ''
      emitValue()
      focus(idx - 1)
    }
  }
  
  watch(
    () => props.modelValue,
    async (newVal = '') => {
      await nextTick()
      const digits = toEnglishDigits(newVal).replace(/\D/g, '').split('')
      for (let i = 0; i < props.length; i++) {
        if (i < digits.length) writeField(i, digits[i])
        else clearField(i)
      }
      focus(digits.length < props.length ? digits.length : props.length - 1)
    },
    { immediate: true }
  )
  </script>
  