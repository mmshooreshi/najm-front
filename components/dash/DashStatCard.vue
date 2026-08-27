<!-- components/dash/DashStatCard.vue -->
<template>
  <div class="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/10 p-4 sm:p-5 backdrop-blur-md transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/20 group">
    <!-- Ambient Glow Accent -->
    <div
      class="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 pointer-events-none"
      :class="glowColorClass"
    ></div>

    <div class="relative z-10 flex items-start justify-between">
      <div class="space-y-1">
        <p class="text-xs font-semibold text-zinc-400 font-d4">{{ title }}</p>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">{{ value }}</span>
          <span v-if="unit" class="text-xs font-medium text-zinc-400">{{ unit }}</span>
        </div>
      </div>

      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs transition-transform duration-200 group-hover:scale-105"
        :class="iconBgClass"
      >
        <AdminIcon :name="icon" class="w-5 h-5" :class="iconColorClass" />
      </div>
    </div>

    <!-- Subtitle / Trend Badge -->
    <div v-if="subtitle || change !== undefined" class="relative z-10 mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
      <span class="text-zinc-400 text-[11px] truncate">{{ subtitle }}</span>
      <span
        v-if="change !== undefined"
        class="font-semibold text-[11px] px-1.5 py-0.5 rounded-md font-mono"
        :class="change >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'"
      >
        {{ change >= 0 ? '+' : '' }}{{ change }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

interface Props {
  title: string
  value: string | number
  icon: string
  unit?: string
  subtitle?: string
  change?: number
  variant?: 'emerald' | 'amber' | 'cyan' | 'purple' | 'rose'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'emerald'
})

const glowColorClass = computed(() => {
  switch (props.variant) {
    case 'amber': return 'bg-amber-500'
    case 'cyan': return 'bg-cyan-500'
    case 'purple': return 'bg-purple-500'
    case 'rose': return 'bg-rose-500'
    default: return 'bg-emerald-500'
  }
})

const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'amber': return 'bg-amber-500/10 border-amber-500/20'
    case 'cyan': return 'bg-cyan-500/10 border-cyan-500/20'
    case 'purple': return 'bg-purple-500/10 border-purple-500/20'
    case 'rose': return 'bg-rose-500/10 border-rose-500/20'
    default: return 'bg-emerald-500/10 border-emerald-500/20'
  }
})

const iconColorClass = computed(() => {
  switch (props.variant) {
    case 'amber': return 'text-amber-400'
    case 'cyan': return 'text-cyan-400'
    case 'purple': return 'text-purple-400'
    case 'rose': return 'text-rose-400'
    default: return 'text-emerald-400'
  }
})
</script>
