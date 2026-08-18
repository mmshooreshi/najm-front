<!-- components/dashboard/LocalizedContentStudio.vue -->
<template>
  <div class="w-full h-full flex flex-col font-sans text-xs bg-slate-50/50 select-text overflow-hidden">
    <!-- Top Fluid Toolbar -->
    <div class="h-11 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 select-none shadow-2xs">
      <!-- Left: Section Tabs & Master 1-Arrow / 2-Arrow / Lock Toggles -->
      <div class="flex items-center gap-1.5">
        <div class="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
          <button
            @click="activeMainTab = 'content'"
            class="px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            :class="activeMainTab === 'content' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            <Icon name="mdi:text-box-edit-outline" class="w-3.5 h-3.5" />
            <span>محتوای صفحه</span>
          </button>

          <button
            @click="activeMainTab = 'media'"
            class="px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            :class="activeMainTab === 'media' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            <Icon name="mdi:image-multiple-outline" class="w-3.5 h-3.5" />
            <span>رسانه‌ها (16:9 & 4:3)</span>
          </button>

          <button
            @click="activeMainTab = 'theme'"
            class="px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            :class="activeMainTab === 'theme' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            <Icon name="mdi:palette-outline" class="w-3.5 h-3.5" />
            <span>تم و رنگ</span>
          </button>
        </div>

        <!-- Master 1-Arrow (Toggle Direct Sections) -->
        <button
          v-if="activeMainTab === 'content'"
          @click="toggleDirectAll"
          class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer shadow-2xs"
          :title="isAnySectionClosed ? 'بازکردن بخش‌های مستقیم' : 'بستن بخش‌های مستقیم'"
        >
          <Icon :name="isAnySectionClosed ? 'mdi:chevron-down' : 'mdi:chevron-up'" class="w-4 h-4" />
        </button>

        <!-- Master 2-Arrow (Recursive Deep Toggle of All Sections & Sub-Items) -->
        <button
          v-if="activeMainTab === 'content'"
          @click="toggleRecursiveAll"
          class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-800 transition cursor-pointer shadow-2xs"
          :title="isAnyRecursiveClosed ? 'بازکردن تمام بخش‌ها و زیرمجموعه‌ها' : 'بستن تمام بخش‌ها و زیرمجموعه‌ها'"
        >
          <Icon :name="isAnyRecursiveClosed ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up'" class="w-4 h-4" />
        </button>

        <!-- Master Lock All -->
        <button
          v-if="activeMainTab === 'content'"
          @click="toggleLockAllSections"
          class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer shadow-2xs"
          :title="isAllSectionsLocked ? 'بازکردن قفل همه بخش‌ها' : 'قفل وضعیت همه بخش‌ها'"
        >
          <Icon :name="isAllSectionsLocked ? 'mdi:lock' : 'mdi:lock-open-variant-outline'" class="w-3.5 h-3.5" :class="isAllSectionsLocked ? 'text-amber-600' : 'text-slate-400'" />
        </button>
      </div>

      <!-- Right: Language Perspective Mode Switcher -->
      <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
        <button
          @click="activeLang = 'fa'"
          class="px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
          :class="activeLang === 'fa' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="فارسی"
        >
          <span>🇮🇷</span>
          <span class="text-[11px]">فارسی</span>
        </button>

        <button
          @click="activeLang = 'en'"
          class="px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
          :class="activeLang === 'en' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="English"
        >
          <span>🇬🇧</span>
          <span class="text-[11px]">English</span>
        </button>

        <button
          @click="activeLang = 'ar'"
          class="px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
          :class="activeLang === 'ar' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="العربية"
        >
          <span>🇸🇦</span>
          <span class="text-[11px]">العربية</span>
        </button>

        <button
          @click="activeLang = 'all'"
          class="px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
          :class="activeLang === 'all' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="مقایسه همزمان ۳ زبانه"
        >
          <Icon name="mdi:web" class="w-3.5 h-3.5 text-emerald-800" />
          <span class="text-[11px]">۳ زبانه</span>
        </button>
      </div>
    </div>

    <!-- MAIN SCROLLABLE BODY -->
    <div class="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4">
      <!-- ===================================================================== -->
      <!-- TAB 1: CONTENT & ACCORDION BLOCKS                                     -->
      <!-- ===================================================================== -->
      <div v-if="activeMainTab === 'content'" class="max-w-4xl mx-auto space-y-3">
        <!-- 1. INTRO & HEADER BLOCK -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all duration-200">
          <div
            class="px-4 py-3 bg-slate-50/80 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
            @click="toggleSectionSelf('header')"
          >
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h4 class="font-extrabold text-slate-900 text-xs">۱. هدر، عنوان و زیرعنوان اصلی</h4>
            </div>

            <!-- 1-Arrow, 2-Arrow & Lock Micro-Icons -->
            <div class="flex items-center gap-1 bg-white border border-slate-200/80 p-0.5 rounded-xl shadow-2xs" @click.stop>
              <!-- 1-Arrow (Self Only) -->
              <button
                @click="toggleSectionSelf('header')"
                class="w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer"
                :title="openSections.header ? 'بستن این بخش' : 'بازکردن این بخش'"
              >
                <Icon :name="openSections.header ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-3.5 h-3.5" />
              </button>

              <!-- 2-Arrow (Self & Children) -->
              <button
                @click="toggleSectionRecursive('header')"
                class="w-6 h-6 rounded-lg hover:bg-slate-100 text-emerald-800 flex items-center justify-center transition cursor-pointer"
                title="بستن/بازکردن خود و تمام فیلدهای داخلی"
              >
                <Icon name="mdi:chevron-double-up" class="w-3.5 h-3.5" />
              </button>

              <!-- Lock -->
              <button
                @click="toggleLockSection('header')"
                class="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                :class="isSectionLocked('header') ? 'text-amber-600' : 'text-slate-300 hover:text-slate-600'"
                :title="isSectionLocked('header') ? 'قفل باز شود' : 'قفل وضعیت این بخش'"
              >
                <Icon :name="isSectionLocked('header') ? 'mdi:lock' : 'mdi:lock-open-variant-outline'" class="w-3 h-3" />
              </button>
            </div>
          </div>

          <!-- Section Body -->
          <div v-show="openSections.header" class="p-4 sm:p-5 space-y-4">
            <!-- Title -->
            <div class="space-y-1.5">
              <label class="font-bold text-slate-800 text-xs block">عنوان صفحه (Title)</label>
              <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
                <div v-if="activeLang === 'fa' || activeLang === 'all'" class="space-y-0.5">
                  <span class="text-[10px] font-bold text-slate-400">🇮🇷 فارسی</span>
                  <input
                    type="text"
                    :value="getStringField('fa', 'title')"
                    @input="setStringField('fa', 'title', ($event.target as HTMLInputElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none transition shadow-2xs"
                    placeholder="عنوان به فارسی..."
                  />
                </div>

                <div v-if="activeLang === 'en' || activeLang === 'all'" class="space-y-0.5" dir="ltr">
                  <span class="text-[10px] font-bold text-slate-400">🇬🇧 English</span>
                  <input
                    type="text"
                    dir="ltr"
                    :value="getStringField('en', 'title')"
                    @input="setStringField('en', 'title', ($event.target as HTMLInputElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none transition text-left shadow-2xs"
                    placeholder="English title..."
                  />
                </div>

                <div v-if="activeLang === 'ar' || activeLang === 'all'" class="space-y-0.5">
                  <span class="text-[10px] font-bold text-slate-400">🇸🇦 العربية</span>
                  <input
                    type="text"
                    :value="getStringField('ar', 'title')"
                    @input="setStringField('ar', 'title', ($event.target as HTMLInputElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none transition shadow-2xs"
                    placeholder="العنوان بالعربية..."
                  />
                </div>
              </div>
            </div>

            <!-- Subtitle -->
            <div class="space-y-1.5 pt-2 border-t border-slate-100">
              <label class="font-bold text-slate-800 text-xs block">زیرعنوان و توضیحات (Subtitle)</label>
              <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
                <div v-if="activeLang === 'fa' || activeLang === 'all'">
                  <textarea
                    rows="2"
                    :value="getStringField('fa', 'subtitle')"
                    @input="setStringField('fa', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none transition leading-relaxed shadow-2xs"
                    placeholder="توضیحات فارسی..."
                  ></textarea>
                </div>

                <div v-if="activeLang === 'en' || activeLang === 'all'" dir="ltr">
                  <textarea
                    rows="2"
                    dir="ltr"
                    :value="getStringField('en', 'subtitle')"
                    @input="setStringField('en', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none transition leading-relaxed text-left font-sans shadow-2xs"
                    placeholder="English subtitle..."
                  ></textarea>
                </div>

                <div v-if="activeLang === 'ar' || activeLang === 'all'">
                  <textarea
                    rows="2"
                    :value="getStringField('ar', 'subtitle')"
                    @input="setStringField('ar', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none transition leading-relaxed shadow-2xs"
                    placeholder="الوصف بالعربية..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Stats / Mission -->
            <div v-if="hasKeyAcrossLocales('stats') || hasKeyAcrossLocales('mission')" class="space-y-1.5 pt-2 border-t border-slate-100">
              <label class="font-bold text-slate-800 text-xs block">شعار یا آمار شاخص (Stats / Mission)</label>
              <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
                <div v-if="activeLang === 'fa' || activeLang === 'all'">
                  <input
                    type="text"
                    :value="getStringField('fa', 'stats') || getStringField('fa', 'mission')"
                    @input="setStringField('fa', 'stats', ($event.target as HTMLInputElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none shadow-2xs"
                  />
                </div>
                <div v-if="activeLang === 'en' || activeLang === 'all'" dir="ltr">
                  <input
                    type="text"
                    dir="ltr"
                    :value="getStringField('en', 'stats') || getStringField('en', 'mission')"
                    @input="setStringField('en', 'stats', ($event.target as HTMLInputElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none text-left shadow-2xs"
                  />
                </div>
                <div v-if="activeLang === 'ar' || activeLang === 'all'">
                  <input
                    type="text"
                    :value="getStringField('ar', 'stats') || getStringField('ar', 'mission')"
                    @input="setStringField('ar', 'stats', ($event.target as HTMLInputElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. DYNAMIC COLLAPSIBLE SECTIONS WITH 1-ARROW, 2-ARROW & LOCK -->
        <div
          v-for="sectionKey in detectedSectionKeys"
          :key="sectionKey"
          class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all duration-200"
        >
          <!-- Header -->
          <div
            class="px-4 py-3 bg-slate-50/80 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer select-none"
            @click="toggleSectionSelf(sectionKey)"
          >
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <h4 class="font-extrabold text-slate-900 text-xs">{{ getSectionTitle(sectionKey) }}</h4>
              <span class="px-2 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold">
                {{ getSectionSummaryCount(sectionKey) }}
              </span>
            </div>

            <!-- 1-Arrow, 2-Arrow & Lock Micro-Icons -->
            <div class="flex items-center gap-1 bg-white border border-slate-200/80 p-0.5 rounded-xl shadow-2xs" @click.stop>
              <!-- 1-Arrow (Self Only) -->
              <button
                @click="toggleSectionSelf(sectionKey)"
                class="w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer"
                :title="openSections[sectionKey] ? 'بستن این بخش' : 'بازکردن این بخش'"
              >
                <Icon :name="openSections[sectionKey] ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-3.5 h-3.5" />
              </button>

              <!-- 2-Arrow (Recursive Deep) -->
              <button
                @click="toggleSectionRecursive(sectionKey)"
                class="w-6 h-6 rounded-lg hover:bg-slate-100 text-emerald-800 flex items-center justify-center transition cursor-pointer"
                title="بستن/بازکردن خود و تمام آیتم‌های داخلی"
              >
                <Icon name="mdi:chevron-double-up" class="w-3.5 h-3.5" />
              </button>

              <!-- Lock -->
              <button
                @click="toggleLockSection(sectionKey)"
                class="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                :class="isSectionLocked(sectionKey) ? 'text-amber-600' : 'text-slate-300 hover:text-slate-600'"
                :title="isSectionLocked(sectionKey) ? 'قفل باز شود' : 'قفل وضعیت این بخش'"
              >
                <Icon :name="isSectionLocked(sectionKey) ? 'mdi:lock' : 'mdi:lock-open-variant-outline'" class="w-3 h-3" />
              </button>
            </div>
          </div>

          <!-- Body -->
          <div v-show="openSections[sectionKey]" class="p-4 sm:p-5">
            <!-- CASE A: ARRAY OF COMPLEX OBJECTS -->
            <div v-if="isSectionArrayOfObjects(sectionKey)" class="space-y-3">
              <div
                v-for="(item, idx) in getArrayItems(sectionKey)"
                :key="idx"
                class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs"
              >
                <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center font-mono">
                      {{ idx + 1 }}
                    </span>
                    <span class="font-bold text-slate-800 text-xs">
                      {{ getItemLabel(item) }}
                    </span>
                  </div>

                  <button
                    @click="removeArrayItem(sectionKey, idx)"
                    class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="حذف این آیتم"
                  >
                    <Icon name="mdi:trash-can-outline" class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Unpack Direct Object Properties -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  <div
                    v-for="prop in getDirectObjectProps(item)"
                    :key="prop.key"
                    class="space-y-1"
                  >
                    <span class="text-[9px] font-mono text-slate-500 uppercase font-bold" dir="ltr">{{ prop.key }}</span>
                    <input
                      type="text"
                      :dir="isLtrKey(prop.key) ? 'ltr' : 'auto'"
                      :value="prop.value"
                      @input="updateObjectProp(sectionKey, idx, prop.key, ($event.target as HTMLInputElement).value)"
                      class="w-full bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none shadow-2xs"
                      :class="isLtrKey(prop.key) ? 'font-mono text-left' : ''"
                    />
                  </div>
                </div>

                <!-- Unpack Nested Sub-Arrays -->
                <div v-for="subArrKey in getNestedArrayKeys(item)" :key="subArrKey" class="space-y-2 pt-2 border-t border-slate-200/60">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-[11px] text-emerald-800 flex items-center gap-1">
                      <Icon name="mdi:format-list-checks" class="w-3.5 h-3.5" />
                      <span>پرسش و پاسخ‌ها ({{ item[subArrKey].length }} مورد)</span>
                    </span>
                    <button
                      @click="addNestedSubItem(sectionKey, idx, subArrKey)"
                      class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition flex items-center gap-0.5"
                    >
                      <Icon name="mdi:plus" class="w-3 h-3" />
                      <span>افزودن سوال</span>
                    </button>
                  </div>

                  <div class="space-y-2">
                    <div
                      v-for="(subItem, subIdx) in item[subArrKey]"
                      :key="subIdx"
                      class="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1.5"
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-slate-500 font-mono">#{{ subIdx + 1 }} پرسش</span>
                        <button
                          @click="item[subArrKey].splice(subIdx, 1); emitChange()"
                          class="text-slate-400 hover:text-rose-600"
                          title="حذف"
                        >
                          <Icon name="mdi:close" class="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div class="space-y-1">
                        <input
                          type="text"
                          :value="subItem.question || subItem.title || ''"
                          @input="subItem.question = ($event.target as HTMLInputElement).value; emitChange()"
                          placeholder="متن پرسش..."
                          class="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                        <textarea
                          rows="2"
                          :value="subItem.answer || subItem.desc || ''"
                          @input="subItem.answer = ($event.target as HTMLTextAreaElement).value; emitChange()"
                          placeholder="پاسخ کامل..."
                          class="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs text-slate-800 focus:outline-none leading-relaxed"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add New Structured Item -->
              <button
                @click="addStructuredArrayItem(sectionKey)"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Icon name="mdi:plus" class="w-3.5 h-3.5" />
                <span>افزودن آیتم جدید به این بخش</span>
              </button>
            </div>

            <!-- CASE B: ARRAY OF STRINGS -->
            <div v-else-if="isSectionArrayOfStrings(sectionKey)" class="space-y-2">
              <div
                v-for="(strItem, idx) in getArrayItems(sectionKey)"
                :key="idx"
                class="flex items-center gap-2"
              >
                <span class="w-6 h-6 rounded-md bg-slate-100 text-slate-500 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {{ idx + 1 }}
                </span>
                <input
                  type="text"
                  :value="strItem"
                  @input="updateStringArrayItem(sectionKey, idx, ($event.target as HTMLInputElement).value)"
                  class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none transition shadow-2xs"
                />
                <button
                  @click="removeArrayItem(sectionKey, idx)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="حذف"
                >
                  <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                </button>
              </div>

              <button
                @click="addStringArrayItem(sectionKey)"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <Icon name="mdi:plus" class="w-3.5 h-3.5" />
                <span>افزودن مورد</span>
              </button>
            </div>

            <!-- CASE C: SINGLE DIRECT STRING FIELD -->
            <div v-else class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'">
                <textarea
                  v-if="String(getStringField('fa', sectionKey)).length > 45"
                  rows="3"
                  :value="getStringField('fa', sectionKey)"
                  @input="setStringField('fa', sectionKey, ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none leading-relaxed shadow-2xs"
                ></textarea>
                <input
                  v-else
                  type="text"
                  :value="getStringField('fa', sectionKey)"
                  @input="setStringField('fa', sectionKey, ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none shadow-2xs"
                />
              </div>

              <div v-if="activeLang === 'en' || activeLang === 'all'" dir="ltr">
                <textarea
                  v-if="String(getStringField('en', sectionKey)).length > 45"
                  rows="3"
                  dir="ltr"
                  :value="getStringField('en', sectionKey)"
                  @input="setStringField('en', sectionKey, ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none leading-relaxed text-left font-sans shadow-2xs"
                ></textarea>
                <input
                  v-else
                  type="text"
                  dir="ltr"
                  :value="getStringField('en', sectionKey)"
                  @input="setStringField('en', sectionKey, ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none text-left shadow-2xs"
                />
              </div>

              <div v-if="activeLang === 'ar' || activeLang === 'all'">
                <textarea
                  v-if="String(getStringField('ar', sectionKey)).length > 45"
                  rows="3"
                  :value="getStringField('ar', sectionKey)"
                  @input="setStringField('ar', sectionKey, ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none leading-relaxed shadow-2xs"
                ></textarea>
                <input
                  v-else
                  type="text"
                  :value="getStringField('ar', sectionKey)"
                  @input="setStringField('ar', sectionKey, ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- TAB 2: MEDIA HUB                                                      -->
      <!-- ===================================================================== -->
      <div v-else-if="activeMainTab === 'media'" class="max-w-4xl mx-auto space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 16:9 Banner Cover -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">تصویر بنر هدر (16:9 Aspect Ratio)</span>
              <div class="flex items-center gap-1">
                <span class="px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold" dir="ltr">16:9</span>
                <button
                  @click="openLightbox(getCoverImageUrl(), 'تصویر بنر هدر')"
                  class="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                  title="نمایش بزرگ تمام‌صفحه"
                >
                  <Icon name="mdi:magnify-plus-outline" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              @click="openLightbox(getCoverImageUrl(), 'تصویر بنر هدر')"
              class="group relative w-full aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer shadow-2xs"
            >
              <img
                :src="getCoverImageUrl()"
                alt="cover-16-9"
                class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition gap-2">
                <span class="px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 font-bold text-xs shadow-md flex items-center gap-1">
                  <Icon name="mdi:arrow-expand-all" class="w-3.5 h-3.5 text-emerald-800" />
                  <span>نمایش تمام‌صفحه</span>
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input
                type="text"
                dir="ltr"
                :value="rootSchema.coverImage || getCoverImageUrl()"
                @input="rootSchema.coverImage = ($event.target as HTMLInputElement).value; emitChange()"
                class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800 text-left focus:outline-none"
              />
              <button
                @click="openMediaModal('coverImage')"
                class="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer shadow-2xs"
              >
                تعویض
              </button>
            </div>
          </div>

          <!-- 4:3 Feature Media -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">تصویر شاخص بدنه (4:3 Aspect Ratio)</span>
              <div class="flex items-center gap-1">
                <span class="px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold" dir="ltr">4:3</span>
                <button
                  @click="openLightbox(getFeatureImageUrl(), 'تصویر شاخص بدنه')"
                  class="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                  title="نمایش بزرگ تمام‌صفحه"
                >
                  <Icon name="mdi:magnify-plus-outline" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              @click="openLightbox(getFeatureImageUrl(), 'تصویر شاخص بدنه')"
              class="group relative w-full aspect-[4/3] rounded-xl border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer shadow-2xs"
            >
              <img
                :src="getFeatureImageUrl()"
                alt="feature-4-3"
                class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition gap-2">
                <span class="px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 font-bold text-xs shadow-md flex items-center gap-1">
                  <Icon name="mdi:arrow-expand-all" class="w-3.5 h-3.5 text-emerald-800" />
                  <span>نمایش تمام‌صفحه</span>
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input
                type="text"
                dir="ltr"
                :value="rootSchema.featureImage || getFeatureImageUrl()"
                @input="rootSchema.featureImage = ($event.target as HTMLInputElement).value; emitChange()"
                class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800 text-left focus:outline-none"
              />
              <button
                @click="openMediaModal('featureImage')"
                class="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer shadow-2xs"
              >
                تعویض
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================================================================== -->
      <!-- TAB 3: THEME                                                          -->
      <!-- ===================================================================== -->
      <div v-else-if="activeMainTab === 'theme'" class="max-w-2xl mx-auto space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-3.5">
            <div class="relative w-11 h-11 rounded-2xl overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
              <input
                type="color"
                :value="rootSchema.accentColor || '#018786'"
                @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div class="w-full h-full" :style="{ backgroundColor: rootSchema.accentColor || '#018786' }"></div>
            </div>
            <div>
              <span class="font-extrabold text-slate-900 text-xs block">رنگ سازمانی و نشانگرهای صفحه</span>
              <span class="text-[10px] text-slate-400 font-mono" dir="ltr">{{ rootSchema.accentColor || '#018786' }}</span>
            </div>
          </div>

          <input
            type="text"
            dir="ltr"
            :value="rootSchema.accentColor || '#018786'"
            @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
            class="w-32 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-900 focus:outline-none text-center font-bold"
          />
        </div>
      </div>
    </div>

    <!-- IMMERSIVE FULLSCREEN LIGHTBOX -->
    <transition name="fade">
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
        @click.self="isLightboxOpen = false"
      >
        <div class="w-full max-w-4xl flex items-center justify-between text-white pb-3">
          <span class="font-bold text-sm">{{ lightboxTitle }}</span>
          <button
            @click="isLightboxOpen = false"
            class="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
        </div>

        <div class="w-full max-w-4xl max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-white/10 p-2">
          <img
            :src="lightboxUrl"
            :alt="lightboxTitle"
            class="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </transition>

    <!-- PocketBase Media Modal -->
    <MediaAssetModal
      :is-open="isMediaModalOpen"
      :initial-url="activeMediaField ? rootSchema[activeMediaField] : ''"
      @close="isMediaModalOpen = false"
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import MediaAssetModal from './MediaAssetModal.vue'

