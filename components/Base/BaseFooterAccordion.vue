<!-- components/Base/BaseFooterAccordion.vue -->
<template>
  <div
    class="group bg-[#0c4a3e] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
    :class="{ 'border-white/25 shadow-md shadow-black/20 bg-[#0d4f42]': open }"
  >
    <!-- Header Button (Strictly transparent with dark hover/active, never turns white) -->
    <button
      type="button"
      class="w-full flex justify-between items-center py-4 px-6 text-sm gap-2 cursor-pointer bg-transparent border-0 outline-none focus:outline-none focus:ring-0 appearance-none transition-colors duration-200 hover:bg-white/5"
      :class="{ 'bg-white/10': open }"
      @click="toggle"
    >
      <span
        class="text-white/85 group-hover:text-white text-sm text-d4 text-demibold transition-colors"
        v-editable="sectionIndex !== undefined ? `sections.${sectionIndex}.name` : ''"
      >{{ title || '' }}</span>

      <!-- Chevron Icon -->
      <Icon
        name="mdi:chevron-down"
        class="w-5 h-5 text-white/70 group-hover:text-white transition-transform duration-300"
        :style="{ transform: `rotate(${open ? 180 : 0}deg)` }"
      />
    </button>

    <!-- Sliding Panel with Smooth Two-Way Transition -->
    <div
      ref="contentRef"
      :style="contentStyles"
      @transitionend="onTransitionEnd"
      class="accordion-content overflow-hidden bg-[#0a3f35] "
      :class="{ '!border-white/10': open }"
    >
      <ul class="my-0 divide-y divide-white/10 list-none p-0">
        <li
          class="relative hover:bg-white/10 text-center py-2.5 flex items-center justify-between px-4 group/item transition-colors"
          v-for="(item, iIdx) in (items || [])"
          :key="item?.id || iIdx"
        >
          <NuxtLink
            v-if="item"
            :to="item.slug?.startsWith('/') ? item.slug : '/' + (item.slug || '')"
            class="block py-1 text-white text-xs text-d4 text-demibold text-right hover:text-white/80 transition-colors flex-1"
          >
            <div
              class="w-max rounded-lg p-1"
              v-editable="sectionIndex !== undefined ? `sections.${sectionIndex}.children.${iIdx}.name` : ''"
            >
              {{ item?.name || '' }}
            </div>
          </NuxtLink>

          <!-- Array Action [+] / [-] -->
          <ClientOnly>
            <AdminArrayItemActions
              v-if="sectionIndex !== undefined && canEdit"
              :path="`sections.${sectionIndex}.children`"
              :index="iIdx"
              position="inline"
            />
          </ClientOnly>
        </li>

        <ClientOnly>
          <li v-if="sectionIndex !== undefined && canEdit" class="list-none">
            <AdminAddCardPlaceholder
              :path="`sections.${sectionIndex}.children`"
              label="افزودن لینک جدید به این بخش"
              customClass="min-h-[40px] p-1.5 my-1"
            />
          </li>
        </ClientOnly>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { adminEditState } from '@/store/adminEditStore'

const canEdit = computed(() => adminEditState.canEdit)

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
</script>

<style scoped>
.accordion-content {
  transition: height 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease, border-color 0.2s ease;
  will-change: height, opacity;
}
</style>
  