<!-- pages/dash/links.vue -->
<template>
  <div class="space-y-6 select-none font-d4 text-white">
    <!-- Top Header & Strategy Banner -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl sm:text-2xl font-bold font-d4 text-white">معماری سیلو و گراف استراتژیک لینک‌ها (Silo & Crawl Graph)</h2>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            استراتژی معماری سایت
          </span>
        </div>
        <p class="text-xs sm:text-sm text-zinc-400 mt-1">
          پایش سلسله‌مراتب سیلوها، توزیع اعتبار داخلی (Link Equity)، رصد عمق دسترسی گوگل‌بات و کشف صفحات یتیم.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2 self-start lg:self-auto">
        <!-- View Mode Switcher -->
        <div class="p-1 rounded-xl bg-zinc-900 border border-white/10 flex items-center gap-1 text-xs">
          <button
            type="button"
            @click="graphMode = 'cluster'"
            class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-bold"
            :class="graphMode === 'cluster' ? 'bg-najmgreen text-white shadow-xs' : 'text-zinc-400 hover:text-white'"
            title="نمایش خوشه‌ای خوشه‌ها و قابلیت باز/بسته کردن دسته‌ها"
          >
            <AdminIcon name="layout" class="w-3.5 h-3.5" />
            <span>خوشه‌های محتوا (Silo)</span>
          </button>

          <button
            type="button"
            @click="graphMode = 'depth'"
            class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-bold"
            :class="graphMode === 'depth' ? 'bg-najmgreen text-white shadow-xs' : 'text-zinc-400 hover:text-white'"
            title="نمایش بر اساس عمق کلیک از صفحه اصلی (Level 0, 1, 2)"
          >
            <AdminIcon name="diff" class="w-3.5 h-3.5" />
            <span>عمق خزش گوگل (Depth)</span>
          </button>

          <button
            type="button"
            @click="graphMode = 'table'"
            class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-bold"
            :class="graphMode === 'table' ? 'bg-najmgreen text-white shadow-xs' : 'text-zinc-400 hover:text-white'"
          >
            <AdminIcon name="list" class="w-3.5 h-3.5" />
            <span>ماتریس جدول سئو</span>
          </button>
        </div>

        <!-- Download Sitemap -->
        <a
          href="/sitemap.xml"
          target="_blank"
          download="sitemap.xml"
          class="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <AdminIcon name="download" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">دانلود نقشه سایت</span>
        </a>

        <!-- Re-Scan -->
        <button
          type="button"
          @click="rescanGraph"
          class="px-3 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          :disabled="isScanning"
        >
          <AdminIcon name="refresh" class="w-3.5 h-3.5" :class="{ 'animate-spin': isScanning }" />
          <span>{{ isScanning ? 'در حال ارزیابی...' : 'اسکن مجدد' }}</span>
        </button>
      </div>
    </div>

    <!-- Strategic HUD Stat Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <!-- Total URLs -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400">کل صفحات سایت</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-white">{{ stats.totalUrls }}</span>
          <span class="text-[10px] text-zinc-500">آدرس</span>
        </div>
        <span class="text-[10px] text-emerald-400 font-mono mt-1">۱۴۱ URL چندزبانه</span>
      </div>

      <!-- Silo Clusters -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400">سیلوهای موضوعی</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-cyan-300">۷</span>
          <span class="text-[10px] text-zinc-500">پیلار محتوا</span>
        </div>
        <span class="text-[10px] text-zinc-400 mt-1">ساختار درختی استاندارد</span>
      </div>

      <!-- Max Crawl Depth -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400">بیشترین عمق کلیک</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-emerald-300">۲</span>
          <span class="text-[10px] text-zinc-500">کلیک از خانه</span>
        </div>
        <span class="text-[10px] text-emerald-400 mt-1">ایده‌آل برای خزش سریع</span>
      </div>

      <!-- Internal Inbound Links -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400">پیوندهای داخلی</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-emerald-300">{{ stats.internalLinksCount }}</span>
          <span class="text-[10px] text-zinc-500">لینک</span>
        </div>
        <span class="text-[10px] text-zinc-400 mt-1">انتقال پیوسته پیج‌رنک</span>
      </div>

      <!-- High PageRank Hubs -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between">
        <span class="text-[11px] text-zinc-400">صفحات کانونی پرقدرت</span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono text-violet-300">{{ stats.authorityHubsCount }}</span>
          <span class="text-[10px] text-zinc-500">هاب اصلی</span>
        </div>
        <span class="text-[10px] text-violet-400 mt-1">ورودی ۱۰+ لینک</span>
      </div>

      <!-- Orphan Pages Warning -->
      <div
        class="p-3.5 rounded-2xl border flex flex-col justify-between transition-colors"
        :class="stats.orphanCount === 0
          ? 'bg-emerald-950/20 border-emerald-500/30'
          : 'bg-rose-950/30 border-rose-500/40'"
      >
        <span class="text-[11px]" :class="stats.orphanCount === 0 ? 'text-emerald-400' : 'text-rose-400'">
          صفحات یتیم (Orphan)
        </span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-xl font-bold font-mono" :class="stats.orphanCount === 0 ? 'text-emerald-300' : 'text-rose-300'">
            {{ stats.orphanCount }}
          </span>
          <span class="text-[10px] text-zinc-500">صفحه</span>
        </div>
        <span class="text-[10px]" :class="stats.orphanCount === 0 ? 'text-emerald-400' : 'text-rose-400'">
          {{ stats.orphanCount === 0 ? 'تمام صفحات متصل‌اند' : 'نیاز به لینک ورودی' }}
        </span>
      </div>
    </div>

    <!-- MAIN INTERACTIVE CANVAS WRAPPER -->
    <div class="relative bg-zinc-950/90 rounded-2xl border border-white/10 overflow-hidden shadow-2xl min-h-[640px] flex flex-col">
      <!-- Strategy Controls Bar -->
      <div class="p-3 border-b border-white/10 bg-zinc-900/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        <!-- Left: Filters & Cluster Expanders -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Cluster View Specific Actions -->
          <template v-if="graphMode === 'cluster'">
            <button
              type="button"
              @click="expandAllClusters"
              class="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <AdminIcon name="plus" class="w-3 h-3 text-emerald-400" />
              <span>باز کردن همه زیرصفحات</span>
            </button>

            <button
              type="button"
              @click="collapseAllClusters"
              class="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <AdminIcon name="close" class="w-3 h-3 text-zinc-400" />
              <span>فقط نمایش پیلارهای اصلی</span>
            </button>

            <div class="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>
          </template>

          <!-- Filter Pills -->
          <div class="flex items-center gap-1 overflow-x-auto custom-scrollbar py-0.5">
            <button
              v-for="flt in filterOptions"
              :key="flt.id"
              type="button"
              @click="activeFilter = flt.id as any"
              class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap"
              :class="activeFilter === flt.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'"
            >
              {{ flt.label }}
            </button>
          </div>
        </div>

        <!-- Right: Search, Reset & Zoom -->
        <div class="flex items-center gap-2">
          <!-- Search in graph -->
          <div class="relative w-44 sm:w-56">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجوی صفحه یا پیوند..."
              class="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500/50 pr-7"
            />
            <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-2 pointer-events-none" />
          </div>

          <!-- Zoom Controls -->
          <div v-if="graphMode !== 'table'" class="flex items-center bg-zinc-900 border border-white/10 rounded-lg p-0.5">
            <button
              type="button"
              @click="zoomIn"
              class="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
              title="بزرگنمایی"
            >
              <AdminIcon name="plus" class="w-3.5 h-3.5" />
            </button>
            <span class="px-1 text-[10px] font-mono text-zinc-400">{{ Math.round(zoomScale * 100) }}%</span>
            <button
              type="button"
              @click="zoomOut"
              class="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
              title="کوچک‌نمایی"
            >
              <AdminIcon name="minimize" class="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              @click="resetView"
              class="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
              title="بازنشانی موقعیت دوربین"
            >
              <AdminIcon name="refresh" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- VISUAL GRAPH CANVAS (Cluster & Depth Modes) -->
      <div v-show="graphMode !== 'table'" class="relative flex-1 w-full h-[620px] bg-radial from-zinc-900/60 to-zinc-950 overflow-hidden">
        <!-- Strategic Legend Overlay -->
        <div class="absolute bottom-4 left-4 z-20 bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[11px] text-zinc-300 space-y-1.5 shadow-xl pointer-events-auto">
          <div class="font-bold text-white mb-1 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>راهنمای استراتژی پیوندها:</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs"></span>
            <span>هسته و بسته‌بندی (ستون فقرات سایت)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>چاپ افست و خدمات تجاری</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>منابع، خطوط تیغ و مقالات وبلاگ</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>صفحات چندزبانه (EN / AR)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>تبدیل خارجی (تماس / واتس‌اپ / مپ)</span>
          </div>
        </div>

        <!-- Strategy Tip -->
        <div v-if="!selectedNode" class="absolute top-4 right-4 z-20 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-zinc-400 pointer-events-none">
          💡 روی هر خوشه کلیک کنید تا زیرصفحات آن باز/بسته شوند. برای بررسی عمق و متن سئو روی صفحه کلیک کنید.
        </div>

        <!-- Interactive SVG Canvas -->
        <svg
          ref="svgRef"
          class="w-full h-full cursor-grab active:cursor-grabbing select-none"
          @mousedown="startPan"
          @mousemove="onPointerMove"
          @mouseup="endPan"
          @mouseleave="endPan"
          @touchstart.prevent="startTouchPan"
          @touchmove.prevent="onPointerMove"
          @touchend="endPan"
          @wheel.prevent="onWheel"
        >
          <defs>
            <!-- Edge Arrows -->
            <marker id="arrow-emerald" viewBox="0 0 10 10" refX="17" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" opacity="0.6" />
            </marker>
            <marker id="arrow-cyan" viewBox="0 0 10 10" refX="17" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06B6D4" opacity="0.6" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="17" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" opacity="0.6" />
            </marker>

            <!-- Glow Filters -->
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Graph Content Transform Container -->
          <g :transform="`translate(${panX}, ${panY}) scale(${zoomScale})`">
            <!-- Background Depth Level Columns in 'depth' mode -->
            <g v-if="graphMode === 'depth'" class="depth-lanes opacity-30">
              <rect x="-100" y="-300" width="260" height="600" rx="16" fill="#10B981" fill-opacity="0.05" stroke="#10B981" stroke-dasharray="4 4" />
              <text x="30" y="-270" text-anchor="middle" fill="#10B981" font-size="11" font-weight="bold" class="graph-persian-font">عمق ۰ (صفحه اصلی)</text>

              <rect x="220" y="-300" width="300" height="600" rx="16" fill="#06B6D4" fill-opacity="0.05" stroke="#06B6D4" stroke-dasharray="4 4" />
              <text x="370" y="-270" text-anchor="middle" fill="#06B6D4" font-size="11" font-weight="bold" class="graph-persian-font">عمق ۱ (هاب‌های دسته‌بندی و خدمات)</text>

              <rect x="580" y="-300" width="340" height="600" rx="16" fill="#F59E0B" fill-opacity="0.05" stroke="#F59E0B" stroke-dasharray="4 4" />
              <text x="750" y="-270" text-anchor="middle" fill="#F59E0B" font-size="11" font-weight="bold" class="graph-persian-font">عمق ۲ (صفحات جزئی، قالب‌ها و مقالات)</text>
            </g>

            <!-- Link Edges -->
            <g class="edges">
              <line
                v-for="(edge, idx) in activeVisibleEdges"
                :key="`edge-${idx}`"
                :x1="edge.source.x"
                :y1="edge.source.y"
                :x2="edge.target.x"
                :y2="edge.target.y"
                :stroke="isEdgeHighlighted(edge) ? '#10B981' : (edge.isOrphan ? '#F43F5E' : 'rgba(255,255,255,0.12)')"
                :stroke-width="isEdgeHighlighted(edge) ? 2.5 : 1"
                :stroke-dasharray="edge.target.isExternal ? '4 3' : undefined"
                :marker-end="getMarkerForEdge(edge)"
                class="transition-colors duration-200"
              />
            </g>

            <!-- Graph Nodes -->
            <g class="nodes">
              <g
                v-for="node in activeVisibleNodes"
                :key="node.id"
                :transform="`translate(${node.x}, ${node.y})`"
                @mousedown.stop="startNodeDrag($event, node)"
                @touchstart.stop="startNodeTouchDrag($event, node)"
                @click.stop="onNodeClick(node)"
                class="cursor-pointer group"
              >
                <!-- Halo on Selected Node -->
                <circle
                  v-if="selectedNode && selectedNode.id === node.id"
                  :r="getNodeRadius(node) + 10"
                  fill="none"
                  stroke="#10B981"
                  stroke-width="2"
                  stroke-dasharray="4 3"
                  class="animate-spin"
                  style="animation-duration: 8s"
                />

                <!-- Orphan Pulsing Ring -->
                <circle
                  v-if="node.inlinksCount === 0 && !node.isExternal"
                  :r="getNodeRadius(node) + 8"
                  fill="none"
                  stroke="#F43F5E"
                  stroke-width="1.5"
                  class="animate-ping"
                  opacity="0.6"
                />

                <!-- Cluster Expansion Ring Indicator (When node is a cluster hub) -->
                <circle
                  v-if="node.isClusterHub"
                  :r="getNodeRadius(node) + 4"
                  fill="none"
                  :stroke="node.isExpanded ? '#10B981' : 'rgba(255,255,255,0.4)'"
                  stroke-width="1.5"
                  :stroke-dasharray="node.isExpanded ? undefined : '3 2'"
                  class="transition-all"
                />

                <!-- Base Node Circle -->
                <circle
                  :r="getNodeRadius(node)"
                  :fill="getNodeColor(node)"
                  :stroke="getNodeStroke(node)"
                  :stroke-width="selectedNode && selectedNode.id === node.id ? 3 : 1.5"
                  class="transition-transform duration-200 group-hover:scale-115 shadow-lg"
                />

                <!-- Node Center Icon / Glyph -->
                <text
                  text-anchor="middle"
                  dy=".32em"
                  fill="#ffffff"
                  font-size="9"
                  font-weight="bold"
                  class="pointer-events-none select-none font-mono"
                >
                  {{ getNodeGlyph(node) }}
                </text>

                <!-- High-Contrast Clean Badge with Native Persian Font -->
                <g :transform="`translate(0, ${getNodeRadius(node) + 12})`">
                  <!-- Pill Background -->
                  <rect
                    :x="-(getNodeLabelWidth(node) / 2)"
                    y="-8"
                    :width="getNodeLabelWidth(node)"
                    height="16"
                    rx="8"
                    fill="#18181b"
                    fill-opacity="0.9"
                    :stroke="selectedNode && selectedNode.id === node.id ? '#10B981' : 'rgba(255,255,255,0.15)'"
                    stroke-width="1"
                    class="transition-colors group-hover:stroke-emerald-400"
                  />

                  <!-- Small Persian Text -->
                  <text
                    text-anchor="middle"
                    dy="3"
                    :fill="selectedNode && selectedNode.id === node.id ? '#34D399' : '#F4F4F5'"
                    font-size="9.5"
                    font-weight="600"
                    class="pointer-events-none select-none graph-persian-font"
                  >
                    {{ node.shortLabel }}
                    <tspan v-if="node.isClusterHub && !node.isExpanded" fill="#A1A1AA" font-size="8">
                      ({{ node.clusterChildCount }})
                    </tspan>
                  </text>
                </g>
              </g>
            </g>
          </g>
        </svg>

        <!-- NODE INSPECTOR SLIDE-OVER DRAWER -->
        <transition name="drawer-slide">
          <div
            v-if="selectedNode"
            class="absolute top-0 right-0 z-30 h-full w-full sm:w-[420px] bg-zinc-950/95 backdrop-blur-2xl border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar shadow-2xl"
          >
            <div class="space-y-5">
              <!-- Drawer Header -->
              <div class="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                <div class="flex items-center gap-2">
                  <span
                    class="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    :style="{ backgroundColor: getNodeColor(selectedNode) }"
                  ></span>
                  <div>
                    <h3 class="font-bold text-sm text-white">{{ selectedNode.title }}</h3>
                    <p class="text-[11px] font-mono text-zinc-400 mt-0.5" dir="ltr">{{ selectedNode.path }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="selectedNode = null"
                  class="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <AdminIcon name="close" class="w-4 h-4" />
                </button>
              </div>

              <!-- Cluster & Depth Strategic Badges -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 rounded-xl bg-zinc-900 border border-white/10">
                  <span class="text-[10px] text-zinc-400">عمق کلیک از خانه (Crawl Depth)</span>
                  <div class="flex items-baseline gap-1 mt-1 font-bold text-emerald-300 font-mono">
                    Level {{ selectedNode.depth }}
                    <span class="text-[10px] font-d4 text-zinc-500">
                      {{ selectedNode.depth === 0 ? '(هسته اصلی)' : (selectedNode.depth === 1 ? '(یک کلیک)' : '(دو کلیک)') }}
                    </span>
                  </div>
                </div>

                <div class="p-2.5 rounded-xl bg-zinc-900 border border-white/10">
                  <span class="text-[10px] text-zinc-400">توزیع اعتبار (PageRank Juice)</span>
                  <div class="flex items-baseline gap-1 mt-1 font-bold font-mono" :class="getPageRankColor(selectedNode.pageRankScore)">
                    {{ selectedNode.pageRankScore }} / 100
                  </div>
                </div>
              </div>

              <!-- Cluster Expand/Collapse Button if Hub -->
              <div v-if="selectedNode.isClusterHub" class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-emerald-300">خوشه موضوعی: {{ selectedNode.clusterName }}</span>
                  <p class="text-[10px] text-zinc-400 mt-0.5">{{ selectedNode.clusterChildCount }} صفحه زیرمجموعه در این سیلو</p>
                </div>
                <button
                  type="button"
                  @click="toggleClusterNode(selectedNode)"
                  class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  {{ selectedNode.isExpanded ? 'بستن زیرصفحات' : 'گسترش زیرصفحات' }}
                </button>
              </div>

              <!-- Quick Orphan Fix if Needed -->
              <div
                v-if="selectedNode.inlinksCount === 0 && !selectedNode.isExternal"
                class="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 space-y-2"
              >
                <div class="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
                  <AdminIcon name="clock-bolt" class="w-4 h-4 text-rose-400" />
                  <span>صفحه یتیم! ربات گوگل این صفحه را نمی‌خزد.</span>
                </div>
                <p class="text-[11px] text-rose-200/80 leading-relaxed">
                  هیچ لینکی از هدر، فوتر یا مقالات به این آدرس متصل نیست. برای خزش فوری توسط گوگل، روی دکمه زیر کلیک کنید.
                </p>
                <button
                  type="button"
                  @click="addQuickInboundLink(selectedNode)"
                  class="w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <AdminIcon name="link" class="w-3.5 h-3.5" />
                  <span>اتصال فوری این صفحه به فوتر و پیوندهای اصلی</span>
                </button>
              </div>

              <!-- Inbound Links List -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>پیوندهای ورودی (Inbound Links)</span>
                  </span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400">
                    {{ selectedNode.inlinks.length }} لینک ورودی
                  </span>
                </div>
                <div class="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1">
                  <div
                    v-for="(inlink, i) in selectedNode.inlinks"
                    :key="`in-${i}`"
                    @click="focusNodeByPath(inlink.fromPath)"
                    class="p-2 rounded-lg bg-zinc-900/80 hover:bg-white/5 border border-white/5 flex items-center justify-between text-[11px] cursor-pointer transition group"
                  >
                    <span class="font-mono text-zinc-300 group-hover:text-emerald-400" dir="ltr">{{ inlink.fromPath }}</span>
                    <span v-if="inlink.anchor" class="text-[10px] text-zinc-400 bg-black/40 px-1.5 py-0.5 rounded">{{ inlink.anchor }}</span>
                  </div>
                  <div v-if="selectedNode.inlinks.length === 0" class="text-center py-2 text-rose-400 text-xs font-bold">
                    هیچ لینک ورودی وجود ندارد!
                  </div>
                </div>
              </div>

              <!-- Outbound Links List -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>پیوندهای خروجی (Outbound Links)</span>
                  </span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400">
                    {{ selectedNode.outlinks.length }} لینک خروجی
                  </span>
                </div>
                <div class="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1">
                  <div
                    v-for="(outlink, i) in selectedNode.outlinks"
                    :key="`out-${i}`"
                    @click="focusNodeByPath(outlink.toPath)"
                    class="p-2 rounded-lg bg-zinc-900/80 hover:bg-white/5 border border-white/5 flex items-center justify-between text-[11px] cursor-pointer transition group"
                  >
                    <span class="font-mono text-zinc-300 group-hover:text-cyan-400 truncate max-w-[240px]" dir="ltr">{{ outlink.toPath }}</span>
                    <span v-if="outlink.isExternal" class="text-[9px] px-1 rounded bg-sky-500/20 text-sky-300">خارجی</span>
                  </div>
                </div>
              </div>

              <!-- SSR Googlebot Simulator -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <AdminIcon name="eye" class="w-3.5 h-3.5 text-emerald-400" />
                    <span>شبیه‌ساز متن SSR ربات گوگل</span>
                  </span>
                  <span class="text-[10px] font-mono text-emerald-400">
                    {{ selectedNode.characterCount }} حرف (خزش قطعی)
                  </span>
                </div>
                <div class="p-3 rounded-xl bg-black/60 border border-white/5 text-[11px] text-zinc-300 leading-relaxed font-sans max-h-28 overflow-y-auto custom-scrollbar">
                  {{ selectedNode.ssrSampleText || 'این آدرس پیوند خارجی است و محتوای HTML داخلی ندارد.' }}
                </div>
              </div>
            </div>

            <!-- Drawer Bottom Actions -->
            <div class="pt-4 border-t border-white/10 flex items-center gap-2">
              <NuxtLink
                :to="selectedNode.path"
                target="_blank"
                class="flex-1 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <AdminIcon name="link" class="w-3.5 h-3.5" />
                <span>مشاهده صفحه زنده در سایت</span>
              </NuxtLink>
            </div>
          </div>
        </transition>
      </div>

      <!-- SEO MATRIX TABLE VIEW -->
      <div v-show="graphMode === 'table'" class="p-4 overflow-x-auto custom-scrollbar">
        <table class="w-full text-right text-xs">
          <thead>
            <tr class="border-b border-white/10 text-zinc-400">
              <th class="py-3 px-3">نام و عنوان صفحه</th>
              <th class="py-3 px-3">مسیر (URL)</th>
              <th class="py-3 px-3">سیلو موضوعی</th>
              <th class="py-3 px-3 text-center">عمق کلیک</th>
              <th class="py-3 px-3 text-center">ورودی (Inbound)</th>
              <th class="py-3 px-3 text-center">خروجی (Outbound)</th>
              <th class="py-3 px-3 text-center">پیج‌رنک</th>
              <th class="py-3 px-3 text-center">وضعیت خزش</th>
              <th class="py-3 px-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
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
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-800 text-zinc-300">
                  {{ row.clusterName || 'عمومی' }}
                </span>
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold text-emerald-300">
                Level {{ row.depth }}
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold" :class="row.inlinksCount === 0 ? 'text-rose-400' : 'text-emerald-400'">
                {{ row.inlinksCount }}
              </td>
              <td class="py-3 px-3 text-center font-mono text-zinc-300">
                {{ row.outlinksCount }}
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold" :class="getPageRankColor(row.pageRankScore)">
                {{ row.pageRankScore }}
              </td>
              <td class="py-3 px-3 text-center font-bold text-[11px]">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px]"
                  :class="row.inlinksCount > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'"
                >
                  {{ row.inlinksCount > 0 ? 'شناسایی و خزش کامل' : 'نیاز به لینک ورودی' }}
                </span>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

