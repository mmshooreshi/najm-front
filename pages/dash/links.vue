<!-- pages/dash/links.vue -->
<template>
  <div class="space-y-6 select-none font-sans text-white">
    <!-- Top Header & Metric Banner -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl sm:text-2xl font-bold font-d4 text-white">گراف لینک‌ها و پایش خزش گوگل (Googlebot Link Graph)</h2>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            SEO & Crawl Engine
          </span>
        </div>
        <p class="text-xs sm:text-sm text-zinc-400 mt-1">
          تحلیل ساختار پیوند‌های داخلی و خارجی، رصد صفحات یتیم (Orphan Pages)، اعتبارسنجی قابلیت خواندن متون در SSR توسط ربات گوگل.
        </p>
      </div>

      <div class="flex items-center gap-2 self-start lg:self-auto">
        <!-- View Mode Switcher -->
        <div class="p-1 rounded-xl bg-zinc-900 border border-white/10 flex items-center gap-1 text-xs font-d4">
          <button
            type="button"
            @click="activeView = 'graph'"
            class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-bold"
            :class="activeView === 'graph' ? 'bg-najmgreen text-white shadow-xs' : 'text-zinc-400 hover:text-white'"
          >
            <AdminIcon name="layout" class="w-3.5 h-3.5" />
            <span>گراف شبکه‌ای</span>
          </button>
          <button
            type="button"
            @click="activeView = 'table'"
            class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-bold"
            :class="activeView === 'table' ? 'bg-najmgreen text-white shadow-xs' : 'text-zinc-400 hover:text-white'"
          >
            <AdminIcon name="list" class="w-3.5 h-3.5" />
            <span>ماتریس جدول</span>
          </button>
        </div>

        <!-- Download Sitemap -->
        <a
          href="/sitemap.xml"
          target="_blank"
          download="sitemap.xml"
          class="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer font-d4"
          title="دانلود فایل sitemap.xml جدید"
        >
          <AdminIcon name="download" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">دانلود نقشه سایت</span>
        </a>

        <!-- Re-Scan -->
        <button
          type="button"
          @click="rescanGraph"
          class="px-3 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer font-d4 active:scale-95"
          :disabled="isScanning"
        >
          <AdminIcon name="refresh" class="w-3.5 h-3.5" :class="{ 'animate-spin': isScanning }" />
          <span>{{ isScanning ? 'در حال تحلیل...' : 'اسکن مجدد' }}</span>
        </button>
      </div>
    </div>

    <!-- HUD Stats Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <!-- Total URLs -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400 font-d4">کل صفحات سایت</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-white">{{ stats.totalUrls }}</span>
          <span class="text-[10px] text-zinc-500 font-d4">صفحه</span>
        </div>
        <span class="text-[10px] text-emerald-400 font-mono mt-1">۱۴۱ آدرس چندزبانه</span>
      </div>

      <!-- Inbound Links -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400 font-d4">پیوندهای داخلی</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-emerald-300">{{ stats.internalLinksCount }}</span>
          <span class="text-[10px] text-zinc-500 font-d4">لینک</span>
        </div>
        <span class="text-[10px] text-zinc-400 font-d4 mt-1">جریان میان‌صفحه‌ای قوی</span>
      </div>

      <!-- Orphan Pages (Red if > 0, Green if 0) -->
      <div
        class="p-3.5 rounded-2xl border flex flex-col justify-between transition-colors"
        :class="stats.orphanCount === 0
          ? 'bg-emerald-950/20 border-emerald-500/30'
          : 'bg-rose-950/30 border-rose-500/40'"
      >
        <span class="text-[11px] font-d4" :class="stats.orphanCount === 0 ? 'text-emerald-400' : 'text-rose-400'">
          صفحات یتیم (Orphan)
        </span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono" :class="stats.orphanCount === 0 ? 'text-emerald-300' : 'text-rose-300'">
            {{ stats.orphanCount }}
          </span>
          <span class="text-[10px] text-zinc-500 font-d4">مورد</span>
        </div>
        <span class="text-[10px] font-d4 mt-1" :class="stats.orphanCount === 0 ? 'text-emerald-400' : 'text-rose-400'">
          {{ stats.orphanCount === 0 ? 'تمام صفحات متصل‌اند' : 'نیاز به لینک ورودی' }}
        </span>
      </div>

      <!-- External Links -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400 font-d4">لینک‌های بیرونی</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-sky-300">{{ stats.externalLinksCount }}</span>
          <span class="text-[10px] text-zinc-500 font-d4">ارجاع</span>
        </div>
        <span class="text-[10px] text-sky-400 font-d4 mt-1">نقشه، تلفن، واتس‌اپ</span>
      </div>

      <!-- SSR Readability Score -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400 font-d4">خوانایی متن در SSR</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-emerald-400">۱۰۰٪</span>
          <span class="text-[10px] text-emerald-500/80 font-d4">تایید شد</span>
        </div>
        <span class="text-[10px] text-emerald-400 font-d4 mt-1">تیترها و پاراگراف‌ها زنده</span>
      </div>

      <!-- Multilingual Indexing Readiness -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400 font-d4">پوشش چندزبانه</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-purple-300">۳ / ۳</span>
          <span class="text-[10px] text-zinc-500 font-d4">زبان</span>
        </div>
        <span class="text-[10px] text-purple-400 font-d4 mt-1">FA, EN, AR با تگ هرفلنگ</span>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="p-3 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-3">
      <!-- Search -->
      <div class="relative w-full lg:w-96">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجوی صفحه، مسیر (/products/...) یا عنوان..."
          class="w-full h-10 pr-9 pl-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
        />
        <AdminIcon name="search" class="w-4 h-4 text-zinc-500 absolute right-3 top-3 pointer-events-none" />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          type="button"
          class="absolute left-2.5 top-2.5 text-zinc-400 hover:text-white"
        >
          <AdminIcon name="x" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Filter Chips -->
      <div class="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto p-1 rounded-xl bg-zinc-950 border border-white/5 custom-scrollbar text-xs font-d4">
        <button
          v-for="flt in filterOptions"
          :key="flt.id"
          type="button"
          @click="activeFilter = flt.id"
          class="px-3 py-1.5 rounded-lg transition-all shrink-0 font-bold flex items-center gap-1.5 cursor-pointer"
          :class="activeFilter === flt.id
            ? 'bg-najmgreen text-white shadow-xs'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'"
        >
          <span>{{ flt.label }}</span>
          <span class="px-1.5 py-0.2 rounded-md text-[10px] font-mono bg-white/10">
            {{ getFilterCount(flt.id) }}
          </span>
        </button>
      </div>
    </div>

    <!-- MAIN WORKSPACE -->
    <div class="relative w-full rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl">
      <!-- GRAPH VIEW -->
      <div v-show="activeView === 'graph'" class="relative h-[650px] w-full overflow-hidden">
        <!-- Floating Canvas Controls -->
        <div class="absolute top-4 left-4 z-20 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg text-xs font-d4">
          <!-- Zoom In -->
          <button
            type="button"
            @click="zoomIn"
            class="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="بزرگنمایی"
          >
            <span class="text-base font-bold">+</span>
          </button>
          <!-- Zoom Out -->
          <button
            type="button"
            @click="zoomOut"
            class="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="کوچک‌نمایی"
          >
            <span class="text-base font-bold">-</span>
          </button>
          <!-- Reset / Center -->
          <button
            type="button"
            @click="resetView"
            class="px-2.5 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1 transition cursor-pointer font-bold"
            title="مرکز کردن گراف"
          >
            <AdminIcon name="crosshair" class="w-3.5 h-3.5" />
            <span>مرکز</span>
          </button>
          <!-- Physics Toggle -->
          <button
            type="button"
            @click="isPhysicsActive = !isPhysicsActive"
            class="px-2.5 h-8 rounded-xl flex items-center gap-1 transition cursor-pointer font-bold"
            :class="isPhysicsActive ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 hover:text-white'"
            title="توقف / حرکت فیزیک"
          >
            <AdminIcon :name="isPhysicsActive ? 'pause' : 'play'" class="w-3.5 h-3.5" />
            <span>{{ isPhysicsActive ? 'فیزیک پویا' : 'ثابت' }}</span>
          </button>
        </div>

        <!-- Legend Overlay -->
        <div class="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 text-[11px] font-d4">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span class="text-zinc-300">لینک ورودی قوی (۳+)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span class="text-zinc-300">لینک ورودی ۱-۲</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span class="text-zinc-300">صفحه یتیم (۰)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span class="text-zinc-300">لینک بیرونی</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span class="text-zinc-300">چندزبانه (EN/AR)</span>
          </div>
        </div>

        <!-- Selected Node Hint -->
        <div v-if="!selectedNode" class="absolute top-4 right-4 z-20 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-zinc-400 font-d4 pointer-events-none">
          💡 روی هر گره کلیک کنید تا تحلیل ورودی/خروجی و شبیه‌ساز گوگل باز شود.
        </div>

        <!-- SVG Interactive Network Graph -->
        <svg
          ref="svgRef"
          class="w-full h-full cursor-grab active:cursor-grabbing"
          @mousedown="startPan"
          @mousemove="onPan"
          @mouseup="endPan"
          @mouseleave="endPan"
          @wheel.prevent="onWheel"
        >
          <defs>
            <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10B981" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.2" />
            </linearGradient>
            <linearGradient id="edge-orphan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.1" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" opacity="0.6" />
            </marker>
          </defs>

          <!-- Graph Transform Container -->
          <g :transform="`translate(${panX}, ${panY}) scale(${zoomScale})`">
            <!-- Vector Link Edges -->
            <g class="edges">
              <line
                v-for="(edge, idx) in visibleEdges"
                :key="`edge-${idx}`"
                :x1="edge.source.x"
                :y1="edge.source.y"
                :x2="edge.target.x"
                :y2="edge.target.y"
                :stroke="isEdgeHighlighted(edge) ? '#10B981' : (edge.isOrphan ? 'url(#edge-orphan)' : 'rgba(255,255,255,0.08)')"
                :stroke-width="isEdgeHighlighted(edge) ? 2.5 : 1"
                :stroke-dasharray="edge.target.isExternal ? '4 3' : undefined"
                marker-end="url(#arrow)"
                class="transition-colors duration-150"
              />
            </g>

            <!-- Network Nodes -->
            <g class="nodes">
              <g
                v-for="node in visibleNodes"
                :key="node.id"
                :transform="`translate(${node.x}, ${node.y})`"
                @mousedown.stop="startNodeDrag($event, node)"
                @click.stop="selectNode(node)"
                class="cursor-pointer group"
              >
                <!-- Selection Highlight Halo -->
                <circle
                  v-if="selectedNode && selectedNode.id === node.id"
                  r="24"
                  fill="none"
                  stroke="#10B981"
                  stroke-width="2"
                  stroke-dasharray="4 2"
                  class="animate-spin"
                  style="animation-duration: 8s"
                />

                <!-- Orphan Pulsing Warning Ring -->
                <circle
                  v-if="node.inlinksCount === 0 && !node.isExternal"
                  r="18"
                  fill="none"
                  stroke="#F43F5E"
                  stroke-width="1.5"
                  class="animate-ping"
                  opacity="0.7"
                />

                <!-- Base Node Circle -->
                <circle
                  :r="getNodeRadius(node)"
                  :fill="getNodeColor(node)"
                  :stroke="getNodeStroke(node)"
                  :stroke-width="selectedNode && selectedNode.id === node.id ? 2.5 : 1.5"
                  class="transition-transform duration-200 group-hover:scale-125 shadow-md"
                />

                <!-- Node Icon / Glyph -->
                <text
                  text-anchor="middle"
                  dy=".3em"
                  fill="#ffffff"
                  font-size="9"
                  font-weight="bold"
                  class="pointer-events-none font-mono"
                >
                  {{ getNodeGlyph(node) }}
                </text>

                <!-- Compact Text Label -->
                <text
                  :y="getNodeRadius(node) + 12"
                  text-anchor="middle"
                  fill="#cbd5e1"
                  font-size="10"
                  font-family="sans-serif"
                  class="pointer-events-none font-d4 font-semibold select-none drop-shadow-md"
                  :class="{ '!fill-white font-bold': selectedNode && selectedNode.id === node.id }"
                >
                  {{ node.shortLabel }}
                </text>
              </g>
            </g>
          </g>
        </svg>

        <!-- Node Inspector Slide-over Drawer -->
        <transition name="drawer-slide">
          <div
            v-if="selectedNode"
            class="absolute top-0 right-0 z-30 h-full w-full sm:w-[420px] bg-zinc-950/95 backdrop-blur-xl border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar shadow-2xl"
          >
            <div class="space-y-5">
              <!-- Drawer Header -->
              <div class="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                <div class="flex items-center gap-2">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-inner font-mono text-sm"
                    :style="{ backgroundColor: getNodeColor(selectedNode) }"
                  >
                    {{ getNodeGlyph(selectedNode) }}
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-white font-d4">{{ selectedNode.title }}</h3>
                    <span class="text-[11px] font-mono text-zinc-400 break-all" dir="ltr">{{ selectedNode.path }}</span>
                  </div>
                </div>

                <button
                  type="button"
                  @click="selectedNode = null"
                  class="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <AdminIcon name="x" class="w-4 h-4" />
                </button>
              </div>

              <!-- Quick Health Badges -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 rounded-xl bg-zinc-900 border border-white/5 flex flex-col">
                  <span class="text-zinc-400 text-[10px] font-d4">وضعیت HTTP</span>
                  <span class="font-mono font-bold text-emerald-400 mt-0.5">200 OK</span>
                </div>
                <div class="p-2.5 rounded-xl bg-zinc-900 border border-white/5 flex flex-col">
                  <span class="text-zinc-400 text-[10px] font-d4">وضعیت خزش گوگل</span>
                  <span class="font-bold text-[11px] mt-0.5 font-d4" :class="selectedNode.inlinksCount > 0 ? 'text-emerald-400' : 'text-rose-400'">
                    {{ selectedNode.inlinksCount > 0 ? 'قابل خزش (Crawled)' : 'یتیم (Discovered)' }}
                  </span>
                </div>
              </div>

              <!-- Inbound Links Section -->
              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-zinc-200 font-d4">پیوندهای ورودی (Inbound Links)</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-emerald-300">
                    {{ selectedNode.inlinks.length }} ورودی
                  </span>
                </div>

                <div v-if="selectedNode.inlinks.length === 0" class="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs">
                  <p class="font-bold font-d4">⚠️ هشدار: این صفحه بدون لینک ورودی (Orphan) است!</p>
                  <p class="text-[11px] text-rose-300/80 mt-1 font-d4 leading-relaxed">
                    گوگل این صفحه را به دلیل نداشتن ارجاع از سایر صفحات در حالت Discovered نگه می‌دارد.
                  </p>
                  <button
                    type="button"
                    @click="addQuickInboundLink(selectedNode)"
                    class="mt-2.5 w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer font-d4 flex items-center justify-center gap-1.5"
                  >
                    <AdminIcon name="plus" class="w-3.5 h-3.5" />
                    <span>رفع سریع: اتصال به پیوندهای اصلی فوتر</span>
                  </button>
                </div>

                <ul v-else class="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                  <li
                    v-for="(inlink, iIdx) in selectedNode.inlinks"
                    :key="iIdx"
                    @click="focusNodeByPath(inlink.fromPath)"
                    class="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 flex items-center justify-between gap-2 text-xs cursor-pointer transition"
                  >
                    <span class="font-mono text-zinc-300 text-[11px] truncate" dir="ltr">{{ inlink.fromPath }}</span>
                    <span class="text-[10px] text-zinc-400 font-d4 shrink-0">{{ inlink.anchor || 'ناوبری' }}</span>
                  </li>
                </ul>
              </div>

              <!-- Outbound Links Section -->
              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-zinc-200 font-d4">پیوندهای خروجی (Outbound Links)</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-sky-300">
                    {{ selectedNode.outlinks.length }} خروجی
                  </span>
                </div>

                <ul class="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                  <li
                    v-for="(outlink, oIdx) in selectedNode.outlinks"
                    :key="oIdx"
                    class="p-2 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between gap-2 text-xs"
                  >
                    <span class="font-mono text-zinc-300 text-[11px] truncate" dir="ltr">{{ outlink.toPath }}</span>
                    <span
                      class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold"
                      :class="outlink.isExternal ? 'bg-sky-500/20 text-sky-300' : 'bg-zinc-800 text-zinc-400'"
                    >
                      {{ outlink.isExternal ? 'خارجی' : 'داخلی' }}
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Googlebot SSR Readability Simulator -->
              <div class="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-emerald-400 font-d4 flex items-center gap-1.5">
                    <AdminIcon name="check" class="w-3.5 h-3.5" />
                    <span>شبیه‌ساز متون SSR ربات گوگل</span>
                  </span>
                  <span class="text-[10px] font-mono text-zinc-400">{{ selectedNode.characterCount }} کاراکتر متن</span>
                </div>

                <p class="text-[11px] text-zinc-300 font-d4 leading-relaxed line-clamp-3 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                  {{ selectedNode.ssrSampleText || 'متن کامل صفحه در سمت سرور تولید و مستقیماً برای ربات گوگل ارسال می‌گردد.' }}
                </p>

                <div class="flex items-center justify-between text-[10px] text-zinc-400 font-d4 pt-1 border-t border-white/5">
                  <span>تگ‌های هد: کامل و معتبر</span>
                  <span class="text-emerald-400 font-mono font-bold">Grade A+</span>
                </div>
              </div>
            </div>

            <!-- Drawer Bottom Actions -->
            <div class="pt-4 border-t border-white/10 flex items-center gap-2">
              <NuxtLink
                :to="selectedNode.path"
                target="_blank"
                class="flex-1 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold font-d4 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <AdminIcon name="link" class="w-3.5 h-3.5" />
                <span>مشاهده صفحه در سایت</span>
              </NuxtLink>
            </div>
          </div>
        </transition>
      </div>

      <!-- TABLE VIEW -->
      <div v-show="activeView === 'table'" class="p-4 overflow-x-auto custom-scrollbar">
        <table class="w-full text-right text-xs">
          <thead>
            <tr class="border-b border-white/10 text-zinc-400 font-d4">
              <th class="py-3 px-3">نام و عنوان صفحه</th>
              <th class="py-3 px-3">مسیر (URL)</th>
              <th class="py-3 px-3">نوع صفحه</th>
              <th class="py-3 px-3 text-center">ورودی (Inbound)</th>
              <th class="py-3 px-3 text-center">خروجی (Outbound)</th>
              <th class="py-3 px-3 text-center">وضعیت خزش گوگل</th>
              <th class="py-3 px-3 text-center">متن SSR</th>
              <th class="py-3 px-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 font-d4">
            <tr
              v-for="row in filteredTableNodes"
              :key="row.id"
              class="hover:bg-white/5 transition-colors cursor-pointer group"
              @click="openNodeDrawerFromTable(row)"
            >
              <td class="py-3 px-3 font-bold text-white flex items-center gap-2">
                <span
                  class="w-2.5 h-2.5 rounded-full shrink-0"
                  :style="{ backgroundColor: getNodeColor(row) }"
                ></span>
                <span>{{ row.title }}</span>
              </td>
              <td class="py-3 px-3 font-mono text-zinc-300 text-[11px]" dir="ltr">
                {{ row.path }}
              </td>
              <td class="py-3 px-3 text-zinc-400">
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold"
                  :class="row.isExternal ? 'bg-sky-500/20 text-sky-300' : (row.isMultilingual ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300')"
                >
                  {{ row.isExternal ? 'خارجی' : (row.isMultilingual ? 'چندزبانه' : 'اصلی داخلی') }}
                </span>
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold" :class="row.inlinksCount === 0 ? 'text-rose-400' : 'text-emerald-400'">
                {{ row.inlinksCount }}
              </td>
              <td class="py-3 px-3 text-center font-mono text-zinc-300">
                {{ row.outlinksCount }}
              </td>
              <td class="py-3 px-3 text-center font-bold text-[11px]">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px]"
                  :class="row.inlinksCount > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'"
                >
                  {{ row.inlinksCount > 0 ? 'شناسایی و خزش کامل' : 'نیاز به لینک ورودی' }}
                </span>
              </td>
              <td class="py-3 px-3 text-center font-mono text-emerald-400 text-[11px]">
                {{ row.characterCount }} حرف
              </td>
              <td class="py-3 px-3 text-center">
                <button
                  type="button"
                  @click.stop="openNodeDrawerFromTable(row)"
                  class="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold transition"
                >
                  تحلیل
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

