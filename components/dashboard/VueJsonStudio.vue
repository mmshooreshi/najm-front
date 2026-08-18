<!-- components/dashboard/VueJsonStudio.vue -->
<template>
  <div class="w-full h-full flex flex-col font-sans text-xs bg-white select-text overflow-hidden">
    <!-- Studio Toolbar -->
    <div class="h-11 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
      <!-- Mode Toggle: Visual Tree vs Raw Code -->
      <div class="flex items-center gap-2">
        <div class="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-bold">
          <button
            @click="editorMode = 'tree'"
            class="px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            :class="editorMode === 'tree' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            <Icon name="mdi:file-tree-outline" class="w-3.5 h-3.5" />
            <span>درخت تعاملی (Interactive Tree)</span>
          </button>

          <button
            @click="syncCodeFromModel(); editorMode = 'code'"
            class="px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            :class="editorMode === 'code' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            <Icon name="mdi:code-json" class="w-3.5 h-3.5" />
            <span>ویرایشگر کد (Code Editor)</span>
          </button>
        </div>

        <!-- Search Filter (in Tree Mode) -->
        <div v-if="editorMode === 'tree'" class="relative w-36 sm:w-48">
          <Icon name="mdi:magnify" class="absolute right-2 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            v-model="searchFilter"
            type="text"
            placeholder="فیلتر کلید یا مقدار..."
            class="w-full bg-white border border-slate-200 rounded-lg pr-7 pl-2 py-1 text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
          />
        </div>
      </div>

      <!-- Code Actions (Format, Minify, Copy) -->
      <div class="flex items-center gap-1.5">
        <button
          v-if="editorMode === 'code'"
          @click="beautifyJson"
          class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition cursor-pointer shadow-2xs"
          title="مرتب‌سازی خودکار (Beautify)"
        >
          مرتب‌سازی
        </button>

        <button
          v-if="editorMode === 'code'"
          @click="minifyJson"
          class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition cursor-pointer shadow-2xs"
          title="فشرده‌سازی (Minify)"
        >
          فشرده
        </button>

        <button
          @click="copyJson"
          class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
        >
          <Icon name="mdi:content-copy" class="w-3 h-3" />
          <span>{{ copied ? 'کپی شد!' : 'کپی' }}</span>
        </button>
      </div>
    </div>

    <!-- 1. TREE MODE -->
    <div v-if="editorMode === 'tree'" class="flex-1 p-3 sm:p-4 overflow-y-auto bg-slate-50/40">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100">
        <TreeNodeItem
          v-for="k in filteredKeys"
          :key="k"
          :key-name="k"
          :value="modelValue[k]"
          :path="[k]"
          :depth="0"
          @update-path="handlePathUpdate"
          @delete-path="handlePathDelete"
        />
      </div>
    </div>

    <!-- 2. CODE MODE -->
    <div v-else class="flex-1 flex flex-col overflow-hidden bg-slate-900 text-slate-100">
      <div v-if="jsonSyntaxError" class="h-8 px-4 bg-rose-900/80 text-rose-200 text-xs flex items-center gap-2 shrink-0">
        <Icon name="mdi:alert-circle" class="w-4 h-4 text-rose-400" />
        <span>خطای سینتکس JSON: {{ jsonSyntaxError }}</span>
      </div>

      <textarea
        v-model="rawCodeText"
        @input="onCodeInput"
        dir="ltr"
        spellcheck="false"
        class="flex-1 w-full p-4 font-mono text-xs text-emerald-300 bg-slate-900 focus:outline-none resize-none leading-relaxed text-left"
        placeholder="JSON payload..."
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h, resolveComponent } from 'vue'

const props = defineProps<{
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'change', val: Record<string, any>): void
}>()

const editorMode = ref<'tree' | 'code'>('tree')
const searchFilter = ref('')
const copied = ref(false)
const rawCodeText = ref('')
const jsonSyntaxError = ref<string | null>(null)

function syncCodeFromModel() {
  rawCodeText.value = JSON.stringify(props.modelValue, null, 2)
  jsonSyntaxError.value = null
}

function onCodeInput() {
  try {
    const parsed = JSON.parse(rawCodeText.value)
    jsonSyntaxError.value = null
    emit('update:modelValue', parsed)
    emit('change', parsed)
  } catch (e: any) {
    jsonSyntaxError.value = e.message
  }
}

function beautifyJson() {
  try {
    const parsed = JSON.parse(rawCodeText.value)
    rawCodeText.value = JSON.stringify(parsed, null, 2)
    jsonSyntaxError.value = null
  } catch (e) {}
}

function minifyJson() {
  try {
    const parsed = JSON.parse(rawCodeText.value)
    rawCodeText.value = JSON.stringify(parsed)
    jsonSyntaxError.value = null
  } catch (e) {}
}

