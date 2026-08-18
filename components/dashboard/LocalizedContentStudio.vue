<!-- components/dashboard/LocalizedContentStudio.vue -->
<template>
  <div class="w-full h-full flex flex-col font-sans text-xs bg-white select-text overflow-hidden">
    <!-- Top Ultra-Compact Icon Toolbar -->
    <div class="h-10 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
      <!-- Section Tabs -->
      <div class="flex items-center gap-1">
        <button
          v-for="tab in sections"
          :key="tab.id"
          @click="activeSection = tab.id"
          class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer"
          :class="activeSection === tab.id ? 'bg-white text-emerald-800 shadow-2xs border border-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'"
        >
          <Icon :name="tab.icon" class="w-3.5 h-3.5" :class="activeSection === tab.id ? 'text-emerald-800' : 'text-slate-400'" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Icon-Only Language Toggles with Tooltips -->
      <div class="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
        <button
          @click="activeLang = 'fa'"
          class="w-7 h-6 flex items-center justify-center rounded transition cursor-pointer"
          :class="activeLang === 'fa' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="فارسی (FA)"
        >
          <span>🇮🇷</span>
        </button>
        <button
          @click="activeLang = 'en'"
          class="w-7 h-6 flex items-center justify-center rounded transition cursor-pointer"
          :class="activeLang === 'en' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="English (EN)"
        >
          <span>🇬🇧</span>
        </button>
        <button
          @click="activeLang = 'ar'"
          class="w-7 h-6 flex items-center justify-center rounded transition cursor-pointer"
          :class="activeLang === 'ar' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="العربية (AR)"
        >
          <span>🇸🇦</span>
        </button>
        <button
          @click="activeLang = 'all'"
          class="w-7 h-6 flex items-center justify-center rounded transition cursor-pointer text-slate-700"
          :class="activeLang === 'all' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="نمایش همزمان ۳ زبانه (Parallel View)"
        >
          <Icon name="mdi:web" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Main High-Density Workspace -->
    <div class="flex-1 p-4 overflow-y-auto bg-slate-50/30">
      <!-- 1. COPY & CONTENT TAB -->
      <div v-if="activeSection === 'copy'" class="space-y-3">
        <!-- Title & Subtitle Card -->
        <div class="bg-white rounded-xl border border-slate-200 p-3 space-y-3 shadow-2xs">
          <!-- Title Row -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">عنوان اصلی</span>
              <span class="text-[9px] font-mono text-slate-400" dir="ltr">title</span>
            </div>

            <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'" class="flex items-center gap-1.5">
                <span class="text-[9px] font-mono text-slate-400 shrink-0">FA</span>
                <input
                  type="text"
                  :value="getLangValue('fa', 'title')"
                  @input="setLangValue('fa', 'title', ($event.target as HTMLInputElement).value)"
                  class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none transition"
                  placeholder="عنوان فارسی..."
                />
              </div>

              <div v-if="activeLang === 'en' || activeLang === 'all'" class="flex items-center gap-1.5" dir="ltr">
                <span class="text-[9px] font-mono text-slate-400 shrink-0">EN</span>
                <input
                  type="text"
                  dir="ltr"
                  :value="getLangValue('en', 'title')"
                  @input="setLangValue('en', 'title', ($event.target as HTMLInputElement).value)"
                  class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none transition text-left"
                  placeholder="English title..."
                />
              </div>

              <div v-if="activeLang === 'ar' || activeLang === 'all'" class="flex items-center gap-1.5">
                <span class="text-[9px] font-mono text-slate-400 shrink-0">AR</span>
                <input
                  type="text"
                  :value="getLangValue('ar', 'title')"
                  @input="setLangValue('ar', 'title', ($event.target as HTMLInputElement).value)"
                  class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none transition"
                  placeholder="العنوان بالعربية..."
                />
              </div>
            </div>
          </div>

          <!-- Subtitle Row -->
          <div class="space-y-1.5 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">زیرعنوان و توضیحات</span>
              <span class="text-[9px] font-mono text-slate-400" dir="ltr">subtitle</span>
            </div>

            <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'">
                <textarea
                  rows="2"
                  :value="getLangValue('fa', 'subtitle')"
                  @input="setLangValue('fa', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none transition leading-relaxed"
                  placeholder="توضیحات فارسی..."
                ></textarea>
              </div>

              <div v-if="activeLang === 'en' || activeLang === 'all'" dir="ltr">
                <textarea
                  rows="2"
                  dir="ltr"
                  :value="getLangValue('en', 'subtitle')"
                  @input="setLangValue('en', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none transition leading-relaxed text-left font-sans"
                  placeholder="English subtitle..."
                ></textarea>
              </div>

              <div v-if="activeLang === 'ar' || activeLang === 'all'">
                <textarea
                  rows="2"
                  :value="getLangValue('ar', 'subtitle')"
                  @input="setLangValue('ar', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none transition leading-relaxed"
                  placeholder="الوصف بالعربية..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Stats / Mission Tagline -->
          <div v-if="hasKeyInUiData('stats') || hasKeyInUiData('mission')" class="space-y-1.5 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">شعار یا آمار شاخص</span>
              <span class="text-[9px] font-mono text-slate-400" dir="ltr">stats</span>
            </div>

            <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'">
                <input
                  type="text"
                  :value="getLangValue('fa', 'stats') || getLangValue('fa', 'mission')"
                  @input="setLangValue('fa', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div v-if="activeLang === 'en' || activeLang === 'all'" dir="ltr">
                <input
                  type="text"
                  dir="ltr"
                  :value="getLangValue('en', 'stats') || getLangValue('en', 'mission')"
                  @input="setLangValue('en', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none text-left"
                />
              </div>
              <div v-if="activeLang === 'ar' || activeLang === 'all'">
                <input
                  type="text"
                  :value="getLangValue('ar', 'stats') || getLangValue('ar', 'mission')"
                  @input="setLangValue('ar', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- DYNAMIC SMART UNPACKED SECTIONS (No [object Object] Ever!) -->
        <div
          v-for="(sectionMeta, sectionKey) in recognizedPageSections"
          :key="sectionKey"
          class="bg-white rounded-xl border border-slate-200 p-3 space-y-3 shadow-2xs"
        >
          <!-- Section Header with Advanced Sub-Editor Icon -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span class="font-extrabold text-slate-900 text-xs">{{ sectionMeta.titleFa }}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-[9px] font-mono text-slate-400" dir="ltr">{{ sectionKey }}</span>
              <!-- Advanced Sub-Editor Trigger Icon -->
              <button
                @click="openAdvancedSubEditor(sectionKey as string)"
                class="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 hover:text-emerald-800 transition cursor-pointer"
                title="ویرایشگر پیشرفته JSON این بخش"
              >
                <Icon name="mdi:tune-vertical" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- A. ARRAY OF OBJECTS (Smart Sub-Card Unpacking - ZERO [object Object]) -->
          <div v-if="sectionMeta.isArrayOfObjects" class="space-y-2.5">
            <div
              v-for="(objItem, idx) in getArraySectionItems(sectionKey as string)"
              :key="idx"
              class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-800 text-[11px]">
                  #{{ idx + 1 }} {{ objItem.name || objItem.title || objItem.slug || 'مورد' }}
                </span>
                <button
                  @click="removeArraySectionItem(sectionKey as string, idx)"
                  class="w-5 h-5 flex items-center justify-center rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="حذف"
                >
                  <Icon name="mdi:close" class="w-3 h-3" />
                </button>
              </div>

              <!-- Unpacked Sub-Properties Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                <div v-for="propKey in getObjectKeys(objItem)" :key="propKey" class="space-y-0.5">
                  <span class="text-[9px] font-mono text-slate-500 uppercase font-bold" dir="ltr">{{ propKey }}</span>
                  <input
                    v-if="typeof objItem[propKey] === 'string' || typeof objItem[propKey] === 'number'"
                    :type="typeof objItem[propKey] === 'number' ? 'number' : 'text'"
                    :dir="isLtrKey(propKey) ? 'ltr' : 'auto'"
                    :value="objItem[propKey]"
                    @input="updateObjectSubProperty(sectionKey as string, idx, propKey, ($event.target as HTMLInputElement).value)"
                    class="w-full bg-white border border-slate-200 focus:border-emerald-600 rounded-md px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                    :class="isLtrKey(propKey) ? 'font-mono text-left' : ''"
                  />
                  <div v-else class="text-[10px] font-mono text-slate-400 px-1 py-0.5">
                    (تودرتو)
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="addObjectToArraySection(sectionKey as string)"
              class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Icon name="mdi:plus" class="w-3 h-3" />
              <span>افزودن مورد ساختاریافته</span>
            </button>
          </div>

          <!-- B. ARRAY OF STRINGS (Categories, Fleet, Milestones) -->
          <div v-else-if="sectionMeta.isArray" class="space-y-1.5">
            <div
              v-for="(item, idx) in getArraySectionItems(sectionKey as string)"
              :key="idx"
              class="flex items-center gap-2"
            >
              <span class="w-5 text-slate-400 font-mono text-[10px] text-center shrink-0">{{ idx + 1 }}</span>
              <input
                type="text"
                :value="typeof item === 'string' ? item : JSON.stringify(item)"
                @input="updateArraySectionItem(sectionKey as string, idx, ($event.target as HTMLInputElement).value)"
                class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
              />
              <button
                @click="removeArraySectionItem(sectionKey as string, idx)"
                class="w-6 h-6 flex items-center justify-center rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                title="حذف"
              >
                <Icon name="mdi:trash-can-outline" class="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              @click="addArraySectionItem(sectionKey as string)"
              class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Icon name="mdi:plus" class="w-3 h-3" />
              <span>افزودن مورد</span>
            </button>
          </div>

          <!-- C. SINGLE UNPACKED OBJECT OR STRING -->
          <div v-else-if="sectionMeta.isObject" class="space-y-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              <div v-for="propKey in getObjectKeys(getSectionObjectValue(sectionKey as string))" :key="propKey" class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-mono font-bold text-slate-600 uppercase" dir="ltr">{{ propKey }}</span>
                </div>
                <input
                  type="text"
                  :dir="isLtrKey(propKey) ? 'ltr' : 'auto'"
                  :value="getSectionObjectValue(sectionKey as string)[propKey]"
                  @input="updateDirectObjectProperty(sectionKey as string, propKey, ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                  :class="isLtrKey(propKey) ? 'font-mono text-left' : ''"
                />
              </div>
            </div>
          </div>

          <!-- D. TRILINGUAL STRING FIELDS -->
          <div v-else class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
            <div v-if="activeLang === 'fa' || activeLang === 'all'">
              <input
                type="text"
                :value="getLangValue('fa', sectionKey as string)"
                @input="setLangValue('fa', sectionKey as string, ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <div v-if="activeLang === 'en' || activeLang === 'all'" dir="ltr">
              <input
                type="text"
                dir="ltr"
                :value="getLangValue('en', sectionKey as string)"
                @input="setLangValue('en', sectionKey as string, ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none text-left"
              />
            </div>
            <div v-if="activeLang === 'ar' || activeLang === 'all'">
              <input
                type="text"
                :value="getLangValue('ar', sectionKey as string)"
                @input="setLangValue('ar', sectionKey as string, ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 2. MEDIA HUB TAB (True Aspect Ratios & Tap to Big Zoom) -->
      <div v-else-if="activeSection === 'media'" class="space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- 16:9 Banner Cover with Big Zoom on Tap -->
          <div class="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">تصویر بنر هدر (16:9)</span>
              <div class="flex items-center gap-1">
                <span class="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-mono" dir="ltr">16:9</span>
                <button
                  @click="openLightboxZoom(getCoverImageUrl(), 'تصویر بنر هدر')"
                  class="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                  title="نمایش بزرگ تمام‌صفحه (Fullscreen Zoom)"
                >
                  <Icon name="mdi:magnify-plus-outline" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- 16:9 Container -->
            <div
              @click="openLightboxZoom(getCoverImageUrl(), 'تصویر بنر هدر')"
              class="group relative w-full aspect-video rounded-lg border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer shadow-2xs"
            >
              <img
                :src="getCoverImageUrl()"
                alt="cover-16-9"
                class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 font-bold text-[11px] shadow-md flex items-center gap-1">
                  <Icon name="mdi:arrow-expand-all" class="w-3.5 h-3.5 text-emerald-800" />
                  <span>کلیک برای نمایش بزرگ</span>
                </span>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <input
                type="text"
                dir="ltr"
                :value="rootSchema.coverImage || getCoverImageUrl()"
                @input="rootSchema.coverImage = ($event.target as HTMLInputElement).value; emitChange()"
                class="flex-1 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[10px] font-mono text-slate-700 text-left"
              />
              <button
                @click="openMediaModalFor('coverImage')"
                class="px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px] hover:bg-emerald-100 transition shrink-0"
              >
                تعویض
              </button>
            </div>
          </div>

          <!-- 4:3 Feature Media with Big Zoom on Tap -->
          <div class="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">تصویر شاخص بدنه (4:3)</span>
              <div class="flex items-center gap-1">
                <span class="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-mono" dir="ltr">4:3</span>
                <button
                  @click="openLightboxZoom(getFeatureImageUrl(), 'تصویر شاخص بدنه')"
                  class="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                  title="نمایش بزرگ تمام‌صفحه"
                >
                  <Icon name="mdi:magnify-plus-outline" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- 4:3 Container -->
            <div
              @click="openLightboxZoom(getFeatureImageUrl(), 'تصویر شاخص بدنه')"
              class="group relative w-full aspect-[4/3] rounded-lg border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer shadow-2xs"
            >
              <img
                :src="getFeatureImageUrl()"
                alt="feature-4-3"
                class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 font-bold text-[11px] shadow-md flex items-center gap-1">
                  <Icon name="mdi:arrow-expand-all" class="w-3.5 h-3.5 text-emerald-800" />
                  <span>کلیک برای نمایش بزرگ</span>
                </span>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <input
                type="text"
                dir="ltr"
                :value="rootSchema.featureImage || getFeatureImageUrl()"
                @input="rootSchema.featureImage = ($event.target as HTMLInputElement).value; emitChange()"
                class="flex-1 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[10px] font-mono text-slate-700 text-left"
              />
              <button
                @click="openMediaModalFor('featureImage')"
                class="px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px] hover:bg-emerald-100 transition shrink-0"
              >
                تعویض
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. STYLE & THEME TAB -->
      <div v-else-if="activeSection === 'style'" class="space-y-3">
        <div class="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
              <input
                type="color"
                :value="rootSchema.accentColor || '#018786'"
                @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div class="w-full h-full" :style="{ backgroundColor: rootSchema.accentColor || '#018786' }"></div>
            </div>
            <div>
              <span class="font-bold text-slate-900 text-xs block">رنگ سازمانی و المان‌ها</span>
              <span class="text-[10px] text-slate-400 font-mono" dir="ltr">{{ rootSchema.accentColor || '#018786' }}</span>
            </div>
          </div>

          <input
            type="text"
            dir="ltr"
            :value="rootSchema.accentColor || '#018786'"
            @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
            class="w-28 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs text-slate-900 focus:outline-none text-center font-bold"
          />
        </div>
      </div>
    </div>

    <!-- IMMERSIVE BIG LIGHTBOX ZOOM MODAL -->
    <transition name="fade">
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
        @click.self="isLightboxOpen = false"
      >
        <!-- Lightbox Bar -->
        <div class="w-full max-w-4xl flex items-center justify-between text-white pb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="font-bold text-sm">{{ lightboxTitle }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="zoomLightbox(0.2)"
              class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              title="بزرگنمایی"
            >
              <Icon name="mdi:plus" class="w-4 h-4" />
            </button>
            <button
              @click="zoomLightbox(-0.2)"
              class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              title="کوچکنمایی"
            >
              <Icon name="mdi:minus" class="w-4 h-4" />
            </button>
            <button
              @click="isLightboxOpen = false"
              class="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer ml-2"
              title="بستن"
            >
              <Icon name="mdi:close" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Big Image Display with Zoom -->
        <div class="w-full max-w-4xl max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-white/10 p-2">
          <img
            :src="lightboxImageUrl"
            :alt="lightboxTitle"
            class="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl transition-transform duration-200"
            :style="{ transform: `scale(${lightboxZoomScale})` }"
          />
        </div>
      </div>
    </transition>

    <!-- Media Picker Modal -->
    <MediaAssetModal
      :is-open="isMediaModalOpen"
      :initial-url="activeMediaField ? rootSchema[activeMediaField] : ''"
      @close="isMediaModalOpen = false"
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MediaAssetModal from './MediaAssetModal.vue'