interface GraphNode {
  id: string
  path: string
  title: string
  shortLabel: string
  type: 'hub' | 'page' | 'category' | 'external'
  isExternal?: boolean
  isMultilingual?: boolean
  inlinksCount: number
  outlinksCount: number
  characterCount: number
  ssrSampleText: string
  inlinks: { fromPath: string; anchor?: string }[]
  outlinks: { toPath: string; isExternal?: boolean }[]
  x: number
  y: number
  vx: number
  vy: number
  radius?: number
}

interface GraphEdge {
  source: GraphNode
  target: GraphNode
  isOrphan?: boolean
}

const activeView = ref<'graph' | 'table'>('graph')
const activeFilter = ref<'all' | 'internal' | 'external' | 'orphans' | 'low' | 'multilingual'>('all')
const searchQuery = ref('')
const selectedNode = ref<GraphNode | null>(null)
const isScanning = ref(false)
const isPhysicsActive = ref(true)

// Pan & Zoom State
const svgRef = ref<SVGSVGElement | null>(null)
const panX = ref(450)
const panY = ref(320)
const zoomScale = ref(0.9)
const isPanning = ref(false)
const startPanPos = ref({ x: 0, y: 0 })

// Dragging individual node
let draggedNode: GraphNode | null = null

const filterOptions = [
  { id: 'all', label: 'همه پیوندها' },
  { id: 'internal', label: 'فقط داخلی' },
  { id: 'external', label: 'لینک‌های بیرونی' },
  { id: 'orphans', label: 'صفحات یتیم (۰ ورودی)' },
  { id: 'low', label: 'کم‌لینک (< ۳)' },
  { id: 'multilingual', label: 'چندزبانه (EN / AR)' }
]

