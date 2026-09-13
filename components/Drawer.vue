<!-- components/Drawer.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100]"
      :dir="isRTL ? 'rtl' : 'ltr'"
      role="dialog"
      aria-modal="true"
      :aria-label="isRTL ? 'منوی ناوبری' : 'Navigation Menu'"
    >
      <!-- Backdrop Overlay -->
      <transition name="drawer-backdrop" appear>
        <div
          class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
          @click="closeDrawer"
          aria-hidden="true"
        />
      </transition>

      <!-- Sliding Panel -->
      <transition :name="isRTL ? 'drawer-slide-rtl' : 'drawer-slide-ltr'" appear>
        <aside
          class="fixed top-0 bottom-0 z-10 w-full sm:w-[420px] md:w-[460px] h-[100dvh] bg-white flex flex-col shadow-2xl overflow-hidden touch-manipulation will-change-transform"
          :class="isRTL ? 'left-0' : 'right-0'"
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
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Mobile Profile / Login Card -->
          <div class="px-3 sm:px-6 pt-3 pb-2 flex-shrink-0">
            <NuxtLink
              :to="isAuthenticated && user.name ? localePath(`/user/${user.id}`) : localePath('/login')"
              @click="closeDrawer"
              class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/90 hover:bg-gray-100/90 border border-gray-100 transition-all duration-150 group active:scale-[0.98] shadow-2xs cursor-pointer select-none"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-najmgreen/10 text-najmgreen flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:account" class="w-5 h-5" />
                </div>
                <div class="flex flex-col" :class="isRTL ? 'text-right' : 'text-left'">
                  <span class="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-[200px]">
                    {{ isAuthenticated && user?.name ? `${user.name} ${user.familyName}` : loginText }}
                  </span>
                  <span class="text-[11px] text-gray-500">
                    {{ isAuthenticated ? profileSubtitle : loginSubtitle }}
                  </span>
                </div>
              </div>

              <Icon
                name="mdi:chevron-left"
                class="w-5 h-5 text-gray-400 group-hover:text-najmgreen transition-transform flex-shrink-0"
                :class="isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'"
              />
            </NuxtLink>
          </div>

          <!-- Single Unified Scroll Container (Zero nested scroll traps!) -->
          <div
            ref="scrollContainer"
            class="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-6 pt-2 pb-32"
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
import { useLocale } from '~/composables/useLocale'
import { useAuth } from '~/composables/useAuth'
import Logo from '~/components/atom/logo.vue'
import LanguageSwitcher from '~/components/atom/LanguageSwitcher.vue'
import Menu from '~/components/Menu.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { language, localePath } = useLocale()
const { user, isAuthenticated } = useAuth()

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

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    closeDrawer()
  }
}

// Lock body scrolling when drawer is active
watch(() => props.open, (isOpen) => {
  if (typeof document === 'undefined') return
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

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
.drawer-backdrop-enter-active {
  transition: opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-backdrop-leave-active {
  transition: opacity 0.2s ease-out;
}
.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}
.drawer-backdrop-enter-to,
.drawer-backdrop-leave-from {
  opacity: 1;
}

/* Slide Drawer RTL (FA & AR: Slides in from LEFT to RIGHT) */
.drawer-slide-rtl-enter-active {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-slide-rtl-leave-active {
  transition: transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-slide-rtl-enter-from,
.drawer-slide-rtl-leave-to {
  transform: translate3d(-100%, 0, 0);
}
.drawer-slide-rtl-enter-to,
.drawer-slide-rtl-leave-from {
  transform: translate3d(0, 0, 0);
}

/* Slide Drawer LTR (EN: Slides in from RIGHT to LEFT) */
.drawer-slide-ltr-enter-active {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-slide-ltr-leave-active {
  transition: transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-slide-ltr-enter-from,
.drawer-slide-ltr-leave-to {
  transform: translate3d(100%, 0, 0);
}
.drawer-slide-ltr-enter-to,
.drawer-slide-ltr-leave-from {
  transform: translate3d(0, 0, 0);
}
</style>