interface StrategicPage {
  path: string
  title: string
  short: string
  clusterKey: string
  clusterName: string
  isClusterHub?: boolean
  depth: number
  chars: number
  text: string
  isExternal?: boolean
  isMultilingual?: boolean
}

interface GraphNode extends StrategicPage {
  id: string
  inlinksCount: number
  outlinksCount: number
  characterCount: number
  ssrSampleText: string
  pageRankScore: number
  isExpanded?: boolean
  clusterChildCount?: number
  inlinks: { fromPath: string; anchor?: string }[]
  outlinks: { toPath: string; isExternal?: boolean }[]
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
}

interface GraphEdge {
  source: GraphNode
  target: GraphNode
  isOrphan?: boolean
}

const graphMode = ref<'cluster' | 'depth' | 'table'>('cluster')
const activeFilter = ref<'all' | 'internal' | 'external' | 'orphans' | 'low' | 'multilingual'>('all')
const searchQuery = ref('')
const selectedNode = ref<GraphNode | null>(null)
const isScanning = ref(false)

// Pan & Zoom
const svgRef = ref<SVGSVGElement | null>(null)
const panX = ref(420)
const panY = ref(300)
const zoomScale = ref(0.9)
const isPanning = ref(false)
const startPanPos = ref({ x: 0, y: 0 })