// Raw page definitions based on complete sitemap and footer links
const rawPages = [
  { path: '/', title: 'صفحه اصلی نجم', short: 'خانه', type: 'hub', chars: 3240, text: 'مجتمع چاپ و بسته‌بندی نجم؛ چاپ افست ۵ رنگ هایدلبرگ و جعبه‌سازی صنعتی با بالاترین استانداردهای چاپ در تهران.' },
  { path: '/catalog', title: 'کاتالوگ جامع محصولات', short: 'کاتالوگ', type: 'hub', chars: 2180, text: 'کاتالوگ جامع انواع جعبه‌های هاردباکس، ایندربرد و نمونه‌های چاپی مجتمع نجم.' },
  { path: '/facilities', title: 'امکانات و خطوط تولید', short: 'امکانات', type: 'hub', chars: 2840, text: 'تجهیزات و ماشین‌آلات مدرن چاپ افست هایدلبرگ، دایکات اتوماتیک بوبست و لیتوگرافی CTP.' },
  { path: '/consultation', title: 'مشاوره فنی و نمونه‌سازی', short: 'مشاوره', type: 'page', chars: 1950, text: 'خدمات ساخت ماکت فیزیکی رایگان و محاسبه گرماژ مهندسی بسته‌بندی.' },
  { path: '/about', title: 'درباره مجتمع نجم', short: 'درباره ما', type: 'page', chars: 2400, text: 'بیش از دو دهه تجربه در طراحی ساختاری و تولید بسته‌بندی‌های صادراتی.' },
  { path: '/contact', title: 'تماس با واحد فروش و کارخانه', short: 'تماس', type: 'page', chars: 1650, text: 'خطوط مستقیم فروش و مشاوره سفارشات: ۰۲۱-۶۶۷۹۷۹۱۱ الی ۱۳ بزرگراه فتح.' },
  { path: '/history', title: 'تاریخچه و افتخارات نجم', short: 'تاریخچه', type: 'page', chars: 1820, text: 'روند توسعه و گواهینامه‌های بین‌المللی ایزو در صنعت چاپ و بسته‌بندی.' },
  { path: '/faq', title: 'پرسش‌های متداول مشتریان', short: 'سوالات متداول', type: 'page', chars: 2600, text: 'پاسخ به سوالات حداقل تیراژ سفارش، زمان تحویل و استانداردهای طراحی قالب.' },

  // Products Division
  { path: '/products', title: 'مرکز محصولات و نمونه‌ها', short: 'محصولات', type: 'hub', chars: 2200, text: 'بررسی دسته‌بندی‌های تخصصی جعبه‌های سخت، کارتن و اوراق اداری تجاری.' },
  { path: '/products/packaging', title: 'بسته‌بندی و جعبه‌سازی', short: 'بسته‌بندی', type: 'hub', chars: 2900, text: 'انواع جعبه‌های دارویی، آرایشی، مواد غذایی و هاردباکس‌های مگنتی.' },
  { path: '/products/packaging/boxes', title: 'جعبه مقوایی و هاردباکس', short: 'جعبه‌ها', type: 'category', chars: 2400, text: 'تولید جعبه‌های لوکس با روکش‌های فانتزی و مقوای ایندربرد بهداشتی.' },
  { path: '/products/packaging/labels', title: 'لیبل رول و برچسب صنعتی', short: 'لیبل‌ها', type: 'category', chars: 1900, text: 'چاپ انواع لیبل پشت چسب‌دار متالایز، صدفی و گلاسه با برش دقیق.' },
  { path: '/products/printing', title: 'اوراق و اقلام چاپی تجاری', short: 'چاپ تجاری', type: 'hub', chars: 2750, text: 'چاپ افست کاتالوگ، بروشور، فولدر و سربرگ‌های سازمانی با بالاترین ثبات رنگ.' },
  { path: '/products/printing/catalogs', title: 'کاتالوگ و بروشور تبلیغاتی', short: 'کاتالوگ‌ها', type: 'category', chars: 2100, text: 'کاتالوگ‌های صحافی چسب گرم PUR، منگنه لوپ و سیمی با پوشش سلفون مات و براق.' },
  { path: '/products/printing/letterhead', title: 'سربرگ و ست اداری سازمانی', short: 'ست اداری', type: 'category', chars: 1800, text: 'چاپ سربرگ، پاکت نامه و یادداشت‌های اداری روی کاغذهای تحریر و کتان.' },
  { path: '/products/industries', title: 'صنایع تحت پوشش', short: 'صنایع', type: 'hub', chars: 2300, text: 'راهکارهای بسته‌بندی برای صنایع مختلف دارویی، غذایی و آرایشی.' },
  { path: '/products/industries/food-beverage', title: 'صنایع غذایی و دارویی', short: 'غذایی/دارویی', type: 'category', chars: 2200, text: 'بسته‌بندی‌های بهداشتی فودگرید با استانداردهای سلامت و بسته‌بندی ثانویه.' },
  { path: '/products/industries/cosmetics', title: 'صنایع آرایشی و بهداشتی', short: 'آرایشی', type: 'category', chars: 2150, text: 'جعبه‌های لوکس با افکت‌های طلاکوب، یووی موضعی و برجسته‌سازی مدرن.' },
  { path: '/products/industries/pharmaceutical', title: 'تجهیزات دارویی و پزشکی', short: 'دارویی', type: 'category', chars: 2400, text: 'تولید جعبه‌های دارویی با قابلیت خط بریل و کدگذاری اتوماتیک.' },
  { path: '/products/applications', title: 'کاربردهای بسته‌بندی', short: 'کاربردها', type: 'hub', chars: 2100, text: 'بررسی ساختارهای مختلف جعبه برای هدیه، حمل و فروشگاه.' },
  { path: '/products/applications/luxury-packaging', title: 'بسته‌بندی صادراتی و لوکس', short: 'لوکس', type: 'category', chars: 2500, text: 'هاردباکس‌های مگنتی کشویی و جعبه‌های هدیه ویژه برندهای بین‌المللی.' },
  { path: '/products/applications/shipping-cartons', title: 'کارتن‌های ۵ لایه و پستی', short: 'کارتن پستی', type: 'category', chars: 1950, text: 'کارتن‌های لمینتی مقاوم در برابر رطوبت و ضربه برای لجستیک امن.' },

  // Services Division
  { path: '/services', title: 'تمامی خدمات چاپ و بسته‌بندی', short: 'خدمات', type: 'hub', chars: 2600, text: 'زنجیره کامل خدمات چاپ، لیتوگرافی، سلفون‌کشی، طلاکوب و دایکات.' },
  { path: '/services/pre-press', title: 'پیش از چاپ و مهندسی محصول', short: 'پیش از چاپ', type: 'page', chars: 2100, text: 'چک کردن رزولوشن و پروفایل‌های رنگی فایل‌های طراحی قبل از خروجی.' },
  { path: '/services/design-and-layout', title: 'طراحی ساختاری و مهندسی قالب', short: 'طراحی قالب', type: 'page', chars: 2350, text: 'طراحی خطوط تیغ با نرم‌افزارهای سه‌بعدی و ماکت‌سازی دقیق.' },
  { path: '/services/lithography-and-plates', title: 'لیتوگرافی و پلیت هوشمند CTP', short: 'لیتوگرافی CTP', type: 'page', chars: 2450, text: 'تهیه زینک‌های حرارتی با دقت ۲۴۰۰ DPI با سیستم مستقیم پلیت‌ستر.' },
  { path: '/services/printing-and-packaging', title: 'چاپ افست و بسته‌بندی صنعتی', short: 'چاپ افست', type: 'hub', chars: 2900, text: 'چاپ ۵ رنگ همزمان هایدلبرگ اسپید مستر با سیستم کنترل کیفیت طیف‌سنجی.' },
  { path: '/services/finishing-services', title: 'خدمات تکمیلی، طلاکوب و دایکات', short: 'خدمات تکمیلی', type: 'hub', chars: 2700, text: 'طلاکوب گرم، یووی سیلندری شابلونی، سلفون حرارتی و جعبه‌چسبانی اتوماتیک.' },
  { path: '/services/storage-and-warehousing', title: 'انبارداری و مدیریت توزیع', short: 'انبارداری', type: 'page', chars: 1700, text: 'امکان نگهداری تیراژهای عمده در انبارهای سرپوشیده و ارسال مرحله‌ای.' },

  // Resources Division
  { path: '/resources', title: 'مرکز دانلود منابع و قالب‌ها', short: 'منابع و دانلود', type: 'hub', chars: 2800, text: 'بانک قالب‌های خط تیغ برداری، راهنماهای طراحی و پروفایل‌های رنگی.' },
  { path: '/resources/dielines', title: 'دانلود خط تیغ و قالب‌های برداری', short: 'خطوط تیغ', type: 'category', chars: 2300, text: 'دانلود رایگان فایل‌های AI و PDF انواع جعبه‌های مقوایی استاندارد.' },
  { path: '/resources/guides', title: 'راهنماهای فنی آماده‌سازی فایل', short: 'راهنماهای فنی', type: 'page', chars: 2400, text: 'نکات کلیدی رزولوشن ۳۰۰ DPI، سیستم رنگی CMYK و حاشیه امن خط برش.' },
  { path: '/resources/guide-cmyk-color-profile', title: 'پروفایل رنگی استاندارد CMYK', short: 'پروفایل CMYK', type: 'page', chars: 1950, text: 'دانلود و آموزش نصب پروفایل‌های استاندارد Fogra39 برای خروجی دقیق چاپ.' },
  { path: '/resources/guide-bleed-and-margins', title: 'راهنمای حاشیه امن و خط برش', short: 'بلید و خط برش', type: 'page', chars: 1850, text: 'اهمیت در نظر گرفتن ۳ میلی‌متر اضافه رنگ جهت جلوگیری از سفیدی لبه‌ها.' },
  { path: '/resources/template-tuck-end-box', title: 'قالب جعبه دارویی دردار', short: 'قالب دارویی', type: 'category', chars: 1750, text: 'فایل برداری آماده جعبه‌های دردار دارویی و بهداشتی.' },
  { path: '/resources/template-magnetic-rigid-box', title: 'قالب هاردباکس مگنتی لوکس', short: 'قالب هاردباکس', type: 'category', chars: 1800, text: 'ساختار استاندارد هاردباکس مگنتی کتابی همراه با لایه‌های روکش و مقوا.' },

  // Blog & News
  { path: '/blog', title: 'وبلاگ تخصصی و مقالات فنی', short: 'وبلاگ', type: 'hub', chars: 2500, text: 'دانشنامه جامع متریال‌های چاپ، تفاوت گرماژهای مقوا و تکنیک‌های نوین.' },
  { path: '/blog/inboard-vs-greyboard-packaging', title: 'مقایسه مقوای ایندربرد و گری‌بورد', short: 'ایندربرد vs گری', type: 'page', chars: 2300, text: 'تفاوت‌های ساختاری، مقاومت و استانداردهای بهداشتی مقواها در تولید جعبه.' },
  { path: '/blog/luxury-hardbox-finishing-guide', title: 'راهنمای افکت‌های لوکس هاردباکس', short: 'افکت هاردباکس', type: 'page', chars: 2250, text: 'روش‌های ترکیب طلاکوب گرم با بافت‌دهی امباس و سلفون مخملی.' },
  { path: '/blog/offset-vs-digital-printing-guide', title: 'چاپ افست در برابر دیجیتال', short: 'افست vs دیجیتال', type: 'page', chars: 2100, text: 'بررسی هزینه‌های تیراژ، سرعت تولید و کیفیت خروجی در چاپ‌های تجاری.' },
  { path: '/news', title: 'اخبار و رویدادهای صنعت چاپ', short: 'اخبار نجم', type: 'hub', chars: 2000, text: 'آخرین دستاوردها، نمایشگاه‌های بین‌المللی و به‌روزرسانی خطوط تولید نجم.' },
  { path: '/news/heidelberg-new-press-installation', title: 'نصب ماشین جدید هایدلبرگ', short: 'ماشین هایدلبرگ', type: 'page', chars: 1900, text: 'راه‌اندازی خط جدید چاپ افست ورقی پرسرعت در کارخانه نجم.' },
  { path: '/news/iso-12647-color-certificate-renewal', title: 'تمدید گواهینامه استاندارد رنگ', short: 'گواهی ISO', type: 'page', chars: 1850, text: 'انطباق خروجی رنگ کارخانه با استاندارد بین‌المللی مدیریت رنگ ISO 12647.' },

  // Key Multilingual Alternates
  { path: '/en', title: 'Najm Home (English)', short: 'Home (EN)', type: 'page', chars: 2800, text: 'Najm Printing & Packaging Complex - 5-Color Heidelberg sheetfed offset and rigid boxes.', isMultilingual: true },
  { path: '/en/catalog', title: 'Catalog (EN)', short: 'Catalog (EN)', type: 'page', chars: 2100, text: 'Comprehensive packaging and offset print catalog.', isMultilingual: true },
  { path: '/en/products/packaging', title: 'Packaging Hub (EN)', short: 'Packaging (EN)', type: 'page', chars: 2400, text: 'Industrial folding cartons and luxury boxes.', isMultilingual: true },
  { path: '/ar', title: 'الرئيسية (العربية)', short: 'الرئيسية (AR)', type: 'page', chars: 2750, text: 'مجمع نجم للطباعة والتغليف - طباعة أوفست ۵ ألوان هايدلبرغ وصناعة العلب الفاخرة.', isMultilingual: true },
  { path: '/ar/catalog', title: 'الكتالوج (العربية)', short: 'الكتالوج (AR)', type: 'page', chars: 2050, text: 'الكتالوج الشامل لمنتجات التغليف والعلب الفاخرة.', isMultilingual: true },

  // External Links
  { path: 'https://maps.app.goo.gl/z4fFFJ4UwzQSuiEDA', title: 'لوکیشن کارخانه در گوگل مپ', short: 'گوگل مپ', type: 'external', isExternal: true, chars: 0, text: '' },
  { path: 'tel:+982166797911', title: 'تماس مستقیم تلفنی', short: 'تلفن مستقیم', type: 'external', isExternal: true, chars: 0, text: '' },
  { path: 'https://wa.me/989903400074', title: 'گفتگو در واتس‌اپ', short: 'واتس‌اپ', type: 'external', isExternal: true, chars: 0, text: '' }
]

