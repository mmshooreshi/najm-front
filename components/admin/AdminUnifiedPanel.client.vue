<!-- components/admin/AdminUnifiedPanel.client.vue -->
<template>
  <teleport to="body">
    <transition name="unified-dock">
      <div
        v-if="state.unifiedPanelOpen"
        class="fixed inset-0 z-[999998] flex justify-end bg-black/60 backdrop-blur-xs"
        @click.self="closeUnifiedPanel"
      >
        <aside
          class="w-full max-w-2xl h-full bg-zinc-950/95 text-white border-l border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-in select-text backdrop-blur-2xl"
          dir="rtl"
        >
          <!-- Top Dock Header -->
          <div class="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10 bg-zinc-900/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
            <div class="flex items-center justify-between sm:justify-start gap-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
                  <AdminIcon name="diff" class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-xs sm:text-sm font-bold text-white tracking-wide">
                      کنسول مدیریت محتوا
                    </h2>
                    <span
                      v-if="changedCount > 0"
                      class="px-2 py-0.5 text-[10px] sm:text-[11px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold"
                    >
                      {{ changedCount }} تغییر
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">
                    <span class="font-mono text-zinc-300">/{{ selectedSlug }}</span>
                    <span>&bull;</span>
                    <span class="font-mono text-amber-300 uppercase font-semibold">{{ currentLang }}</span>
                    <span>&bull;</span>
                    <span class="text-zinc-500 truncate max-w-[120px]">{{ telemetryStatus }}</span>
                  </div>
                </div>
              </div>

              <!-- Close Dock Button (Visible on mobile top-right) -->
              <button
                type="button"
                class="sm:hidden w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                @click="closeUnifiedPanel"
                title="بستن"
              >
                <AdminIcon name="close" class="w-5 h-5" />
              </button>
            </div>

            <!-- Tab Switcher (Origin / Proof Lens / Versions) -->
            <div class="flex items-center justify-between sm:justify-start bg-zinc-900 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto custom-scrollbar w-full sm:w-auto">
              <button
                type="button"
                class="flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                :class="activeTab === 'origin' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-white'"
                @click="activeTab = 'origin'"
              >
                <span class="hidden xs:inline">تبارشناسی</span>
                <span class="xs:hidden">ساختار</span>
                <span class="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-zinc-300 font-mono">
                  {{ filteredPageItems.length }}
                </span>
              </button>

              <button
                type="button"
                class="flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                :class="activeTab === 'proof' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-white'"
                @click="activeTab = 'proof'"
              >
                <span class="hidden xs:inline">تغییرات زنده</span>
                <span class="xs:hidden">تغییرات</span>
                <span
                  class="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
                  :class="changedCount > 0 ? 'bg-amber-500/30 text-amber-300' : 'bg-black/40 text-zinc-400'"
                >
                  {{ changedCount }}
                </span>
              </button>

              <button
                type="button"
                class="flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                :class="activeTab === 'versions' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-white'"
                @click="loadVersionsTab"
              >
                <span class="hidden xs:inline">تاریخچه</span>
                <span class="xs:hidden">نسخه‌ها</span>
                <span class="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-zinc-300 font-mono">
                  {{ versionList.length }}
                </span>
              </button>
            </div>

            <!-- Close Dock Button (Desktop) -->
            <button
              type="button"
              class="hidden sm:flex w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 items-center justify-center transition-colors cursor-pointer shrink-0"
              @click="closeUnifiedPanel"
              title="بستن (Esc یا ⌘K)"
            >
              <AdminIcon name="close" class="w-5 h-5" />
            </button>
          </div>

          <!-- Controls & Filters Strip -->
          <div class="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-white/5 bg-zinc-900/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0">
            <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <!-- Slug Selector -->
              <div class="flex-1 sm:flex-none flex items-center gap-1 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs">
                <span class="text-zinc-400 text-[11px] shrink-0">صفحه:</span>
                <select
                  v-model="selectedSlug"
                  class="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer pr-1 w-full"
                  @change="onSlugChange"
                >
                  <option v-for="s in activeSlugs" :key="s" :value="s" class="bg-zinc-900 text-white">
                    /{{ s }}
                  </option>
                </select>
              </div>

              <!-- Origin Source Filter (for Origin tab) -->
              <div v-if="activeTab === 'origin'" class="flex-1 sm:flex-none flex items-center gap-1 bg-zinc-900 px-2 py-1.5 rounded-lg border border-white/10 text-xs">
                <span class="text-zinc-400 text-[11px] shrink-0">منبع:</span>
                <select
                  v-model="selectedSourceFilter"
                  class="bg-transparent text-white text-xs focus:outline-none cursor-pointer pr-1 w-full"
                >
                  <option value="all" class="bg-zinc-900 text-white">همه منابع</option>
                  <option value="page_cms" class="bg-zinc-900 text-white">محتوای CMS</option>
                  <option value="layout_shared" class="bg-zinc-900 text-white">قالب مشترک</option>
                  <option value="pocketbase_collection" class="bg-zinc-900 text-white">مجموعه‌های DB</option>
                  <option value="hardcoded_ui" class="bg-zinc-900 text-white">المان استاتیک</option>
                </select>
              </div>

              <!-- Proof Lens View Mode Switcher -->
              <div v-if="activeTab === 'proof'" class="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-white/10 text-xs shrink-0">
                <button
                  type="button"
                  class="px-2 py-1 rounded text-[11px] transition-colors cursor-pointer"
                  :class="diffViewMode === 'inline' ? 'bg-zinc-700 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'"
                  @click="diffViewMode = 'inline'"
                >
                  یکپارچه
                </button>
                <button
                  type="button"
                  class="px-2 py-1 rounded text-[11px] transition-colors cursor-pointer"
                  :class="diffViewMode === 'split' ? 'bg-zinc-700 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'"
                  @click="diffViewMode = 'split'"
                >
                  دوستونه
                </button>
              </div>
            </div>

            <!-- Search Field -->
            <div class="relative flex-1 min-w-0">
              <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="activeTab === 'origin' ? 'جستجو در مسیرها و سلسله‌مراتب...' : activeTab === 'proof' ? 'فیلتر تغییرات...' : 'جستجو در یادداشت نسخه‌ها...'"
                class="w-full bg-zinc-900 border border-white/10 rounded-lg pr-8 pl-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <!-- TAB 1: Hierarchy & Origin Tree -->
          <div v-if="activeTab === 'origin'" class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            <!-- Summary Origin Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div class="bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col">
                <span class="text-[10px] text-zinc-400 font-medium">محتوای CMS</span>
                <span class="text-sm font-bold text-emerald-400 font-mono mt-0.5">{{ originCounts.page_cms }}</span>
              </div>
              <div class="bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col">
                <span class="text-[10px] text-zinc-400 font-medium">قالب مشترک</span>
                <span class="text-sm font-bold text-blue-400 font-mono mt-0.5">{{ originCounts.layout_shared }}</span>
              </div>
              <div class="bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col">
                <span class="text-[10px] text-zinc-400 font-medium">مجموعه‌های DB</span>
                <span class="text-sm font-bold text-purple-400 font-mono mt-0.5">{{ originCounts.pocketbase_collection }}</span>
              </div>
              <div class="bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col">
                <span class="text-[10px] text-zinc-400 font-medium">المان‌های استاتیک</span>
                <span class="text-sm font-bold text-amber-400 font-mono mt-0.5">{{ originCounts.hardcoded_ui }}</span>
              </div>
            </div>

            <!-- Empty Search State -->
            <div v-if="filteredPageItems.length === 0" class="h-64 flex flex-col items-center justify-center text-center p-6">
              <div class="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
                <AdminIcon name="search" class="w-5 h-5" />
              </div>
              <p class="text-sm font-medium text-zinc-300">
                هیچ آیتمی با شرایط فیلتر یافت نشد
              </p>
              <p class="text-xs text-zinc-500 mt-1">
                عبارت جستجو را پاک کنید یا منبع دیگری را انتخاب نمایید.
              </p>
            </div>

            <!-- Content Hierarchy Cards -->
            <div
              v-for="item in filteredPageItems"
              :key="item.path"
              class="rounded-2xl bg-zinc-900/60 border p-4 transition-all space-y-3"
              :class="item.isChanged ? 'border-amber-500/40 bg-amber-950/10' : 'border-white/10 hover:border-white/20'"
            >
              <!-- Origin Breadcrumbs & Badges -->
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <!-- Origin Badge -->
                  <span
                    class="px-2 py-0.5 rounded-md text-[10px] font-bold border"
                    :class="getOriginBadgeClass(item.path)"
                  >
                    {{ getOriginLabel(item.path) }}
                  </span>

                  <!-- Hierarchy Breadcrumbs -->
                  <div class="flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                    <span>{{ item.sectionLabel }}</span>
                    <span>&rsaquo;</span>
                    <span class="font-mono text-zinc-300">{{ item.key }}</span>
                  </div>
                </div>

                <!-- Action Tools -->
                <div class="flex items-center gap-1.5 shrink-0">
                  <!-- Show On Screen Highlight Pulse -->
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-lg text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="highlightFieldInView(item.path)"
                    title="مشاهده و پالس نوری المنت روی صفحه"
                  >
                    <span>👁️</span>
                    <span>روی صفحه</span>
                  </button>

                  <button
                    type="button"
                    class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors cursor-pointer"
                    @click="copyText(item.path, 'مسیر')"
                    title="کپی مسیر فیلد"
                  >
                    <AdminIcon name="copy" class="w-3.5 h-3.5" />
                  </button>

                  <button
                    v-if="item.isChanged"
                    type="button"
                    class="px-2.5 py-1 rounded-lg text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="handleRevert(item.path)"
                    title="بازگردانی این فیلد به مقدار سرور"
                  >
                    <AdminIcon name="undo" class="w-3.5 h-3.5" />
                    <span>بازگردانی</span>
                  </button>
                </div>
              </div>

              <!-- In-Place Input / Editor -->
              <div>
                <textarea
                  v-if="item.isMultiline"
                  :value="item.current"
                  rows="2"
                  class="w-full bg-zinc-950/80 border border-white/15 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all leading-relaxed custom-scrollbar"
                  @input="handleFieldInput(item, $event)"
                ></textarea>

                <input
                  v-else
                  type="text"
                  :value="item.current"
                  class="w-full bg-zinc-950/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
                  @input="handleFieldInput(item, $event)"
                />
              </div>

              <!-- Original Baseline Preview if changed -->
              <div v-if="item.isChanged" class="text-[10px] text-zinc-500 flex items-start gap-1 pt-0.5 border-t border-white/5">
                <span class="text-zinc-400 shrink-0 font-medium">مقدار اولیه در سرور:</span>
                <span class="truncate line-through text-zinc-500" :title="item.original">{{ item.original }}</span>
              </div>

              <!-- Built-in Field Version History Row -->
              <div v-if="getItemVersions(item.path).length > 0" class="pt-1.5 border-t border-white/5 flex items-center gap-1.5 flex-wrap text-[11px]">
                <span class="text-zinc-400 text-[10px] flex items-center gap-1 shrink-0 font-medium">
                  <AdminIcon name="history" class="w-3 h-3 text-amber-400" />
                  <span>نسخه‌های فیلد:</span>
                </span>
                <button
                  v-for="(v, vIdx) in getItemVersions(item.path)"
                  :key="vIdx"
                  type="button"
                  class="px-2 py-0.5 rounded-md border text-[10px] transition-all cursor-pointer flex items-center gap-1"
                  :class="v.value === item.current
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-white/10 hover:border-white/20'"
                  @click="handleRestoreFieldVersion(item.path, v.value)"
                  :title="`کلیک برای بازگردانی به این نسخه: «${v.value}»`"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="v.type === 'original' ? 'bg-sky-400' : 'bg-amber-400'"></span>
                  <span>{{ v.type === 'original' ? 'سرور (اصلی)' : `نسخه ${vIdx + 1}` }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 2: Live Proof Lens -->
          <div v-else-if="activeTab === 'proof'" class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            <!-- Empty Diff State -->
            <div v-if="filteredDiffItems.length === 0" class="h-64 flex flex-col items-center justify-center text-center p-6">
              <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <AdminIcon name="check" class="w-6 h-6" />
              </div>
              <p class="text-sm font-bold text-zinc-200">
                {{ searchQuery ? 'تغییری با عبارت جستجوی فعلی یافت نشد' : 'هیچ تغییر ذخیره‌نشده‌ای وجود ندارد' }}
              </p>
              <p class="text-xs text-zinc-400 mt-1 max-w-sm">
                {{ searchQuery ? 'فیلتر جستجو را پاک کنید.' : 'تمام محتواهای ویرایش‌پذیر این صفحه دقیقاً با نسخه پایگاه داده همگام هستند.' }}
              </p>
            </div>

            <!-- Modified Items Diff List -->
            <div
              v-for="item in filteredDiffItems"
              :key="item.path"
              class="rounded-2xl bg-zinc-900/70 border border-white/10 p-4 transition-all hover:border-white/20 space-y-3"
            >
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span
                    class="text-xs font-semibold text-amber-200 truncate cursor-pointer hover:underline font-mono"
                    dir="ltr"
                    :title="`کلیک برای کپی: ${item.path}`"
                    @click="copyText(item.path, 'مسیر')"
                  >
                    {{ item.path }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-lg text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="highlightFieldInView(item.path)"
                    title="مشاهده و پالس نوری روی صفحه"
                  >
                    <span>👁️</span>
                    <span>روی صفحه</span>
                  </button>

                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-lg text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    @click="handleRevert(item.path)"
                    title="بازگردانی فقط این فیلد"
                  >
                    <AdminIcon name="undo" class="w-3.5 h-3.5" />
                    <span>بازگردانی</span>
                  </button>
                </div>
              </div>

              <!-- Diff Viewer -->
              <DiffPreview
                :before="item.original"
                :after="item.current"
                :mode="diffViewMode"
              />

              <!-- Built-in Field Version History Row -->
              <div v-if="getItemVersions(item.path).length > 0" class="pt-2 border-t border-white/5 flex items-center gap-1.5 flex-wrap text-[11px]">
                <span class="text-zinc-400 text-[10px] flex items-center gap-1 shrink-0 font-medium">
                  <AdminIcon name="history" class="w-3 h-3 text-amber-400" />
                  <span>نسخه‌های فیلد:</span>
                </span>
                <button
                  v-for="(v, vIdx) in getItemVersions(item.path)"
                  :key="vIdx"
                  type="button"
                  class="px-2 py-0.5 rounded-md border text-[10px] transition-all cursor-pointer flex items-center gap-1"
                  :class="v.value === item.current
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-white/10 hover:border-white/20'"
                  @click="handleRestoreFieldVersion(item.path, v.value)"
                  :title="`کلیک برای بازگردانی به این نسخه: «${v.value}»`"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="v.type === 'original' ? 'bg-sky-400' : 'bg-amber-400'"></span>
                  <span>{{ v.type === 'original' ? 'سرور (اصلی)' : `نسخه ${vIdx + 1}` }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 3: Versions Timeline & 1-Click Rollback -->
          <div v-else-if="activeTab === 'versions'" class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            <!-- Loading versions -->
            <div v-if="isLoadingVersions" class="h-64 flex flex-col items-center justify-center text-center p-6 text-zinc-400">
              <AdminIcon name="spinner" class="w-6 h-6 animate-spin text-emerald-400 mb-2" />
              <p class="text-xs">در حال بارگذاری سابقه تغییرات از سرور...</p>
            </div>

            <!-- Empty Versions State -->
            <div v-else-if="filteredVersions.length === 0" class="h-64 flex flex-col items-center justify-center text-center p-6">
              <div class="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
                <AdminIcon name="history" class="w-5 h-5" />
              </div>
              <p class="text-sm font-medium text-zinc-300">
                هیچ نسخه ثبت‌شده‌ای برای «/{{ selectedSlug }}» یافت نشد
              </p>
              <p class="text-xs text-zinc-500 mt-1">
                به محض اولین ذخیره تغییرات، تاریخچه حسابرسی اینجا ایجاد می‌گردد.
              </p>
            </div>

            <!-- Version Timeline Cards -->
            <div
              v-else
              v-for="(ver, idx) in filteredVersions"
              :key="ver.versionId"
              class="rounded-2xl bg-zinc-900/60 border border-white/10 p-4 transition-all hover:border-white/20 space-y-3"
            >
              <div class="flex items-center justify-between gap-3 flex-wrap">
                <div class="flex items-center gap-2.5">
                  <span class="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                    {{ ver.versionId }}
                  </span>
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-white">
                      {{ ver.note || 'نسخه ذخیره‌شده' }}
                    </span>
                    <span class="text-[10px] text-zinc-400 mt-0.5">
                      {{ formatPersianDate(ver.timestamp) }} &bull; {{ ver.changesCount }} تغییر
                    </span>
                  </div>
                </div>

                <!-- 1-Click Rollback Button -->
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    :disabled="isRollingBack"
                    @click="executeRollback(ver.versionId)"
                    title="بازگردانی کل صفحه به این نسخه"
                  >
                    <AdminIcon :name="isRollingBack ? 'spinner' : 'undo'" class="w-3.5 h-3.5" :class="{ 'animate-spin': isRollingBack }" />
                    <span>بازگشت ۱-کلیکی (Rollback)</span>
                  </button>
                </div>
              </div>

              <!-- Changes summary chips -->
              <div v-if="ver.changes && ver.changes.length > 0" class="flex flex-wrap gap-1.5 pt-1">
                <span
                  v-for="(ch, cIdx) in ver.changes.slice(0, 6)"
                  :key="cIdx"
                  class="px-2 py-0.5 rounded-md bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-300"
                >
                  {{ ch.path }}
                </span>
                <span v-if="ver.changes.length > 6" class="text-[10px] text-zinc-500 self-center">
                  + {{ ver.changes.length - 6 }} تغییر دیگر
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Footer Bar -->
          <div class="px-4 sm:px-5 py-3 sm:py-4 border-t border-white/10 bg-zinc-900/95 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0 pb-[max(12px,env(safe-area-inset-bottom,12px))]">
            <!-- Left: Discard All -->
            <button
              type="button"
              class="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              :disabled="changedCount === 0 || isSaving"
              @click="handleDiscardAll"
            >
              <AdminIcon name="trash" class="w-4 h-4" />
              <span>لغو تمام تغییرات ({{ changedCount }})</span>
            </button>

            <!-- Right: Close & Save Changes -->
            <div class="flex items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                class="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-colors cursor-pointer text-center"
                @click="closeUnifiedPanel"
              >
                بستن (Esc)
              </button>

              <button
                type="button"
                class="flex-2 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                :disabled="changedCount === 0 || isSaving"
                @click="handleSaveAll"
              >
                <AdminIcon
                  :name="isSaving ? 'spinner' : 'save'"
                  class="w-4 h-4"
                  :class="{ 'animate-spin': isSaving }"
                />
                <span>{{ isSaving ? 'در حال همگام‌سازی...' : `ذخیره قطعی (${changedCount})` }}</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  adminEditState as state,
  closeUnifiedPanel,
  highlightFieldInView,
  getChangedDetails,
  revertPath,
  buildChangesPayloadBySlug,
  recordSavedVersions,
  discardAllChanges,
  getPageContentItems,
  getActiveSlugs,
  setDraftValue,
  getOrigin,
  getVersions,
  restoreVersion,
  type PageContentItem
} from '@/store/adminEditStore'
import { invalidatePageUI } from '~/composables/ui/pageUiCache'
import DiffPreview from '~/components/admin/DiffPreview.vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

const activeTab = computed({
  get: () => state.unifiedPanelTab || 'origin',
  set: (val: 'origin' | 'proof' | 'versions') => {
    state.unifiedPanelTab = val
  }
})

const selectedSlug = ref(state.slug || 'home')
const currentLang = computed(() => (state.language || 'FA').toUpperCase())
const activeSlugs = computed(() => getActiveSlugs())
const searchQuery = ref('')
const selectedSourceFilter = ref<'all' | 'page_cms' | 'layout_shared' | 'pocketbase_collection' | 'hardcoded_ui'>('all')
const diffViewMode = ref<'inline' | 'split'>('inline')
const isSaving = ref(false)
const isRollingBack = ref(false)
const isLoadingVersions = ref(false)
const versionList = ref<any[]>([])

// Synchronize selectedSlug on dock open
watch(() => state.unifiedPanelOpen, (isOpen) => {
  if (isOpen) {
    selectedSlug.value = state.slug || 'home'
    if (activeTab.value === 'versions') {
      fetchVersions()
    }
  }
})

function onSlugChange() {
  if (activeTab.value === 'versions') {
    fetchVersions()
  }
}

const changedItems = computed(() => getChangedDetails(currentLang.value))
const changedCount = computed(() => changedItems.value.length)

const pageItems = computed(() => getPageContentItems(selectedSlug.value, currentLang.value))

const originCounts = computed(() => {
  const counts = { page_cms: 0, layout_shared: 0, pocketbase_collection: 0, hardcoded_ui: 0 }
  for (const item of pageItems.value) {
    const orig = getOrigin(item.path)
    if (counts[orig.source] !== undefined) {
      counts[orig.source]++
    }
  }
  return counts
})

const filteredPageItems = computed(() => {
  let list = pageItems.value
  if (selectedSourceFilter.value !== 'all') {
    list = list.filter(item => getOrigin(item.path).source === selectedSourceFilter.value)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(item =>
    item.path.toLowerCase().includes(q) ||
    item.section.toLowerCase().includes(q) ||
    item.sectionLabel.toLowerCase().includes(q) ||
    item.current.toLowerCase().includes(q) ||
    item.original.toLowerCase().includes(q)
  )
})

const filteredDiffItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return changedItems.value
  return changedItems.value.filter(item =>
    item.path.toLowerCase().includes(q) ||
    item.current.toLowerCase().includes(q) ||
    item.original.toLowerCase().includes(q)
  )
})

const filteredVersions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return versionList.value
  return versionList.value.filter(v =>
    (v.note && v.note.toLowerCase().includes(q)) ||
    (v.versionId && v.versionId.toLowerCase().includes(q))
  )
})