// Dragging
let draggedNode: GraphNode | null = null

const filterOptions = [
  { id: 'all', label: 'همه پیوندها' },
  { id: 'internal', label: 'فقط صفحات داخلی' },
  { id: 'external', label: 'لینک‌های تبدیل خارجی' },
  { id: 'orphans', label: 'صفحات یتیم (۰ ورودی)' },
  { id: 'low', label: 'کم‌لینک (< ۳)' },
  { id: 'multilingual', label: 'چندزبانه (EN / AR)' }
]

// Strategic Master Page Dataset
const strategicDataset: StrategicPage[] = [
  // 1. Core Authority
  { path: '/', title: 'صفحه اصلی نجم', short: 'خانه نجم', clusterKey: 'core', clusterName: 'هسته اصلی', isClusterHub: true, depth: 0, chars: 3240, text: 'مجتمع چاپ و بسته‌بندی نجم؛ چاپ افست ۵ رنگ هایدلبرگ و جعبه‌سازی صنعتی با بالاترین استانداردهای چاپ در تهران.' },

  // 2. Packaging Silo
  { path: '/products/packaging', title: 'بسته‌بندی و جعبه‌سازی صنعتی', short: 'سیلو بسته‌بندی', clusterKey: 'packaging', clusterName: 'بسته‌بندی', isClusterHub: true, depth: 1, chars: 2900, text: 'انواع جعبه‌های دارویی، آرایشی، مواد غذایی و هاردباکس‌های مگنتی صادراتی.' },
  { path: '/products/packaging/boxes', title: 'جعبه مقوایی و هاردباکس لوکس', short: 'جعبه و هاردباکس', clusterKey: 'packaging', clusterName: 'بسته‌بندی', depth: 2, chars: 2400, text: 'تولید جعبه‌های لوکس با روکش‌های فانتزی و مقوای ایندربرد بهداشتی.' },
  { path: '/products/packaging/labels', title: 'لیبل رول و برچسب صنعتی', short: 'لیبل و برچسب', clusterKey: 'packaging', clusterName: 'بسته‌بندی', depth: 2, chars: 1900, text: 'چاپ انواع لیبل پشت چسب‌دار متالایز، صدفی و گلاسه با برش دقیق رول.' },
  { path: '/products/applications/luxury-packaging', title: 'بسته‌بندی لوکس صادراتی', short: 'جعبه لوکس', clusterKey: 'packaging', clusterName: 'بسته‌بندی', depth: 2, chars: 2500, text: 'هاردباکس‌های مگنتی کشویی و جعبه‌های هدیه ویژه برندهای بین‌المللی.' },
  { path: '/products/applications/shipping-cartons', title: 'کارتن‌های ۵ لایه پستی', short: 'کارتن پستی', clusterKey: 'packaging', clusterName: 'بسته‌بندی', depth: 2, chars: 1950, text: 'کارتن‌های لمینتی مقاوم در برابر رطوبت و ضربه برای لجستیک امن.' },

  // 3. Printing Silo
  { path: '/products/printing', title: 'چاپ تجاری و افست ورقی', short: 'سیلو چاپ افست', clusterKey: 'printing', clusterName: 'چاپ تجاری', isClusterHub: true, depth: 1, chars: 2750, text: 'چاپ افست کاتالوگ، بروشور، فولدر و سربرگ‌های سازمانی با بالاترین ثبات رنگ.' },
  { path: '/products', title: 'مرکز محصولات و نمونه‌ها', short: 'همه محصولات', clusterKey: 'printing', clusterName: 'چاپ تجاری', depth: 1, chars: 2200, text: 'بررسی دسته‌بندی‌های تخصصی جعبه‌های سخت، کارتن و اوراق اداری تجاری.' },
  { path: '/products/printing/catalogs', title: 'کاتالوگ و بروشور تبلیغاتی', short: 'کاتالوگ تبلیغاتی', clusterKey: 'printing', clusterName: 'چاپ تجاری', depth: 2, chars: 2100, text: 'کاتالوگ‌های صحافی چسب گرم PUR، منگنه لوپ و سیمی با پوشش سلفون مات و براق.' },
  { path: '/products/printing/letterhead', title: 'سربرگ و ست اداری سازمانی', short: 'ست اداری و پاکت', clusterKey: 'printing', clusterName: 'چاپ تجاری', depth: 2, chars: 1800, text: 'چاپ سربرگ، پاکت نامه و یادداشت‌های اداری روی کاغذهای تحریر و کتان.' },

  // 4. Industrial Services Silo
  { path: '/services', title: 'خدمات کامل چاپ و پس از چاپ', short: 'سیلو خدمات', clusterKey: 'services', clusterName: 'خدمات چاپ', isClusterHub: true, depth: 1, chars: 2600, text: 'زنجیره کامل خدمات چاپ، لیتوگرافی، سلفون‌کشی، طلاکوب و دایکات بوبست.' },
  { path: '/services/printing-and-packaging', title: 'چاپ افست ۵ رنگ هایدلبرگ', short: 'چاپ هایدلبرگ', clusterKey: 'services', clusterName: 'خدمات چاپ', depth: 2, chars: 2900, text: 'چاپ ۵ رنگ همزمان هایدلبرگ اسپید مستر با سیستم کنترل کیفیت طیف‌سنجی.' },
  { path: '/services/finishing-services', title: 'خدمات تکمیلی، طلاکوب و دایکات', short: 'طلاکوب و دایکات', clusterKey: 'services', clusterName: 'خدمات چاپ', depth: 2, chars: 2700, text: 'طلاکوب گرم، یووی سیلندری شابلونی، سلفون حرارتی و جعبه‌چسبانی اتوماتیک.' },
  { path: '/services/pre-press', title: 'پیش از چاپ و آماده‌سازی فایل', short: 'پیش از چاپ', clusterKey: 'services', clusterName: 'خدمات چاپ', depth: 2, chars: 2100, text: 'چک کردن رزولوشن و پروفایل‌های رنگی فایل‌های طراحی قبل از خروجی.' },
  { path: '/services/lithography-and-plates', title: 'لیتوگرافی و پلیت دیجیتال CTP', short: 'لیتوگرافی CTP', clusterKey: 'services', clusterName: 'خدمات چاپ', depth: 2, chars: 2450, text: 'تهیه زینک‌های حرارتی با دقت ۲۴۰۰ DPI با سیستم مستقیم پلیت‌ستر.' },

  // 5. Resources & Dielines Silo
  { path: '/resources', title: 'مرکز دانلود منابع و قالب‌های تیغ', short: 'سیلو منابع و تیغ', clusterKey: 'resources', clusterName: 'منابع و قالب', isClusterHub: true, depth: 1, chars: 2800, text: 'بانک قالب‌های خط تیغ برداری، راهنماهای طراحی و پروفایل‌های رنگی.' },
  { path: '/resources/dielines', title: 'دانلود خط تیغ و قالب‌های برداری', short: 'بانک خط تیغ', clusterKey: 'resources', clusterName: 'منابع و قالب', depth: 2, chars: 2300, text: 'دانلود رایگان فایل‌های AI و PDF انواع جعبه‌های مقوایی استاندارد.' },
  { path: '/resources/guides', title: 'راهنماهای فنی آماده‌سازی فایل', short: 'راهنماهای طراحی', clusterKey: 'resources', clusterName: 'منابع و قالب', depth: 2, chars: 2400, text: 'نکات کلیدی رزولوشن ۳۰۰ DPI، سیستم رنگی CMYK و حاشیه امن خط برش.' },
  { path: '/resources/template-tuck-end-box', title: 'قالب جعبه دارویی دردار', short: 'قالب دارویی', clusterKey: 'resources', clusterName: 'منابع و قالب', depth: 2, chars: 1750, text: 'فایل برداری آماده جعبه‌های دردار دارویی و بهداشتی.' },
  { path: '/resources/template-magnetic-rigid-box', title: 'قالب هاردباکس مگنتی لوکس', short: 'قالب هاردباکس', clusterKey: 'resources', clusterName: 'منابع و قالب', depth: 2, chars: 1800, text: 'ساختار استاندارد هاردباکس مگنتی کتابی همراه با لایه‌های روکش و مقوا.' },

  // 6. Content & Blog Silo
  { path: '/blog', title: 'وبلاگ تخصصی و دانشنامه چاپ', short: 'سیلو وبلاگ', clusterKey: 'content', clusterName: 'محتوا و وبلاگ', isClusterHub: true, depth: 1, chars: 2500, text: 'دانشنامه جامع متریال‌های چاپ، تفاوت گرماژهای مقوا و تکنیک‌های نوین.' },
  { path: '/blog/inboard-vs-greyboard-packaging', title: 'مقایسه ایندربرد و گری‌بورد', short: 'ایندربرد vs گری', clusterKey: 'content', clusterName: 'محتوا و وبلاگ', depth: 2, chars: 2300, text: 'تفاوت‌های ساختاری، مقاومت و استانداردهای بهداشتی مقواها در تولید جعبه.' },
  { path: '/blog/luxury-hardbox-finishing-guide', title: 'راهنمای افکت‌های لوکس هاردباکس', short: 'افکت هاردباکس', clusterKey: 'content', clusterName: 'محتوا و وبلاگ', depth: 2, chars: 2250, text: 'روش‌های ترکیب طلاکوب گرم با بافت‌دهی امباس و سلفون مخملی.' },
  { path: '/blog/offset-vs-digital-printing-guide', title: 'چاپ افست در برابر دیجیتال', short: 'افست vs دیجیتال', clusterKey: 'content', clusterName: 'محتوا و وبلاگ', depth: 2, chars: 2100, text: 'بررسی هزینه‌های تیراژ، سرعت تولید و کیفیت خروجی در چاپ‌های تجاری.' },
  { path: '/news', title: 'اخبار و رویدادهای مجتمع نجم', short: 'اخبار نجم', clusterKey: 'content', clusterName: 'محتوا و وبلاگ', depth: 1, chars: 2000, text: 'آخرین دستاوردها، نمایشگاه‌های بین‌المللی و به‌روزرسانی خطوط تولید نجم.' },
  { path: '/news/heidelberg-new-press-installation', title: 'نصب ماشین جدید هایدلبرگ', short: 'ماشین هایدلبرگ', clusterKey: 'content', clusterName: 'محتوا و وبلاگ', depth: 2, chars: 1900, text: 'راه‌اندازی خط جدید چاپ افست ورقی پرسرعت در کارخانه نجم.' },

  // 7. Trust & Company Silo
  { path: '/about', title: 'درباره مجتمع چاپ و بسته‌بندی نجم', short: 'درباره ما', clusterKey: 'company', clusterName: 'اعتماد و شرکت', isClusterHub: true, depth: 1, chars: 2400, text: 'بیش از دو دهه تجربه در طراحی ساختاری و تولید بسته‌بندی‌های صادراتی.' },
  { path: '/facilities', title: 'امکانات و خطوط تولید کارخانه', short: 'خطوط تولید', clusterKey: 'company', clusterName: 'اعتماد و شرکت', depth: 1, chars: 2840, text: 'تجهیزات و ماشین‌آلات مدرن چاپ افست هایدلبرگ، دایکات اتوماتیک بوبست و لیتوگرافی CTP.' },
  { path: '/history', title: 'تاریخچه و افتخارات نجم', short: 'افتخارات نجم', clusterKey: 'company', clusterName: 'اعتماد و شرکت', depth: 2, chars: 1820, text: 'روند توسعه و گواهینامه‌های بین‌المللی ایزو در صنعت چاپ و بسته‌بندی.' },
  { path: '/catalog', title: 'کاتالوگ جامع محصولات و هاردباکس', short: 'کاتالوگ جامع', clusterKey: 'company', clusterName: 'اعتماد و شرکت', depth: 1, chars: 2180, text: 'کاتالوگ جامع انواع جعبه‌های هاردباکس، ایندربرد و نمونه‌های چاپی مجتمع نجم.' },
  { path: '/faq', title: 'پرسش‌های متداول مشتریان', short: 'سوالات متداول', clusterKey: 'company', clusterName: 'اعتماد و شرکت', depth: 1, chars: 2600, text: 'پاسخ به سوالات حداقل تیراژ سفارش، زمان تحویل و استانداردهای طراحی قالب.' },
  { path: '/consultation', title: 'مشاوره فنی و نمونه‌سازی', short: 'مشاوره فنی', clusterKey: 'company', clusterName: 'اعتماد و شرکت', depth: 1, chars: 1950, text: 'خدمات ساخت ماکت فیزیکی رایگان و محاسبه گرماژ مهندسی بسته‌بندی.' },
  { path: '/contact', title: 'تماس با واحد فروش و کارخانه', short: 'تماس با ما', clusterKey: 'company', clusterName: 'اعتماد و شرکت', depth: 1, chars: 1650, text: 'خطوط مستقیم فروش و مشاوره سفارشات: ۰۲۱-۶۶۷۹۷۹۱۱ الی ۱۳ بزرگراه فتح.' },

  // 8. Multilingual Alternates
  { path: '/en', title: 'Najm Home (English)', short: 'Home (EN)', clusterKey: 'multilingual', clusterName: 'چندزبانه', isClusterHub: true, depth: 1, chars: 2800, text: 'Najm Printing & Packaging Complex - 5-Color Heidelberg sheetfed offset and rigid boxes.', isMultilingual: true },
  { path: '/en/catalog', title: 'Catalog (EN)', short: 'Catalog (EN)', clusterKey: 'multilingual', clusterName: 'چندزبانه', depth: 2, chars: 2100, text: 'Comprehensive packaging and offset print catalog.', isMultilingual: true },
  { path: '/ar', title: 'الرئيسية (العربية)', short: 'الرئيسية (AR)', clusterKey: 'multilingual', clusterName: 'چندزبانه', depth: 1, chars: 2750, text: 'مجمع نجم للطباعة والتغليف - طباعة أوفست ۵ ألوان هايدلبرغ وصناعة العلب الفاخرة.', isMultilingual: true },
  { path: '/ar/catalog', title: 'الكتالوج (العربية)', short: 'الكتالوج (AR)', clusterKey: 'multilingual', clusterName: 'چندزبانه', depth: 2, chars: 2050, text: 'الكتالوج الشامل لمنتجات التغليف والعلب الفاخرة.', isMultilingual: true },

  // 9. External Conversion Hubs
  { path: 'https://maps.app.goo.gl/z4fFFJ4UwzQSuiEDA', title: 'لوکیشن کارخانه در گوگل مپ', short: 'گوگل مپ', clusterKey: 'conversion', clusterName: 'تبدیل خارجی', depth: 2, chars: 0, text: '', isExternal: true },
  { path: 'tel:+982166797911', title: 'تماس مستقیم تلفنی', short: 'تلفن مستقیم', clusterKey: 'conversion', clusterName: 'تبدیل خارجی', depth: 2, chars: 0, text: '', isExternal: true },
  { path: 'https://wa.me/989903400074', title: 'گفتگو در واتس‌اپ', short: 'واتس‌اپ', clusterKey: 'conversion', clusterName: 'تبدیل خارجی', depth: 2, chars: 0, text: '', isExternal: true }
]

