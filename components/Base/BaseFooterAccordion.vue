<!-- components/Base/BaseFooterAccordion.vue -->
<template>
  <div
    class="group bg-[#115247] border border-transparent rounded-xl overflow-hidden transition-colors"
    :class="{ '!border-white/20': open }"
  >
    <!-- Header Button -->
    <button
      type="button"
      class="w-full flex transition-height duration-500 ease justify-between hover:bg-[#023028]/20 items-center py-4 px-6 text-sm gap-2 cursor-pointer bg-transparent border-0 outline-none focus:outline-none focus:ring-0 appearance-none"
      :class="{ 'bg-[#023028]/20': open }"
      @click="toggle"
    >
      <span
        class="text-white/80 group-hover:text-white/100 text-sm text-d4 text-demibold transition-colors"
        v-editable="sectionIndex !== undefined ? `sections.${sectionIndex}.name` : ''"
      >{{ title || '' }}</span>

      <!-- chevron -->
      <Icon
        name="mdi:chevron-down"
        class="w-5 h-5 text-white/80 group-hover:text-white/100 transition-transform duration-300"
        :style="{ transform: `rotate(${open ? 180 : 0}deg)` }"
      />
    </button>

    <!-- Sliding panel with Smooth Transition -->
    <div
      ref="contentRef"
      :style="contentStyles"
      @transitionend="onTransitionEnd"
      class="accordion-content overflow-hidden bg-[#115247]"
    >
      <ul class="my-0 divide-y divide-white/20 list-none p-0">
        <li
          v-for="(item, iIdx) in (items || [])"
          :key="item?.id || iIdx"
          class="relative hover:bg-white/10 text-center py-2 border-t border-t-0.5 border-white/20 flex items-center justify-between px-4 group/item transition-colors"
        >
          <NuxtLink
            v-if="item"
            :to="localePath(item.slug?.startsWith('/') ? item.slug : '/' + (item.slug || ''))"
            class="block py-1 text-white/100 text-xs text-d4 text-demibold text-right hover:text-white/80 transition-colors flex-1"
          >
            <div
              class="w-max rounded-lg p-1"
              v-editable="sectionIndex !== undefined ? `sections.${sectionIndex}.children.${iIdx}.name` : ''"
            >
              {{ item?.name || '' }}
            </div>
          </NuxtLink>

          <!-- Sleek, non-intrusive micro-action cluster in edit mode -->
          <div
            v-if="canEdit && isEditMode && sectionIndex !== undefined"
            class="opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-1 shrink-0 select-none mr-2"
            @click.stop.prevent
          >
            <button
              v-if="iIdx > 0"
              type="button"
              @click="onMoveUp(iIdx)"
              class="w-5 h-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="انتقال به بالا (Move Up)"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
              </svg>
            </button>

            <button
              v-if="iIdx < (items?.length || 0) - 1"
              type="button"
              @click="onMoveDown(iIdx)"
              class="w-5 h-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/25 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="انتقال به پایین (Move Down)"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button
              type="button"
              @click="onRemove(iIdx)"
              class="w-5 h-5 rounded flex items-center justify-center bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white transition-colors cursor-pointer"
              title="حذف این لینک (Delete)"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </li>

        <!-- Subtle Add Link Action in Edit Mode -->
        <li
          v-if="canEdit && isEditMode && sectionIndex !== undefined"
          class="list-none py-2 px-4"
        >
          <button
            type="button"
            @click="onAdd"
            class="w-full py-1.5 px-3 rounded-lg border border-dashed border-white/25 hover:border-white/60 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span class="text-sm leading-none">+</span>
            <span>افزودن لینک جدید</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { adminEditState as state, moveArrayItem, removeArrayItem, addArrayItem } from '@/store/adminEditStore'
import { useLocale } from '~/composables/useLocale'

const { localePath } = useLocale()
const canEdit = computed(() => state.canEdit)
const isEditMode = computed(() => state.editMode)

interface Item {
  id: string
  name: string
  slug: string
}

const props = defineProps<{
  id: string
  title: string
  items: Item[]
  initialOpen?: boolean
  modelValue: boolean
  sectionIndex?: number
}>()

const open = computed(() => props.modelValue)
const contentRef = ref<HTMLElement | null>(null)

const contentStyles = reactive<{ height: string; opacity: string }>({
  height: '0px',
  opacity: '0'
})

function setHeight(expand: boolean) {
  const el = contentRef.value
  if (!el) return

  if (expand) {
    contentStyles.height = '0px'
    contentStyles.opacity = '0'
    requestAnimationFrame(() => {
      if (!el) return
      contentStyles.height = `${el.scrollHeight}px`
      contentStyles.opacity = '1'
    })
  } else {
    contentStyles.height = `${el.scrollHeight}px`
    contentStyles.opacity = '1'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        contentStyles.height = '0px'
        contentStyles.opacity = '0'
      })
    })
  }
}

function onTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'height') return
  if (open.value) {
    contentStyles.height = 'auto'
  }
}

const emit = defineEmits<{
  (e: 'toggle', id: string): void
}>()

watch(
  () => open.value,
  v => nextTick(() => setHeight(v)),
  { immediate: true }
)

function toggle() {
  emit('toggle', props.id)
}

function onMoveUp(idx: number) {
  if (props.sectionIndex === undefined) return
  moveArrayItem(`sections.${props.sectionIndex}.children`, idx, idx - 1, state.language || 'fa', 'footer')
}

function onMoveDown(idx: number) {
  if (props.sectionIndex === undefined) return
  moveArrayItem(`sections.${props.sectionIndex}.children`, idx, idx + 1, state.language || 'fa', 'footer')
}

function onRemove(idx: number) {
  if (props.sectionIndex === undefined) return
  removeArrayItem(`sections.${props.sectionIndex}.children`, idx, state.language || 'fa', 'footer')
}

function onAdd() {
  if (props.sectionIndex === undefined) return
  const count = props.items?.length || 0
  addArrayItem(`sections.${props.sectionIndex}.children`, count - 1, state.language || 'fa', 'footer')
}
</script>

<style scoped>
.accordion-content {
  transition: height 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease, border-color 0.2s ease;
  will-change: height, opacity;
}
</style>
  