<!-- components/dashboard/VanillaJsonEditor.vue -->
<template>
  <div class="w-full h-full flex flex-col overflow-hidden bg-[#0A0E17] select-text">
    <div ref="editorContainerRef" class="w-full h-full jse-theme-butter"></div>
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
/* Butter Theme: Monolithic, Seamless, Borderless Linear Dark Aesthetic */
.jse-theme-butter {
  --jse-theme-color: #018786;
  --jse-theme-color-highlight: #00bfa5;
  --jse-background-color: #070a12;
  --jse-panel-background: #0d121f;
  --jse-main-border: none;
  --jse-text-color: #e2e8f0;
  --jse-key-color: #38bdf8;
  --jse-value-color-number: #fb923c;
  --jse-value-color-boolean: #c084fc;
  --jse-value-color-string: #34d399;
  --jse-value-color-null: #f43f5e;
  --jse-menu-background: #0d121f;
  --jse-menu-button-background: transparent;
  --jse-menu-button-background-hover: rgba(255, 255, 255, 0.06);
  --jse-selection-background-color: rgba(1, 135, 134, 0.25);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 11.5px !important;
  height: 100%;
}

.jse-theme-butter .jse-main {
  border: none !important;
  box-shadow: none !important;
}

.jse-theme-butter .jse-menu {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding: 4px 8px !important;
}

.jse-theme-butter .jse-navigation-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.04) !important;
  background: #070a12 !important;
  color: #64748b !important;
}

.jse-theme-butter .jse-tree-mode,
.jse-theme-butter .jse-text-mode {
  background: #070a12 !important;
}
</style>