const telemetryStatus = computed(() => {
  if (state.telemetry.source === 'local_storage') return 'پیش‌نویس محلی'
  if (state.telemetry.source === 'server_live') return 'همگام با سرور'
  return 'اصلی'
})

function getOriginBadgeClass(path: string): string {
  const src = getOrigin(path).source
  switch (src) {
    case 'page_cms':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    case 'layout_shared':
      return 'bg-blue-500/10 text-blue-300 border-blue-500/30'
    case 'pocketbase_collection':
      return 'bg-purple-500/10 text-purple-300 border-purple-500/30'
    default:
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  }
}

function getOriginLabel(path: string): string {
  return getOrigin(path).sourceLabel
}

function handleFieldInput(item: PageContentItem, event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  if (!target) return
  setDraftValue(item.path, currentLang.value, target.value, selectedSlug.value, true)
}

function handleRevert(path: string) {
  revertPath(path, currentLang.value)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: `فیلد «${path}» به مقدار اولیه بازگشت` } }))
}

function getItemVersions(path: string) {
  return getVersions(path, currentLang.value)
}

function handleRestoreFieldVersion(path: string, val: string) {
  restoreVersion(path, currentLang.value, val)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `فیلد به نسخه انتخابی بازگردانی شد` } }))
}

function copyText(text: string, label = 'متن') {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `${label} در حافظه کپی شد` } }))
  }
}