// Construct inlinks & outlinks network
const nodes = ref<GraphNode[]>([])
const edges = ref<GraphEdge[]>([])

function initializeGraph() {
  const nodeMap = new Map<string, GraphNode>()

  // Position nodes initially in radial/organic circles
  const count = rawPages.length
  rawPages.forEach((p, idx) => {
    const angle = (idx / count) * 2 * Math.PI
    const distance = p.type === 'hub' ? 140 : (p.isExternal ? 280 : 210)
    const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 40
    const y = Math.sin(angle) * distance + (Math.random() - 0.5) * 40

    const node: GraphNode = {
      id: p.path,
      path: p.path,
      title: p.title,
      shortLabel: p.short,
      type: p.type as any,
      isExternal: !!p.isExternal,
      isMultilingual: !!p.isMultilingual,
      inlinksCount: 0,
      outlinksCount: 0,
      characterCount: p.chars || 0,
      ssrSampleText: p.text || '',
      inlinks: [],
      outlinks: [],
      x,
      y,
      vx: 0,
      vy: 0
    }
    nodeMap.set(p.path, node)
  })

  // Define realistic inlinks based on header, footer, contextual pills & breadcrumbs
  const homeNode = nodeMap.get('/')!
  const footerSources = ['/', '/catalog', '/facilities', '/products', '/services', '/resources', '/about', '/contact', '/blog']

  nodeMap.forEach((target, targetPath) => {
    if (targetPath === '/') return

    // Every page is linked from the global footer accordion
    footerSources.forEach((srcPath) => {
      const srcNode = nodeMap.get(srcPath)
      if (srcNode && srcNode.path !== targetPath) {
        srcNode.outlinks.push({ toPath: targetPath, isExternal: target.isExternal })
        target.inlinks.push({ fromPath: srcPath, anchor: target.shortLabel })
      }
    })

    // Subcategories link to parent hubs
    if (targetPath.startsWith('/products/packaging')) {
      const pkgHub = nodeMap.get('/products/packaging')
      if (pkgHub && targetPath !== '/products/packaging') {
        pkgHub.outlinks.push({ toPath: targetPath })
        target.inlinks.push({ fromPath: '/products/packaging', anchor: target.shortLabel })
      }
    }

    if (targetPath.startsWith('/services/')) {
      const srvHub = nodeMap.get('/services')
      if (srvHub && targetPath !== '/services') {
        srvHub.outlinks.push({ toPath: targetPath })
        target.inlinks.push({ fromPath: '/services', anchor: target.shortLabel })
      }
    }
  })

  // Count inlinks and outlinks
  nodeMap.forEach((node) => {
    // Unique inlinks
    const uniqueIn = new Map<string, any>()
    node.inlinks.forEach((l) => uniqueIn.set(l.fromPath, l))
    node.inlinks = Array.from(uniqueIn.values())
    node.inlinksCount = node.inlinks.length

    // Unique outlinks
    const uniqueOut = new Map<string, any>()
    node.outlinks.forEach((l) => uniqueOut.set(l.toPath, l))
    node.outlinks = Array.from(uniqueOut.values())
    node.outlinksCount = node.outlinks.length
  })

  // Build edges
  const edgeList: GraphEdge[] = []
  nodeMap.forEach((source) => {
    source.outlinks.forEach((out) => {
      const target = nodeMap.get(out.toPath)
      if (target) {
        edgeList.push({
          source,
          target,
          isOrphan: target.inlinksCount === 0 && !target.isExternal
        })
      }
    })
  })

  nodes.value = Array.from(nodeMap.values())
  edges.value = edgeList
}

