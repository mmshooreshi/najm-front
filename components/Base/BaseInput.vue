<template>
    <div class="relative">
        <!-- 1) Keep all your original classes, just add `peer` and clear the real placeholder -->
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
          'absolute right-5 bg-[#F9FBFA] text-gray-500 pointer-events-none z-10 transition-all duration-300 ease-in-out ttt',
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
                    <Icon class="relative h-5 w-5 text-black/80" name="mdi:close-circle" />
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
import { computed, useAttrs } from 'vue'
import { toPersianDigits, toEnglishDigits } from '~/utils/digits'

const isFocused = ref(false)
function onFocus() { isFocused.value = true }
function onBlur() { isFocused.value = false }

interface Props {
    persian?: boolean
    /** Iconify name, e.g. 'mdi:check-circle' */
    iconName?: string | null
    /** 'right' (default) or 'left' */
    position?: 'right' | 'left'
    tooltip?: string
    numberOnly?: boolean

}
const tooltipText = computed(() => {
    if (props.iconName?.includes('check')) return 'عالیه!'
    if (props.iconName?.includes('alert')) return 'شماره‌ی موبایل باید با ۰۹ شروع شود.'
    if (props.iconName?.includes('error')) return 'بد شد'
    return 'هیچ'
})


const props = withDefaults(defineProps<Props>(), {
    persian: false,
    iconName: null,
    position: 'right',
    tooltip: 'هیچ',
    numberOnly: false,

})
function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    let val = target.value

    if (props.numberOnly) {
        val = val.replace(/[^\d۰-۹]/g, '') // allow Persian and English digits only
        target.value = val
    }

    display.value = val
}

const model = defineModel<string | number | null>()

const attrs = useAttrs()

/* presentation ↔ value conversion */
const display = computed({
    get: () =>
        props.persian
            ? toPersianDigits(String(model.value ?? ''))
            : String(model.value ?? ''),
    set: (val: string | number) =>
        (model.value = props.persian ? toEnglishDigits(String(val)) : val),
})

/* simple heuristic → success / error colours */
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
            ? ''
            : 'border-gray-300 text-gray-500',
)

const iconColor = computed(() =>
    state.value === 'success'
        ? 'text-green-500'
        : state.value === 'error'
            ? 'text-rose-600'
            : 'text-gray-400',
)

/* forward all attrs except our own props */
const { persian, ...forward } = attrs as any
</script>

<style>
.ttt {

    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

label {
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  padding: 0;
}

/* when focused or has content */
label.floating {
  top: 0.5rem;
  transform: translateY(-100%);
  font-size: 0.65rem;
  padding: 0 0.5rem;
}
</style>