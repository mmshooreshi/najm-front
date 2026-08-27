<!-- components/admin/FolderTreeNode.vue -->
<template>
  <div class="space-y-0.5 select-none font-sans text-xs">
    <!-- Folder Row -->
    <div
      class="group flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-all border text-xs"
      :class="[
        isSelected
          ? 'bg-najmgreen text-white font-bold border-emerald-500 shadow-xs'
          : 'text-zinc-300 hover:text-white hover:bg-white/5 border-transparent',
        isDragOver ? 'ring-2 ring-emerald-400 bg-emerald-500/20' : ''
      ]"
      :style="{ paddingRight: `${node.depth * 14 + 10}px` }"
      @click="onSelect"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
      :title="node.path"
    >
      <div class="flex items-center gap-1.5 min-w-0 truncate">
        <!-- Chevron toggle for folders with children -->
        <button
          v-if="hasChildren"
          type="button"
          class="w-4 h-4 rounded hover:bg-white/10 flex items-center justify-center transition-transform shrink-0 cursor-pointer"
          :class="isExpanded ? 'rotate-90 text-emerald-300' : 'text-zinc-400 hover:text-white'"
          @click.stop="onToggle"
          :title="isExpanded ? 'بستن زیرپوشه‌ها' : 'باز کردن زیرپوشه‌ها'"
        >
          <AdminIcon name="chevron-left" class="w-3 h-3" />
        </button>
        <span v-else class="w-4 shrink-0"></span>

        <!-- Folder Icon -->
        <AdminIcon
          :name="isExpanded ? 'folder-open' : 'folder'"
          class="w-4 h-4 shrink-0 transition-colors"
          :class="isSelected ? 'text-white' : isExpanded ? 'text-emerald-400' : 'text-amber-400 group-hover:text-emerald-300'"
        />

        <!-- Folder Name -->
        <span class="truncate font-mono text-[11px]" dir="ltr">
          {{ node.name }}
        </span>
      </div>

      <!-- File Count Badge -->
      <span
        class="px-1.5 py-0.5 rounded-md text-[10px] font-mono shrink-0 ml-1"
        :class="isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'"
      >
        {{ node.totalCount }}
      </span>
    </div>

    <!-- Collapsible Nested Children -->
    <div
      v-if="hasChildren && isExpanded"
      class="border-r border-white/10 mr-3 pr-1 space-y-0.5"
    >
      <FolderTreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :selected-path="selectedPath"
        :expanded-paths="expandedPaths"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
        @drop-file="$emit('dropFile', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

export interface FolderNode {
  name: string
  path: string
  depth: number
  count: number
  totalCount: number
  children: FolderNode[]
}

const props = defineProps<{
  node: FolderNode
  selectedPath: string
  expandedPaths: Set<string>
}>()

const emit = defineEmits<{
  (e: 'select', path: string): void
  (e: 'toggle', path: string): void
  (e: 'dropFile', path: string): void
}>()

const isDragOver = ref(false)

const hasChildren = computed(() => {
  return Array.isArray(props.node.children) && props.node.children.length > 0
})

const isExpanded = computed(() => {
  return props.expandedPaths.has(props.node.path)
})

const isSelected = computed(() => {
  return props.selectedPath === props.node.path
})

function onSelect() {
  emit('select', props.node.path)
}

function onToggle() {
  emit('toggle', props.node.path)
}

function onDrop() {
  isDragOver.value = false
  emit('dropFile', props.node.path)
}
</script>
