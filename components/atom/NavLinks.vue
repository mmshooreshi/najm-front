<!-- components/atom/NavLinks.vue -->
<template>
  <nav class="flex items-center" aria-label="Desktop Main Navigation">
    <ul class="flex flex-row items-center gap-3 lg:gap-5 text-xs lg:text-sm font-medium select-none">
      <li
        v-for="(item, idx) in visibleNavItems"
        :key="item.id || idx"
        class="relative group py-1"
        :class="{
          'hidden xl:block': idx === 4 && !isEditMode,
          'opacity-60 border border-dashed border-amber-400/80 rounded-lg px-2 py-0.5': item.archived
        }"
      >
        <NuxtLink
          :to="formatToUrl(item.slug)"
          class="hover:text-najmgreen text-gray-700 transition-colors duration-200 py-1.5 px-1 block whitespace-nowrap"
          active-class="text-najmgreen font-bold"
        >
          <span v-editable="`headerNav.${idx}.name`">{{ item.name }}</span>
        </NuxtLink>

        <!-- Archived Indicator in Admin Mode -->
        <span
          v-if="item.archived && canEdit && isEditMode"
          class="absolute -top-2 -right-1 bg-amber-500 text-zinc-950 font-bold text-[9px] px-1.5 rounded-full shadow-xs"
        >
          آرشیو
        </span>

        <!-- In-Place Admin Toolbar on Hover -->
        <div
          v-if="canEdit && isEditMode"
          class="absolute -bottom-8 right-1/2 translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-zinc-950/95 text-white rounded-lg p-1 border border-white/20 shadow-xl backdrop-blur-md z-50 text-[10px]"
          @click.stop
        >
          <!-- Move Left -->
          <button
            v-if="idx > 0"
            type="button"
            @click="onMove(idx, idx - 1)"
            class="p-1 rounded hover:bg-white/20 text-zinc-300 hover:text-white transition cursor-pointer"
            title="انتقال به قبل (Move Left)"
          >
            <svg class="w-3 h-3 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Move Right -->
          <button
            v-if="idx < totalCount - 1"
            type="button"
            @click="onMove(idx, idx + 1)"
            class="p-1 rounded hover:bg-white/20 text-zinc-300 hover:text-white transition cursor-pointer"
            title="انتقال به بعد (Move Right)"
          >
            <svg class="w-3 h-3 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Archive / Restore Toggle -->
          <button
            type="button"
            @click="onToggleArchive(idx, item)"
            class="p-1 rounded hover:bg-amber-500/30 text-amber-300 transition cursor-pointer"
            :title="item.archived ? 'بازگردانی از آرشیو (Restore)' : 'انتقال به آرشیو (Archive)'"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>

          <!-- Remove Item -->
          <button
            type="button"
            @click="onRemove(idx)"
            class="p-1 rounded hover:bg-rose-500/30 text-rose-300 transition cursor-pointer"
            title="حذف (Delete)"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </li>

      <!-- Subtle Add Link in Admin Mode -->
      <li v-if="canEdit && isEditMode" class="list-none">
        <button
          type="button"
          @click="onAdd"
          class="h-7 px-2.5 rounded-lg border border-dashed border-emerald-500/60 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          title="افزودن لینک جدید به هدر"
        >
          <span class="text-sm leading-none">+</span>
          <span class="hidden xl:inline">لینک جدید</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMenuUIData } from '@/composables/ui/menuUI'
import { useLocale } from '~/composables/useLocale'
import {
  adminEditState as state,
  moveArrayItem,
  removeArrayItem,
  addArrayItem
} from '@/store/adminEditStore'

const { localePath } = useLocale()
const { menuUIData } = useMenuUIData()

const canEdit = computed(() => state.canEdit)
const isEditMode = computed(() => state.editMode)

// Extract headerNav items or fallback to top items from links and contact
const rawNavItems = computed<any[]>(() => {
  if (Array.isArray(menuUIData.value?.headerNav) && menuUIData.value.headerNav.length > 0) {
    return menuUIData.value.headerNav
  }

  const extracted: any[] = []
  const linksChildren = menuUIData.value?.links?.children || []
  const contactChildren = menuUIData.value?.contact?.children || []

  for (const item of [...linksChildren, ...contactChildren]) {
    extracted.push({
      id: item.id,
      name: item.name,
      slug: item.slug,
      order: item.order || extracted.length + 1
    })
  }

  return extracted
})

// In visitor mode: filter out archived items, limit to top 5 max (top 4 on lg, 5th on xl)
// In admin edit mode: show all items so admin can manage them
const visibleNavItems = computed(() => {
  if (canEdit.value && isEditMode.value) {
    return rawNavItems.value
  }
  return rawNavItems.value.filter(item => !item.archived).slice(0, 5)
})

const totalCount = computed(() => rawNavItems.value.length)

function formatToUrl(slug = ''): string {
  if (!slug) return localePath('/')
  if (slug.startsWith('http')) return slug
  const clean = slug.startsWith('/') ? slug : '/' + slug
  return localePath(clean)
}

function onMove(fromIdx: number, toIdx: number) {
  moveArrayItem('headerNav', fromIdx, toIdx, state.language || 'fa', 'menu')
}

function onToggleArchive(idx: number, item: any) {
  const currentLang = state.language || 'fa'
  const isArchived = Boolean(item.archived)
  const updated = [...rawNavItems.value]
  updated[idx] = { ...updated[idx], archived: !isArchived }
  state.clientOverrides.menu = state.clientOverrides.menu || {}
  state.clientOverrides.menu[currentLang] = state.clientOverrides.menu[currentLang] || {}
  state.clientOverrides.menu[currentLang].headerNav = updated
  window.dispatchEvent(new CustomEvent('najm:admin-change', {
    detail: { path: 'headerNav', lang: currentLang, slug: 'menu' }
  }))
}

function onRemove(idx: number) {
  removeArrayItem('headerNav', idx, state.language || 'fa', 'menu')
}

function onAdd() {
  const currentLang = state.language || 'fa'
  const defaultItem = {
    id: Date.now(),
    name: currentLang === 'en' ? 'New Link' : currentLang === 'ar' ? 'رابط جديد' : 'لینک جدید',
    slug: '/',
    order: rawNavItems.value.length + 1
  }
  addArrayItem('headerNav', rawNavItems.value.length - 1, currentLang, 'menu', defaultItem)
}
</script>
