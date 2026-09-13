<!-- components/admin/AdminSeoDrawer.client.vue -->
<template>
  <teleport to="body">
    <transition name="seo-drawer-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[999998] flex justify-end bg-black/70 backdrop-blur-sm"
        @click.self="close"
        role="dialog"
        aria-modal="true"
        aria-label="SEO & AEO Management Studio"
      >
        <div
          class="w-full max-w-3xl h-full bg-zinc-950 text-white border-l border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-in"
          :dir="currentLang === 'fa' || currentLang === 'ar' ? 'rtl' : 'ltr'"
        >
          <!-- Drawer Header -->
          <div class="p-4 border-b border-white/10 bg-zinc-900/90 flex items-center justify-between gap-3 flex-shrink-0">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
                🌐
              </div>
              <div>
                <h2 class="text-sm font-bold flex items-center gap-2 text-white">
                  <span>SEO & AEO Management Studio</span>
                  <span class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    AI Ready
                  </span>
                </h2>
                <p class="text-[11px] text-zinc-400 font-mono" dir="ltr">
                  Page: /{{ currentSlug }} &middot; {{ activeLangUpper }}
                </p>
              </div>
            </div>

            <!-- Header Actions: Language Switcher & Close -->
            <div class="flex items-center gap-2">
              <!-- Locale Switcher Pills -->
              <div class="flex items-center bg-zinc-800/90 p-0.5 rounded-xl border border-white/10 text-xs font-bold" dir="ltr">
                <button
                  v-for="l in ['fa', 'en', 'ar']"
                  :key="l"
                  type="button"
                  @click="switchLang(l)"
                  class="px-2.5 py-1 rounded-lg text-[11px] uppercase transition-colors cursor-pointer"
                  :class="currentLang === l ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-400 hover:text-white'"
                >
                  {{ l }}
                </button>
              </div>

              <!-- Close Button -->
              <button
                type="button"
                class="w-8 h-8 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                @click="close"
                title="بستن (Esc)"
              >
                <AdminIcon name="close" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Studio Navigation Tabs -->
          <div class="flex items-center gap-1 px-4 py-2 bg-zinc-900/60 border-b border-white/10 overflow-x-auto flex-shrink-0">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              @click="activeTab = tab.id"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              :class="activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'"
            >
              <span>{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <!-- Studio Content Body (Single unified scroll container) -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 overscroll-contain">
            
            <!-- TAB 1: SERP & Search Meta -->
            <div v-if="activeTab === 'serp'" class="space-y-6">
              
              <!-- Google SERP Live Simulation Card -->
              <div class="bg-zinc-900/90 rounded-2xl border border-white/10 p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <span class="text-base">🔍</span>
                    <span>پیش‌نمایش در نتایج گوگل (Google SERP Simulation)</span>
                  </div>
                  <div class="flex items-center gap-1 bg-zinc-800 p-0.5 rounded-lg border border-white/10 text-[11px]" dir="ltr">
                    <button
                      type="button"
                      @click="serpDevice = 'desktop'"
                      class="px-2 py-0.5 rounded transition"
                      :class="serpDevice === 'desktop' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-white'"
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      @click="serpDevice = 'mobile'"
                      class="px-2 py-0.5 rounded transition"
                      :class="serpDevice === 'mobile' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-white'"
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <!-- Google Snippet Simulation Box -->
                <div
                  class="bg-white text-zinc-900 p-4 rounded-xl shadow-inner border border-zinc-200 font-sans transition-all"
                  :class="serpDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'"
                  :dir="currentLang === 'fa' || currentLang === 'ar' ? 'rtl' : 'ltr'"
                >
                  <!-- Google Header: Favicon + Domain + Breadcrumb -->
                  <div class="flex items-center gap-2 mb-1 text-xs text-zinc-700">
                    <div class="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                      N
                    </div>
                    <div class="flex flex-col leading-tight">
                      <span class="font-semibold text-zinc-800 text-[12px]">مجتمع چاپ و بسته‌بندی نجم</span>
                      <span class="text-[11px] text-zinc-500 font-mono" dir="ltr">
                        https://chapenajm.com &rsaquo; {{ currentSlug || 'home' }}
                      </span>
                    </div>
                  </div>

                  <!-- Google Blue Title -->
                  <h3 class="text-[#1a0dab] hover:underline text-base sm:text-lg font-medium leading-snug cursor-pointer line-clamp-2">
                    {{ displayTitle }}
                  </h3>

                  <!-- Google Grey Snippet Description -->
                  <p class="text-zinc-600 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
                    {{ displayDescription }}
                  </p>
                </div>
              </div>

              <!-- Form Inputs for SERP -->
              <div class="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                <!-- Page Title Input -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <label class="font-bold text-zinc-200">عنوان سئو صفحه (SEO Page Title)</label>
                    <span
                      class="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      :class="titleCharCount >= 50 && titleCharCount <= 60 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'"
                    >
                      {{ titleCharCount }} / 60 کاراکتر
                    </span>
                  </div>
                  <input
                    v-model="seoState.title"
                    @input="onFieldInput('title')"
                    type="text"
                    placeholder="عنوان دقیق و متمرکز بر کلمه کلیدی اصلی..."
                    class="w-full bg-zinc-950 text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition"
                  />
                  <p class="text-[11px] text-zinc-400">
                    توصیه: ۵۰ تا ۶۰ کاراکتر. نام برند به انتهای عنوان متصل می‌شود.
                  </p>
                </div>

                <!-- Meta Description Input -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <label class="font-bold text-zinc-200">توضیحات متا (Meta Description)</label>
                    <span
                      class="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      :class="descCharCount >= 140 && descCharCount <= 165 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'"
                    >
                      {{ descCharCount }} / 160 کاراکتر
                    </span>
                  </div>
                  <textarea
                    v-model="seoState.description"
                    @input="onFieldInput('description')"
                    rows="3"
                    placeholder="خلاصه‌ای جذاب و ترغیب‌کننده برای کلیک در موتور جستجو..."
                    class="w-full bg-zinc-950 text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition leading-relaxed"
                  />
                  <p class="text-[11px] text-zinc-400">
                    توصیه: ۱۴۰ تا ۱۶۰ کاراکتر حاوی پیشنهاد ارزش منحصربه‌فرد و دعوت به اقدام (Call to Action).
                  </p>
                </div>

                <!-- Canonical URL -->
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-zinc-200">آدرس استاندارد (Canonical URL)</label>
                  <input
                    v-model="seoState.canonical"
                    @input="onFieldInput('canonical')"
                    type="text"
                    placeholder="https://chapenajm.com/..."
                    class="w-full bg-zinc-950 text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none transition"
                    dir="ltr"
                  />
                </div>

                <!-- Robots Directives Toggles -->
                <div class="pt-2 border-t border-white/10 flex flex-wrap gap-4 text-xs">
                  <label class="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      v-model="seoState.indexable"
                      @change="onFieldInput('indexable')"
                      type="checkbox"
                      class="rounded accent-emerald-500 w-4 h-4"
                    />
                    <span class="text-zinc-300">نمایه شدن در گوگل (Indexable)</span>
                  </label>

                  <label class="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      v-model="seoState.followLinks"
                      @change="onFieldInput('followLinks')"
                      type="checkbox"
                      class="rounded accent-emerald-500 w-4 h-4"
                    />
                    <span class="text-zinc-300">دنبال کردن لینک‌ها (Follow Links)</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- TAB 2: Social & OpenGraph -->
            <div v-else-if="activeTab === 'social'" class="space-y-6">
              
              <!-- Social Card 1.91:1 Preview -->
              <div class="bg-zinc-900/90 rounded-2xl border border-white/10 p-4 space-y-3">
                <div class="text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <span>📱</span>
                  <span>پیش‌نمایش اشتراک‌گذاری شبکه‌های اجتماعی (Social Card 1.91:1)</span>
                </div>

                <div class="max-w-md mx-auto bg-zinc-900 rounded-2xl overflow-hidden border border-white/15 shadow-xl text-left font-sans">
                  <!-- Image Banner -->
                  <div class="w-full h-48 bg-zinc-950 relative overflow-hidden flex items-center justify-center">
                    <img
                      v-if="seoState.image"
                      :src="seoState.image"
                      alt="Social Banner Preview"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="text-zinc-600 text-xs flex flex-col items-center gap-1">
                      <span>🖼️</span>
                      <span>تصویر پیش‌فرض (/social-image.png)</span>
                    </div>
                  </div>

                  <!-- Text Details -->
                  <div class="p-3.5 space-y-1 bg-zinc-900" :dir="currentLang === 'fa' || currentLang === 'ar' ? 'rtl' : 'ltr'">
                    <span class="text-[10px] uppercase tracking-wider text-emerald-400 font-mono">chapenajm.com</span>
                    <h4 class="text-sm font-bold text-white line-clamp-1">
                      {{ seoState.ogTitle || displayTitle }}
                    </h4>
                    <p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {{ seoState.ogDescription || displayDescription }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Form Inputs for Social -->
              <div class="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-zinc-200">عنوان شبکه‌های اجتماعی (OG Title)</label>
                  <input
                    v-model="seoState.ogTitle"
                    @input="onFieldInput('ogTitle')"
                    type="text"
                    :placeholder="displayTitle"
                    class="w-full bg-zinc-950 text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-zinc-200">توضیحات شبکه‌های اجتماعی (OG Description)</label>
                  <textarea
                    v-model="seoState.ogDescription"
                    @input="onFieldInput('ogDescription')"
                    rows="2"
                    :placeholder="displayDescription"
                    class="w-full bg-zinc-950 text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none transition leading-relaxed"
                  />
                </div>

                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <label class="font-bold text-zinc-200">آدرس تصویر کارت (OG Image URL - 1200x630)</label>
                    <button
                      type="button"
                      @click="seoState.image = 'https://chapenajm.com/social-image.png'; onFieldInput('image')"
                      class="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                    >
                      تنظیم پیش‌فرض
                    </button>
                  </div>
                  <input
                    v-model="seoState.image"
                    @input="onFieldInput('image')"
                    type="text"
                    placeholder="https://chapenajm.com/social-image.png"
                    class="w-full bg-zinc-950 text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none transition"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <!-- TAB 3: AEO & AI Citations -->
            <div v-else-if="activeTab === 'aeo'" class="space-y-6">
              
              <!-- AEO Information Banner -->
              <div class="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                <div class="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <span class="text-base">🤖</span>
                  <span>بهینه‌سازی برای موتورهای پاسخ هوش مصنوعی (AEO: Answer Engine Optimization)</span>
                </div>
                <p class="text-[11px] text-zinc-400 leading-relaxed">
                  موتورهای جستجوی نسلی (Perplexity, ChatGPT Search, Gemini, Claude) مستقیماً حقایق فشرده، جداول و خلاصه‌های ساختاریافته را برای پاسخ‌گویی به کاربران استخراج می‌کنند. تنظیم این فیلدها تضمین می‌کند هوش مصنوعی شرکت شما را به عنوان مرجع صنعتی دست اول استناد کند.
                </p>
              </div>

              <!-- AI Knowledge Summary (llms.txt compatible) -->
              <div class="space-y-2 bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold text-zinc-200">
                    خلاصه فکت‌های مرجع برای هوش مصنوعی (AI Knowledge Summary for llms.txt)
                  </label>
                  <span class="text-[10px] text-zinc-500 font-mono">Dense Factual Syntax</span>
                </div>
                <textarea
                  v-model="seoState.aeoSummary"
                  @input="onFieldInput('aeoSummary')"
                  rows="4"
                  placeholder="خلاصه فشرده حاوی مشخصات صنعتی، تیراژ، دستگاه‌ها، آدرس و خدمات جهت آموزش و استناد ربات‌های جستجو..."
                  class="w-full bg-zinc-950 text-white border border-white/10 rounded-xl p-3 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none leading-relaxed transition"
                />
              </div>

              <!-- Key Facts for AI Citations (Bullet points) -->
              <div class="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold text-zinc-200">
                    حقایق کلیدی برای نقل‌قول مستقیم (Key Facts for AI Citations)
                  </label>
                  <button
                    type="button"
                    @click="addFact"
                    class="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition cursor-pointer flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>افزودن حقیقت جدید</span>
                  </button>
                </div>

                <div class="space-y-2">
                  <div
                    v-for="(fact, fIdx) in seoState.aeoFacts"
                    :key="fIdx"
                    class="flex items-center gap-2"
                  >
                    <span class="text-emerald-400 font-mono text-xs">{{ fIdx + 1 }}.</span>
                    <input
                      v-model="seoState.aeoFacts[fIdx]"
                      @input="onFieldInput('aeoFacts')"
                      type="text"
                      placeholder="یک حقیقت شفاف و تاییدشده (مثلا: تحویل ماکت فیزیکی رایگان ظرف ۴۸ ساعت)"
                      class="flex-1 bg-zinc-950 text-white border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      @click="removeFact(fIdx)"
                      class="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition cursor-pointer"
                      title="حذف"
                    >
                      <AdminIcon name="close" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Entity Taxonomy -->
              <div class="space-y-2 bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                <label class="text-xs font-bold text-zinc-200">انتیتی‌ها و موضوعات مفهومی (Entity Taxonomy)</label>
                <input
                  v-model="seoState.entities"
                  @input="onFieldInput('entities')"
                  type="text"
                  placeholder="چاپ افست، جعبه‌سازی، ایندربرد، هایدلبرگ، هاردباکس"
                  class="w-full bg-zinc-950 text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
            </div>

            <!-- TAB 4: JSON-LD Graph & FAQs -->
            <div v-else-if="activeTab === 'schema'" class="space-y-6">
              
              <!-- FAQPage Schema Builder -->
              <div class="bg-zinc-900/90 rounded-2xl border border-white/10 p-4 space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <span>❓</span>
                    <span>سازنده سوالات متداول (FAQPage Schema Builder for Google Accordions)</span>
                  </div>
                  <button
                    type="button"
                    @click="addFaq"
                    class="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition cursor-pointer flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>افزودن پرسش و پاسخ</span>
                  </button>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="(faq, qIdx) in seoState.faqs"
                    :key="qIdx"
                    class="p-3.5 rounded-xl bg-zinc-950 border border-white/10 space-y-2 relative group"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-emerald-400">پرسش {{ qIdx + 1 }}</span>
                      <button
                        type="button"
                        @click="removeFaq(qIdx)"
                        class="text-zinc-500 hover:text-rose-400 text-xs cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>

                    <input
                      v-model="faq.question"
                      @input="onFieldInput('faqs')"
                      type="text"
                      placeholder="عنوان پرسش متداول..."
                      class="w-full bg-zinc-900 text-white border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    />

                    <textarea
                      v-model="faq.answer"
                      @input="onFieldInput('faqs')"
                      rows="2"
                      placeholder="پاسخ کامل و شفاف..."
                      class="w-full bg-zinc-900 text-white border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <!-- Live Schema.org Graph Inspector -->
              <div class="bg-zinc-900/90 rounded-2xl border border-white/10 p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <span>⚡</span>
                    <span>گراف زنده ساختاریافته (Live Schema.org @graph Inspector)</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="copyJsonLd"
                      class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white text-xs font-mono transition cursor-pointer flex items-center gap-1"
                    >
                      <span>📋</span>
                      <span>کپی JSON-LD</span>
                    </button>

                    <a
                      href="https://search.google.com/test/rich-results"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition"
                    >
                      تست در گوگل ↗
                    </a>
                  </div>
                </div>

                <pre class="bg-zinc-950 p-4 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72 border border-white/10 leading-relaxed" dir="ltr">{{ formattedJsonLd }}</pre>
              </div>

            </div>

          </div>

          <!-- Drawer Footer Bar -->
          <div class="p-4 border-t border-white/10 bg-zinc-900/90 flex items-center justify-between gap-3 flex-shrink-0">
            <div class="text-[11px] text-zinc-400">
              تغییرات به صورت خودکار به عنوان پیش‌نویس ذخیره می‌شوند.
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="close"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-zinc-200 transition cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'
import {
  adminEditState as state,
  setDraftValue,
  deepClone
} from '@/store/adminEditStore'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', val: boolean): void }>()

const activeTab = ref<'serp' | 'social' | 'aeo' | 'schema'>('serp')
const serpDevice = ref<'desktop' | 'mobile'>('desktop')
const currentLang = ref(state.language || 'fa')

const tabs = [
  { id: 'serp', label: 'گوگل و متا (SERP)', icon: '🔍' },
  { id: 'social', label: 'شبکه‌های اجتماعی (OG)', icon: '📱' },
  { id: 'aeo', label: 'استناد هوش مصنوعی (AEO)', icon: '🤖' },
  { id: 'schema', label: 'داده‌های ساختاریافته (JSON-LD)', icon: '⚡' }
] as const

const currentSlug = computed(() => state.slug || 'home')
const activeLangUpper = computed(() => currentLang.value.toUpperCase())

const seoState = reactive({
  title: '',
  description: '',
  canonical: '',
  indexable: true,
  followLinks: true,
  ogTitle: '',
  ogDescription: '',
  image: 'https://chapenajm.com/social-image.png',
  aeoSummary: '',
  aeoFacts: [] as string[],
  entities: '',
  faqs: [] as Array<{ question: string; answer: string }>
})

function switchLang(l: string) {
  currentLang.value = l
  loadFromStore()
}

function loadFromStore() {
  const slug = currentSlug.value
  const lang = currentLang.value.toLowerCase()
  const overrides = state.clientOverrides?.[slug]?.[lang]?.seo ||
                    state.clientOverrides?.[slug]?.[lang.toUpperCase()]?.seo ||
                    state.allLangUIBySlug?.[slug]?.[lang]?.seo ||
                    state.allLangUIBySlug?.[slug]?.[lang.toUpperCase()]?.seo ||
                    {}

  seoState.title = overrides.title || ''
  seoState.description = overrides.description || ''
  seoState.canonical = overrides.canonical || (slug === 'home' ? 'https://chapenajm.com' : `https://chapenajm.com/${slug}`)
  seoState.indexable = overrides.indexable !== false
  seoState.followLinks = overrides.followLinks !== false
  seoState.ogTitle = overrides.ogTitle || ''
  seoState.ogDescription = overrides.ogDescription || ''
  seoState.image = overrides.image || 'https://chapenajm.com/social-image.png'
  seoState.aeoSummary = overrides.aeoSummary || ''
  seoState.aeoFacts = Array.isArray(overrides.aeoFacts) ? [...overrides.aeoFacts] : [
    'تأسیس مجتمع چاپ و بسته‌بندی نجم در سال ۱۳۷۸ با بیش از ۲۵ سال تجربه صنعتی پیوسته',
    'مجهز به خطوط چاپ افست ورقی ۵ رنگ هایدلبرگ Speedmaster 74 و ماشین‌آلات لیتوگرافی حرارتی CTP',
    'تولید انواع جعبه‌های دارویی، بهداشتی، مقوایی ایندربرد، کرافت و هاردباکس‌های لوکس مگنتی',
    'ارائه ماکت فیزیکی رایگان ظرف ۴۸ ساعت و تحویل سفارشات صنعتی ظرف ۵ الی ۷ روز کاری'
  ]
  seoState.entities = overrides.entities || 'چاپ افست، جعبه‌سازی، مقوای ایندربرد، هاردباکس، چاپ نجم، Heidelberg Speedmaster'
  seoState.faqs = Array.isArray(overrides.faqs) && overrides.faqs.length > 0
    ? deepClone(overrides.faqs)
    : [
        {
          question: 'حداقل تیراژ سفارش جعبه و بسته‌بندی در مجتمع نجم چقدر است؟',
          answer: 'حداقل تیراژ برای انواع جعبه‌های مقوایی ۱,۰۰۰ عدد و برای هاردباکس‌های لوکس ۵۰۰ عدد می‌باشد.'
        },
        {
          question: 'مدت زمان نمونه‌سازی و تحویل نهایی سفارشات چقدر است؟',
          answer: 'نمونه‌سازی ماکت فیزیکی رایگان ظرف ۴۸ ساعت و تولید صنعتی ظرف ۵ تا ۷ روز کاری پس از تأیید نهایی انجام می‌پذیرد.'
        }
      ]
}

watch([() => props.open, () => state.slug], () => {
  if (props.open) {
    currentLang.value = state.language || 'fa'
    loadFromStore()
  }
}, { immediate: true })

const displayTitle = computed(() => {
  if (seoState.title) return `${seoState.title} | مجتمع چاپ و بسته‌بندی نجم`
  return 'مجتمع چاپ و بسته‌بندی نجم | چاپ افست و جعبه‌سازی صنعتی'
})

const displayDescription = computed(() => {
  if (seoState.description) return seoState.description
  return 'طراحی و تولید انواع جعبه‌های مقوایی، هاردباکس و بسته‌بندی‌های لوکس با بالاترین استانداردهای چاپ در تهران.'
})

const titleCharCount = computed(() => seoState.title.length)
const descCharCount = computed(() => seoState.description.length)

function onFieldInput(field: string) {
  const slug = currentSlug.value
  const lang = currentLang.value.toLowerCase()
  const payload = { ...seoState }

  // Persist into store
  setDraftValue('seo', lang, JSON.stringify(payload), slug, true)

  window.dispatchEvent(new CustomEvent('najm:admin-change', {
    detail: { path: `seo.${field}`, lang, slug }
  }))
}

function addFact() {
  seoState.aeoFacts.push('')
  onFieldInput('aeoFacts')
}

function removeFact(idx: number) {
  seoState.aeoFacts.splice(idx, 1)
  onFieldInput('aeoFacts')
}

function addFaq() {
  seoState.faqs.push({ question: '', answer: '' })
  onFieldInput('faqs')
}

function removeFaq(idx: number) {
  seoState.faqs.splice(idx, 1)
  onFieldInput('faqs')
}

const formattedJsonLd = computed(() => {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'مجتمع چاپ و بسته‌بندی نجم',
        url: 'https://chapenajm.com',
        description: displayDescription.value
      },
      {
        '@type': 'FAQPage',
        mainEntity: seoState.faqs.filter(f => f.question && f.answer).map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      }
    ]
  }
  return JSON.stringify(graph, null, 2)
})

function copyJsonLd() {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(formattedJsonLd.value)
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', text: 'کد JSON-LD در حافظه کپی شد.' }
    }))
  }
}

function close() {
  emit('update:open', false)
}
</script>

<style scoped>
.seo-drawer-fade-enter-active,
.seo-drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}
.seo-drawer-fade-enter-from,
.seo-drawer-fade-leave-to {
  opacity: 0;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.animate-slide-in {
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