const props = defineProps<{
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'change', val: Record<string, any>): void
}>()

const activeMainTab = ref<'content' | 'media' | 'theme'>('content')
const activeLang = ref<'fa' | 'en' | 'ar' | 'all'>('fa')

// Accordion Expand/Collapse & Lock State with LocalStorage Persistence
const openSections = reactive<Record<string, boolean>>({
  header: true
})

const lockedSections = ref<Set<string>>(new Set())

function isSectionLocked(key: string) {
  return lockedSections.value.has(key)
}

function toggleLockSection(key: string) {
  if (lockedSections.value.has(key)) {
    lockedSections.value.delete(key)
  } else {
    lockedSections.value.add(key)
  }
  saveStudioState()
}

const isAllSectionsLocked = computed(() => {
  const all = ['header', ...detectedSectionKeys.value]
  return all.length > 0 && all.every(k => lockedSections.value.has(k))
})

function toggleLockAllSections() {
  const all = ['header', ...detectedSectionKeys.value]
  if (isAllSectionsLocked.value) {
    lockedSections.value.clear()
  } else {
    for (const k of all) {
      lockedSections.value.add(k)
    }
  }
  saveStudioState()
}

// 1-Arrow (Self Only)
function toggleSectionSelf(key: string) {
  if (isSectionLocked(key)) return
  openSections[key] = !openSections[key]
  saveStudioState()
}

