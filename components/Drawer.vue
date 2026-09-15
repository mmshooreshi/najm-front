<!-- components/Drawer.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[100]"
      :dir="isRTL ? 'rtl' : 'ltr'"
      role="dialog"
      aria-modal="true"
      :aria-label="isRTL ? 'منوی ناوبری' : 'Navigation Menu'"
    >
      <!-- Backdrop Overlay (soft tint + subtle blur, zero GPU lag) -->
      <transition appear name="drawer-backdrop">
        <div
          v-if="open"
          class="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
          @click="closeDrawer"
          aria-hidden="true"
        />
      </transition>

      <!-- Sliding Panel -->
      <transition
        appear
        :name="isRTL ? 'drawer-slide-rtl' : 'drawer-slide-ltr'"
        @after-leave="onAfterLeave"
      >
        <aside
          v-if="open"
          class="fixed top-0 bottom-0 z-10 w-full max-w-full md:w-[420px] lg:w-[460px] h-[100dvh] bg-white flex flex-col overflow-hidden touch-manipulation will-change-transform inset-x-0 md:inset-x-auto"
          :class="[
            isRTL ? 'md:left-0 md:right-auto shadow-[8px_0_36px_rgba(0,0,0,0.14)]' : 'md:right-0 md:left-auto shadow-[-8px_0_36px_rgba(0,0,0,0.14)]'
          ]"
        >
          <!-- Drawer Top Header Bar (100% pixel-perfect match with Header.vue) -->
          <div class="w-full flex items-center justify-between px-3 sm:px-6 h-16 sm:h-20 border-b border-gray-100 flex-shrink-0 bg-white/95 backdrop-blur-md">
            <!-- Brand Logo (Directly identical markup as Header.vue to ensure exact alignment) -->
            <div class="flex items-center flex-shrink-0 cursor-pointer" @click="closeDrawer">
              <Logo :menuOpen="true" class="w-24 sm:w-28 flex-shrink-0" />
            </div>

            <!-- Language Switcher & Close Trigger -->
            <div class="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
              <LanguageSwitcher v-model="language" class="scale-90 sm:scale-100 origin-center" />

              <button
                type="button"
                @click="closeDrawer"
                class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-90 flex items-center justify-center text-gray-700 transition-all duration-150 cursor-pointer select-none"
                :aria-label="isRTL ? 'بستن منو' : 'Close Menu'"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mobile Profile / Login Card -->
          <div class="px-3 sm:px-6 pt-3 pb-2 flex-shrink-0 drawer-stagger-item" style="--item-idx: 0;">
            <NuxtLink
              :to="isAuthenticated && user?.name ? localePath(`/user/${user?.id || ''}`) : localePath('/login')"
              @click="closeDrawer"
              class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/90 hover:bg-gray-100/90 border border-gray-100 transition-all duration-150 group active:scale-[0.98] shadow-2xs cursor-pointer select-none"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-najmgreen/10 text-najmgreen flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"/>
                  </svg>
                </div>
                <div class="flex flex-col" :class="isRTL ? 'text-right' : 'text-left'">
                  <span class="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-[200px]">
                    {{ isAuthenticated && user?.name ? `${user.name} ${user.familyName || ''}` : loginText }}
                  </span>
                  <span class="text-[11px] text-gray-500">
                    {{ isAuthenticated ? profileSubtitle : loginSubtitle }}
                  </span>
                </div>
              </div>

              <svg
                class="w-5 h-5 text-gray-400 group-hover:text-najmgreen transition-transform flex-shrink-0"
                :class="isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
              </svg>
            </NuxtLink>
          </div>

          <!-- Single Unified Scroll Container (Zero nested scroll traps!) -->
          <div
            ref="scrollContainer"
            class="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3 sm:px-6 pt-2 pb-32"
            style="-webkit-overflow-scrolling: touch; overscroll-behavior: contain;"
          >
            <slot>
              <Menu @close="closeDrawer" />
            </slot>
          </div>
        </aside>
      </transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '~/composables/useLocale'
import { useAuth } from '~/composables/useAuth'
import { useMenu } from '~/composables/useMenu'
import Logo from '~/components/atom/logo.vue'
import LanguageSwitcher from '~/components/atom/LanguageSwitcher.vue'
import Menu from '~/components/Menu.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { language, localePath } = useLocale()
const { user, isAuthenticated } = useAuth()
const { preloadMenuRoutes } = useMenu()
const route = useRoute()

