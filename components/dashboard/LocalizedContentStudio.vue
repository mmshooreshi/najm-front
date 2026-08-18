<!-- components/dashboard/LocalizedContentStudio.vue -->
<template>
  <div class="w-full h-full flex flex-col font-sans text-xs bg-white select-text overflow-hidden">
    <!-- Top Studio Toolbar: Mode Tabs & Language Perspective Switcher -->
    <div class="h-12 px-5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
      <!-- Digital Mirror View Modes -->
      <div class="flex items-center gap-1.5">
        <button
          @click="activeStudioView = 'page-mirror'"
          class="px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer flex items-center gap-1.5"
          :class="[
            activeStudioView === 'page-mirror'
              ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          ]"
        >
          <Icon name="mdi:view-dashboard-outline" class="w-3.5 h-3.5" :class="activeStudioView === 'page-mirror' ? 'text-emerald-800' : 'text-slate-400'" />
          <span>آینه دیجیتال صفحه (Page Mirror)</span>
        </button>

        <button
          @click="activeStudioView = 'media-hub'"
          class="px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer flex items-center gap-1.5"
          :class="[
            activeStudioView === 'media-hub'
              ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          ]"
        >
          <Icon name="mdi:image-multiple-outline" class="w-3.5 h-3.5" :class="activeStudioView === 'media-hub' ? 'text-emerald-800' : 'text-slate-400'" />
          <span>رسانه‌های صفحه (Media Hub)</span>
        </button>
      </div>

      <!-- Language Perspective Switcher (FA / EN / AR / All) -->
      <div class="flex items-center gap-1.5">
        <span class="text-slate-400 text-[10px] font-bold ml-1">زبان:</span>
        <div class="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-bold">
          <button
            v-for="l in ['fa', 'en', 'ar', 'all']"
            :key="l"
            @click="activeLang = l as any"
            class="px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1 uppercase"
            :class="activeLang === l ? 'bg-white text-emerald-800 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'"
          >
            <span>{{ l === 'all' ? '۳ زبانه' : l }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN STUDIO BODY -->
    <div class="flex-1 overflow-y-auto bg-slate-50/40">
      <!-- ====================================================================== -->
      <!-- VIEW 1: LIVING DIGITAL MIRROR OF THE REAL PAGE                        -->
      <!-- ====================================================================== -->
      <div v-if="activeStudioView === 'page-mirror'" class="max-w-4xl mx-auto p-5 sm:p-7 space-y-6">
        <!-- 1. HERO & INTRO SECTION (With 16:9 Banner Aspect Ratio) -->
        <section class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <!-- Section Header -->
          <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h4 class="font-extrabold text-slate-900 text-xs">۱. بخش معرفی و هدر صفحه (Hero & Header)</h4>
            </div>
            <span class="text-[10px] text-slate-400 font-mono" dir="ltr">section:hero</span>
          </div>

          <div class="p-5 space-y-5">
            <!-- Integrated Media: 16:9 Hero Cover with True Aspect Ratio Preview -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="font-bold text-slate-800 text-xs">تصویر پس‌زمینه هدر (نسبت ابعاد ۱۶:۹)</label>
                <button
                  @click="openMediaModalFor('coverImage')"
                  class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <Icon name="mdi:folder-image" class="w-3.5 h-3.5" />
                  <span>انتخاب از رسانه‌های PB</span>
                </button>
              </div>

              <!-- 16:9 Aspect Ratio Container -->
              <div
                @click="openMediaModalFor('coverImage')"
                class="group relative w-full aspect-video rounded-xl border border-slate-200 bg-slate-100 overflow-hidden cursor-pointer shadow-2xs hover:border-emerald-500 transition-all duration-200 flex items-center justify-center"
              >
                <img
                  :src="getCoverImageUrl()"
                  alt="hero-cover"
                  class="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                  <span class="px-3.5 py-1.5 rounded-xl bg-white/95 text-slate-900 font-bold text-xs shadow-md flex items-center gap-1.5">
                    <Icon name="mdi:tune" class="w-3.5 h-3.5 text-emerald-800" />
                    <span>کلیک برای ویرایش یا تعویض</span>
                  </span>
                </div>
                <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono" dir="ltr">
                  16:9 Aspect Ratio
                </span>
              </div>

              <!-- URL Input strictly LTR -->
              <input
                type="text"
                dir="ltr"
                :value="rootSchema.coverImage || getCoverImageUrl()"
                @input="rootSchema.coverImage = ($event.target as HTMLInputElement).value; emitChange()"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-700 focus:outline-none text-left transition"
                placeholder="https://..."
              />
            </div>

            <!-- Page Title (Trilingual Input Grid) -->
            <div class="space-y-1.5 pt-2 border-t border-slate-100">
              <label class="font-bold text-slate-800 text-xs block">عنوان اصلی صفحه (Title)</label>
              <div class="grid gap-2.5" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
                <div v-if="activeLang === 'fa' || activeLang === 'all'" class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400">فارسی</span>
                  <input
                    type="text"
                    :value="getLangValue('fa', 'title')"
                    @input="setLangValue('fa', 'title', ($event.target as HTMLInputElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none transition"
                    placeholder="عنوان به فارسی..."
                  />
                </div>
                <div v-if="activeLang === 'en' || activeLang === 'all'" class="space-y-1" dir="ltr">
                  <span class="text-[10px] font-bold text-slate-400">English</span>
                  <input
                    type="text"
                    dir="ltr"
                    :value="getLangValue('en', 'title')"
                    @input="setLangValue('en', 'title', ($event.target as HTMLInputElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none transition text-left"
                    placeholder="Title in English..."
                  />
                </div>
                <div v-if="activeLang === 'ar' || activeLang === 'all'" class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400">العربية</span>
                  <input
                    type="text"
                    :value="getLangValue('ar', 'title')"
                    @input="setLangValue('ar', 'title', ($event.target as HTMLInputElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none transition"
                    placeholder="العنوان بالعربية..."
                  />
                </div>
              </div>
            </div>

            <!-- Page Subtitle -->
            <div class="space-y-1.5 pt-2 border-t border-slate-100">
              <label class="font-bold text-slate-800 text-xs block">زیرعنوان و توضیحات معرفی (Subtitle)</label>
              <div class="grid gap-2.5" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
                <div v-if="activeLang === 'fa' || activeLang === 'all'" class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400">فارسی</span>
                  <textarea
                    rows="2"
                    :value="getLangValue('fa', 'subtitle')"
                    @input="setLangValue('fa', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none transition leading-relaxed"
                  ></textarea>
                </div>
                <div v-if="activeLang === 'en' || activeLang === 'all'" class="space-y-1" dir="ltr">
                  <span class="text-[10px] font-bold text-slate-400">English</span>
                  <textarea
                    rows="2"
                    dir="ltr"
                    :value="getLangValue('en', 'subtitle')"
                    @input="setLangValue('en', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none transition leading-relaxed text-left"
                  ></textarea>
                </div>
                <div v-if="activeLang === 'ar' || activeLang === 'all'" class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400">العربية</span>
                  <textarea
                    rows="2"
                    :value="getLangValue('ar', 'subtitle')"
                    @input="setLangValue('ar', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                    class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none transition leading-relaxed"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. METRICS & KEY STATS (If exists in uiData) -->
        <section v-if="hasKeyInUiData('stats')" class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <h4 class="font-extrabold text-slate-900 text-xs">۲. نشانگرها و آمار شاخص (Key Metrics & Stats)</h4>
            </div>
            <span class="text-[10px] text-slate-400 font-mono" dir="ltr">field:stats</span>
          </div>

          <div class="p-5">
            <div class="grid gap-2.5" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">فارسی</span>
                <input
                  type="text"
                  :value="getLangValue('fa', 'stats')"
                  @input="setLangValue('fa', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div v-if="activeLang === 'en' || activeLang === 'all'" class="space-y-1" dir="ltr">
                <span class="text-[10px] font-bold text-slate-400">English</span>
                <input
                  type="text"
                  dir="ltr"
                  :value="getLangValue('en', 'stats')"
                  @input="setLangValue('en', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none text-left"
                />
              </div>
              <div v-if="activeLang === 'ar' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">العربية</span>
                <input
                  type="text"
                  :value="getLangValue('ar', 'stats')"
                  @input="setLangValue('ar', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- 3. DYNAMIC CONTENT SECTIONS (Categories, Fleet, Milestones, Topics, Story, Mission, Contact) -->
        <section
          v-for="(sectionMeta, sectionKey) in recognizedPageSections"
          :key="sectionKey"
          class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
        >
          <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <h4 class="font-extrabold text-slate-900 text-xs">{{ sectionMeta.titleFa }}</h4>
            </div>
            <span class="text-[10px] text-slate-400 font-mono" dir="ltr">{{ sectionKey }}</span>
          </div>

          <div class="p-5">
            <!-- If Array Section (e.g. categories, fleet, milestones, topics, formats) -->
            <div v-if="sectionMeta.isArray" class="space-y-2.5">
              <div
                v-for="(item, idx) in getArraySectionItems(sectionKey as string)"
                :key="idx"
                class="flex items-center gap-2.5"
              >
                <span class="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                  {{ idx + 1 }}
                </span>
                <input
                  type="text"
                  :value="typeof item === 'string' ? item : (item.title || item.name || JSON.stringify(item))"
                  @input="updateArraySectionItem(sectionKey as string, idx, ($event.target as HTMLInputElement).value)"
                  class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none font-medium"
                />
                <button
                  @click="removeArraySectionItem(sectionKey as string, idx)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="حذف"
                >
                  <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                </button>
              </div>

              <button
                @click="addArraySectionItem(sectionKey as string)"
                class="mt-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Icon name="mdi:plus" class="w-3.5 h-3.5" />
                <span>افزودن مورد جدید</span>
              </button>
            </div>

            <!-- If String Section (e.g. story, mission, phone, factoryAddress) -->
            <div v-else class="grid gap-2.5" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">فارسی</span>
                <textarea
                  v-if="String(getLangValue('fa', sectionKey as string)).length > 40"
                  rows="2"
                  :value="getLangValue('fa', sectionKey as string)"
                  @input="setLangValue('fa', sectionKey as string, ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
                ></textarea>
                <input
                  v-else
                  type="text"
                  :value="getLangValue('fa', sectionKey as string)"
                  @input="setLangValue('fa', sectionKey as string, ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div v-if="activeLang === 'en' || activeLang === 'all'" class="space-y-1" dir="ltr">
                <span class="text-[10px] font-bold text-slate-400">English</span>
                <textarea
                  v-if="String(getLangValue('en', sectionKey as string)).length > 40"
                  rows="2"
                  dir="ltr"
                  :value="getLangValue('en', sectionKey as string)"
                  @input="setLangValue('en', sectionKey as string, ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none text-left font-sans"
                ></textarea>
                <input
                  v-else
                  type="text"
                  dir="ltr"
                  :value="getLangValue('en', sectionKey as string)"
                  @input="setLangValue('en', sectionKey as string, ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none text-left font-sans"
                />
              </div>

              <div v-if="activeLang === 'ar' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">العربية</span>
                <textarea
                  v-if="String(getLangValue('ar', sectionKey as string)).length > 40"
                  rows="2"
                  :value="getLangValue('ar', sectionKey as string)"
                  @input="setLangValue('ar', sectionKey as string, ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
                ></textarea>
                <input
                  v-else
                  type="text"
                  :value="getLangValue('ar', sectionKey as string)"
                  @input="setLangValue('ar', sectionKey as string, ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- 4. VISUAL THEME & ACCENT COLOR SECTION -->
        <section class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purple-500"></span>
              <h4 class="font-extrabold text-slate-900 text-xs">رنگ برند و نشانگرها (Brand Accent Color)</h4>
            </div>
            <span class="text-[10px] text-slate-400 font-mono" dir="ltr">accentColor</span>
          </div>

          <div class="p-5 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
                <input
                  type="color"
                  :value="rootSchema.accentColor || '#018786'"
                  @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div class="w-full h-full" :style="{ backgroundColor: rootSchema.accentColor || '#018786' }"></div>
              </div>
              <div>
                <span class="font-bold text-slate-900 text-xs block">کد هگز رنگ</span>
                <span class="text-[10px] text-slate-400 font-mono" dir="ltr">{{ rootSchema.accentColor || '#018786' }}</span>
              </div>
            </div>

            <input
              type="text"
              dir="ltr"
              :value="rootSchema.accentColor || '#018786'"
              @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
              class="w-32 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-emerald-600 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-900 focus:outline-none text-center font-bold"
            />
          </div>
        </section>
      </div>

      <!-- ====================================================================== -->
      <!-- VIEW 2: SEPARATED MEDIA HUB (All Aspect Ratios & PocketBase Library)  -->
      <!-- ====================================================================== -->
      <div v-else class="max-w-5xl mx-auto p-5 sm:p-7 space-y-6">
        <div class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">مرکز رسانه‌ها و تصاویر صفحه</h4>
            <p class="text-[11px] text-slate-500">پیش‌نمایش در نسبت‌های ابعاد واقعی (۱۶:۹، ۴:۳، ۱:۱) و تعویض از گالری PocketBase</p>
          </div>

          <button
            @click="openMediaModalFor('coverImage')"
            class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Icon name="mdi:cloud-upload-outline" class="w-4 h-4" />
            <span>باز کردن گالری رسانه‌ها</span>
          </button>
        </div>

        <!-- Grid of Media Items with True Aspect Ratios -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- 1. Hero Cover Banner (16:9) -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">تصویر بنر هدر (16:9 Hero Banner)</span>
              <span class="px-2 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px] font-mono" dir="ltr">16:9</span>
            </div>

            <div
              @click="openMediaModalFor('coverImage')"
              class="group relative w-full aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer"
            >
              <img
                :src="getCoverImageUrl()"
                alt="cover-16-9"
                class="w-full h-full object-cover group-hover:scale-102 transition duration-200"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                <span class="px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 font-bold text-xs shadow-md">تعویض رسانه</span>
              </div>
            </div>

            <input
              type="text"
              dir="ltr"
              :value="rootSchema.coverImage || getCoverImageUrl()"
              @input="rootSchema.coverImage = ($event.target as HTMLInputElement).value; emitChange()"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-700 text-left"
            />
          </div>

          <!-- 2. Feature / Gallery Card (4:3) -->
          <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">تصویر شاخص بدنه (4:3 Feature Card)</span>
              <span class="px-2 py-0.2 rounded bg-slate-100 text-slate-500 text-[10px] font-mono" dir="ltr">4:3</span>
            </div>

            <div
              @click="openMediaModalFor('featureImage')"
              class="group relative w-full aspect-[4/3] rounded-xl border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer"
            >
              <img
                :src="rootSchema.featureImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'"
                alt="feature-4-3"
                class="w-full h-full object-cover group-hover:scale-102 transition duration-200"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                <span class="px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 font-bold text-xs shadow-md">تعویض رسانه</span>
              </div>
            </div>

            <input
              type="text"
              dir="ltr"
              :value="rootSchema.featureImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'"
              @input="rootSchema.featureImage = ($event.target as HTMLInputElement).value; emitChange()"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-700 text-left"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Media Asset Picker & Light Editor Lightbox Modal -->
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

const activeStudioView = ref<'page-mirror' | 'media-hub'>('page-mirror')
const activeLang = ref<'fa' | 'en' | 'ar' | 'all'>('fa')
const isMediaModalOpen = ref(false)
const activeMediaField = ref<string | null>(null)

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

function hasKeyInUiData(key: string) {
  const locales = ['fa', 'en', 'ar', 'FA', 'EN', 'AR']
  return locales.some(l => props.modelValue[l] && (props.modelValue[l][key] !== undefined))
}

// Dynamically recognize specialized sections present in uiData (categories, fleet, milestones, topics, formats, mission, story, contact)
const recognizedPageSections = computed(() => {
  const knownSectionMeta: Record<string, { titleFa: string, isArray: boolean }> = {
    'categories': { titleFa: 'دسته‌بندی‌های محصولات (Product Lines)', isArray: true },
    'fleet': { titleFa: 'ماشین‌آلات و خطوط تولید کارخانه (Fleet & Machinery)', isArray: true },
    'milestones': { titleFa: 'گاه‌شمار تحول تاریخی و دستاوردها (Milestones)', isArray: true },
    'topics': { titleFa: 'دسته‌بندی‌های پرسش‌های متداول (FAQ Topics)', isArray: true },
    'formats': { titleFa: 'فرمت‌های کاتالوگ و کیت نمونه (Formats & Sample Kits)', isArray: true },
    'mission': { titleFa: 'ماموریت و استاندارد کیفی (Mission & Quality Standards)', isArray: false },
    'story': { titleFa: 'روایت تاریخچه و تاسیس (Founding Story)', isArray: false },
    'factoryAddress': { titleFa: 'نشانی کارخانه (Factory Address)', isArray: false },
    'phone': { titleFa: 'تلفن تماس مستقیم (Direct Phone)', isArray: false }
  }

  const result: Record<string, { titleFa: string, isArray: boolean }> = {}
  const locales = ['fa', 'en', 'ar', 'FA', 'EN', 'AR']

  for (const loc of locales) {
    const locObj = props.modelValue[loc]
    if (locObj && typeof locObj === 'object') {
      for (const k of Object.keys(locObj)) {
        if (!['title', 'subtitle', 'stats'].includes(k)) {
          if (knownSectionMeta[k]) {
            result[k] = knownSectionMeta[k]
          } else {
            result[k] = {
              titleFa: `بخش ${k}`,
              isArray: Array.isArray(locObj[k])
            }
          }
        }
      }
    }
  }

  return result
})

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

function addArraySectionItem(sectionKey: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][sectionKey]) props.modelValue[targetLang][sectionKey] = []
  props.modelValue[targetLang][sectionKey].push('')
  emitChange()
}

function removeArraySectionItem(sectionKey: string, idx: number) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (props.modelValue[targetLang]?.[sectionKey]) {
    props.modelValue[targetLang][sectionKey].splice(idx, 1)
    emitChange()
  }
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
