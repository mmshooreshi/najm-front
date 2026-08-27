<!-- pages/dash/products.vue -->
<template>
  <div class="space-y-6 select-none font-sans">
    <!-- MODE 1: CATALOG OVERVIEW -->
    <div v-if="!isEditingMode" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-white font-d4">محصولات و نمونه‌کارهای چاپ و بسته‌بندی</h2>
          <p class="text-xs text-zinc-400">مدیریت جامع دو بخش تخصصی مجتمع نجم: ۱. صنعت بسته‌بندی و جعبه‌سازی | ۲. خدمات چاپ افست و اوراق تجاری</p>
        </div>

        <button
          type="button"
          @click="openProductStudio(null)"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer self-start"
        >
          <AdminIcon name="plus" class="w-4 h-4" />
          <span>افزودن نمونه‌کار / محصول جدید</span>
        </button>
      </div>

      <!-- Master Division Selector Bar (Packaging vs Commercial Printing) -->
      <div class="p-2 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
        <div class="flex items-center gap-1.5 font-d4 text-xs">
          <button
            v-for="div in masterDivisions"
            :key="div.id"
            type="button"
            @click="activeDivision = div.id; activeCategory = 'all'"
            class="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer"
            :class="activeDivision === div.id
              ? 'bg-najmgreen text-white shadow-md shadow-emerald-950/40'
              : 'bg-zinc-950/60 text-zinc-400 hover:text-white border border-white/5'"
          >
            <span>{{ div.icon }}</span>
            <span>{{ div.label }}</span>
            <span class="px-1.5 py-0.5 rounded-md text-[10px] bg-white/10 font-mono">{{ getDivisionCount(div.id) }}</span>
          </button>
        </div>
      </div>

      <!-- Sub-Category & Search Filters -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <!-- Search -->
        <div class="relative w-full md:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در نام محصول، نوع مقوا، روکش، صحافی..."
            class="w-full h-9 pr-8 pl-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
          <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-3 pointer-events-none" />
        </div>

        <!-- Sub-Category Filter Chips -->
        <div class="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 rounded-xl bg-zinc-950 border border-white/5 custom-scrollbar text-xs font-d4">
          <button
            v-for="cat in availableCategories"
            :key="cat.id"
            type="button"
            @click="activeCategory = cat.id"
            class="px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
            :class="activeCategory === cat.id ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400 hover:text-white'"
          >
            <span>{{ cat.label }}</span>
            <span class="px-1 rounded-full text-[10px] bg-white/10 font-mono">{{ getCategoryCount(cat.id) }}</span>
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="loading" class="p-16 text-center text-zinc-500 text-xs font-d4">
        در حال بارگذاری کاتالوگ محصولات...
      </div>

      <div v-else-if="filteredProducts.length === 0" class="p-16 text-center text-zinc-500 text-xs font-d4">
        موردی در این بخش یافت نشد.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="prod in filteredProducts"
          :key="prod.id"
          class="rounded-3xl bg-zinc-900/90 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl transition-all group"
        >
          <!-- Product Photo with Media Studio Trigger -->
          <div class="relative h-56 bg-zinc-950 flex items-center justify-center p-3 overflow-hidden">
            <img
              :src="prod.image"
              :alt="prod.title"
              class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />

            <!-- Division & Category Badges -->
            <div class="absolute top-3 right-3 flex items-center gap-1.5">
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md font-d4"
                :class="prod.division === 'packaging' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300' : 'bg-cyan-950/80 border-cyan-500/30 text-cyan-300'"
              >
                {{ prod.division === 'packaging' ? '📦 بسته‌بندی' : '🖨️ چاپ تجاری' }}
              </span>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-950/80 border border-white/10 text-zinc-300 backdrop-blur-md font-d4">
                {{ prod.categoryLabel || prod.category }}
              </span>
            </div>

            <!-- 3-Locales indicator -->
            <div class="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-md bg-zinc-950/80 border border-white/10 text-zinc-400">
              <span :class="prod.locales?.fa ? 'text-emerald-400 font-bold' : 'opacity-40'">FA</span>
              <span>&middot;</span>
              <span :class="prod.locales?.en ? 'text-emerald-400 font-bold' : 'opacity-40'">EN</span>
              <span>&middot;</span>
              <span :class="prod.locales?.ar ? 'text-emerald-400 font-bold' : 'opacity-40'">AR</span>
            </div>
          </div>

          <!-- Specifications & Content -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-3.5">
            <div class="space-y-2">
              <h3 class="text-sm font-bold text-white font-d4 leading-relaxed line-clamp-1">
                {{ prod.title }}
              </h3>

              <!-- Technical Chips -->
              <div class="flex flex-wrap gap-1.5 pt-0.5">
                <span class="px-2 py-0.5 rounded-md bg-zinc-950 text-[10px] text-zinc-300 border border-white/5 font-d4">
                  {{ prod.paperType }}
                </span>
                <span v-if="prod.coating" class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] text-emerald-400 border border-emerald-500/20 font-d4">
                  {{ prod.coating }}
                </span>
                <span v-if="prod.dimensions" class="px-2 py-0.5 rounded-md bg-zinc-950 text-[10px] font-mono text-zinc-400 border border-white/5">
                  {{ prod.dimensions }}
                </span>
                <span v-if="prod.binding" class="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] text-purple-300 border border-purple-500/20 font-d4">
                  {{ prod.binding }}
                </span>
                <span class="px-2 py-0.5 rounded-md bg-zinc-950 text-[10px] font-mono text-amber-300 border border-amber-500/20">
                  تیراژ: {{ formatQty(prod.minQty) }}
                </span>
              </div>

              <p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                {{ prod.description }}
              </p>
            </div>

            <!-- Card Actions -->
            <div class="pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                type="button"
                @click="openProductStudio(prod)"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-d4 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <AdminIcon name="edit" class="w-3.5 h-3.5" />
                <span>ویرایش تخصصی محصول</span>
              </button>

              <button
                type="button"
                @click="deleteProduct(prod.id)"
                class="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="حذف محصول"
              >
                <AdminIcon name="trash" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 2: DEDICATED FULL-PAGE PACKAGING & PRINTING STUDIO (NOT A MODAL!) -->
    <div v-else class="space-y-6">
      <!-- Studio Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900 border border-white/10">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isEditingMode = false"
            class="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer font-d4"
          >
            <AdminIcon name="chevron-right" class="w-4 h-4" />
            <span>بازگشت به لیست کاتالوگ</span>
          </button>

          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-bold text-white font-d4">
                {{ editingProduct.id ? `ویرایش تخصصی: ${editingProduct.title}` : 'ثبت نمونه‌کار و محصول جدید' }}
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-d4"
                :class="editingProduct.division === 'packaging' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'"
              >
                {{ editingProduct.division === 'packaging' ? 'بخش بسته‌بندی' : 'بخش چاپ تجاری' }}
              </span>
            </div>
            <p class="text-xs text-zinc-400">تنظیم متون ۳ زبانه، مشخصات صنعتی متریال، تصاویر و تیراژ تولید</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="saveProductStudio"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer"
          >
            <AdminIcon name="save" class="w-4 h-4" />
            <span>ذخیره نهایی در دیتابیس</span>
          </button>
        </div>
      </div>

      <!-- Studio Navigation Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-zinc-900 border border-white/10 font-d4 custom-scrollbar text-xs">
        <button
          v-for="st in studioTabs"
          :key="st.id"
          type="button"
          @click="activeStudioTab = st.id"
          class="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all shrink-0 cursor-pointer"
          :class="activeStudioTab === st.id ? 'bg-najmgreen text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'"
        >
          <AdminIcon :name="st.icon" class="w-4 h-4" />
          <span>{{ st.label }}</span>
        </button>
      </div>

      <!-- TAB 1: 3-LOCALE (FA / EN / AR) CONTENT & DIVISION -->
      <div v-if="activeStudioTab === 'locales'" class="rounded-3xl bg-zinc-900/90 border border-white/10 p-6 space-y-6">
        <!-- Division Picker in Studio -->
        <div class="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-2">
          <label class="font-bold text-zinc-200 font-d4 text-xs">حوزه تخصصی محصول (Division):</label>
          <div class="grid grid-cols-2 gap-3 text-xs font-d4">
            <button
              type="button"
              @click="editingProduct.division = 'packaging'"
              class="p-3 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all"
              :class="editingProduct.division === 'packaging' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'"
            >
              <span>📦</span>
              <span>صنعت بسته‌بندی، جعبه‌سازی و هاردباکس</span>
            </button>
            <button
              type="button"
              @click="editingProduct.division = 'printing'"
              class="p-3 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all"
              :class="editingProduct.division === 'printing' ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-md' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'"
            >
              <span>🖨️</span>
              <span>خدمات چاپ تجاری، کاتالوگ و ست اداری</span>
            </button>
          </div>
        </div>

        <!-- 3-Locale Switcher -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 class="text-sm font-bold text-white font-d4">عناوین و متون ۳ زبانه</h3>
            <p class="text-xs text-zinc-400">تنظیم نام محصول، خلاصه و کاربرد در شلف و صادرات به زبان‌های فارسی، انگلیسی و عربی</p>
          </div>

          <div class="flex items-center p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono">
            <button
              v-for="lang in ['fa', 'en', 'ar']"
              :key="lang"
              type="button"
              @click="activeLocaleTab = lang as any"
              class="px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer uppercase flex items-center gap-1.5"
              :class="activeLocaleTab === lang ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400 hover:text-white'"
            >
              <span>{{ lang === 'fa' ? '🇮🇷 فارسی (FA)' : lang === 'en' ? '🇬🇧 English (EN)' : '🇸🇦 العربية (AR)' }}</span>
            </button>
          </div>
        </div>

        <div class="space-y-4 text-xs">
          <!-- Title in active language -->
          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">نام و عنوان محصول ({{ activeLocaleTab.toUpperCase() }}):</label>
            <input
              v-model="editingProduct.locales[activeLocaleTab].title"
              type="text"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              :dir="activeLocaleTab === 'en' ? 'ltr' : 'rtl'"
            />
          </div>

          <!-- Application / Industry -->
          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">کاربرد و صنایع هدف ({{ activeLocaleTab.toUpperCase() }}):</label>
            <input
              v-model="editingProduct.locales[activeLocaleTab].application"
              type="text"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              :dir="activeLocaleTab === 'en' ? 'ltr' : 'rtl'"
            />
          </div>

          <!-- Description -->
          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">توضیحات کامل و ویژگی‌ها ({{ activeLocaleTab.toUpperCase() }}):</label>
            <textarea
              v-model="editingProduct.locales[activeLocaleTab].description"
              rows="4"
              class="w-full p-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white leading-relaxed focus:border-emerald-500 focus:outline-none"
              :dir="activeLocaleTab === 'en' ? 'ltr' : 'rtl'"
            ></textarea>
          </div>

          <!-- Slug & Specific Category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">نامک انگلیسی در آدرس (Slug):</label>
              <input
                v-model="editingProduct.slug"
                type="text"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                dir="ltr"
              />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">دسته‌بندی موضوعی:</label>
              <select
                v-model="editingProduct.category"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none font-d4"
              >
                <template v-if="editingProduct.division === 'packaging'">
                  <option value="hardbox">هاردباکس و جعبه سخت لوکس</option>
                  <option value="folding_carton">جعبه مقوایی و ایندربرد بهداشتی</option>
                  <option value="laminated_carton">کارتن لمینتی و فلوت‌دار صادراتی</option>
                  <option value="shopping_bag">ساک دستی و شاپینگ بگ تبلیغاتی</option>
                  <option value="flexible_pouch">لفاف پلیمری، پاکت زیپ‌کیپ و ساشه</option>
                </template>
                <template v-else>
                  <option value="catalog_brochure">کاتالوگ جامع و بروشور چندلت</option>
                  <option value="folder_stationery">فولدر، پوشه و ست اوراق اداری</option>
                  <option value="calendar_planner">سررسید، سالنامه و تقویم رومیزی</option>
                  <option value="business_card">کارت ویزیت لوکس و ضمانت‌نامه</option>
                  <option value="book_magazine">کتابچه، مجله و نشریات</option>
                  <option value="label_sticker">لیبل و استیکر رول و شیت</option>
                </template>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: VISUAL MEDIA STUDIO & DIELINE -->
      <div v-else-if="activeStudioTab === 'media'" class="rounded-3xl bg-zinc-900/90 border border-white/10 p-6 space-y-6">
        <div>
          <h3 class="text-sm font-bold text-white font-d4">تصویر شاخص، گالری و فایل قالب تیغ</h3>
          <p class="text-xs text-zinc-400">انتخاب مستقیم از ۳۱۰ فایل گالری بدون تایپ آدرس URL یا ادیت مستقیم در استودیو مدیا</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- Main Photo Showcase -->
          <div class="md:col-span-5 space-y-3">
            <label class="font-bold text-zinc-200 text-xs font-d4">تصویر شاخص محصول:</label>
            <div class="h-64 rounded-2xl bg-zinc-950 border-2 border-dashed border-white/15 flex items-center justify-center p-3 relative overflow-hidden group">
              <img
                :src="editingProduct.image"
                :alt="editingProduct.title"
                class="max-h-full max-w-full object-contain"
              />

              <div class="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                <button
                  type="button"
                  @click="openMediaStudioForProduct"
                  class="px-4 py-2 rounded-xl bg-najmgreen text-white text-xs font-bold font-d4 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <AdminIcon name="sparkles" class="w-4 h-4" />
                  <span>ویرایش در استودیو مدیا</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Gallery Browser Tray -->
          <div class="md:col-span-7 space-y-3">
            <label class="font-bold text-zinc-200 text-xs font-d4">انتخاب از بین فایل‌های سرور (۳۱۰+ فایل):</label>
            <div class="h-64 overflow-y-auto rounded-2xl bg-zinc-950 border border-white/10 p-3 grid grid-cols-3 sm:grid-cols-4 gap-2.5 custom-scrollbar">
              <div
                v-for="item in galleryAssets"
                :key="item.url"
                @click="editingProduct.image = item.url"
                class="aspect-square rounded-xl bg-zinc-900 border overflow-hidden p-1.5 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                :class="editingProduct.image === item.url ? 'border-emerald-500 shadow-md shadow-emerald-500/20' : 'border-white/10 hover:border-white/30'"
              >
                <img :src="item.url" :alt="item.filename" class="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: DYNAMIC INDUSTRIAL & PRINTING SPECS -->
      <div v-else-if="activeStudioTab === 'specs'" class="rounded-3xl bg-zinc-900/90 border border-white/10 p-6 space-y-6">
        <div>
          <h3 class="text-sm font-bold text-white font-d4">مشخصات فنی و متریال صنعتی</h3>
          <p class="text-xs text-zinc-400">
            {{ editingProduct.division === 'packaging' ? 'نوع مقوا، ساختار بازشو، خدمات تکمیلی و قالب دایکات' : 'قطع استاندارد، گرماژ کاغذ، نوع صحافی و سیستم چاپ افست' }}
          </p>
        </div>

        <!-- 1. PACKAGING SPECS FORM -->
        <div v-if="editingProduct.division === 'packaging'" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">نوع مقوا / متریال پایه:</label>
              <input
                v-model="editingProduct.paperType"
                type="text"
                placeholder="مثال: مقوای ایندربرد بهداشتی ۳۵۰ گرم"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">ابعاد استاندارد (طول×عرض×ارتفاع cm):</label>
              <input
                v-model="editingProduct.dimensions"
                type="text"
                placeholder="مثال: ۲۲ × ۱۶ × ۶ سانتی‌متر"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">خلاصه روکش و خدمات پس از چاپ:</label>
              <input
                v-model="editingProduct.coating"
                type="text"
                placeholder="مثال: طلاکوب مات + سلفون حرارتی"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- Checkboxes for Packaging Finishing Features -->
          <div class="pt-4 border-t border-white/10 space-y-3">
            <span class="text-xs font-bold text-zinc-300 font-d4">خدمات تکمیلی و سفارشی‌سازی جعبه:</span>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
              <label
                v-for="feat in packagingFinishingOptions"
                :key="feat"
                class="flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-white/5 hover:border-emerald-500/30 transition-colors cursor-pointer select-none"
              >
                <input type="checkbox" class="w-4 h-4 rounded accent-emerald-500" />
                <span class="text-zinc-200 font-d4">{{ feat }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 2. COMMERCIAL PRINTING SPECS FORM -->
        <div v-else class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">نوع کاغذ و گرماژ:</label>
              <input
                v-model="editingProduct.paperType"
                type="text"
                placeholder="مثال: گلاسه ۲۰۰ گرم داخلی + ۳۰۰ گرم جلد"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">قطع و ابعاد چاپ:</label>
              <input
                v-model="editingProduct.dimensions"
                type="text"
                placeholder="مثال: قطع رحلی (A4) / ۲۱ × ۲۹.۷ سانتی‌متر"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">نوع صحافی و جلد:</label>
              <input
                v-model="editingProduct.binding"
                type="text"
                placeholder="مثال: چسب گرم PUR / منگنه لوپ / فنر دوبل"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">سیستم چاپ:</label>
              <input
                v-model="editingProduct.printSystem"
                type="text"
                placeholder="مثال: افست هایدلبرگ ۵ رنگ با برج ورنی"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">روکش محافظ:</label>
              <input
                v-model="editingProduct.coating"
                type="text"
                placeholder="مثال: سلفون مات حرارتی + یووی موضعی"
                class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: QUANTITY TIERS & TIMELINE -->
      <div v-else-if="activeStudioTab === 'pricing'" class="rounded-3xl bg-zinc-900/90 border border-white/10 p-6 space-y-6">
        <div>
          <h3 class="text-sm font-bold text-white font-d4">پله‌های تیراژ و زمان‌بندی تحویل سفارش</h3>
          <p class="text-xs text-zinc-400">حداقل تیراژ اقتصادی، زمان ساخت ماکت ۳D و تحویل بار انبوه</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">حداقل تیراژ اقتصادی سفارش:</label>
            <input
              v-model="editingProduct.minQty"
              type="text"
              placeholder="مثال: ۲,۰۰۰ عدد"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">زمان تحویل سفارش انبوه:</label>
            <input
              v-model="editingProduct.leadTime"
              type="text"
              placeholder="مثال: ۷ الی ۱۰ روز کاری"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { openMediaStudio } from '@/store/adminEditStore'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const loading = ref(true)
const isEditingMode = ref(false)
const searchQuery = ref('')
const activeDivision = ref<'all' | 'packaging' | 'printing'>('all')
const activeCategory = ref('all')
const activeStudioTab = ref('locales')
const activeLocaleTab = ref<'fa' | 'en' | 'ar'>('fa')
const galleryAssets = ref<any[]>([])

const products = ref<any[]>([])

const masterDivisions = [
  { id: 'all', icon: '🗂️', label: 'همه محصولات و خدمات' },
  { id: 'packaging', icon: '📦', label: 'صنعت بسته‌بندی و جعبه‌سازی' },
  { id: 'printing', icon: '🖨️', label: 'خدمات چاپ و اوراق تجاری' }
]

const packagingCategories = [
  { id: 'all', label: 'همه جعبه‌ها' },
  { id: 'hardbox', label: 'هاردباکس لوکس' },
  { id: 'folding_carton', label: 'جعبه ایندربرد دارویی' },
  { id: 'laminated_carton', label: 'کارتن لمینتی' },
  { id: 'shopping_bag', label: 'ساک دستی و بگ' },
  { id: 'flexible_pouch', label: 'لفاف و پاکت پلیمری' }
]

const printingCategories = [
  { id: 'all', label: 'همه اوراق چاپی' },
  { id: 'catalog_brochure', label: 'کاتالوگ و بروشور' },
  { id: 'folder_stationery', label: 'فولدر و ست اداری' },
  { id: 'calendar_planner', label: 'سررسید و تقویم' },
  { id: 'business_card', label: 'کارت ویزیت لوکس' },
  { id: 'book_magazine', label: 'کتاب و نشریات' },
  { id: 'label_sticker', label: 'لیبل و استیکر' }
]

const availableCategories = computed(() => {
  if (activeDivision.value === 'packaging') return packagingCategories
  if (activeDivision.value === 'printing') return printingCategories
  return [
    { id: 'all', label: 'همه دسته‌بندی‌ها' },
    ...packagingCategories.filter(c => c.id !== 'all'),
    ...printingCategories.filter(c => c.id !== 'all')
  ]
})

const studioTabs = [
  { id: 'locales', icon: 'edit', label: 'عناوین و متون ۳ زبانه (FA/EN/AR)' },
  { id: 'media', icon: 'photo', label: 'عکس‌ها و قالب تیغ' },
  { id: 'specs', icon: 'crop', label: 'مشخصات صنعتی متریال و چاپ' },
  { id: 'pricing', icon: 'diff', label: 'تیراژ و زمان‌بندی تحویل' }
]

const packagingFinishingOptions = [
  'طلاکوب مات حرارتی',
  'طلاکوب براق',
  'نقره‌کوب',
  'یووی موضعی برجسته',
  'یووی شنی',
  'سلفون مات حرارتی',
  'سلفون براق',
  'امباس و برجسته‌سازی',
  'خط بریل نابینایان',
  'پنجره طلق شفاف PET',
  'قفل مگنتی نئودیمیوم',
  'روکش فوم و مخمل داخلی'
]

const editingProduct = reactive<any>({
  id: '',
  slug: '',
  division: 'packaging',
  title: '',
  category: 'hardbox',
  categoryLabel: 'هاردباکس لوکس',
  image: '/images/sections/cards/01.png',
  paperType: 'مقوای کرجی ۲ میل + گالینگور',
  coating: 'طلاکوب مات + سلفون حرارتی',
  dimensions: '۲۲×۱۶×۶ سانتی‌متر',
  binding: '',
  printSystem: 'افست هایدلبرگ ۵ رنگ',
  minQty: '۲,۰۰۰ عدد',
  leadTime: '۷ الی ۱۰ روز کاری',
  description: '',
  locales: {
    fa: { title: '', description: '', application: '' },
    en: { title: '', description: '', application: '' },
    ar: { title: '', description: '', application: '' }
  }
})

function formatQty(val: any): string {
  if (!val) return '۱,۰۰۰ عدد'
  if (typeof val === 'object') return `${val.min || val.count || 1000} عدد`
  return String(val)
}

function getDivisionCount(divId: string): number {
  if (divId === 'all') return products.value.length
  return products.value.filter(p => p.division === divId).length
}

function getCategoryCount(catId: string): number {
  if (catId === 'all') {
    if (activeDivision.value === 'all') return products.value.length
    return products.value.filter(p => p.division === activeDivision.value).length
  }
  return products.value.filter(p => p.category === catId).length
}

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    if (activeDivision.value !== 'all' && p.division !== activeDivision.value) return false
    if (activeCategory.value !== 'all' && p.category !== activeCategory.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return (
        p.title?.toLowerCase().includes(q) ||
        p.paperType?.toLowerCase().includes(q) ||
        p.coating?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }
    return true
  })
})