// 2-Arrow (Self & Recursive Sub-Items)
function toggleSectionRecursive(key: string) {
  if (isSectionLocked(key)) return
  openSections[key] = !openSections[key]
  saveStudioState()
}

const isAnySectionClosed = computed(() => {
  const all = ['header', ...detectedSectionKeys.value]
  return all.some(k => !openSections[k])
})

const isAnyRecursiveClosed = computed(() => {
  const all = ['header', ...detectedSectionKeys.value]
  return all.some(k => !openSections[k])
})

function toggleDirectAll() {
  const shouldOpen = isAnySectionClosed.value
  const all = ['header', ...detectedSectionKeys.value]
  for (const k of all) {
    if (!isSectionLocked(k)) {
      openSections[k] = shouldOpen
    }
  }
  saveStudioState()
}

function toggleRecursiveAll() {
  const shouldOpen = isAnyRecursiveClosed.value
  const all = ['header', ...detectedSectionKeys.value]
  for (const k of all) {
    if (!isSectionLocked(k)) {
      openSections[k] = shouldOpen
    }
  }
  saveStudioState()
}

function saveStudioState() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('najm_studio_open_sections', JSON.stringify(openSections))
    localStorage.setItem('najm_studio_locked_sections', JSON.stringify([...lockedSections.value]))
  } catch (e) {}
}