const props = defineProps<{
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'change', val: Record<string, any>): void
}>()

const activeSection = ref<'copy' | 'media' | 'style'>('copy')
const activeLang = ref<'fa' | 'en' | 'ar' | 'all'>('fa')
const isMediaModalOpen = ref(false)
const activeMediaField = ref<string | null>(null)

// Big Lightbox Zoom State
const isLightboxOpen = ref(false)
const lightboxImageUrl = ref('')
const lightboxTitle = ref('')
const lightboxZoomScale = ref(1)

function openLightboxZoom(url: string, title: string) {
  lightboxImageUrl.value = url
  lightboxTitle.value = title
  lightboxZoomScale.value = 1
  isLightboxOpen.value = true
}

function zoomLightbox(delta: number) {
  lightboxZoomScale.value = Math.max(0.6, Math.min(2.5, lightboxZoomScale.value + delta))
}

const sections = [
  { id: 'copy', label: 'محتوا و متون', icon: 'mdi:format-text' },
  { id: 'media', label: 'رسانه‌ها (16:9)', icon: 'mdi:image-outline' },
  { id: 'style', label: 'رنگ و استایل', icon: 'mdi:palette-outline' }
]

const rootSchema = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
})

function emitChange() {
  emit('update:modelValue', props.modelValue)
  emit('change', props.modelValue)
}

