<!-- components/common/SmartPhoneInput.vue -->
<template>
  <div class="smart-phone-input-wrapper space-y-1.5 w-full" :class="isRTL ? 'text-right' : 'text-left'" :dir="isRTL ? 'rtl' : 'ltr'">
    <label v-if="label" class="block text-xs font-bold text-gray-700">
      {{ cleanLabel }}
      <span v-if="required && !cleanLabel.includes('*')" class="text-rose-500 mx-0.5">*</span>
    </label>

    <div
      class="relative flex items-center rounded-2xl border transition-all duration-200 bg-najmback/60 focus-within:bg-white focus-within:border-najmgreen focus-within:ring-2 focus-within:ring-najmgreen/15"
      :class="[
        isFocused
          ? 'border-najmgreen shadow-xs'
          : hasError
            ? 'border-rose-400 bg-rose-50/20'
            : 'border-gray-200/90 hover:border-gray-300'
      ]"
    >
      <!-- Main Input with Locale-Aware Digits Display -->
      <input
        ref="inputRef"
        :value="displayValue"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="handleBlur"
        @paste="handlePaste"
        type="tel"
        inputmode="numeric"
        autocomplete="tel"
        :placeholder="placeholder || (isRTL ? '۰۹۱۲۳۴۵۶۷۸۹' : '09123456789')"
        :dir="isRTL ? 'rtl' : 'ltr'"
        class="w-full py-3 px-4 text-sm font-semibold text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400 placeholder:font-normal tracking-normal"
        :class="isRTL ? 'text-right' : 'text-left'"
        :required="required"
      />

      <!-- Clear / Status Icon -->
      <div v-if="rawDigits" class="flex items-center px-3 shrink-0">
        <button
          type="button"
          @click="clearInput"
          class="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-[10px] transition cursor-pointer"
          :title="isRTL ? 'پاک کردن' : 'Clear'"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Friendly Validation Warning -->
    <p v-if="hasError && rawDigits.length > 3" class="text-[11px] text-rose-500 font-medium pt-0.5">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLocale } from '~/composables/useLocale'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
}>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'valid', isValid: boolean): void
}>()

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const isFarsi = computed(() => (language.value || '').toUpperCase() === 'FA')

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const rawDigits = ref('')

const cleanLabel = computed(() => {
  return (props.label || '').replace(/\*+/g, '').trim()
})

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

function normalizeToAscii(str: string): string {
  if (!str) return ''
  let res = String(str)
  for (let i = 0; i < 10; i++) {
    res = res.replace(new RegExp(persianDigits[i], 'g'), String(i))
    res = res.replace(new RegExp(arabicDigits[i], 'g'), String(i))
  }
  return res.replace(/\D/g, '')
}

function toPersianDigits(str: string): string {
  if (!str) return ''
  return String(str).replace(/\d/g, d => persianDigits[Number(d)] ?? d)
}

function cleanIranianMobile(digits: string): string {
  let d = digits
  if (d.startsWith('0098')) d = d.slice(4)
  if (d.startsWith('98')) d = d.slice(2)
  if (d.startsWith('9') && d.length === 10) d = '0' + d
  return d.slice(0, 11)
}

const displayValue = computed(() => {
  if (isFarsi.value) {
    return toPersianDigits(rawDigits.value)
  }
  return rawDigits.value
})

const isValid = computed(() => {
  const d = rawDigits.value
  return d.length === 11 && d.startsWith('09')
})

const hasError = computed(() => {
  if (!rawDigits.value) return false
  if (isFocused.value) return false
  return !isValid.value
})

const errorMessage = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') return 'Mobile number must be 11 digits starting with 09.'
  if (lang === 'AR') return 'يجب أن يتكون رقم الجوال من 11 رقماً ويبدأ بـ 09.'
  return 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.'
})

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const cleaned = cleanIranianMobile(normalizeToAscii(target.value))
  rawDigits.value = cleaned
  emit('update:modelValue', cleaned)
  emit('valid', isValid.value)
}

function handlePaste(e: ClipboardEvent) {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') || ''
  const cleaned = cleanIranianMobile(normalizeToAscii(pasted))
  rawDigits.value = cleaned
  emit('update:modelValue', cleaned)
  emit('valid', isValid.value)
}

function handleBlur() {
  isFocused.value = false
}

function clearInput() {
  rawDigits.value = ''
  emit('update:modelValue', '')
  emit('valid', false)
  inputRef.value?.focus()
}

watch(
  () => props.modelValue,
  (val) => {
    const cleaned = cleanIranianMobile(normalizeToAscii(val || ''))
    if (cleaned !== rawDigits.value) {
      rawDigits.value = cleaned
    }
  },
  { immediate: true }
)
</script>