const isVisible = ref(props.open)

const isRTL = computed(() => {
  const l = (language.value || 'FA').toUpperCase()
  return l === 'FA' || l === 'AR'
})

const loginText = computed(() => {
  const l = (language.value || 'FA').toUpperCase()
  if (l === 'EN') return 'Sign In / Register'
  if (l === 'AR') return 'تسجيل الدخول / التسجيل'
  return 'ورود / عضویت'
})

const loginSubtitle = computed(() => {
  const l = (language.value || 'FA').toUpperCase()
  if (l === 'EN') return 'Access customer dashboard'
  if (l === 'AR') return 'الدخول إلى لوحة التحكم'
  return 'دسترسی به سامانه سفارشات و استعلام'
})

const profileSubtitle = computed(() => {
  const l = (language.value || 'FA').toUpperCase()
  if (l === 'EN') return 'View personal profile'
  if (l === 'AR') return 'عرض الحساب الشخصي'
  return 'مشاهده حساب کاربری'
})

function closeDrawer() {
  emit('update:open', false)
}

function onAfterLeave() {
  if (!props.open) {
    isVisible.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    closeDrawer()
  }
}

// Watch open state: manage visibility and body scroll lock
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    isVisible.value = true
    preloadMenuRoutes()
  }
  if (typeof document === 'undefined') return
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

// Close drawer automatically on route navigation
watch(() => route.fullPath, () => {
  if (props.open) {
    closeDrawer()
  }
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Backdrop Fade */
.drawer-backdrop-appear-active,
.drawer-backdrop-enter-active {
  transition: opacity 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.drawer-backdrop-leave-active {
  transition: opacity 0.22s cubic-bezier(0.4, 0, 1, 1);
}
.drawer-backdrop-appear-from,
.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}
.drawer-backdrop-appear-to,
.drawer-backdrop-enter-to,
.drawer-backdrop-leave-from {
  opacity: 1;
}

/* Slide Drawer RTL (FA & AR: Smooth, natural deceleration from left to right) */
.drawer-slide-rtl-appear-active,
.drawer-slide-rtl-enter-active {
  transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.drawer-slide-rtl-leave-active {
  transition: transform 0.22s cubic-bezier(0.4, 0, 1, 1);
}
.drawer-slide-rtl-appear-from,
.drawer-slide-rtl-enter-from,
.drawer-slide-rtl-leave-to {
  transform: translate3d(-100%, 0, 0);
}
.drawer-slide-rtl-appear-to,
.drawer-slide-rtl-enter-to,
.drawer-slide-rtl-leave-from {
  transform: translate3d(0, 0, 0);
}

/* Slide Drawer LTR (EN: Smooth, natural deceleration from right to left) */
.drawer-slide-ltr-appear-active,
.drawer-slide-ltr-enter-active {
  transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.drawer-slide-ltr-leave-active {
  transition: transform 0.22s cubic-bezier(0.4, 0, 1, 1);
}
.drawer-slide-ltr-appear-from,
.drawer-slide-ltr-enter-from,
.drawer-slide-ltr-leave-to {
  transform: translate3d(100%, 0, 0);
}
.drawer-slide-ltr-appear-to,
.drawer-slide-ltr-enter-to,
.drawer-slide-ltr-leave-from {
  transform: translate3d(0, 0, 0);
}

/* Swift Sequential Placement: smooth micro-glide cascade with ZERO rubber bounce */
.drawer-slide-rtl-appear-active :deep(.drawer-stagger-item),
.drawer-slide-rtl-enter-active :deep(.drawer-stagger-item),
.drawer-slide-ltr-appear-active :deep(.drawer-stagger-item),
.drawer-slide-ltr-enter-active :deep(.drawer-stagger-item) {
  animation: drawerItemCascade 0.28s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
  animation-delay: calc(0.04s + var(--item-idx, 0) * 0.024s);
}

.drawer-slide-rtl-leave-active :deep(.drawer-stagger-item),
.drawer-slide-ltr-leave-active :deep(.drawer-stagger-item) {
  transition: opacity 0.16s ease, transform 0.16s ease;
  opacity: 0.4;
  transform: translate3d(0, -3px, 0);
}

@keyframes drawerItemCascade {
  0% {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

aside {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform;
}
</style>
