<template>
    <div class="relative">
      <input
        v-bind="forward"
        v-model="display"
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
  
      <!-- floating label -->
      <label
        :class="[
          'absolute right-5 bg-[#F9FBFA] text-gray-500 pointer-events-none z-10 transition ttt px-2',
          { floating: isFocused || !!display }
        ]"
      >
        {{ forward.floatinglabel }}
      </label>
  
      <div @click="display =''" v-if="display && state != 'success'"  :class="['inline-block w-5 h-5 group absolute inset-y-0 flex items-center h-full',
              position === 'right' ? 'right-3' : 'left-3',
              iconColor, ]">
                  <span class="relative inline-block group w-5 h-5 cursor-pointer">
                      <!-- the circle -->
                      <span class="absolute inset-0 bg-gray-300/50 rounded-full
                      transform scale-0 opacity-0
                       ease-out
                      group-hover:scale-150 group-hover:opacity-100"></span>
  
                      <!-- your icon -->
                      <Icon class="relative h-5 w-5 text-black/60" name="mdi:close-circle" />
                  </span>
              </div>
  
          <!-- optional status icon (unchanged) -->
          <div v-if="iconName" :class="[
              'group absolute inset-y-0 flex items-center h-full',
              position === 'right' ? 'right-3' : 'left-3',
              iconColor,
          ]">
              <Icon class="h-5 w-5" v-if="iconName != 'mdi:alert-circle'" :name="iconName" />
              <div class="rtl absolute z-10 w-max max-w-xs px-3 pt-1.5 pb-1.5 flex items-center text-xs text-white bg-black/80 rounded-xl shadow-sm opacity-0 leading-6 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  :class="[position === 'right' ? 'left-full ml-2' : 'right-full mr-2']">
                  {{ tooltipText }}
              </div>
          </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, useAttrs, defineProps, withDefaults } from 'vue'
  import { toPersianDigits, toEnglishDigits } from '~/utils/digits'
  
  interface Props {
    persian?: boolean
    iconName?: string | null
    position?: 'right' | 'left'
    tooltip?: string
    numberOnly?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    persian: false,
    iconName: null,
    position: 'right',
    tooltip: 'هیچ',
    numberOnly: false,
  })
  
  const isFocused = ref(false)
  const onFocus = () => (isFocused.value = true)
  const onBlur = () => (isFocused.value = false)
  
  const attrs = useAttrs()
  const { persian, ...forward } = attrs as any
  
  // Model binding
  const model = defineModel<string | number | null>()
  const display = computed({
    get: () =>
      props.persian
        ? toPersianDigits(String(model.value ?? ''))
        : String(model.value ?? ''),
    set: (val: string) =>
      (model.value = props.persian ? toEnglishDigits(val) : val),
  })
  
  // Input filtering
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    let val = target.value
    if (props.numberOnly) {
      val = val.replace(/[^\d۰-۹]/g, '')
      target.value = val
    }
    display.value = val
  }
  
  // State for styling
  const state = computed(() => {
    if (!props.iconName) return 'default'
    if (props.iconName.includes('check')) return 'success'
    if (props.iconName.includes('alert') || props.iconName.includes('error')) return 'error'
    return 'default'
  })
  
  const borderClass = computed(() =>
    state.value === 'success'
      ? 'border-green-500 text-green-600 focus:border-green-500'
      : state.value === 'error'
      ? 'border-rose-600'
      : 'border-gray-300 text-gray-500'
  )
  
  const iconColor = computed(() =>
    state.value === 'success'
      ? 'text-green-500'
      : state.value === 'error'
      ? 'text-rose-600'
      : 'text-gray-400'
  )
  
  const tooltipText = computed(() => {
    if (props.iconName?.includes('check')) return 'عالیه!'
    if (props.iconName?.includes('alert')) return 'شماره‌ی موبایل باید با ۰۹ شروع شود.'
    if (props.iconName?.includes('error')) return 'بد شد'
    return props.tooltip || ''
  })
  </script>
  
  <style>
  .ttt {
    transition: transform 0.2s ease-in-out;
    will-change: transform;
  }
  
  label {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform-origin: right center;
    transform: translateY(-50%) scale(1) translateZ(0);
    backface-visibility: hidden;
    background-color: #F9FBFA;
    padding: 0;
  }
  
  label.floating {
    transform: translateY(-170%) scale(0.65) translateZ(0);
  }
  </style>
  