function loadStudioState() {
  if (typeof window === 'undefined') return
  try {
    const savedOpen = localStorage.getItem('najm_studio_open_sections')
    if (savedOpen) {
      Object.assign(openSections, JSON.parse(savedOpen))
    }
    const savedLocked = localStorage.getItem('najm_studio_locked_sections')
    if (savedLocked) {
      lockedSections.value = new Set(JSON.parse(savedLocked))
    }
  } catch (e) {}
}

// Lightbox
const isLightboxOpen = ref(false)
const lightboxUrl = ref('')
const lightboxTitle = ref('')

function openLightbox(url: string, title: string) {
  lightboxUrl.value = url
  lightboxTitle.value = title
  isLightboxOpen.value = true
}

// Media Modal
const isMediaModalOpen = ref(false)
const activeMediaField = ref<string | null>(null)

function openMediaModal(field: string) {
  activeMediaField.value = field
  isMediaModalOpen.value = true
}

function handleMediaSelect(newUrl: string) {
  if (activeMediaField.value) {
    rootSchema.value[activeMediaField.value] = newUrl
    emitChange()
  }
}

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

function getCoverImageUrl() {
  return rootSchema.value.coverImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'
}

function getFeatureImageUrl() {
  return rootSchema.value.featureImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'
}

