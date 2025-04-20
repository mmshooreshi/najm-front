<template>
    <div class="relative">
      <input
        v-bind="forward"
        v-model="display"
        :type="numberOnly ? 'tel' : 'text'"
        :placeholder="forward.placeholder"
        @focus="onFocus"
        @blur="onBlur"
        @input="handleInput"
        :class="[
          'rtl w-full rounded-2xl placeholder-transparent focus:placeholder-black/30 bg-transparent px-6 py-5 text-xs font-semibold outline-none ring-0 border transition-colors',
          borderClass,
          forward.class,
          forward.disabled && 'cursor-not-allowed opacity-60'
        ]"
      />
  
      <!-- floating label using VueUse Motion -->
      <label
        ref="labelRef"
        class="absolute right-5 top-4 bg-[#F9FBFA] text-gray-500 pointer-events-none z-10 will-change-transform px-2"
      >
        {{ forward.floatinglabel }}
      </label>
  
      <!-- clear icon -->
      <div v-if="(display&&state!=='success')||iconName"
     @click="display&&state!=='success'&&(display='')"
     :class="['absolute inset-y-0 flex items-center h-full w-5 group',position+'-3',iconColor]">
  <span v-if="display&&state!=='success'" class="relative w-5 h-5 cursor-pointer group">
    <span class="absolute inset-0 rounded-full bg-gray-300/50 transform transition duration-200 scale-75 group-hover:scale-150 group-hover:opacity-100"/>
    <Icon name="mdi:close-circle" class="w-5 h-5 text-black/80"/>
  </span>
  <span v-else class="relative w-5 h-5 flex flex-row">
    <div class="rtl absolute z-10 w-max max-w-xs px-3 -mt-2 pt-1.5 pb-1.5 flex items-center text-xs text-white bg-black/80 rounded-xl shadow-sm opacity-0 leading-6 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                :class="[position === 'right' ? 'left-full ml-2' : 'right-full mr-2']">
                {{ tooltipText }}
            </div>

    <Icon v-if="iconName!=='mdi:alert-circle'" :name="iconName" class="w-5 h-5"/>
  </span>
</div>

    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, watch, useAttrs, defineProps, withDefaults } from 'vue'
  import { toPersianDigits, toEnglishDigits } from '~/utils/digits'
  import { useMotionProperties, useSpring } from '@vueuse/motion'
  
  // Props
  const props = withDefaults(defineProps<{ persian?: boolean; iconName?: string | null; position?: 'right' | 'left'; tooltip?: string; numberOnly?: boolean }>(), {
    persian: false,
    iconName: null,
    position: 'right',
    tooltip: 'هیچ',
    numberOnly: false,
  })
  
  // Forward attrs & v-model
  const attrs = useAttrs()
  const { persian, ...forward } = attrs as Record<string, any>
  const model = defineModel<string | number | null>()
  const display = computed({
    get: () => props.persian
      ? toPersianDigits(String(model.value ?? ''))
      : String(model.value ?? ''),
    set: v => model.value = props.persian ? toEnglishDigits(v) : v,
  })
  const handleInput = (e: Event) => {
    const t = e.target as HTMLInputElement
    t.value = props.numberOnly ? t.value.replace(/[^\d۰-۹]/g, '') : t.value
    display.value = t.value
  }
  
  // Focus state
  const isFocused = ref(false)
  const onFocus = () => { isFocused.value = true }
  const onBlur = () => { isFocused.value = false }
  
  // Validation styling
  const state = computed(() =>
    props.iconName?.includes('check') ? 'success'
    : props.iconName?.includes('alert') || props.iconName?.includes('error') ? 'error'
    : 'default'
  )
  const borderClass = computed(() =>
    state.value === 'success' ? 'border-green-500 text-green-600 focus:border-green-500'
    : state.value === 'error'   ? ''
    : 'border-gray-300 text-gray-500'
  )
  const iconColor = computed(() =>
    state.value === 'success' ? 'text-green-500'
    : state.value === 'error'   ? ''
    : 'text-gray-400'
  )
  const tooltipText = computed(() =>
    props.iconName?.includes('check') ? 'عالیه!'
    : props.iconName?.includes('alert') ? 'شماره‌ی موبایل باید با ۰۹ شروع شود.'
    : props.iconName?.includes('error') ? 'بد شد'
    : props.tooltip || ''
  )
  
  // Motion for label
  const labelRef = ref<HTMLElement | null>(null)
  const { motionProperties } = useMotionProperties(labelRef, { y: 0, scale: 1 })
  const { set: animateLabel } = useSpring(motionProperties, { stiffness: 200, damping: 20 })
  
  // Trigger animation on floating state change
  const isFloating = computed(() => isFocused.value || !!display.value)
  watch(isFloating, f => {
    animateLabel({ y: f ? -28 : 0, scale: f ? 0.65 : 1 })
  }, { immediate: true })
  </script>
  
  <style>
  label {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform-origin: right center;
    background-color: #F9FBFA;
    padding: 0;
  }
  </style>
  