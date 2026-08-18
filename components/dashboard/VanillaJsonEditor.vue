<!-- components/dashboard/VanillaJsonEditor.vue -->
<template>
  <div class="w-full h-full flex flex-col overflow-hidden bg-[#1e293b] rounded-2xl border border-slate-700 select-text">
    <div ref="editorContainerRef" class="w-full h-full jse-theme-dark"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  modelValue: any
  readOnly?: boolean
  mode?: 'tree' | 'text' | 'table'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}>()

const editorContainerRef = ref<HTMLElement | null>(null)
let jsonEditorInstance: any = null

onMounted(async () => {
  if (!process.client || !editorContainerRef.value) return

  try {
    const { createJSONEditor } = await import('vanilla-jsoneditor')

    jsonEditorInstance = createJSONEditor({
      target: editorContainerRef.value,
      props: {
        content: { json: props.modelValue || {} },
        mode: props.mode || 'tree',
        readOnly: props.readOnly || false,
        mainMenuBar: true,
        navigationBar: true,
        statusBar: true,
        askToFormat: true,
        onChange: (updatedContent: any) => {
          let updatedJson: any = null
          if ('json' in updatedContent) {
            updatedJson = updatedContent.json
          } else if ('text' in updatedContent) {
            try {
              updatedJson = JSON.parse(updatedContent.text)
            } catch (e) {
              // Syntax error while typing in text mode
              return
            }
          }
          emit('update:modelValue', updatedJson)
          emit('change', updatedJson)
        }
      }
    })
  } catch (err) {
    console.error('Failed to initialize vanilla-jsoneditor:', err)
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (jsonEditorInstance && newVal !== undefined) {
      try {
        jsonEditorInstance.update({ json: newVal })
      } catch (e) {
        // Safe update
      }
    }
  },
  { deep: false }
)

onBeforeUnmount(() => {
  if (jsonEditorInstance) {
    try {
      jsonEditorInstance.destroy()
    } catch (e) {
      // Destroy
    }
  }
})
</script>

<style>
/* Dark theme customization for vanilla-jsoneditor */
.jse-theme-dark {
  --jse-theme-color: #018786;
  --jse-theme-color-highlight: #00bfa5;
  --jse-background-color: #0b0f19;
  --jse-panel-background: #0f172a;
  --jse-main-border: 1px solid #1e293b;
  --jse-text-color: #e2e8f0;
  --jse-key-color: #38bdf8;
  --jse-value-color-number: #fb923c;
  --jse-value-color-boolean: #a855f7;
  --jse-value-color-string: #34d399;
  --jse-value-color-null: #f43f5e;
  height: 100%;
}
.jse-main {
  border: none !important;
  border-radius: 0.75rem;
}
</style>