function loadVersionsTab() {
  activeTab.value = 'versions'
  fetchVersions()
}

async function fetchVersions() {
  isLoadingVersions.value = true
  try {
    const slug = selectedSlug.value || 'home'
    const lang = currentLang.value
    const res: any = await $fetch(`/api/admin/ui/versions?slug=${slug}&lang=${lang}`)
    if (res && res.ok && Array.isArray(res.versions)) {
      versionList.value = res.versions
    } else {
      versionList.value = []
    }
  } catch (err) {
    versionList.value = []
  } finally {
    isLoadingVersions.value = false
  }
}

async function executeRollback(versionId: string) {
  if (isRollingBack.value || !versionId) return
  const confirmMsg = `آیا از بازگردانی کل محتوای صفحه «/${selectedSlug.value}» به نسخه «${versionId}» اطمینان دارید؟`
  if (typeof window !== 'undefined' && !window.confirm(confirmMsg)) {
    return
  }

  isRollingBack.value = true
  try {
    const res: any = await $fetch('/api/admin/ui/rollback', {
      method: 'POST',
      body: {
        slug: selectedSlug.value,
        versionId,
        language: currentLang.value
      }
    })

    if (res && res.ok) {
      invalidatePageUI(selectedSlug.value)
      discardAllChanges(currentLang.value)
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'success', text: `صفحه با موفقیت به نسخه ${versionId} بازگردانده شد.` }
      }))
      fetchVersions()
    } else {
      throw new Error(res?.error || 'خطا در انجام بازگشت')
    }
  } catch (err: any) {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'error', text: err?.message || 'عملیات بازگشت ناموفق بود.' }
    }))
  } finally {
    isRollingBack.value = false
  }
}