// State for active nodes & links
const allNodes = ref<GraphNode[]>([])
const allEdges = ref<GraphEdge[]>([])

// Expanded cluster state (by clusterKey)
const expandedClusters = ref<Record<string, boolean>>({
  core: true,
  packaging: true, // Default open the primary packaging cluster
  printing: false,
  services: false,
  resources: false,
  content: false,
  company: false,
  multilingual: false,
  conversion: false
})

function initializeGraphData() {
  const map = new Map<string, GraphNode>()

  // 1. Create nodes with initial calculated positions
  strategicDataset.forEach((p) => {
    const node: GraphNode = {
      ...p,
      id: p.path,
      inlinksCount: 0,
      outlinksCount: 0,
      characterCount: p.chars || 0,
      ssrSampleText: p.text || '',
      pageRankScore: 50,
      isExpanded: false,
      clusterChildCount: 0,
      inlinks: [],
      outlinks: [],
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      vx: 0,
      vy: 0
    }
    map.set(p.path, node)
  })

  // 2. Count children per cluster hub
  strategicDataset.forEach((p) => {
    if (!p.isClusterHub && p.clusterKey) {
      const hub = Array.from(map.values()).find((n) => n.clusterKey === p.clusterKey && n.isClusterHub)
      if (hub) {
        hub.clusterChildCount = (hub.clusterChildCount || 0) + 1
      }
    }
  })

  // 3. Establish authoritative semantic links
  const homeNode = map.get('/')
  const packagingHub = map.get('/products/packaging')
  const printingHub = map.get('/products/printing')
  const servicesHub = map.get('/services')
  const resourcesHub = map.get('/resources')
  const blogHub = map.get('/blog')
  const aboutHub = map.get('/about')

  // Homepage links to all primary hubs & company pages (Header + Footer)
  map.forEach((target, path) => {
    if (path !== '/' && homeNode) {
      homeNode.outlinks.push({ toPath: path, isExternal: target.isExternal })
      target.inlinks.push({ fromPath: '/', anchor: target.short })
    }
  })

  // Silo Hub outlinks to child pages
  map.forEach((target) => {
    if (!target.isClusterHub && target.clusterKey) {
      let hub: GraphNode | undefined
      if (target.clusterKey === 'packaging') hub = packagingHub
      else if (target.clusterKey === 'printing') hub = printingHub
      else if (target.clusterKey === 'services') hub = servicesHub
      else if (target.clusterKey === 'resources') hub = resourcesHub
      else if (target.clusterKey === 'content') hub = blogHub
      else if (target.clusterKey === 'company') hub = aboutHub

      if (hub && hub.path !== target.path) {
        hub.outlinks.push({ toPath: target.path })
        target.inlinks.push({ fromPath: hub.path, anchor: target.short })
      }
    }
  })

  // Cross-silo contextual linking (Packaging -> Dielines, Blog -> Products)
  const boxes = map.get('/products/packaging/boxes')
  const dielines = map.get('/resources/dielines')
  const blogInboard = map.get('/blog/inboard-vs-greyboard-packaging')
  const contact = map.get('/contact')
  const mapLink = map.get('https://maps.app.goo.gl/z4fFFJ4UwzQSuiEDA')
  const telLink = map.get('tel:+982166797911')

  if (boxes && dielines) {
    boxes.outlinks.push({ toPath: dielines.path })
    dielines.inlinks.push({ fromPath: boxes.path, anchor: 'دانلود خط تیغ جعبه' })
  }
  if (blogInboard && packagingHub) {
    blogInboard.outlinks.push({ toPath: packagingHub.path })
    packagingHub.inlinks.push({ fromPath: blogInboard.path, anchor: 'تولید جعبه بهداشتی' })
  }
  if (contact && mapLink && telLink) {
    contact.outlinks.push({ toPath: mapLink.path, isExternal: true })
    contact.outlinks.push({ toPath: telLink.path, isExternal: true })
    mapLink.inlinks.push({ fromPath: contact.path, anchor: 'لوکیشن کارخانه' })
    telLink.inlinks.push({ fromPath: contact.path, anchor: 'تلفن تماس' })
  }

  // 4. Compute Counts & Simulated PageRank Juice
  map.forEach((node) => {
    node.inlinksCount = node.inlinks.length
    node.outlinksCount = node.outlinks.length

    // Simulated PageRank (0 to 100) based on inlink weight and crawl depth
    if (node.path === '/') {
      node.pageRankScore = 100
    } else {
      const depthPenalty = node.depth === 1 ? 0.85 : 0.65
      const inlinkScore = Math.min(node.inlinksCount * 14, 80)
      node.pageRankScore = Math.round(inlinkScore * depthPenalty)
    }
  })

  allNodes.value = Array.from(map.values())

  // 5. Build edge connections
  const edgesList: GraphEdge[] = []
  allNodes.value.forEach((source) => {
    source.outlinks.forEach((out) => {
      const target = map.get(out.toPath)
      if (target) {
        edgesList.push({
          source,
          target,
          isOrphan: target.inlinksCount === 0 && !target.isExternal
        })
      }
    })
  })
  allEdges.value = edgesList

  // Update layout positions
  recalculateNodePositions()
}