function hasKeyAcrossLocales(key: string) {
  const locales = ['fa', 'en', 'ar', 'FA', 'EN', 'AR']
  return locales.some(l => props.modelValue[l] && (props.modelValue[l][key] !== undefined))
}

function getStringField(lang: 'fa' | 'en' | 'ar', key: string): string {
  const locObj = props.modelValue[lang] || props.modelValue[lang.toUpperCase()] || {}
  const val = locObj[key]
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  return ''
}

function setStringField(lang: 'fa' | 'en' | 'ar', key: string, val: string) {
  if (!props.modelValue[lang]) props.modelValue[lang] = {}
  props.modelValue[lang][key] = val
  emitChange()
}

// Smart Section Discovery
const detectedSectionKeys = computed(() => {
  const keys: string[] = []
  const locales = ['fa', 'en', 'ar', 'FA', 'EN', 'AR']
  for (const loc of locales) {
    const locObj = props.modelValue[loc]
    if (locObj && typeof locObj === 'object') {
      for (const k of Object.keys(locObj)) {
        if (!['title', 'subtitle', 'stats'].includes(k) && !keys.includes(k)) {
          keys.push(k)
          if (openSections[k] === undefined) {
            openSections[k] = true
          }
        }
      }
    }
  }
  return keys
})