function isLtrKey(k: string) {
  const lower = k.toLowerCase()
  return lower.includes('slug') || lower.includes('url') || lower.includes('path') || lower.includes('icon') || lower.includes('count') || lower.includes('order') || lower.includes('id') || lower.includes('type')
}

function getObjectKeys(obj: any) {
  if (!obj || typeof obj !== 'object') return []
  return Object.keys(obj).filter(k => k !== 'id')
}

function getLangValue(lang: 'fa' | 'en' | 'ar', field: string) {
  const langObj = props.modelValue[lang] || props.modelValue[lang.toUpperCase()] || {}
  return langObj[field] || ''
}

function setLangValue(lang: 'fa' | 'en' | 'ar', field: string, val: any) {
  if (!props.modelValue[lang]) {
    props.modelValue[lang] = {}
  }
  props.modelValue[lang][field] = val
  emitChange()
}

function getCoverImageUrl() {
  return rootSchema.value.coverImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'
}

function getFeatureImageUrl() {
  return rootSchema.value.featureImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'
}

function hasKeyInUiData(key: string) {
  const locales = ['fa', 'en', 'ar', 'FA', 'EN', 'AR']
  return locales.some(l => props.modelValue[l] && (props.modelValue[l][key] !== undefined))
}

const recognizedPageSections = computed(() => {
  const knownSectionMeta: Record<string, { titleFa: string, isArray: boolean, isArrayOfObjects?: boolean, isObject?: boolean }> = {
    'categories': { titleFa: 'دسته‌بندی‌های محصولات', isArray: true },
    'fleet': { titleFa: 'ماشین‌آلات و خطوط تولید', isArray: true },
    'milestones': { titleFa: 'گاه‌شمار تحول تاریخی', isArray: true },
    'topics': { titleFa: 'پرسش‌های متداول', isArray: true },
    'formats': { titleFa: 'فرمت‌های کاتالوگ', isArray: true },
    'mission': { titleFa: 'ماموریت و کیفیت', isArray: false },
    'story': { titleFa: 'روایت تاریخچه', isArray: false },
    'factoryAddress': { titleFa: 'نشانی کارخانه', isArray: false },
    'phone': { titleFa: 'تلفن مستقیم', isArray: false },
    'links': { titleFa: 'لینک‌ها و پیوندها', isArray: false, isObject: true },
    'contact': { titleFa: 'اطلاعات تماس', isArray: false, isObject: true },
    'services': { titleFa: 'خدمات کارخانه', isArray: false, isObject: true },
    'products': { titleFa: 'محصولات منو', isArray: false, isObject: true }
  }

  const result: Record<string, { titleFa: string, isArray: boolean, isArrayOfObjects?: boolean, isObject?: boolean }> = {}
  const locales = ['fa', 'en', 'ar', 'FA', 'EN', 'AR']

  for (const loc of locales) {
    const locObj = props.modelValue[loc]
    if (locObj && typeof locObj === 'object') {
      for (const k of Object.keys(locObj)) {
        if (!['title', 'subtitle', 'stats'].includes(k)) {
          const val = locObj[k]
          const isArr = Array.isArray(val)
          const isArrOfObj = isArr && val.length > 0 && typeof val[0] === 'object'
          const isObj = !isArr && typeof val === 'object' && val !== null

          if (knownSectionMeta[k]) {
            result[k] = {
              ...knownSectionMeta[k],
              isArrayOfObjects: isArrOfObj,
              isObject: isObj
            }
          } else {
            result[k] = {
              titleFa: `بخش ${k}`,
              isArray: isArr,
              isArrayOfObjects: isArrOfObj,
              isObject: isObj
            }
          }
        }
      }
    }
  }

  return result
})