// Layout Position Computations
function recalculateNodePositions() {
  const nodesList = allNodes.value
  const homeNode = nodesList.find((n) => n.path === '/')

  if (graphMode.value === 'depth') {
    // 3 Structured Vertical Columns: Level 0 -> Level 1 -> Level 2
    const level0 = nodesList.filter((n) => n.depth === 0)
    const level1 = nodesList.filter((n) => n.depth === 1)
    const level2 = nodesList.filter((n) => n.depth === 2)

    level0.forEach((n, i) => {
      n.targetX = 30
      n.targetY = 0
    })

    const l1Spacing = 480 / Math.max(level1.length, 1)
    level1.forEach((n, i) => {
      n.targetX = 370
      n.targetY = -230 + i * l1Spacing
    })

    const l2Spacing = 520 / Math.max(level2.length, 1)
    level2.forEach((n, i) => {
      n.targetX = 750
      n.targetY = -240 + i * l2Spacing
    })
  } else {
    // Silo / Cluster Radial Layout
    // Center: Homepage
    if (homeNode) {
      homeNode.targetX = 0
      homeNode.targetY = 0
    }

    // Cluster Hubs arranged in a balanced circle around home
    const clusterHubs = nodesList.filter((n) => n.isClusterHub && n.path !== '/')
    const hubCount = clusterHubs.length
    const hubRadius = 220

    clusterHubs.forEach((hub, i) => {
      const angle = (i / hubCount) * 2 * Math.PI - Math.PI / 2
      hub.targetX = Math.cos(angle) * hubRadius
      hub.targetY = Math.sin(angle) * hubRadius
      hub.isExpanded = !!expandedClusters.value[hub.clusterKey]

      // Sub-pages in this cluster arranged in a subtle arc around their hub
      const children = nodesList.filter((n) => n.clusterKey === hub.clusterKey && !n.isClusterHub)
      const childCount = children.length
      const childDist = 125

      children.forEach((child, j) => {
        const spread = Math.PI / 2.2
        const childAngle = angle - spread / 2 + (j / Math.max(childCount - 1, 1)) * spread
        child.targetX = hub.targetX + Math.cos(childAngle) * childDist
        child.targetY = hub.targetY + Math.sin(childAngle) * childDist
      })
    })
  }

  // Snap or smoothly interpolate to targets
  nodesList.forEach((n) => {
    if (n.x === 0 && n.y === 0) {
      n.x = n.targetX
      n.y = n.targetY
    }
  })
}