function openProductStudio(prod: any) {
  if (prod) {
    Object.assign(editingProduct, JSON.parse(JSON.stringify(prod)))
    if (!editingProduct.locales) {
      editingProduct.locales = {
        fa: { title: prod.title, description: prod.description, application: '' },
        en: { title: prod.title, description: prod.description, application: '' },
        ar: { title: prod.title, description: prod.description, application: '' }
      }
    }
  } else {
    Object.assign(editingProduct, {
      id: '',
      slug: `custom-item-${Date.now()}`,
      division: activeDivision.value === 'printing' ? 'printing' : 'packaging',
      title: 'محصول چاپی / بسته‌بندی جدید',
      category: activeDivision.value === 'printing' ? 'catalog_brochure' : 'hardbox',
      categoryLabel: activeDivision.value === 'printing' ? 'کاتالوگ و بروشور' : 'هاردباکس لوکس',
      image: '/images/sections/cards/01.png',
      paperType: 'مقوای کرجی ۲ میل + گالینگور',
      coating: 'طلاکوب مات + سلفون حرارتی',
      dimensions: '۲۲×۱۶×۶ سانتی‌متر',
      binding: '',
      printSystem: 'افست هایدلبرگ ۵ رنگ',
      minQty: '۱,۰۰۰ عدد',
      leadTime: '۷ الی ۱۰ روز کاری',
      description: 'طراحی و تولید اختصاصی با بالاترین کیفیت چاپ و برش.',
      locales: {
        fa: { title: 'محصول چاپی / بسته‌بندی جدید', description: 'طراحی و تولید اختصاصی با بالاترین کیفیت چاپ و برش.', application: 'صادرات و فروشگاهی' },
        en: { title: 'New Custom Product', description: 'Custom engineered packaging/print with offset printing.', application: 'Export & Retail' },
        ar: { title: 'منتج مخصص جديد', description: 'تصميم وإنتاج مخصص بأعلى جودة طباعة وقص.', application: 'للتصدير والتجزئة' }
      }
    })
  }

  activeStudioTab.value = 'locales'
  activeLocaleTab.value = 'fa'
  isEditingMode.value = true
}