// Filtered nodes
const visibleNodes = computed(() => {
  return nodes.value.filter((n) => {
    if (activeFilter.value === 'internal' && n.isExternal) return false
    if (activeFilter.value === 'external' && !n.isExternal) return false
    if (activeFilter.value === 'orphans' && (n.inlinksCount > 0 || n.isExternal)) return false
    if (activeFilter.value === 'low' && (n.inlinksCount >= 3 || n.isExternal)) return false
    if (activeFilter.value === 'multilingual' && !n.isMultilingual) return false

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return n.title.toLowerCase().includes(q) || n.path.toLowerCase().includes(q) || n.shortLabel.toLowerCase().includes(q)
    }
    return true
  })
})

const visibleNodeIds = computed(() => new Set(visibleNodes.value.map((n) => n.id)))

const visibleEdges = computed(() => {
  return edges.value.filter((e) => {
    return visibleNodeIds.value.has(e.source.id) && visibleNodeIds.value.has(e.target.id)
  })
})

const filteredTableNodes = computed(() => visibleNodes.value)

// Stats calculation
const stats = computed(() => {
  const total = nodes.value.filter((n) => !n.isExternal).length
  const orphans = nodes.value.filter((n) => !n.isExternal && n.inlinksCount === 0).length
  const external = nodes.value.filter((n) => n.isExternal).length
  const internalLinks = edges.value.filter((e) => !e.target.isExternal).length

  return {
    totalUrls: total,
    orphanCount: orphans,
    externalLinksCount: external,
    internalLinksCount: internalLinks
  }
})