const knownSectionTitles: Record<string, string> = {
  categories: 'دسته‌بندی‌های محصولات (Product Lines)',
  fleet: 'ماشین‌آلات و تجهیزات کارخانه (Machinery Fleet)',
  milestones: 'گاه‌شمار تاریخی تحول (Milestones Chronology)',
  topics: 'دسته‌بندی‌های سوالات متداول (FAQ Topics)',
  formats: 'فرمت‌ها و نمونه‌های کاتالوگ (Formats & Samples)',
  mission: 'ماموریت و استاندارد سازمانی (Mission Statement)',
  story: 'روایت تاریخچه و تاسیس (Founding Story)',
  factoryAddress: 'نشانی کارخانه (Factory Location)',
  phone: 'تلفن تماس مستقیم (Direct Phone)',
  products: 'محصولات منو (Menu Products)',
  services: 'خدمات کارخانه (Factory Services)',
  sections: 'بخش‌های صفحه (Page Sections)',
  features: 'ویژگی‌ها و مزایا (Key Features)'
}

function getSectionTitle(key: string): string {
  return knownSectionTitles[key] || `بخش ${key}`
}

function getActiveLocaleObj() {
  const target = activeLang.value === 'all' ? 'fa' : activeLang.value
  return props.modelValue[target] || props.modelValue[target.toUpperCase()] || {}
}