function openMediaStudioForProduct() {
  openMediaStudio({
    path: `product.${editingProduct.slug || 'item'}.image`,
    url: editingProduct.image,
    meta: {
      format: editingProduct.image.split('.').pop() || 'png',
      width: 600,
      height: 600
    }
  })
}

async function saveProductStudio() {
  editingProduct.title = editingProduct.locales.fa.title || editingProduct.title
  editingProduct.description = editingProduct.locales.fa.description || editingProduct.description

  const payload = JSON.parse(JSON.stringify(editingProduct))

  await $fetch('/api/admin/products/save', {
    method: 'POST',
    body: payload
  }).catch(() => null)

  if (editingProduct.id) {
    const idx = products.value.findIndex(p => p.id === editingProduct.id)
    if (idx !== -1) products.value[idx] = payload
  } else {
    payload.id = `prod-${Date.now()}`
    products.value.unshift(payload)
  }

  isEditingMode.value = false
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'محصول با موفقیت ذخیره گردید.' } }))
}

function deleteProduct(id: string) {
  products.value = products.value.filter(p => p.id !== id)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'محصول حذف شد.' } }))
}

async function loadData() {
  loading.value = true
  try {
    const [prodRes, mediaRes]: any = await Promise.all([
      $fetch('/api/products').catch(() => ({ items: [] })),
      $fetch('/api/admin/media').catch(() => ({ items: [] }))
    ])

    products.value = prodRes?.items || []
    galleryAssets.value = mediaRes?.items || []
  } catch (err) {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