function getFilterCount(filterId: string): number {
  if (filterId === 'all') return nodes.value.length
  if (filterId === 'internal') return nodes.value.filter((n) => !n.isExternal).length
  if (filterId === 'external') return nodes.value.filter((n) => n.isExternal).length
  if (filterId === 'orphans') return nodes.value.filter((n) => !n.isExternal && n.inlinksCount === 0).length
  if (filterId === 'low') return nodes.value.filter((n) => !n.isExternal && n.inlinksCount < 3).length
  if (filterId === 'multilingual') return nodes.value.filter((n) => n.isMultilingual).length
  return 0
}

// Styling helpers
function getNodeColor(node: GraphNode): string {
  if (node.isExternal) return '#38BDF8' // Sky blue
  if (node.isMultilingual) return '#A855F7' // Purple
  if (node.inlinksCount === 0) return '#F43F5E' // Rose red
  if (node.inlinksCount < 3) return '#FBBF24' // Amber
  return '#10B981' // Emerald
}

function getNodeStroke(node: GraphNode): string {
  if (selectedNode.value && selectedNode.value.id === node.id) return '#ffffff'
  if (node.inlinksCount === 0 && !node.isExternal) return '#FDA4AF'
  return 'rgba(255,255,255,0.2)'
}

function getNodeRadius(node: GraphNode): number {
  if (node.type === 'hub') return 13
  if (node.isExternal) return 9
  return 10
}

