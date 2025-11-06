<!-- components/admin/AdminTip.vue -->
<script setup lang="ts">
import ClipboardIcon from '~/components/clipboardIcon.vue'

const props = defineProps<{ rows: string }>()
</script>

<template>
  <div class="admin-tip">
    <pre>{{ rows }}</pre>
    <ClipboardIcon :text="rows" />
  </div>
</template>

<style scoped>
.admin-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  line-height: 1.4;
}
</style>
