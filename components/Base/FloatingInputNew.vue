<!-- components/Base/FloatingInputNew.vue -->
<template>
  <div class="relative isolate w-full">
    <!-- INPUT FIELD -->
    <input
      v-bind="restAttrs"
      v-model="display"
      :type="inputType"
      :dir="dir"
      :placeholder="placeholder"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @input="handleInput"
      :class="[
        'peer block w-full rounded-2xl bg-transparent px-6 py-5 text-xs font-semibold outline-none transition-colors disabled:cursor-not-allowed',
        borderClass,
        iconPaddingClass
      ]"
    />

    <!-- STATE ICON (check / alert / etc.) -->
    <div
      v-if="iconName"
      :class="[
        'absolute inset-y-0 flex items-center pointer-events-none -mx-2',
        iconPositionClass
      ]"
    >
      <div v-if="tooltipText" class="group relative h-5 w-5">
        <div
          class="absolute z-10 w-max max-w-xs -mt-2 rounded-xl bg-black/80 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          :class="tooltipPositionClass"
        >
          {{ tooltipText }}
        </div>
        <Icon :name="iconName" class="h-5 w-5" />
      </div>
      <Icon v-else :name="iconName" class="h-5 w-5" />
    </div>

    <!-- CLEAR BUTTON or PASSWORD TOGGLE (opposite side) -->
    <button
      v-if="showActionButton"
      type="button"
      :class="[
        'absolute inset-y-0 flex items-center group h-5 w-5 top-5',
        clearPositionClass
      ]"
      @click="onActionButton"
    >
      <span
        class="absolute inset-0 scale-75 rounded-full bg-gray-300/50 opacity-0 transition group-hover:scale-150 group-hover:opacity-100"
      />
      <Icon :name="actionIcon" class="h-5 w-5 text-gray-600" />
    </button>

    <!-- ERROR MESSAGE -->
    <p v-if="error" class="mt-1 text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, useAttrs } from 'vue'
import { useMotionProperties, useSpring } from '@vueuse/motion'
import { toPersianDigits, toEnglishDigits } from '~/utils/digits'

/**
 * Floating input component with RTL/LTR support, Persian digit rendering,
 * clear button, password visibility toggle, and optional state/tooltip icon.
 */

/* -------------------------------------------------------------------------- */
/*                                  Props                                     */
/* -------------------------------------------------------------------------- */

const props = withDefaults(
  defineProps<{
    persian?: boolean
    iconName?: string | null
    iconPosition?: 'left' | 'right'
    tooltip?: string
    numberOnly?: boolean
    error?: string
    floatingLabel?: string
    placeholder?: string
    dir?: 'ltr' | 'rtl'
    /** native input type ("text", "password", etc.) */
    type?: string
  }>(),
  {
    persian: false,
    iconName: null,
    iconPosition: 'left',
    tooltip: '',
    numberOnly: false,
    error: '',
    floatingLabel: '',
    placeholder: '',
    dir: 'rtl',
    type: 'text'
  }
)

/* -------------------------------------------------------------------------- */
/*                              v‑model plumbing                               */
/* -------------------------------------------------------------------------- */

const externalModel = defineModel<string | number | null>()
const display = ref('')

watch(
  () => externalModel.value,
  (val) => {
    display.value = props.persian ? toPersianDigits(String(val ?? '')) : String(val ?? '')
  },
  { immediate: true }
)
watch(display, (val) => {
  externalModel.value = props.persian ? toEnglishDigits(val) : val
})

/* -------------------------------------------------------------------------- */
/*                               State / Computed                             */
/* -------------------------------------------------------------------------- */

const isFocused = ref(false)

const state = computed<'success' | 'error' | 'default'>(() => {
  if (props.iconName?.includes('check')) return 'success'
  if (props.iconName?.includes('alert') || props.iconName?.includes('error')) return 'error'
  return 'default'
})

const borderClass = computed(() => {
  if (state.value === 'success') return 'border-green-500 text-green-600 focus:border-green-500'
  if (props.error) return 'border-red-500 text-red-600 focus:border-red-500'
  if (state.value === 'error') return 'border-yellow-500 text-yellow-600 focus:border-yellow-500'
  return 'border-gray-300 text-gray-700 focus:border-primary-600'
})

const iconPaddingClass = computed(() =>
  actionButtonNeeded.value || props.iconName
    ? props.iconPosition === 'left'
      ? 'pl-12 pr-6'
      : 'pr-12 pl-6'
    : ''
)

const tooltipText = computed(() => {
  if (props.tooltip) return props.tooltip
  if (state.value === 'success') return 'عالیه!'
  if (state.value === 'error') return 'شماره‌ی موبایل باید با ۰۹ شروع شود.'
  return ''
})

/* -------------------------------------------------------------------------- */
/*                         Input type + password toggle                       */
/* -------------------------------------------------------------------------- */

const isPasswordField = computed(() => props.type === 'password')
const isPasswordVisible = ref(false)

const inputType = computed(() => {
  if (props.numberOnly) return 'tel'
  if (isPasswordField.value) return isPasswordVisible.value ? 'text' : 'password'
  return props.type
})

/* -------------------------------------------------------------------------- */
/* Action button (clear or eye)                                               */
/* -------------------------------------------------------------------------- */

const actionButtonNeeded = computed(() => {
  return isPasswordField.value || (display.value && state.value !== 'success')
})

const actionIcon = computed(() => {
  return isPasswordField.value
    ? isPasswordVisible.value
      ? 'mdi:eye-off-outline'
      : 'mdi:eye-outline'
    : 'mdi:close-circle'
})

const showActionButton = computed(() => actionButtonNeeded.value)

function onActionButton() {
  if (isPasswordField.value) {
    isPasswordVisible.value = !isPasswordVisible.value
  } else {
    display.value = ''
  }
}

/* -------------------------------------------------------------------------- */
/*                            Input / Events                                  */
/* -------------------------------------------------------------------------- */

function handleInput(e: Event) {
  const t = e.target as HTMLInputElement
  if (props.numberOnly) t.value = t.value.replace(/[^\d۰-۹]/g, '')
  display.value = t.value
}

/* -------------------------------------------------------------------------- */
/*                        Floating label animation                             */
/* -------------------------------------------------------------------------- */

const labelRef = ref<HTMLElement | null>(null)
const { motionProperties } = useMotionProperties(labelRef, { y: 0, scale: 1 })
const { set: animateLabel } = useSpring(motionProperties, { stiffness: 500, damping: 30 })

const isFloating = computed(() => isFocused.value || !!display.value)
watch(
  isFloating,
  (floating) => {
    animateLabel({ y: floating ? -28 : 0, scale: floating ? 0.65 : 1 })
  },
  { immediate: true }
)

/* -------------------------------------------------------------------------- */
/*                         Direction‑based classes                             */
/* -------------------------------------------------------------------------- */

const iconPositionClass = computed(() =>
  props.iconPosition === 'left' ? 'left-6' : 'right-6'
)

const clearPositionClass = computed(() =>
  props.iconPosition === 'left' ? 'right-6' : 'left-6'
)

const tooltipPositionClass = computed(() =>
  props.iconPosition === 'left' ? 'left-full ml-2' : 'right-full mr-2'
)

/* -------------------------------------------------------------------------- */
/*                            Rest of attrs                                   */
/* -------------------------------------------------------------------------- */

const { class: _class, placeholder: _ph, type: _t, ...restAttrs } = useAttrs() as Record<string, any>
</script>

<style scoped>
label {
  transform-origin: right center;
}
</style>
