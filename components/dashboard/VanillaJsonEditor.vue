<!-- components/dashboard/VanillaJsonEditor.vue -->
<template>
  <div class="w-full h-full flex flex-col overflow-hidden bg-white select-text">
    <div ref="editorContainerRef" class="w-full h-full jse-theme-light-pro"></div>
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
        statusBar: false,
        askToFormat: true,
        onChange: (updatedContent: any) => {
          let updatedJson: any = null
          if ('json' in updatedContent) {
            updatedJson = updatedContent.json
          } else if ('text' in updatedContent) {
            try {
              updatedJson = JSON.parse(updatedContent.text)
            } catch (e) {
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
/* Light Pro Theme: Crisp White, Clean Slate Borders & High Contrast Typography */
.jse-theme-light-pro {
  --jse-theme-color: #018786;
  --jse-theme-color-highlight: #00bfa5;
  --jse-background-color: #ffffff;
  --jse-panel-background: #f8fafc;
  --jse-main-border: 1px solid #e2e8f0;
  --jse-text-color: #0f172a;
  --jse-key-color: #0284c7;
  --jse-value-color-number: #d97706;
  --jse-value-color-boolean: #7c3aed;
  --jse-value-color-string: #059669;
  --jse-value-color-null: #e11d48;
  --jse-menu-background: #f1f5f9;
  --jse-menu-color: #334155;
  --jse-menu-button-background: transparent;
  --jse-menu-button-background-hover: #e2e8f0;
  --jse-selection-background-color: rgba(1, 135, 134, 0.15);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 12px !important;
  height: 100%;
}

.jse-theme-light-pro .jse-main {
  border: none !important;
}

.jse-theme-light-pro .jse-menu {
  border-bottom: 1px solid #e2e8f0 !important;
  padding: 4px 10px !important;
}

.jse-theme-light-pro .jse-navigation-bar {
  border-top: 1px solid #e2e8f0 !important;
  background: #f8fafc !important;
  color: #64748b !important;
}
</style>