function copyJson() {
  navigator.clipboard.writeText(JSON.stringify(props.modelValue, null, 2))
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const filteredKeys = computed(() => {
  const allKeys = Object.keys(props.modelValue || {})
  if (!searchFilter.value) return allKeys
  const q = searchFilter.value.toLowerCase()
  return allKeys.filter(k => {
    if (k.toLowerCase().includes(q)) return true
    const val = JSON.stringify(props.modelValue[k]).toLowerCase()
    return val.includes(q)
  })
})

function handlePathUpdate(path: (string | number)[], newVal: any) {
  const clone = JSON.parse(JSON.stringify(props.modelValue))
  let curr = clone
  for (let i = 0; i < path.length - 1; i++) {
    curr = curr[path[i]]
  }
  curr[path[path.length - 1]] = newVal
  emit('update:modelValue', clone)
  emit('change', clone)
}

function handlePathDelete(path: (string | number)[]) {
  const clone = JSON.parse(JSON.stringify(props.modelValue))
  let curr = clone
  for (let i = 0; i < path.length - 1; i++) {
    curr = curr[path[i]]
  }
  const lastKey = path[path.length - 1]
  if (Array.isArray(curr)) {
    curr.splice(Number(lastKey), 1)
  } else {
    delete curr[lastKey]
  }
  emit('update:modelValue', clone)
  emit('change', clone)
}

// Recursive Tree Node Item Component
const TreeNodeItem = defineComponent({
  name: 'TreeNodeItem',
  props: {
    keyName: { type: [String, Number], required: true },
    value: { type: null as any, required: true },
    path: { type: Array as () => (string | number)[], required: true },
    depth: { type: Number, default: 0 }
  },
  emits: ['update-path', 'delete-path'],
  setup(props, { emit }) {
    const isExpanded = ref(true)

    const isObject = computed(() => typeof props.value === 'object' && props.value !== null)
    const isArray = computed(() => Array.isArray(props.value))

    const typeLabel = computed(() => {
      if (isArray.value) return `Array [${props.value.length}]`
      if (isObject.value) return `Object {${Object.keys(props.value).length}}`
      if (typeof props.value === 'string') return 'string'
      if (typeof props.value === 'number') return 'number'
      if (typeof props.value === 'boolean') return 'boolean'
      return 'null'
    })

    return () => {
      const paddingRight = `${props.depth * 16 + 12}px`

      if (isObject.value) {
        const childrenKeys = Object.keys(props.value)
        return h('div', { class: 'border-b border-slate-100 last:border-0' }, [
          h(
            'div',
            {
              class: 'py-2 px-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer select-none',
              style: { paddingRight },
              onClick: () => (isExpanded.value = !isExpanded.value)
            },
            [
              h('div', { class: 'flex items-center gap-2' }, [
                h('span', { class: 'w-4 h-4 flex items-center justify-center text-slate-400 font-mono text-xs' }, isExpanded.value ? '▼' : '▶'),
                h('span', { class: 'font-mono font-bold text-slate-900 text-xs' }, String(props.keyName)),
                h('span', { class: 'px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-mono text-[9px]' }, typeLabel.value)
              ]),
              h('button', {
                class: 'w-5 h-5 flex items-center justify-center rounded hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition',
                onClick: (e: Event) => {
                  e.stopPropagation()
                  emit('delete-path', props.path)
                }
              }, '✕')
            ]
          ),
          isExpanded.value
            ? h(
                'div',
                { class: 'divide-y divide-slate-100/60 bg-slate-50/30' },
                childrenKeys.map((k) =>
                  h(TreeNodeItem, {
                    key: k,
                    keyName: k,
                    value: props.value[k],
                    path: [...props.path, k],
                    depth: props.depth + 1,
                    onUpdatePath: (p: any, v: any) => emit('update-path', p, v),
                    onDeletePath: (p: any) => emit('delete-path', p)
                  })
                )
              )
            : null
        ])
      }

      // Primitive Value Row
      return h(
        'div',
        {
          class: 'py-2 px-3 flex items-center justify-between hover:bg-slate-50/80 gap-3',
          style: { paddingRight }
        },
        [
          h('div', { class: 'flex items-center gap-2 shrink-0' }, [
            h('span', { class: 'font-mono font-bold text-slate-700 text-xs' }, String(props.keyName)),
            h('span', { class: 'px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-mono text-[9px]' }, typeLabel.value)
          ]),
          h('input', {
            type: typeof props.value === 'number' ? 'number' : 'text',
            value: props.value,
            class: 'flex-1 max-w-md bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono text-left focus:outline-none shadow-2xs',
            dir: 'ltr',
            onInput: (e: Event) => {
              const val = (e.target as HTMLInputElement).value
              emit('update-path', props.path, typeof props.value === 'number' ? Number(val) : val)
            }
          }),
          h('button', {
            class: 'w-5 h-5 flex items-center justify-center rounded hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition shrink-0',
            onClick: () => emit('delete-path', props.path)
          }, '✕')
        ]
      )
    }
  }
})
</script>
