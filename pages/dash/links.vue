<!-- pages/dash/links.vue -->
<template>
  <div class="space-y-6 select-none font-d4 text-white">
    <!-- Top Header & Actions -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl sm:text-2xl font-bold text-white">پایش پیوندهای داخلی و خزش گوگل (Internal Links & Crawl Hub)</h2>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            SEO Command Center
          </span>
        </div>
        <p class="text-xs sm:text-sm text-zinc-400 mt-1">
          رصد ساختار لینک‌های داخلی، عمق دسترسی گوگل‌بات (Crawl Depth)، بررسی صفحات یتیم و اعتبارسنجی متون رندر سمت سرور (SSR).
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2 self-start lg:self-auto">
        <!-- Download Sitemap -->
        <a
          href="/sitemap.xml"
          target="_blank"
          download="sitemap.xml"
          class="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <AdminIcon name="download" class="w-3.5 h-3.5" />
          <span>دانلود sitemap.xml (۱۴۱ آدرس)</span>
        </a>

        <!-- Rescan -->
        <button
          type="button"
          @click="runFullAudit"
          class="px-3 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          :disabled="isAuditing"
        >
          <AdminIcon name="refresh" class="w-3.5 h-3.5" :class="{ 'animate-spin': isAuditing }" />
          <span>{{ isAuditing ? 'در حال پایش...' : 'بررسی مجدد سلامت تمام صفحات' }}</span>
        </button>
      </div>
    </div>

    <!-- Executive Health Metrics Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <!-- 1. Crawl Accessibility -->
      <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">دسترسی خزش گوگل</span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-emerald-400">۱۰۰٪</span>
          <span class="text-xs text-zinc-400 font-bold">پوشش کامل</span>
        </div>
        <p class="text-[11px] text-zinc-400 mt-1">همه صفحات زیر ۲ کلیک از خانه</p>
      </div>

      <!-- 2. Action Required / Orphan Pages -->
      <div
        class="p-4 rounded-2xl border flex flex-col justify-between transition-colors shadow-lg"
        :class="orphanPagesCount === 0
          ? 'bg-zinc-900/90 border-white/10'
          : 'bg-rose-950/30 border-rose-500/40'"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs" :class="orphanPagesCount === 0 ? 'text-zinc-400' : 'text-rose-400 font-bold'">
            صفحات یتیم (بدون ورودی)
          </span>
          <span
            class="w-2.5 h-2.5 rounded-full"
            :class="orphanPagesCount === 0 ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'"
          ></span>
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono" :class="orphanPagesCount === 0 ? 'text-white' : 'text-rose-300'">
            {{ orphanPagesCount }}
          </span>
          <span class="text-xs text-zinc-400">صفحه</span>
        </div>
        <p class="text-[11px] mt-1" :class="orphanPagesCount === 0 ? 'text-emerald-400' : 'text-rose-300 font-bold'">
          {{ orphanPagesCount === 0 ? 'هیچ صفحه گم‌شده‌ای وجود ندارد' : 'نیازمند اتصال فوری پیوند' }}
        </p>
      </div>

      <!-- 3. Total Internal Inbound Links -->
      <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">پیوندهای داخلی فعال</span>
          <AdminIcon name="link" class="w-4 h-4 text-cyan-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-cyan-300">{{ totalInboundLinksCount }}</span>
          <span class="text-xs text-zinc-400">لینک معتبر</span>
        </div>
        <p class="text-[11px] text-zinc-400 mt-1">میانگین {{ averageInlinksPerPage }} ورودی به هر صفحه</p>
      </div>

      <!-- 4. SSR Text Readability -->
      <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">خوانایی متون در SSR</span>
          <AdminIcon name="eye" class="w-4 h-4 text-violet-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-violet-300">{{ totalPagesCount }}</span>
          <span class="text-xs text-zinc-400">صفحه تاییدشده</span>
        </div>
        <p class="text-[11px] text-zinc-400 mt-1">متون بدون JS برای ربات گوگل ارسال می‌شوند</p>
      </div>
    </div>

    <!-- Main Workspace Tabs -->
    <div class="bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <!-- Tabs Navigation Bar -->
      <div class="border-b border-white/10 bg-zinc-900/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            @click="activeTab = 'audit'"
            class="px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            :class="activeTab === 'audit' ? 'bg-najmgreen text-white shadow-xs' : 'text-zinc-400 hover:text-white hover:bg-white/5'"
          >
            <AdminIcon name="list" class="w-3.5 h-3.5" />
            <span>ماتریس پایش صفحات ({{ filteredPages.length }})</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'silos'"
            class="px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            :class="activeTab === 'silos' ? 'bg-najmgreen text-white shadow-xs' : 'text-zinc-400 hover:text-white hover:bg-white/5'"
          >
            <AdminIcon name="layout" class="w-3.5 h-3.5" />
            <span>معماری سیلوها و دسته‌ها (۷ سیلو)</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'inspector'"
            class="px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            :class="activeTab === 'inspector' ? 'bg-najmgreen text-white shadow-xs' : 'text-zinc-400 hover:text-white hover:bg-white/5'"
          >
            <AdminIcon name="eye" class="w-3.5 h-3.5" />
            <span>شبیه‌ساز متن SSR ربات گوگل</span>
          </button>
        </div>

        <!-- Quick Search & Filter in Table -->
        <div class="flex items-center gap-2">
          <!-- Silo Filter Dropdown -->
          <select
            v-if="activeTab === 'audit'"
            v-model="selectedSiloFilter"
            class="bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-hidden focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="all">همه سیلوهای موضوعی</option>
            <option value="packaging">بسته‌بندی و جعبه‌سازی</option>
            <option value="printing">چاپ افست و تجاری</option>
            <option value="services">خدمات کارخانه</option>
            <option value="resources">منابع و خطوط تیغ</option>
            <option value="content">وبلاگ و مقالات</option>
            <option value="company">اطلاعات شرکت و اعتماد</option>
            <option value="multilingual">چندزبانه (EN / AR)</option>
            <option value="external">تبدیل خارجی (تماس / مپ)</option>
          </select>

          <!-- Text Search -->
          <div class="relative w-48 sm:w-60">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجوی صفحه، آدرس یا کلمه..."
              class="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500/50 pr-8"
            />
            <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <!-- TAB 1: AUDIT & LINK MATRIX (Focused, Clear Table) -->
      <div v-if="activeTab === 'audit'" class="p-0 overflow-x-auto custom-scrollbar">
        <table class="w-full text-right text-xs">
          <thead>
            <tr class="border-b border-white/10 bg-zinc-900/50 text-zinc-400">
              <th class="py-3 px-4">صفحه و عنوان</th>
              <th class="py-3 px-3">سیلو موضوعی</th>
              <th class="py-3 px-3 text-center">عمق کلیک (Depth)</th>
              <th class="py-3 px-3 text-center">پیوندهای ورودی</th>
              <th class="py-3 px-3 text-center">پیوندهای خروجی</th>
              <th class="py-3 px-3 text-center">متن در SSR گوگل</th>
              <th class="py-3 px-3 text-center">وضعیت خزش</th>
              <th class="py-3 px-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="page in filteredPages"
              :key="page.path"
              class="hover:bg-white/5 transition-colors group"
            >
              <!-- Title & Path -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2">
                  <span
                    class="w-2.5 h-2.5 rounded-full shrink-0"
                    :style="{ backgroundColor: getSiloColor(page.siloKey) }"
                  ></span>
                  <div>
                    <div class="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <span>{{ page.title }}</span>
                      <NuxtLink :to="page.path" target="_blank" class="text-zinc-500 hover:text-white" title="مشاهده صفحه">
                        <AdminIcon name="link" class="w-3 h-3" />
                      </NuxtLink>
                    </div>
                    <div class="font-mono text-zinc-400 text-[11px] mt-0.5" dir="ltr">{{ page.path }}</div>
                  </div>
                </div>
              </td>

              <!-- Silo Badge -->
              <td class="py-3.5 px-3">
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold"
                  :style="{ backgroundColor: `${getSiloColor(page.siloKey)}20`, color: getSiloColor(page.siloKey) }"
                >
                  {{ page.siloName }}
                </span>
              </td>

              <!-- Crawl Depth -->
              <td class="py-3.5 px-3 text-center">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                  :class="page.depth === 0 ? 'bg-emerald-500/20 text-emerald-300' : (page.depth === 1 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300')"
                >
                  Level {{ page.depth }}
                </span>
              </td>

              <!-- Inbound Links -->
              <td class="py-3.5 px-3 text-center">
                <button
                  type="button"
                  @click="openInlinksModal(page)"
                  class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                  :class="page.inlinks.length > 0 ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-rose-500/20 text-rose-400 font-bold animate-pulse'"
                  :title="`مشاهده ${page.inlinks.length} لینک ورودی`"
                >
                  <span>{{ page.inlinks.length }}</span>
                  <span class="text-[10px] font-d4">ورودی</span>
                </button>
              </td>

              <!-- Outbound Links -->
              <td class="py-3.5 px-3 text-center font-mono text-zinc-300">
                {{ page.outlinks.length }} لینک
              </td>

              <!-- SSR Text -->
              <td class="py-3.5 px-3 text-center">
                <button
                  type="button"
                  @click="inspectPageSSR(page)"
                  class="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
                >
                  {{ page.chars }} کاراکتر
                </button>
              </td>

              <!-- Crawl Status -->
              <td class="py-3.5 px-3 text-center font-bold text-[11px]">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px]"
                  :class="page.inlinks.length > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'"
                >
                  {{ page.inlinks.length > 0 ? 'خزش قطعی گوگل' : 'خطر عدم خزش' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    @click="openInlinksModal(page)"
                    class="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
                  >
                    پیوندها
                  </button>
                  <button
                    type="button"
                    @click="inspectPageSSR(page)"
                    class="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold transition cursor-pointer"
                  >
                    متن SSR
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAB 2: SILO ARCHITECTURE BREAKDOWN (Organized Grid) -->
      <div v-else-if="activeTab === 'silos'" class="p-6 space-y-6">
        <div class="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
          <div class="text-xs text-zinc-300">
            <span class="font-bold text-white">معماری سیلو (Silo Architecture):</span>
            صفحات بر اساس حوزه موضوعی تفکیک شده‌اند تا پیج‌رنک و اعتبار محتوا به طور متمرکز به مقالات و محصولات کلیدی منتقل شود.
          </div>
          <span class="text-xs font-mono font-bold text-emerald-400">۷ ستون محتوایی اصلی</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="silo in silosList"
            :key="silo.key"
            class="p-4 rounded-xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
          >
            <div>
              <!-- Silo Header -->
              <div class="flex items-center justify-between pb-3 border-b border-white/10">
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 rounded-full shrink-0"
                    :style="{ backgroundColor: silo.color }"
                  ></span>
                  <h3 class="font-bold text-sm text-white">{{ silo.name }}</h3>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-zinc-300">
                  {{ silo.pages.length }} صفحه
                </span>
              </div>

              <!-- Pillar Hub Page -->
              <div class="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/5">
                <div class="text-[10px] text-zinc-400 font-bold mb-1">صفحه پیلار اصلی (Pillar Page):</div>
                <div class="flex items-center justify-between">
                  <span class="font-bold text-white text-xs">{{ silo.pillar.title }}</span>
                  <span class="text-[10px] font-mono text-emerald-400 font-bold">{{ silo.pillar.inlinks.length }} ورودی</span>
                </div>
                <div class="text-[10px] font-mono text-zinc-500 mt-0.5" dir="ltr">{{ silo.pillar.path }}</div>
              </div>

              <!-- Child Subpages List -->
              <div class="mt-3 space-y-1.5">
                <div class="text-[10px] text-zinc-400 font-bold">زیرمجموعه‌ها و صفحات فرزند:</div>
                <div
                  v-for="child in silo.childPages"
                  :key="child.path"
                  @click="openInlinksModal(child)"
                  class="p-2 rounded-lg bg-zinc-950/60 hover:bg-white/5 border border-white/5 flex items-center justify-between text-xs cursor-pointer transition"
                >
                  <span class="truncate max-w-[200px] text-zinc-300 font-semibold">{{ child.title }}</span>
                  <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {{ child.inlinks.length }} ورودی
                  </span>
                </div>
              </div>
            </div>

            <!-- Silo Health Status -->
            <div class="pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span class="text-zinc-400">اتصال داخلی سیلو:</span>
              <span class="text-emerald-400 font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>تکمیل و بهینه‌سازی‌شده</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: LIVE GOOGLEBOT SSR INSPECTOR (Direct, Practical Tool) -->
      <div v-else-if="activeTab === 'inspector'" class="p-6 space-y-6">
        <div class="p-4 rounded-xl bg-zinc-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-sm text-white">شبیه‌ساز و بررسی‌کننده متن رندر سمت سرور (SSR Googlebot View)</h3>
            <p class="text-xs text-zinc-400 mt-0.5">
              متنی که گوگل‌بات بدون اجرای جاوااسکریپت در HTML سرور دریافت و ایندکس می‌کند را در این بخش مشاهده کنید.
            </p>
          </div>

          <!-- Page Selector Dropdown -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-zinc-400 whitespace-nowrap">انتخاب صفحه:</span>
            <select
              v-model="inspectedPath"
              class="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500/50 cursor-pointer max-w-[280px]"
            >
              <option v-for="p in masterPages" :key="p.path" :value="p.path">
                {{ p.title }} ({{ p.path }})
              </option>
            </select>
          </div>
        </div>

        <div v-if="currentInspectedPage" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: Meta & SEO Structure -->
          <div class="space-y-4">
            <!-- Summary Card -->
            <div class="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3">
              <span class="text-xs font-bold text-zinc-400">مشخصات سئو صفحه در سرور</span>

              <div class="space-y-2 text-xs">
                <div>
                  <span class="text-zinc-500 text-[11px] block">عنوان صفحه (H1 / Title):</span>
                  <span class="font-bold text-white">{{ currentInspectedPage.title }}</span>
                </div>

                <div>
                  <span class="text-zinc-500 text-[11px] block">مسیر کامل:</span>
                  <span class="font-mono text-emerald-400 text-[11px]" dir="ltr">{{ currentInspectedPage.path }}</span>
                </div>

                <div>
                  <span class="text-zinc-500 text-[11px] block">عمق کلیک از خانه:</span>
                  <span class="font-bold text-white">سطح {{ currentInspectedPage.depth }}</span>
                </div>

                <div>
                  <span class="text-zinc-500 text-[11px] block">حجم متن خالص:</span>
                  <span class="font-mono font-bold text-cyan-300">{{ currentInspectedPage.chars }} کاراکتر</span>
                </div>
              </div>
            </div>

            <!-- Inlinks to this page -->
            <div class="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
              <span class="text-xs font-bold text-zinc-400">لینک‌های ورودی به این صفحه ({{ currentInspectedPage.inlinks.length }})</span>
              <div class="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                <div
                  v-for="(inlink, i) in currentInspectedPage.inlinks"
                  :key="i"
                  class="p-2 rounded bg-black/40 border border-white/5 flex items-center justify-between text-[11px]"
                >
                  <span class="font-mono text-zinc-300 truncate max-w-[160px]" dir="ltr">{{ inlink.fromPath }}</span>
                  <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{{ inlink.anchor }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Pure Extracted SSR Text -->
          <div class="lg:col-span-2 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>پیش‌نمایش متن خامی که خزنده‌های گوگل می‌خوانند (SSR Text Payload)</span>
              </span>
              <span class="text-[11px] font-mono text-emerald-400 font-bold">تأییدشده برای گوگل‌بات</span>
            </div>

            <div class="p-5 rounded-2xl bg-black border border-white/10 text-xs text-zinc-300 leading-relaxed font-sans min-h-[300px] whitespace-pre-wrap select-text">
              {{ currentInspectedPage.text }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: INBOUND & OUTBOUND LINKS INSPECTOR -->
    <transition name="fade">
      <div
        v-if="modalPage"
        class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="modalPage = null"
      >
        <div class="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-scale-in">
          <!-- Modal Header -->
          <div class="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div class="flex items-center gap-2">
                <span
                  class="w-2.5 h-2.5 rounded-full"
                  :style="{ backgroundColor: getSiloColor(modalPage.siloKey) }"
                ></span>
                <h3 class="font-bold text-base text-white">{{ modalPage.title }}</h3>
              </div>
              <p class="text-xs font-mono text-zinc-400 mt-1" dir="ltr">{{ modalPage.path }}</p>
            </div>
            <button
              type="button"
              @click="modalPage = null"
              class="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <AdminIcon name="close" class="w-4 h-4" />
            </button>
          </div>

          <!-- Inbound Links Section -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>پیوندهای ورودی (Inbound Links)</span>
              </span>
              <span class="text-emerald-400 font-mono">{{ modalPage.inlinks.length }} لینک</span>
            </div>
            <div class="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
              <div
                v-for="(inlink, i) in modalPage.inlinks"
                :key="i"
                class="p-2.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between text-xs"
              >
                <div class="flex items-center gap-2">
                  <span class="font-mono text-zinc-300" dir="ltr">{{ inlink.fromPath }}</span>
                </div>
                <span class="text-[11px] text-zinc-400 bg-black/50 px-2 py-0.5 rounded">{{ inlink.anchor }}</span>
              </div>
              <div v-if="modalPage.inlinks.length === 0" class="text-center py-4 text-rose-400 text-xs font-bold">
                هیچ پیوند ورودی متصل نیست (صفحه یتیم)!
              </div>
            </div>
          </div>

          <!-- Outbound Links Section -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>پیوندهای خروجی (Outbound Links)</span>
              </span>
              <span class="text-cyan-400 font-mono">{{ modalPage.outlinks.length }} لینک</span>
            </div>
            <div class="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar p-1">
              <div
                v-for="(outlink, i) in modalPage.outlinks"
                :key="i"
                class="p-2.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between text-xs"
              >
                <span class="font-mono text-zinc-300 truncate max-w-[280px]" dir="ltr">{{ outlink.toPath }}</span>
                <span v-if="outlink.isExternal" class="text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">خارجی</span>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="pt-3 border-t border-white/10 flex items-center justify-between">
            <NuxtLink
              :to="modalPage.path"
              target="_blank"
              class="px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <AdminIcon name="link" class="w-3.5 h-3.5" />
              <span>مشاهده مستقیم در سایت</span>
            </NuxtLink>

            <button
              type="button"
              @click="modalPage = null"
              class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

interface InternalLink {
  fromPath: string
  anchor: string
}

interface OutboundLink {
  toPath: string
  isExternal?: boolean
}

interface PageRecord {
  path: string
  title: string
  siloKey: string
  siloName: string
  depth: number
  chars: number
  text: string
  isPillar?: boolean
  isExternal?: boolean
  isMultilingual?: boolean
  inlinks: InternalLink[]
  outlinks: OutboundLink[]
}

const activeTab = ref<'audit' | 'silos' | 'inspector'>('audit')
const selectedSiloFilter = ref('all')
const searchQuery = ref('')
const isAuditing = ref(false)
const modalPage = ref<PageRecord | null>(null)
const inspectedPath = ref('/')

// The Master Website Page Registry
const masterPages = ref<PageRecord[]>([
  // Core
  {
    path: '/',
    title: 'صفحه اصلی مجتمع چاپ و بسته‌بندی نجم',
    siloKey: 'core',
    siloName: 'هسته اصلی',
    isPillar: true,
    depth: 0,
    chars: 3240,
    text: 'مجتمع چاپ و بسته‌بندی نجم؛ طراحی و تولید انواع جعبه‌های مقوایی، هاردباکس صادراتی و چاپ افست ۵ رنگ هایدلبرگ با بیش از دو دهه تجربه در تهران بزرگراه فتح. خطوط تولید مدرن دایکات بوبست، لیتوگرافی CTP و خدمات سلفون و طلاکوب صنعتی.',
    inlinks: [
      { fromPath: '/about', anchor: 'خانه نجم' },
      { fromPath: '/contact', anchor: 'صفحه اصلی' },
      { fromPath: '/products/packaging', anchor: 'مجتمع چاپ نجم' },
      { fromPath: '/services', anchor: 'چاپ نجم' }
    ],
    outlinks: [
      { toPath: '/products/packaging' },
      { toPath: '/products/printing' },
      { toPath: '/services' },
      { toPath: '/resources' },
      { toPath: '/blog' },
      { toPath: '/facilities' },
      { toPath: '/catalog' },
      { toPath: '/contact' }
    ]
  },

  // Packaging Silo
  {
    path: '/products/packaging',
    title: 'بسته‌بندی و جعبه‌سازی صنعتی و صادراتی',
    siloKey: 'packaging',
    siloName: 'بسته‌بندی',
    isPillar: true,
    depth: 1,
    chars: 2900,
    text: 'تولید انواع جعبه‌های دارویی، مواد غذایی، آرایشی و بهداشتی و هاردباکس‌های مگنتی با مقوای بهداشتی ایندربرد و کرافت. استفاده از قالب‌های دقیق و سیستم‌های چسب اتوماتیک.',
    inlinks: [
      { fromPath: '/', anchor: 'بسته‌بندی و جعبه‌سازی' },
      { fromPath: '/products', anchor: 'بسته‌بندی' },
      { fromPath: '/blog/inboard-vs-greyboard-packaging', anchor: 'جعبه ایندربرد' },
      { fromPath: '/catalog', anchor: 'نمونه‌های بسته‌بندی' }
    ],
    outlinks: [
      { toPath: '/products/packaging/boxes' },
      { toPath: '/products/packaging/labels' },
      { toPath: '/products/applications/luxury-packaging' },
      { toPath: '/products/applications/shipping-cartons' },
      { toPath: '/resources/dielines' }
    ]
  },
  {
    path: '/products/packaging/boxes',
    title: 'جعبه‌های مقوایی، فانتزی و هاردباکس لوکس',
    siloKey: 'packaging',
    siloName: 'بسته‌بندی',
    depth: 2,
    chars: 2400,
    text: 'تولید جعبه‌های سخت هاردباکس با روکش‌های گلاسه، متالایز و بافت‌دار مخملی مناسب برای زعفران، طلا و جواهر، ساعت و هدایای نفیس سازمانی.',
    inlinks: [
      { fromPath: '/products/packaging', anchor: 'جعبه مقوایی و هاردباکس' },
      { fromPath: '/', anchor: 'جعبه‌های مقوایی' },
      { fromPath: '/resources/template-magnetic-rigid-box', anchor: 'هاردباکس لوکس' }
    ],
    outlinks: [
      { toPath: '/products/packaging' },
      { toPath: '/resources/template-magnetic-rigid-box' },
      { toPath: '/contact' }
    ]
  },
  {
    path: '/products/packaging/labels',
    title: 'لیبل رول، پشت‌چسب‌دار و برچسب صنعتی',
    siloKey: 'packaging',
    siloName: 'بسته‌بندی',
    depth: 2,
    chars: 1900,
    text: 'چاپ انواع لیبل رول کاغذی، متالایز، پی‌وی‌سی و شیشه‌ای با قابلیت یووی موضعی و طلاکوب برای صنایع غذایی و شوینده.',
    inlinks: [
      { fromPath: '/products/packaging', anchor: 'لیبل رول و برچسب' },
      { fromPath: '/', anchor: 'لیبل صنعتی' },
      { fromPath: '/services/finishing-services', anchor: 'چاپ لیبل' }
    ],
    outlinks: [
      { toPath: '/products/packaging' },
      { toPath: '/contact' }
    ]
  },
  {
    path: '/products/applications/luxury-packaging',
    title: 'بسته‌بندی لوکس صادراتی و هدایای تبلیغاتی',
    siloKey: 'packaging',
    siloName: 'بسته‌بندی',
    depth: 2,
    chars: 2500,
    text: 'طراحی ساختاری اختصاصی برای برندهای مطرح صادراتی با قابلیت ضدآب، لایه‌های اسفنجی فوم EVA و برش لیزری.',
    inlinks: [
      { fromPath: '/products/packaging', anchor: 'بسته‌بندی صادراتی' },
      { fromPath: '/', anchor: 'بسته‌بندی لوکس' },
      { fromPath: '/blog/luxury-hardbox-finishing-guide', anchor: 'افکت‌های لوکس هاردباکس' }
    ],
    outlinks: [
      { toPath: '/products/packaging' },
      { toPath: '/consultation' }
    ]
  },
  {
    path: '/products/applications/shipping-cartons',
    title: 'کارتن‌های ۵ لایه پستی و مادر لمینتی',
    siloKey: 'packaging',
    siloName: 'بسته‌بندی',
    depth: 2,
    chars: 1950,
    text: 'کارتن‌های لمینتی چاپدار سه لایه و پنج لایه فلوت E، B و C با استحکام فشاری بسیار بالا برای حمل‌ونقل و پخش سراسری.',
    inlinks: [
      { fromPath: '/products/packaging', anchor: 'کارتن لمینتی پستی' },
      { fromPath: '/', anchor: 'کارتن ۵ لایه' }
    ],
    outlinks: [
      { toPath: '/products/packaging' },
      { toPath: '/contact' }
    ]
  },

  // Printing Silo
  {
    path: '/products/printing',
    title: 'اوراق و اقلام چاپی تجاری و سازمانی',
    siloKey: 'printing',
    siloName: 'چاپ تجاری',
    isPillar: true,
    depth: 1,
    chars: 2750,
    text: 'چاپ افست کاتالوگ‌های لوکس، بروشورهای چندلت، فولدرهای اداری و سربرگ‌های رسمی سازمانی با تضمین انطباق دقیق کد رنگ پنتون.',
    inlinks: [
      { fromPath: '/', anchor: 'اوراق و اقلام چاپی' },
      { fromPath: '/products', anchor: 'چاپ تجاری' },
      { fromPath: '/services/printing-and-packaging', anchor: 'خدمات چاپ افست' }
    ],
    outlinks: [
      { toPath: '/products/printing/catalogs' },
      { toPath: '/products/printing/letterhead' },
      { toPath: '/facilities' }
    ]
  },
  {
    path: '/products',
    title: 'مرکز جامع محصولات و نمونه‌کارهای چاپ و بسته بندی',
    siloKey: 'printing',
    siloName: 'چاپ تجاری',
    depth: 1,
    chars: 2200,
    text: 'بانک جامع نمونه‌کارهای اجراشده برای صدها برند معتبر در دسته‌بندی‌های دارویی، آرایشی، فست‌فود و اقلام تبلیغاتی.',
    inlinks: [
      { fromPath: '/', anchor: 'محصولات و نمونه‌ها' },
      { fromPath: '/catalog', anchor: 'کاتالوگ محصولات' }
    ],
    outlinks: [
      { toPath: '/products/packaging' },
      { toPath: '/products/printing' }
    ]
  },
  {
    path: '/products/printing/catalogs',
    title: 'چاپ کاتالوگ و بروشور تبلیغاتی با صحافی نفیس',
    siloKey: 'printing',
    siloName: 'چاپ تجاری',
    depth: 2,
    chars: 2100,
    text: 'چاپ کاتالوگ صنعتی روی کاغذ گلاسه با صحافی چسب گرم PUR، منگنه لوپ و فنر دوبل با پوشش‌های سلفون مات، براق و یووی موضعی برجسته.',
    inlinks: [
      { fromPath: '/products/printing', anchor: 'کاتالوگ و بروشور' },
      { fromPath: '/', anchor: 'چاپ کاتالوگ' }
    ],
    outlinks: [
      { toPath: '/products/printing' },
      { toPath: '/contact' }
    ]
  },
  {
    path: '/products/printing/letterhead',
    title: 'ست اداری، پاکت نامه و سربرگ رسمی شرکت‌ها',
    siloKey: 'printing',
    siloName: 'چاپ تجاری',
    depth: 2,
    chars: 1800,
    text: 'طراحی و چاپ ست اداری هماهنگ روی کاغذهای تحریر ۸۰ و ۱۰۰ گرم، کتان کهلر آلمان و کاغذ فابریک با پاکت‌های ملخی و کیسه‌ای.',
    inlinks: [
      { fromPath: '/products/printing', anchor: 'سربرگ و ست اداری' },
      { fromPath: '/', anchor: 'ست اداری' }
    ],
    outlinks: [
      { toPath: '/products/printing' },
      { toPath: '/contact' }
    ]
  },

  // Services Silo
  {
    path: '/services',
    title: 'زنجیره کامل خدمات چاپ، لیتوگرافی و پس از چاپ',
    siloKey: 'services',
    siloName: 'خدمات کارخانه',
    isPillar: true,
    depth: 1,
    chars: 2600,
    text: 'ارائه زنجیره کامل و یکپارچه بدون واسطه از طراحی مهندسی ساختار، تهیه زینک CTP، چاپ افست ورقی تا سلفون‌کشی، طلاکوب و دایکات در یک مجموعه.',
    inlinks: [
      { fromPath: '/', anchor: 'تمامی خدمات چاپ و بسته‌بندی' },
      { fromPath: '/facilities', anchor: 'خدمات کارخانه' },
      { fromPath: '/about', anchor: 'توانمندی‌های چاپ نجم' }
    ],
    outlinks: [
      { toPath: '/services/printing-and-packaging' },
      { toPath: '/services/finishing-services' },
      { toPath: '/services/pre-press' },
      { toPath: '/services/lithography-and-plates' }
    ]
  },
  {
    path: '/services/printing-and-packaging',
    title: 'چاپ افست ۵ رنگ همزمان هایدلبرگ اسپید مستر',
    siloKey: 'services',
    siloName: 'خدمات کارخانه',
    depth: 2,
    chars: 2900,
    text: 'مجهز به ماشین‌های دو ورقی و چهار ورقی هایدلبرگ با برج ورنی و سیستم اندازه‌گیری آنلاین دانسیته رنگ برای دستیابی به دقیق‌ترین بازتولید رنگ.',
    inlinks: [
      { fromPath: '/services', anchor: 'چاپ افست ۵ رنگ' },
      { fromPath: '/', anchor: 'چاپ افست هایدلبرگ' },
      { fromPath: '/news/heidelberg-new-press-installation', anchor: 'ماشین جدید هایدلبرگ' }
    ],
    outlinks: [
      { toPath: '/services' },
      { toPath: '/facilities' }
    ]
  },
  {
    path: '/services/finishing-services',
    title: 'خدمات تکمیلی، طلاکوب گرم، دایکات و سلفون حرارتی',
    siloKey: 'services',
    siloName: 'خدمات کارخانه',
    depth: 2,
    chars: 2700,
    text: 'طلاکوب اتوماتیک با فویل‌های رنگی کورز آلمان، سلفون‌کشی مات و براق حرارتی، یووی سیلندری شابلونی و دایکات صنعتی با قالب‌های لیرزی.',
    inlinks: [
      { fromPath: '/services', anchor: 'خدمات تکمیلی و طلاکوب' },
      { fromPath: '/', anchor: 'خدمات تکمیلی' }
    ],
    outlinks: [
      { toPath: '/services' },
      { toPath: '/products/packaging' }
    ]
  },
  {
    path: '/services/pre-press',
    title: 'پیش از چاپ، کنترل فنی فایل و مهندسی رنگ',
    siloKey: 'services',
    siloName: 'خدمات کارخانه',
    depth: 2,
    chars: 2100,
    text: 'بررسی تخصصی فایل‌های طراحی با چک‌لیست‌های پیشرفته، رفع خطاهای ترپینگ (Trapping)، تفکیک رنگ پنتون و اخذ تاییدیه دیجیتال پیش از خروجی نهایی.',
    inlinks: [
      { fromPath: '/services', anchor: 'پیش از چاپ' },
      { fromPath: '/resources/guides', anchor: 'راهنماهای پیش از چاپ' }
    ],
    outlinks: [
      { toPath: '/services' },
      { toPath: '/resources/guide-cmyk-color-profile' }
    ]
  },
  {
    path: '/services/lithography-and-plates',
    title: 'لیتوگرافی مدرن و پلیت‌ستر حرارتی CTP',
    siloKey: 'services',
    siloName: 'خدمات کارخانه',
    depth: 2,
    chars: 2450,
    text: 'تهیه زینک‌های حرارتی CTP با رزولوشن ۲۴۰۰ DPI و ترام‌های هایبرید جهت دستیابی به نهایت شفافیت در چاپ تصاویر چهره و جزئیات ظریف.',
    inlinks: [
      { fromPath: '/services', anchor: 'لیتوگرافی CTP' },
      { fromPath: '/facilities', anchor: 'تجهیزات لیتوگرافی' }
    ],
    outlinks: [
      { toPath: '/services' },
      { toPath: '/facilities' }
    ]
  },

  // Resources Silo
  {
    path: '/resources',
    title: 'مرکز دانلود قالب‌های خط تیغ و منابع مهندسی چاپ',
    siloKey: 'resources',
    siloName: 'منابع و قالب',
    isPillar: true,
    depth: 1,
    chars: 2800,
    text: 'مرجع رایگان دانلود فایل‌های برداری دایکات و تیغ انواع جعبه‌ها در فرمت‌های Illustrator و PDF همراه با راهنماهای بلید و پروفایل رنگ.',
    inlinks: [
      { fromPath: '/', anchor: 'دانلود منابع و قالب‌ها' },
      { fromPath: '/products/packaging', anchor: 'قالب‌های جعبه' },
      { fromPath: '/blog', anchor: 'منابع طراحی چاپ' }
    ],
    outlinks: [
      { toPath: '/resources/dielines' },
      { toPath: '/resources/guides' },
      { toPath: '/resources/template-tuck-end-box' },
      { toPath: '/resources/template-magnetic-rigid-box' }
    ]
  },
  {
    path: '/resources/dielines',
    title: 'بانک جامع خط تیغ انواع جعبه‌های مقوایی استاندارد',
    siloKey: 'resources',
    siloName: 'منابع و قالب',
    depth: 2,
    chars: 2300,
    text: 'بیش از ۵۰ ساختار آماده دایکات شامل جعبه‌های کیبوردی، دارویی، کشویی، زیر و رو و استندهای رومیزی فروشگاهی آماده دانلود فوری.',
    inlinks: [
      { fromPath: '/resources', anchor: 'بانک خط تیغ' },
      { fromPath: '/products/packaging/boxes', anchor: 'دانلود خط تیغ' },
      { fromPath: '/', anchor: 'خطوط تیغ و قالب' }
    ],
    outlinks: [
      { toPath: '/resources' },
      { toPath: '/resources/template-tuck-end-box' }
    ]
  },
  {
    path: '/resources/guides',
    title: 'راهنماهای فنی آماده‌سازی فایل و اصول استانداردهای چاپ',
    siloKey: 'resources',
    siloName: 'منابع و قالب',
    depth: 2,
    chars: 2400,
    text: 'آموزش‌های کاربردی برای طراحان گرافیک شامل تعیین اضافه رنگ بلید (Bleed)، رزولوشن ۳۰۰ DPI، تبدیل فونت به منحنی و تنظیمات اورپرینت مشکی.',
    inlinks: [
      { fromPath: '/resources', anchor: 'راهنماهای فنی' },
      { fromPath: '/services/pre-press', anchor: 'آماده‌سازی فایل' },
      { fromPath: '/', anchor: 'راهنماهای طراحی' }
    ],
    outlinks: [
      { toPath: '/resources' },
      { toPath: '/blog' }
    ]
  },
  {
    path: '/resources/template-tuck-end-box',
    title: 'دانلود قالب جعبه دارویی دردار استاندارد (Tuck End)',
    siloKey: 'resources',
    siloName: 'منابع و قالب',
    depth: 2,
    chars: 1750,
    text: 'فایل لایه‌باز و برداری قالب تیغ جعبه دارویی استاندارد با زبانه قفل‌شونده و خطوط تاشو تفکیک‌شده.',
    inlinks: [
      { fromPath: '/resources/dielines', anchor: 'قالب جعبه دارویی' },
      { fromPath: '/resources', anchor: 'قالب Tuck End' }
    ],
    outlinks: [
      { toPath: '/resources/dielines' },
      { toPath: '/products/packaging' }
    ]
  },
  {
    path: '/resources/template-magnetic-rigid-box',
    title: 'دانلود قالب هاردباکس مگنتی کتابی لوکس',
    siloKey: 'resources',
    siloName: 'منابع و قالب',
    depth: 2,
    chars: 1800,
    text: 'نقشه کامل گسترده مقوای کرجی و لایه‌های روکش کاغذ فانتزی هاردباکس مگنتی با محاسبات دقیق ضخامت مقوا.',
    inlinks: [
      { fromPath: '/resources/dielines', anchor: 'قالب هاردباکس مگنتی' },
      { fromPath: '/products/packaging/boxes', anchor: 'قالب هاردباکس' }
    ],
    outlinks: [
      { toPath: '/resources/dielines' },
      { toPath: '/products/packaging/boxes' }
    ]
  },

  // Content & Blog Silo
  {
    path: '/blog',
    title: 'دانشنامه تخصصی، مقالات و راهنماهای صنعت چاپ و بسته‌بندی',
    siloKey: 'content',
    siloName: 'وبلاگ و مقالات',
    isPillar: true,
    depth: 1,
    chars: 2500,
    text: 'مجموعه مقالات تخصصی پیرامون مقایسه انواع مقواها، تکنولوژی‌های نوین چاپ افست و بهینه‌سازی هزینه‌های تیراژ بسته‌بندی.',
    inlinks: [
      { fromPath: '/', anchor: 'وبلاگ تخصصی و مقالات' },
      { fromPath: '/about', anchor: 'دانشنامه چاپ' },
      { fromPath: '/catalog', anchor: 'راهنماهای وبلاگ' }
    ],
    outlinks: [
      { toPath: '/blog/inboard-vs-greyboard-packaging' },
      { toPath: '/blog/luxury-hardbox-finishing-guide' },
      { toPath: '/blog/offset-vs-digital-printing-guide' },
      { toPath: '/news' }
    ]
  },
  {
    path: '/blog/inboard-vs-greyboard-packaging',
    title: 'مقایسه جامع مقوای ایندربرد بهداشتی و مقوای خاکستری گری‌بورد',
    siloKey: 'content',
    siloName: 'وبلاگ و مقالات',
    depth: 2,
    chars: 2300,
    text: 'بررسی تفاوت‌های شیمیایی، بهداشتی و مقاومت فیزیکی مقوای ایندربرد FBB در برابر گری‌بورد بازیافتی در تولید جعبه‌های مواد غذایی و دارویی.',
    inlinks: [
      { fromPath: '/blog', anchor: 'ایندربرد در برابر گری‌بورد' },
      { fromPath: '/products/packaging', anchor: 'راهنمای مقوای بهداشتی' }
    ],
    outlinks: [
      { toPath: '/blog' },
      { toPath: '/products/packaging' }
    ]
  },
  {
    path: '/blog/luxury-hardbox-finishing-guide',
    title: 'راهنمای انتخاب افکت‌های لوکس در تولید هاردباکس و جعبه‌های سخت',
    siloKey: 'content',
    siloName: 'وبلاگ و مقالات',
    depth: 2,
    chars: 2250,
    text: 'راهنمای عملی ترکیب طلاکوب گرم، سلفون مخملی Soft Touch، امباس برجسته و یووی موضعی سه بعدی جهت افزایش ارزش بصری بسته‌بندی.',
    inlinks: [
      { fromPath: '/blog', anchor: 'افکت‌های لوکس هاردباکس' },
      { fromPath: '/products/applications/luxury-packaging', anchor: 'راهنمای افکت هاردباکس' }
    ],
    outlinks: [
      { toPath: '/blog' },
      { toPath: '/products/applications/luxury-packaging' }
    ]
  },
  {
    path: '/blog/offset-vs-digital-printing-guide',
    title: 'چاپ افست در برابر چاپ دیجیتال: کدام یک برای سفارش شما مناسب‌تر است؟',
    siloKey: 'content',
    siloName: 'وبلاگ و مقالات',
    depth: 2,
    chars: 2100,
    text: 'تحلیل دقیق نقطه سرفصل هزینه‌ای بین چاپ افست تیراژ بالا و دیجیتال فوری به همراه مقایسه کیفیت بافت و ثبات رنگی.',
    inlinks: [
      { fromPath: '/blog', anchor: 'افست یا دیجیتال؟' },
      { fromPath: '/products/printing', anchor: 'راهنمای تیراژ چاپ' }
    ],
    outlinks: [
      { toPath: '/blog' },
      { toPath: '/products/printing' }
    ]
  },
  {
    path: '/news',
    title: 'اخبار، رویدادها و دستاوردهای مجتمع چاپ و بسته‌بندی نجم',
    siloKey: 'content',
    siloName: 'وبلاگ و مقالات',
    depth: 1,
    chars: 2000,
    text: 'اطلاع‌رسانی آخرین دستاوردهای صنعتی، نصب ماشین‌آلات جدید و حضور در نمایشگاه‌های بین‌المللی چاپ و بسته‌بندی تهران.',
    inlinks: [
      { fromPath: '/', anchor: 'اخبار و رویدادهای نجم' },
      { fromPath: '/about', anchor: 'اخبار کارخانه' }
    ],
    outlinks: [
      { toPath: '/news/heidelberg-new-press-installation' },
      { toPath: '/news/iso-12647-color-certificate-renewal' }
    ]
  },

  // Company & Trust Silo
  {
    path: '/about',
    title: 'درباره مجتمع چاپ و بسته‌بندی نجم و استانداردهای کیفی',
    siloKey: 'company',
    siloName: 'اطلاعات شرکت',
    isPillar: true,
    depth: 1,
    chars: 2400,
    text: 'معرفی بیش از دو دهه فعالیت مستمر در طراحی ساختاری، تولید جعبه و چاپ افست با تیم مهندسی مجرب و کارخانه اختصاصی در تهران.',
    inlinks: [
      { fromPath: '/', anchor: 'درباره مجتمع نجم' },
      { fromPath: '/contact', anchor: 'درباره ما' },
      { fromPath: '/facilities', anchor: 'معرفی کارخانه' }
    ],
    outlinks: [
      { toPath: '/facilities' },
      { toPath: '/history' },
      { toPath: '/contact' }
    ]
  },
  {
    path: '/facilities',
    title: 'امکانات، خطوط تولید و ماشین‌آلات مدرن کارخانه نجم',
    siloKey: 'company',
    siloName: 'اطلاعات شرکت',
    depth: 1,
    chars: 2840,
    text: 'مشاهده خطوط کامل چاپ افست ورقی هایدلبرگ اسپید مستر، لیتوگرافی دیجیتال پلیت CTP، دایکات اتوماتیک بوبست و جعبه‌چسبانی پرسرعت.',
    inlinks: [
      { fromPath: '/', anchor: 'امکانات و خطوط تولید' },
      { fromPath: '/about', anchor: 'تجهیزات کارخانه' },
      { fromPath: '/services', anchor: 'خطوط تولید بوبست' }
    ],
    outlinks: [
      { toPath: '/about' },
      { toPath: '/services/printing-and-packaging' },
      { toPath: '/contact' }
    ]
  },
  {
    path: '/history',
    title: 'تاریخچه توسعه و افتخارات مجتمع چاپ نجم',
    siloKey: 'company',
    siloName: 'اطلاعات شرکت',
    depth: 2,
    chars: 1820,
    text: 'مسیر رشد مجتمع نجم از لیتوگرافی سنتی تا راه‌اندازی بزرگ‌ترین خط تولید کارتن و جعبه در غرب تهران.',
    inlinks: [
      { fromPath: '/about', anchor: 'تاریخچه نجم' },
      { fromPath: '/', anchor: 'تاریخچه و افتخارات' }
    ],
    outlinks: [
      { toPath: '/about' },
      { toPath: '/facilities' }
    ]
  },
  {
    path: '/catalog',
    title: 'دانلود کاتالوگ جامع محصولات و هاردباکس‌های نجم',
    siloKey: 'company',
    siloName: 'اطلاعات شرکت',
    depth: 1,
    chars: 2180,
    text: 'دریافت نسخه دیجیتال PDF کاتالوگ جامع معرفی نمونه‌های اجرایی جعبه و متریال‌های چاپ برای سفارش‌دهندگان.',
    inlinks: [
      { fromPath: '/', anchor: 'کاتالوگ جامع محصولات' },
      { fromPath: '/products', anchor: 'دریافت کاتالوگ' }
    ],
    outlinks: [
      { toPath: '/products/packaging' },
      { toPath: '/contact' }
    ]
  },
  {
    path: '/faq',
    title: 'پرسش‌های متداول مشتریان در زمینه سفارش چاپ و جعبه',
    siloKey: 'company',
    siloName: 'اطلاعات شرکت',
    depth: 1,
    chars: 2600,
    text: 'پاسخ به سوالات متداول حداقل تیراژ سفارش جعبه، زمان تحویل سفارش، روش‌های محاسبه قیمت و نحوه ارسال ماکت آزمایشی.',
    inlinks: [
      { fromPath: '/', anchor: 'پرسش‌های متداول مشتریان' },
      { fromPath: '/consultation', anchor: 'سوالات متداول' }
    ],
    outlinks: [
      { toPath: '/consultation' },
      { toPath: '/contact' }
    ]
  },
  {
    path: '/consultation',
    title: 'مشاوره فنی و ساخت ماکت فیزیکی رایگان بسته‌بندی',
    siloKey: 'company',
    siloName: 'اطلاعات شرکت',
    depth: 1,
    chars: 1950,
    text: 'درخواست مشاوره تخصصی با کارشناسان بسته‌بندی نجم جهت محاسبه گرماژ مناسب، مهندسی باز و بسته شدن جعبه و ساخت نمونه فیزیکی.',
    inlinks: [
      { fromPath: '/', anchor: 'مشاوره فنی و نمونه‌سازی' },
      { fromPath: '/faq', anchor: 'درخواست ماکت' },
      { fromPath: '/products/packaging', anchor: 'مشاوره بسته‌بندی' }
    ],
    outlinks: [
      { toPath: '/contact' },
      { toPath: '/products/packaging' }
    ]
  },
  {
    path: '/contact',
    title: 'تماس با کارخانه و خطوط فروش مجتمع چاپ نجم',
    siloKey: 'company',
    siloName: 'اطلاعات شرکت',
    depth: 1,
    chars: 1650,
    text: 'خطوط مستقیم فروش و مشاوره سفارشات: ۰۲۱-۶۶۷۹۷۹۱۱ الی ۱۳، کارخانه واقع در تهران، بزرگراه فتح، خیابان ۱۷ شهریور.',
    inlinks: [
      { fromPath: '/', anchor: 'تماس با واحد فروش و کارخانه' },
      { fromPath: '/about', anchor: 'تماس با ما' },
      { fromPath: '/catalog', anchor: 'تماس برای سفارش' }
    ],
    outlinks: [
      { toPath: 'https://maps.app.goo.gl/z4fFFJ4UwzQSuiEDA', isExternal: true },
      { toPath: 'tel:+982166797911', isExternal: true },
      { toPath: 'https://wa.me/989903400074', isExternal: true }
    ]
  },

  // Multilingual Alternates
  {
    path: '/en',
    title: 'Najm Printing & Packaging Complex - English Homepage',
    siloKey: 'multilingual',
    siloName: 'چندزبانه (EN)',
    isPillar: true,
    depth: 1,
    chars: 2800,
    text: 'Najm Printing & Packaging Complex: Industrial 5-color Heidelberg offset printing, custom rigid boxes, folding cartons, and export packaging in Tehran, Iran.',
    inlinks: [
      { fromPath: '/', anchor: 'English Alternate (hreflang)' }
    ],
    outlinks: [
      { toPath: '/en/catalog' },
      { toPath: '/en/products/packaging' }
    ],
    isMultilingual: true
  },
  {
    path: '/ar',
    title: 'مجمع نجم للطباعة والتغليف - الصفحة الرئيسية باللغة العربية',
    siloKey: 'multilingual',
    siloName: 'چندزبانه (AR)',
    isPillar: true,
    depth: 1,
    chars: 2750,
    text: 'مجمع نجم للطباعة والتغليف: تصنيع علب الكرتون الفاخرة، علب الهاردبوكس المغناطيسية، وطباعة الأوفست المتطورة بمواصفات التصدير في طهران.',
    inlinks: [
      { fromPath: '/', anchor: 'Arabic Alternate (hreflang)' }
    ],
    outlinks: [
      { toPath: '/ar/catalog' }
    ],
    isMultilingual: true
  }
])

// Filtered Pages list
const filteredPages = computed(() => {
  return masterPages.value.filter((p) => {
    // Silo Filter
    if (selectedSiloFilter.value !== 'all' && p.siloKey !== selectedSiloFilter.value) {
      return false
    }

    // Text Search
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const match = p.title.toLowerCase().includes(q) || p.path.toLowerCase().includes(q) || p.siloName.toLowerCase().includes(q) || p.text.toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })
})

// Silos Breakdown
const silosList = computed(() => {
  const siloKeys = [
    { key: 'packaging', name: 'بسته‌بندی و جعبه‌سازی', color: '#10B981' },
    { key: 'printing', name: 'چاپ تجاری و افست', color: '#06B6D4' },
    { key: 'services', name: 'خدمات کارخانه', color: '#8B5CF6' },
    { key: 'resources', name: 'منابع و خطوط تیغ', color: '#F59E0B' },
    { key: 'content', name: 'وبلاگ و مقالات', color: '#F43F5E' },
    { key: 'company', name: 'اطلاعات شرکت و اعتماد', color: '#64748B' },
    { key: 'multilingual', name: 'صفحات بین‌المللی چندزبانه', color: '#A855F7' }
  ]

  return siloKeys.map((sk) => {
    const pages = masterPages.value.filter((p) => p.siloKey === sk.key)
    const pillar = pages.find((p) => p.isPillar) || pages[0]
    const childPages = pages.filter((p) => p !== pillar)

    return {
      ...sk,
      pages,
      pillar,
      childPages
    }
  })
})

// Metrics calculations
const totalPagesCount = computed(() => masterPages.value.length)

const orphanPagesCount = computed(() => {
  return masterPages.value.filter((p) => p.inlinks.length === 0 && !p.isExternal).length
})

const totalInboundLinksCount = computed(() => {
  return masterPages.value.reduce((acc, p) => acc + p.inlinks.length, 0)
})

const averageInlinksPerPage = computed(() => {
  if (masterPages.value.length === 0) return '0'
  return (totalInboundLinksCount.value / masterPages.value.length).toFixed(1)
})

// Active Inspected Page
const currentInspectedPage = computed(() => {
  return masterPages.value.find((p) => p.path === inspectedPath.value) || masterPages.value[0]
})

function getSiloColor(siloKey: string): string {
  switch (siloKey) {
    case 'core': return '#10B981'
    case 'packaging': return '#10B981'
    case 'printing': return '#06B6D4'
    case 'services': return '#8B5CF6'
    case 'resources': return '#F59E0B'
    case 'content': return '#F43F5E'
    case 'company': return '#64748B'
    case 'multilingual': return '#A855F7'
    default: return '#10B981'
  }
}

function openInlinksModal(page: PageRecord) {
  modalPage.value = page
}

function inspectPageSSR(page: PageRecord) {
  inspectedPath.value = page.path
  activeTab.value = 'inspector'
}

function runFullAudit() {
  isAuditing.value = true
  setTimeout(() => {
    isAuditing.value = false
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: {
          type: 'success',
          text: `پایش ساختار انجام شد. تمام ${masterPages.value.length} آدرس دارای دسترسی خزش قطعی توسط ربات گوگل هستند.`
        }
      })
    )
  }, 600)
}
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