async function handleSaveAll() {
  if (isSaving.value || changedCount.value === 0) return
  isSaving.value = true
  const langVal = currentLang.value
  const payloadBySlug = buildChangesPayloadBySlug(langVal)

  let totalSaved = 0
  try {
    for (const [slugKey, changes] of Object.entries(payloadBySlug)) {
      if (!changes || changes.length === 0) continue
      await $fetch('/api/admin/ui/save-draft', {
        method: 'POST',
        body: { slug: slugKey, language: langVal, changes }
      })

      recordSavedVersions(langVal, changes.map(p => p.path))
      invalidatePageUI(slugKey)
      totalSaved += changes.length
    }

    state.lastSavedAt = new Date().toISOString()
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', text: `✓ ${totalSaved} تغییر با موفقیت در دیتابیس ثبت شد.` }
    }))
    closeUnifiedPanel()
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'خطا در ذخیره تغییرات'
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: msg } }))
  } finally {
    isSaving.value = false
  }
}

function handleDiscardAll() {
  if (changedCount.value === 0) return
  discardAllChanges(currentLang.value)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: 'تمامی پیش‌نویس‌ها لغو شدند' } }))
  closeUnifiedPanel()
}

function formatPersianDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('fa-IR', {
      dateStyle: 'short',
      timeStyle: 'short'
    })
  } catch {
    return iso
  }
}

onMounted(() => {
  if (state.unifiedPanelOpen) {
    fetchVersions()
  }
})
</script>

<style scoped>
.unified-dock-enter-active,
.unified-dock-leave-active {
  transition: opacity 0.25s ease;
}

.unified-dock-enter-from,
.unified-dock-leave-to {
  opacity: 0;
}

@keyframes slideInDock {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideInDock 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