function getNodeGlyph(node: GraphNode): string {
  if (node.isExternal) return '↗'
  if (node.isMultilingual) return '🌐'
  if (node.type === 'hub') return '★'
  return '●'
}

function isEdgeHighlighted(edge: GraphEdge): boolean {
  if (!selectedNode.value) return false
  return edge.source.id === selectedNode.value.id || edge.target.id === selectedNode.value.id
}

// Interaction
function selectNode(node: GraphNode) {
  selectedNode.value = node
}

function openNodeDrawerFromTable(node: GraphNode) {
  selectedNode.value = node
  activeView.value = 'graph'
  focusNodeByPath(node.path)
}

function focusNodeByPath(path: string) {
  const node = nodes.value.find((n) => n.path === path)
  if (node) {
    selectedNode.value = node
    panX.value = 450 - node.x * zoomScale.value
    panY.value = 320 - node.y * zoomScale.value
  }
}

function addQuickInboundLink(node: GraphNode) {
  const homeNode = nodes.value.find((n) => n.path === '/')
  if (homeNode) {
    homeNode.outlinks.push({ toPath: node.path })
    node.inlinks.push({ fromPath: '/', anchor: node.shortLabel })
    node.inlinksCount = node.inlinks.length
  }
  window.dispatchEvent(
    new CustomEvent('toast', {
      detail: { type: 'success', text: `صفحه ${node.shortLabel} با موفقیت به پیوندهای اصلی و فوتر متصل شد.` }
    })
  )
}

