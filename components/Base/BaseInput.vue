<template>
    <div class="relative">
        <input  @input="handleInput" v-bind="forward" v-model="display" :class="[
            'placeholder-gray-500 focus:placeholder-gray-500/30 w-full rounded-2xl bg-gray/10 focus:bg-transparent px-6 py-5 text-xs font-semibold outline-none ring-0 border transition-colors',
            borderClass,
            forward.class,
            forward.disabled && 'cursor-not-allowed opacity-60',
        ]" />
        <!-- optional status icon -->
        <div v-if="iconName" :name="iconName" :class="[
            'group absolute inset-y-0 flex items-center h-full',
            position === 'right' ? 'right-3' : 'left-3',
            iconColor,
        ]">

            <Icon class="h-5 w-5" :name="iconName" />
            <!-- Tooltip -->
            <div class="rtl absolute z-10 w-max max-w-xs px-3 pt-1.5 pb-1.5 flex items-center text-xs text-white bg-black/80 rounded-xl shadow-sm opacity-0 leading-6 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            :class="[props.position === 'right' ? 'left-full ml-2' : 'right-full mr-2']">
            {{ tooltipText }}
        </div>


        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { toPersianDigits, toEnglishDigits } from '~/utils/digits'

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
  if (props.iconName?.includes('alert')) return 'مطمئنی این شماره‌س!'
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
            ? 'border-rose-600 text-rose-600 focus:border-rose-600'
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