// Active Visible Nodes according to Cluster Expansion and Active Filter
const activeVisibleNodes = computed(() => {
  return allNodes.value.filter((node) => {
    // 1. Check Filter
    if (activeFilter.value === 'internal' && node.isExternal) return false
    if (activeFilter.value === 'external' && !node.isExternal) return false
    if (activeFilter.value === 'orphans' && (node.inlinksCount > 0 || node.isExternal)) return false
    if (activeFilter.value === 'low' && (node.inlinksCount >= 3 || node.isExternal)) return false
    if (activeFilter.value === 'multilingual' && !node.isMultilingual) return false

    // 2. Check Search
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const match = node.title.toLowerCase().includes(q) || node.path.toLowerCase().includes(q) || node.short.toLowerCase().includes(q)
      if (!match) return false
    }

    // 3. In Cluster Mode: if node is a child page, only show if its cluster is expanded!
    if (graphMode.value === 'cluster' && !searchQuery.value.trim()) {
      if (!node.isClusterHub && node.path !== '/') {
        if (!expandedClusters.value[node.clusterKey]) {
          return false
        }
      }
    }

    return true
  })
})

const activeVisibleEdges = computed(() => {
  const visibleIds = new Set(activeVisibleNodes.value.map((n) => n.id))
  return allEdges.value.filter((e) => visibleIds.has(e.source.id) && visibleIds.has(e.target.id))
})