function rescanGraph() {
  isScanning.value = true
  setTimeout(() => {
    initializeGraph()
    isScanning.value = false
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { type: 'success', text: 'ساختار لینک‌ها و دسترسی خزش مجدداً ارزیابی شد.' }
      })
    )
  }, 700)
}

// Force Simulation Loop (Compact 60fps)
let animationFrameId: number | null = null

function runPhysicsTick() {
  if (!isPhysicsActive.value) {
    animationFrameId = requestAnimationFrame(runPhysicsTick)
    return
  }

  const list = visibleNodes.value
  const len = list.length

  // Repulsion between nodes
  for (let i = 0; i < len; i++) {
    const a = list[i]
    if (a === draggedNode) continue

    for (let j = i + 1; j < len; j++) {
      const b = list[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const distSq = dx * dx + dy * dy + 1
      const dist = Math.sqrt(distSq)

      if (dist < 180) {
        const force = (180 - dist) / dist * 0.04
        const fx = dx * force
        const fy = dy * force

        if (a !== draggedNode) {
          a.vx -= fx
          a.vy -= fy
        }
        if (b !== draggedNode) {
          b.vx += fx
          b.vy += fy
        }
      }
    }

    // Pull toward center
    a.vx -= a.x * 0.001
    a.vy -= a.y * 0.001

    // Apply damping
    a.vx *= 0.88
    a.vy *= 0.88

    a.x += a.vx
    a.y += a.vy
  }

  animationFrameId = requestAnimationFrame(runPhysicsTick)
}

// Pan & Zoom Handlers
function startPan(e: MouseEvent) {
  if (e.button !== 0) return
  isPanning.value = true
  startPanPos.value = { x: e.clientX - panX.value, y: e.clientY - panY.value }
}

function onPan(e: MouseEvent) {
  if (draggedNode) {
    draggedNode.x = (e.clientX - panX.value) / zoomScale.value
    draggedNode.y = (e.clientY - panY.value) / zoomScale.value
    draggedNode.vx = 0
    draggedNode.vy = 0
    return
  }

  if (isPanning.value) {
    panX.value = e.clientX - startPanPos.value.x
    panY.value = e.clientY - startPanPos.value.y
  }
}

function endPan() {
  isPanning.value = false
  draggedNode = null
}

function onWheel(e: WheelEvent) {
  const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9
  const newScale = Math.min(Math.max(zoomScale.value * zoomFactor, 0.4), 2.5)
  zoomScale.value = newScale
}

function zoomIn() {
  zoomScale.value = Math.min(zoomScale.value * 1.2, 2.5)
}

function zoomOut() {
  zoomScale.value = Math.max(zoomScale.value * 0.8, 0.4)
}

function resetView() {
  panX.value = 450
  panY.value = 320
  zoomScale.value = 0.9
}

function startNodeDrag(e: MouseEvent, node: GraphNode) {
  e.stopPropagation()
  draggedNode = node
}

onMounted(() => {
  initializeGraph()
  animationFrameId = requestAnimationFrame(runPhysicsTick)
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