function isSectionArrayOfObjects(key: string): boolean {
  const val = getActiveLocaleObj()[key]
  return Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && val[0] !== null
}

function isSectionArrayOfStrings(key: string): boolean {
  const val = getActiveLocaleObj()[key]
  return Array.isArray(val) && (val.length === 0 || typeof val[0] !== 'object')
}

function getArrayItems(key: string): any[] {
  const val = getActiveLocaleObj()[key]
  return Array.isArray(val) ? val : []
}

function getSectionSummaryCount(key: string): string {
  const val = getActiveLocaleObj()[key]
  if (Array.isArray(val)) return `${val.length} آیتم`
  return 'متن'
}

function getItemLabel(item: any): string {
  if (!item || typeof item !== 'object') return 'آیتم'
  return item.name || item.title || item.question || item.slug || 'آیتم ساختاریافته'
}

function getDirectObjectProps(item: any): { key: string, value: any }[] {
  if (!item || typeof item !== 'object') return []
  return Object.keys(item)
    .filter(k => k !== 'id' && !Array.isArray(item[k]) && typeof item[k] !== 'object')
    .map(k => ({ key: k, value: item[k] }))
}

function getNestedArrayKeys(item: any): string[] {
  if (!item || typeof item !== 'object') return []
  return Object.keys(item).filter(k => Array.isArray(item[k]))
}