const filteredTableNodes = computed(() => {
  return allNodes.value.filter((node) => {
    if (activeFilter.value === 'internal' && node.isExternal) return false
    if (activeFilter.value === 'external' && !node.isExternal) return false
    if (activeFilter.value === 'orphans' && (node.inlinksCount > 0 || node.isExternal)) return false
    if (activeFilter.value === 'low' && (node.inlinksCount >= 3 || node.isExternal)) return false
    if (activeFilter.value === 'multilingual' && !node.isMultilingual) return false

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      return node.title.toLowerCase().includes(q) || node.path.toLowerCase().includes(q) || node.short.toLowerCase().includes(q)
    }
    return true
  })
})

// Stats calculations
const stats = computed(() => {
  const total = allNodes.value.length
  let inlinkSum = 0
  let orphans = 0
  let hubs = 0

  allNodes.value.forEach((n) => {
    inlinkSum += n.inlinksCount
    if (n.inlinksCount === 0 && !n.isExternal) orphans++
    if (n.inlinksCount >= 8) hubs++
  })

  return {
    totalUrls: total,
    internalLinksCount: inlinkSum,
    orphanCount: orphans,
    authorityHubsCount: hubs
  }
})

// Appearance Helpers
function getNodeColor(node: GraphNode): string {
  if (node.path === '/') return '#10B981' // Emerald
  if (node.isExternal) return '#38BDF8' // Sky
  if (node.isMultilingual) return '#A855F7' // Purple

  if (node.clusterKey === 'packaging') return '#10B981' // Emerald
  if (node.clusterKey === 'printing') return '#06B6D4' // Cyan
  if (node.clusterKey === 'services') return '#8B5CF6' // Violet
  if (node.clusterKey === 'resources') return '#F59E0B' // Amber
  if (node.clusterKey === 'content') return '#F43F5E' // Rose
  if (node.clusterKey === 'company') return '#64748B' // Slate

  return '#10B981'
}

function getNodeStroke(node: GraphNode): string {
  if (selectedNode.value && selectedNode.value.id === node.id) return '#ffffff'
  if (node.inlinksCount === 0 && !node.isExternal) return '#FDA4AF'
  return 'rgba(255,255,255,0.3)'
}

function getNodeRadius(node: GraphNode): number {
  if (node.path === '/') return 18
  if (node.isClusterHub) return 14
  if (node.isExternal) return 9
  return 10
}