function getSectionObjectValue(sectionKey: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  const locObj = props.modelValue[targetLang] || props.modelValue[targetLang.toUpperCase()] || {}
  return locObj[sectionKey] || {}
}

function updateDirectObjectProperty(sectionKey: string, propKey: string, val: any) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][sectionKey]) props.modelValue[targetLang][sectionKey] = {}
  props.modelValue[targetLang][sectionKey][propKey] = val
  emitChange()
}

function getArraySectionItems(sectionKey: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  const locObj = props.modelValue[targetLang] || props.modelValue[targetLang.toUpperCase()] || {}
  return locObj[sectionKey] || []
}

function updateArraySectionItem(sectionKey: string, idx: number, val: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][sectionKey]) props.modelValue[targetLang][sectionKey] = []
  props.modelValue[targetLang][sectionKey][idx] = val
  emitChange()
}

function updateObjectSubProperty(sectionKey: string, idx: number, propKey: string, val: any) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][sectionKey]) props.modelValue[targetLang][sectionKey] = []
  if (props.modelValue[targetLang][sectionKey][idx]) {
    props.modelValue[targetLang][sectionKey][idx][propKey] = val
    emitChange()
  }
}

function addArraySectionItem(sectionKey: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][sectionKey]) props.modelValue[targetLang][sectionKey] = []
  props.modelValue[targetLang][sectionKey].push('')
  emitChange()
}

function addObjectToArraySection(sectionKey: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][sectionKey]) props.modelValue[targetLang][sectionKey] = []
  props.modelValue[targetLang][sectionKey].push({ name: '', slug: '', order: 1 })
  emitChange()
}

function removeArraySectionItem(sectionKey: string, idx: number) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (props.modelValue[targetLang]?.[sectionKey]) {
    props.modelValue[targetLang][sectionKey].splice(idx, 1)
    emitChange()
  }
}

function openAdvancedSubEditor(sectionKey: string) {
  // Can trigger focus or custom modal
}

function openMediaModalFor(field: string) {
  activeMediaField.value = field
  isMediaModalOpen.value = true
}

function handleMediaSelect(newUrl: string) {
  if (activeMediaField.value) {
    rootSchema.value[activeMediaField.value] = newUrl
    emitChange()
  }
}
</script>