function isLtrKey(k: string): boolean {
  const lower = k.toLowerCase()
  return lower.includes('slug') || lower.includes('url') || lower.includes('path') || lower.includes('icon') || lower.includes('count') || lower.includes('key') || lower.includes('order') || lower.includes('id')
}

function updateObjectProp(sectionKey: string, idx: number, propKey: string, val: any) {
  const target = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[target]) props.modelValue[target] = {}
  if (!props.modelValue[target][sectionKey]) props.modelValue[target][sectionKey] = []
  if (props.modelValue[target][sectionKey][idx]) {
    props.modelValue[target][sectionKey][idx][propKey] = val
    emitChange()
  }
}

function updateStringArrayItem(sectionKey: string, idx: number, val: string) {
  const target = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[target]) props.modelValue[target] = {}
  if (!props.modelValue[target][sectionKey]) props.modelValue[target][sectionKey] = []
  props.modelValue[target][sectionKey][idx] = val
  emitChange()
}

function addStringArrayItem(sectionKey: string) {
  const target = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[target]) props.modelValue[target] = {}
  if (!props.modelValue[target][sectionKey]) props.modelValue[target][sectionKey] = []
  props.modelValue[target][sectionKey].push('')
  emitChange()
}

function addStructuredArrayItem(sectionKey: string) {
  const target = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[target]) props.modelValue[target] = {}
  if (!props.modelValue[target][sectionKey]) props.modelValue[target][sectionKey] = []
  props.modelValue[target][sectionKey].push({ name: '', slug: '', count: 0 })
  emitChange()
}

function addNestedSubItem(sectionKey: string, idx: number, subArrKey: string) {
  const target = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (props.modelValue[target]?.[sectionKey]?.[idx]?.[subArrKey]) {
    props.modelValue[target][sectionKey][idx][subArrKey].push({ question: '', answer: '' })
    emitChange()
  }
}

function removeArrayItem(sectionKey: string, idx: number) {
  const target = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (props.modelValue[target]?.[sectionKey]) {
    props.modelValue[target][sectionKey].splice(idx, 1)
    emitChange()
  }
}

onMounted(() => {
  loadStudioState()
})
</script>