function getNodeGlyph(node: GraphNode): string {
  if (node.path === '/') return '★'
  if (node.isExternal) return '↗'
  if (node.isMultilingual) return '🌐'
  if (node.isClusterHub) return node.isExpanded ? '−' : '+'
  return '●'
}

function getNodeLabelWidth(node: GraphNode): number {
  const len = (node.shortLabel || '').length
  const extra = node.isClusterHub && !node.isExpanded ? 24 : 0
  return Math.max(len * 8 + 18 + extra, 54)
}

function getMarkerForEdge(edge: GraphEdge): string {
  if (edge.source.clusterKey === 'printing') return 'url(#arrow-cyan)'
  if (edge.source.clusterKey === 'resources' || edge.source.clusterKey === 'content') return 'url(#arrow-amber)'
  return 'url(#arrow-emerald)'
}

function isEdgeHighlighted(edge: GraphEdge): boolean {
  if (!selectedNode.value) return false
  return edge.source.id === selectedNode.value.id || edge.target.id === selectedNode.value.id
}

function getPageRankColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 50) return 'text-cyan-400'
  if (score >= 30) return 'text-amber-400'
  return 'text-rose-400'
}

// User Interactions
function onNodeClick(node: GraphNode) {
  selectedNode.value = node

  // In cluster mode, toggle cluster expansion when clicking a hub!
  if (graphMode.value === 'cluster' && node.isClusterHub && node.path !== '/') {
    toggleClusterNode(node)
  }
}

function toggleClusterNode(node: GraphNode) {
  const nextState = !expandedClusters.value[node.clusterKey]
  expandedClusters.value[node.clusterKey] = nextState
  node.isExpanded = nextState
  recalculateNodePositions()
}

function expandAllClusters() {
  Object.keys(expandedClusters.value).forEach((k) => {
    expandedClusters.value[k] = true
  })
  allNodes.value.forEach((n) => {
    if (n.isClusterHub) n.isExpanded = true
  })
  recalculateNodePositions()
}

function collapseAllClusters() {
  Object.keys(expandedClusters.value).forEach((k) => {
    expandedClusters.value[k] = false
  })
  expandedClusters.value.core = true
  allNodes.value.forEach((n) => {
    if (n.isClusterHub) n.isExpanded = false
  })
  recalculateNodePositions()
}

function openNodeDrawerFromTable(node: GraphNode) {
  selectedNode.value = node
  graphMode.value = 'cluster'
  // Expand its cluster so it is visible
  if (node.clusterKey) {
    expandedClusters.value[node.clusterKey] = true
  }
  recalculateNodePositions()
  focusNodeByPath(node.path)
}

function focusNodeByPath(path: string) {
  const node = allNodes.value.find((n) => n.path === path)
  if (node) {
    selectedNode.value = node
    if (node.clusterKey) {
      expandedClusters.value[node.clusterKey] = true
    }
    recalculateNodePositions()
    panX.value = 420 - node.x * zoomScale.value
    panY.value = 300 - node.y * zoomScale.value
  }
}

function addQuickInboundLink(node: GraphNode) {
  const homeNode = allNodes.value.find((n) => n.path === '/')
  if (homeNode) {
    homeNode.outlinks.push({ toPath: node.path })
    node.inlinks.push({ fromPath: '/', anchor: node.shortLabel })
    node.inlinksCount = node.inlinks.length
    node.pageRankScore = 65
  }
  window.dispatchEvent(
    new CustomEvent('toast', {
      detail: { type: 'success', text: `صفحه ${node.shortLabel} با موفقیت به پیوندهای اصلی متصل شد.` }
    })
  )
}

function rescanGraph() {
  isScanning.value = true
  setTimeout(() => {
    initializeGraphData()
    isScanning.value = false
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { type: 'success', text: 'ساختار سیلوها و عمق خزش گوگل مجدداً ارزیابی شد.' }
      })
    )
  }, 600)
}

// Smooth Motion Interpolation Frame Loop
let animId: number | null = null
function startAnimationLoop() {
  const step = () => {
    const list = allNodes.value
    for (let i = 0; i < list.length; i++) {
      const n = list[i]
      if (n === draggedNode) continue

      // Smoothly ease position toward target
      const dx = n.targetX - n.x
      const dy = n.targetY - n.y
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        n.x += dx * 0.15
        n.y += dy * 0.15
      }
    }
    animId = requestAnimationFrame(step)
  }
  animId = requestAnimationFrame(step)
}

// PIXEL-PERFECT CURSOR & TOUCH TRACKING (Eliminates Offset)
function getSvgLocalCoordinates(clientX: number, clientY: number): { x: number; y: number } {
  if (!svgRef.value) return { x: 0, y: 0 }
  const rect = svgRef.value.getBoundingClientRect()
  return {
    x: (clientX - rect.left - panX.value) / zoomScale.value,
    y: (clientY - rect.top - panY.value) / zoomScale.value
  }
}

function startPan(e: MouseEvent) {
  if (e.button !== 0 || !svgRef.value) return
  isPanning.value = true
  const rect = svgRef.value.getBoundingClientRect()
  startPanPos.value = {
    x: e.clientX - rect.left - panX.value,
    y: e.clientY - rect.top - panY.value
  }
}

function startTouchPan(e: TouchEvent) {
  if (!svgRef.value || e.touches.length === 0) return
  isPanning.value = true
  const touch = e.touches[0]
  const rect = svgRef.value.getBoundingClientRect()
  startPanPos.value = {
    x: touch.clientX - rect.left - panX.value,
    y: touch.clientY - rect.top - panY.value
  }
}

function onPointerMove(e: MouseEvent | TouchEvent) {
  const pointer = 'touches' in e ? e.touches[0] : (e as MouseEvent)
  if (!pointer || !svgRef.value) return
  const rect = svgRef.value.getBoundingClientRect()

  if (draggedNode) {
    const pt = getSvgLocalCoordinates(pointer.clientX, pointer.clientY)
    draggedNode.x = pt.x
    draggedNode.y = pt.y
    draggedNode.targetX = pt.x
    draggedNode.targetY = pt.y
    return
  }

  if (isPanning.value) {
    panX.value = pointer.clientX - rect.left - startPanPos.value.x
    panY.value = pointer.clientY - rect.top - startPanPos.value.y
  }
}

function endPan() {
  isPanning.value = false
  draggedNode = null
}

function startNodeDrag(e: MouseEvent, node: GraphNode) {
  if (e.button !== 0) return
  e.stopPropagation()
  draggedNode = node
}

function startNodeTouchDrag(e: TouchEvent, node: GraphNode) {
  e.stopPropagation()
  draggedNode = node
}

function onWheel(e: WheelEvent) {
  const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92
  const newScale = Math.min(Math.max(zoomScale.value * zoomFactor, 0.45), 2.2)
  zoomScale.value = newScale
}

function zoomIn() {
  zoomScale.value = Math.min(zoomScale.value * 1.15, 2.2)
}

function zoomOut() {
  zoomScale.value = Math.max(zoomScale.value * 0.85, 0.45)
}

function resetView() {
  panX.value = 420
  panY.value = 300
  zoomScale.value = 0.9
}

onMounted(() => {
  initializeGraphData()
  startAnimationLoop()
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
/* Ensure Persian typography inside SVG matches the site's IRANSansX font family cleanly */
.graph-persian-font {
  font-family: 'IRANSansX-d4', 'IRANSansX', sans-serif !important;
  letter-spacing: -0.01em;
}

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
