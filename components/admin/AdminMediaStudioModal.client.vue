<!-- components/admin/AdminMediaStudioModal.client.vue -->
<template>
  <teleport to="body">
    <transition name="admin-modal">
      <div
        v-if="state.mediaStudioOpen"
        class="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none font-sans"
        @click.self="close"
        @keydown.esc="close"
      >
        <div class="bg-zinc-950 text-white rounded-3xl border border-white/15 shadow-2xl w-full max-w-6xl h-[92vh] max-h-[880px] flex flex-col overflow-hidden text-xs">
          <!-- Modal Header -->
          <div class="h-14 px-4 sm:px-6 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-najmgreen flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                <AdminIcon name="sparkles" class="w-4 h-4" />
              </div>
              <div class="truncate">
                <div class="flex items-center gap-2">
                  <h2 class="font-bold text-sm text-white font-d4">استودیو ویرایش و مدیریت فایل</h2>
                  <span
                    v-if="state.activeMediaPath"
                    class="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 truncate max-w-[200px]"
                    :title="state.activeMediaPath"
                  >
                    {{ state.activeMediaPath }}
                  </span>
                </div>
                <p class="text-[11px] text-zinc-400 font-mono">
                  {{ imageMeta.format.toUpperCase() }} &middot;
                  <template v-if="mediaType === 'image'">{{ imageMeta.width }}×{{ imageMeta.height }} px &middot;</template>
                  {{ formatBytes(imageMeta.size || 0) }}
                </p>
              </div>
            </div>

            <!-- Navigation Tabs -->
            <div class="hidden sm:flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 font-d4">
              <button
                v-for="t in availableTabs"
                :key="t.id"
                type="button"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                :class="activeTab === t.id
                  ? 'bg-najmgreen text-white shadow-xs font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'"
                @click="activeTab = t.id"
              >
                <AdminIcon :name="t.icon" class="w-3.5 h-3.5" />
                <span>{{ t.label }}</span>
              </button>
            </div>

            <!-- Close Button -->
            <button
              type="button"
              class="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
              title="بستن (Esc)"
              @click="close"
            >
              <AdminIcon name="x" class="w-4 h-4" />
            </button>
          </div>

          <!-- Mobile Tab Selector -->
          <div class="sm:hidden flex items-center gap-1 overflow-x-auto p-2 bg-zinc-900 border-b border-white/10 custom-scrollbar font-d4">
            <button
              v-for="t in availableTabs"
              :key="t.id"
              type="button"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
              :class="activeTab === t.id ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400'"
              @click="activeTab = t.id"
            >
              {{ t.label }}
            </button>
          </div>

          <!-- Main Studio Body -->
          <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
            <!-- Workspace Area -->
            <div
              class="flex-1 bg-zinc-900/60 relative flex items-center justify-center p-4 overflow-hidden select-none"
              @wheel.prevent="onWheelZoom"
            >
              <!-- Loading -->
              <div v-if="isLoadingMedia" class="flex flex-col items-center gap-2 text-zinc-400">
                <AdminIcon name="spinner" class="w-8 h-8 animate-spin text-emerald-400" />
                <span class="text-xs">در حال بارگذاری فایل...</span>
              </div>

              <!-- 1. IMAGE CANVAS PREVIEW -->
              <div
                v-show="!isLoadingMedia && mediaType === 'image'"
                class="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-75"
                :style="{ transform: `scale(${zoomLevel})` }"
              >
                <canvas
                  ref="previewCanvas"
                  class="max-w-full max-h-[55vh] object-contain rounded-xl shadow-2xl border border-white/10"
                ></canvas>

                <!-- Crop Bounding Box -->
                <div
                  v-if="activeTab === 'crop' && cropEnabled"
                  class="absolute inset-0 pointer-events-none border-2 border-emerald-400/90 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
                  :style="cropOverlayStyle"
                >
                  <div class="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div class="border-r border-b border-emerald-400/40"></div>
                    <div class="border-r border-b border-emerald-400/40"></div>
                    <div class="border-b border-emerald-400/40"></div>
                    <div class="border-r border-b border-emerald-400/40"></div>
                    <div class="border-r border-b border-emerald-400/40"></div>
                    <div class="border-b border-emerald-400/40"></div>
                    <div class="border-r border-emerald-400/40"></div>
                    <div class="border-r border-emerald-400/40"></div>
                    <div></div>
                  </div>
                </div>
              </div>

              <!-- 2. VIDEO PLAYER PREVIEW -->
              <div v-if="!isLoadingMedia && mediaType === 'video'" class="w-full max-w-2xl flex flex-col items-center gap-3">
                <video
                  :src="currentMediaUrl"
                  controls
                  class="w-full max-h-[55vh] rounded-2xl border border-white/15 bg-black shadow-2xl"
                ></video>
                <span class="text-xs text-zinc-400 font-mono">فرمت ویدیو: {{ imageMeta.format.toUpperCase() }}</span>
              </div>

              <!-- 3. AUDIO PLAYER PREVIEW -->
              <div v-if="!isLoadingMedia && mediaType === 'audio'" class="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-white/15 flex flex-col items-center gap-4 text-center">
                <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <AdminIcon name="sparkles" class="w-8 h-8" />
                </div>
                <audio :src="currentMediaUrl" controls class="w-full"></audio>
                <span class="text-xs font-mono text-zinc-400">{{ currentMediaUrl }}</span>
              </div>

              <!-- 4. DOCUMENT PREVIEW (PDF, PSD, AI) -->
              <div v-if="!isLoadingMedia && mediaType === 'document'" class="p-8 rounded-3xl bg-zinc-900 border border-white/15 flex flex-col items-center gap-3 text-center">
                <div class="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl font-bold font-mono">
                  {{ imageMeta.format.toUpperCase() }}
                </div>
                <div class="text-sm font-bold text-white font-d4">فایل سورس / سند گرافیکی</div>
                <a
                  :href="currentMediaUrl"
                  target="_blank"
                  download
                  class="px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer font-d4 flex items-center gap-2"
                >
                  <AdminIcon name="download" class="w-4 h-4" />
                  <span>دانلود فایل ({{ imageMeta.format.toUpperCase() }})</span>
                </a>
              </div>

              <!-- Active Changes Tracker Strip -->
              <div
                v-if="hasAdjustments && mediaType === 'image'"
                class="absolute top-4 inset-x-0 mx-auto max-w-md flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/90 border border-emerald-500/30 backdrop-blur-md text-[10px] font-mono text-zinc-300 shadow-xl"
              >
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-emerald-400 font-bold font-d4">تغییرات فعال:</span>
                <span v-if="adj.brightness !== 100">نور: {{ adj.brightness }}%</span>
                <span v-if="adj.contrast !== 100">کنتراست: {{ adj.contrast }}%</span>
                <span v-if="adj.saturation !== 100">رنگ: {{ adj.saturation }}%</span>
                <span v-if="cropEnabled">برش: {{ selectedRatio }}</span>
              </div>

              <!-- Zoom Controls Bar (Bottom Left for Images) -->
              <div v-if="mediaType === 'image'" class="absolute bottom-4 left-4 flex items-center gap-1 bg-zinc-950/90 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                <button
                  type="button"
                  class="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors flex items-center justify-center cursor-pointer"
                  @click="zoomLevel = Math.max(0.25, Number((zoomLevel - 0.25).toFixed(2)))"
                  title="کوچک‌نمایی (-)"
                >
                  -
                </button>
                <span class="px-2 text-[11px] text-zinc-300 font-mono font-bold">{{ Math.round(zoomLevel * 100) }}%</span>
                <button
                  type="button"
                  class="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors flex items-center justify-center cursor-pointer"
                  @click="zoomLevel = Math.min(3.0, Number((zoomLevel + 0.25).toFixed(2)))"
                  title="بزرگ‌نمایی (+)"
                >
                  +
                </button>
                <button
                  type="button"
                  class="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-semibold transition-colors cursor-pointer"
                  @click="zoomLevel = 1.0"
                  title="اندازه طبیعی"
                >
                  100%
                </button>
              </div>

              <!-- Live Comparison Helper (Bottom Right for Images) -->
              <div v-if="mediaType === 'image'" class="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 text-zinc-300 border border-white/10 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer font-d4"
                  @mousedown="showOriginal = true"
                  @mouseup="showOriginal = false"
                  @mouseleave="showOriginal = false"
                  title="کلیک کنید و نگه دارید تا نسخه اصلی تصویر را ببینید"
                >
                  <AdminIcon name="eye" class="w-3.5 h-3.5 text-amber-400" />
                  <span>مشاهده نسخه اصلی</span>
                </button>
              </div>
            </div>

            <!-- Right Sidebar: Tool Settings Panel -->
            <div class="w-full md:w-80 bg-zinc-950 border-t md:border-t-0 md:border-l border-white/10 flex flex-col overflow-hidden">
              <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <!-- TAB 1: LIGHTING & COLOR ADJUSTMENTS -->
                <div v-if="activeTab === 'adjust' && mediaType === 'image'" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white font-d4">تنظیم نور، کنتراست و رنگ</h3>
                    <button
                      type="button"
                      class="text-[10px] text-zinc-400 hover:text-amber-400 underline cursor-pointer"
                      @click="resetAdjustments"
                    >
                      بازنشانی تنظیمات
                    </button>
                  </div>

                  <!-- Sliders -->
                  <div class="space-y-3">
                    <div>
                      <div class="flex justify-between text-[11px] font-medium text-zinc-300 mb-1">
                        <span>روشنایی (Brightness)</span>
                        <span class="font-mono text-emerald-400">{{ adj.brightness }}%</span>
                      </div>
                      <input
                        v-model.number="adj.brightness"
                        type="range"
                        min="20"
                        max="180"
                        class="w-full accent-emerald-500 cursor-pointer"
                        @input="renderLive"
                      />
                    </div>

                    <div>
                      <div class="flex justify-between text-[11px] font-medium text-zinc-300 mb-1">
                        <span>کنتراست و شفافیت (Contrast)</span>
                        <span class="font-mono text-emerald-400">{{ adj.contrast }}%</span>
                      </div>
                      <input
                        v-model.number="adj.contrast"
                        type="range"
                        min="20"
                        max="180"
                        class="w-full accent-emerald-500 cursor-pointer"
                        @input="renderLive"
                      />
                    </div>

                    <div>
                      <div class="flex justify-between text-[11px] font-medium text-zinc-300 mb-1">
                        <span>اشباع رنگ (Saturation)</span>
                        <span class="font-mono text-emerald-400">{{ adj.saturation }}%</span>
                      </div>
                      <input
                        v-model.number="adj.saturation"
                        type="range"
                        min="0"
                        max="200"
                        class="w-full accent-emerald-500 cursor-pointer"
                        @input="renderLive"
                      />
                    </div>

                    <div>
                      <div class="flex justify-between text-[11px] font-medium text-zinc-300 mb-1">
                        <span>تنظیم حرارت رنگ (Warmth/Hue)</span>
                        <span class="font-mono text-emerald-400">{{ adj.hueRotate }}°</span>
                      </div>
                      <input
                        v-model.number="adj.hueRotate"
                        type="range"
                        min="0"
                        max="360"
                        class="w-full accent-emerald-500 cursor-pointer"
                        @input="renderLive"
                      />
                    </div>

                    <div>
                      <div class="flex justify-between text-[11px] font-medium text-zinc-300 mb-1">
                        <span>تاری و نرمی لبه‌ها (Blur)</span>
                        <span class="font-mono text-emerald-400">{{ adj.blur }}px</span>
                      </div>
                      <input
                        v-model.number="adj.blur"
                        type="range"
                        min="0"
                        max="12"
                        step="0.5"
                        class="w-full accent-emerald-500 cursor-pointer"
                        @input="renderLive"
                      />
                    </div>
                  </div>

                  <!-- Presets -->
                  <div class="pt-2 border-t border-white/10 space-y-2">
                    <span class="text-[11px] font-bold text-zinc-400 font-d4">فیلترهای آماده چاپی:</span>
                    <div class="grid grid-cols-3 gap-1.5">
                      <button
                        v-for="p in presets"
                        :key="p.name"
                        type="button"
                        class="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-medium border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer text-center font-d4"
                        @click="applyPreset(p)"
                      >
                        {{ p.nameFa || p.name }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- TAB 2: CROP & GEOMETRY -->
                <div v-else-if="activeTab === 'crop' && mediaType === 'image'" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white font-d4">برش، ابعاد و چرخش تصویر</h3>
                    <button
                      type="button"
                      class="text-[10px] text-zinc-400 hover:text-amber-400 underline cursor-pointer"
                      @click="resetCrop"
                    >
                      بازنشانی برش
                    </button>
                  </div>

                  <!-- Aspect Ratio Presets -->
                  <div class="space-y-2">
                    <span class="text-[11px] font-bold text-zinc-400 font-d4">نسبت تصویر (Aspect Ratio):</span>
                    <div class="grid grid-cols-3 gap-1.5">
                      <button
                        v-for="ratio in aspectRatios"
                        :key="ratio.label"
                        type="button"
                        class="px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center font-d4"
                        :class="selectedRatio === ratio.value
                          ? 'bg-najmgreen text-white font-bold shadow-xs'
                          : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-white/5'"
                        @click="setAspectRatio(ratio.value)"
                      >
                        {{ ratio.labelFa || ratio.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Rotation & Flips -->
                  <div class="pt-3 border-t border-white/10 space-y-2">
                    <span class="text-[11px] font-bold text-zinc-400 font-d4">چرخش و تقارن:</span>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        class="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                        @click="rotate(90)"
                      >
                        <AdminIcon name="rotate" class="w-3.5 h-3.5" />
                        <span>چرخش ۹۰°</span>
                      </button>
                      <button
                        type="button"
                        class="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                        @click="rotate(-90)"
                      >
                        <AdminIcon name="rotate" class="w-3.5 h-3.5 -scale-x-100" />
                        <span>چرخش -۹۰°</span>
                      </button>
                      <button
                        type="button"
                        class="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                        :class="{ 'border-emerald-500 text-emerald-300': adj.flipH }"
                        @click="adj.flipH = !adj.flipH; renderLive()"
                      >
                        <AdminIcon name="flip-horizontal" class="w-3.5 h-3.5" />
                        <span>آینه‌ای افقی</span>
                      </button>
                      <button
                        type="button"
                        class="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                        :class="{ 'border-emerald-500 text-emerald-300': adj.flipV }"
                        @click="adj.flipV = !adj.flipV; renderLive()"
                      >
                        <AdminIcon name="flip-vertical" class="w-3.5 h-3.5" />
                        <span>آینه‌ای عمودی</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- TAB 3: COMPRESS & FORMAT -->
                <div v-else-if="activeTab === 'compress' && mediaType === 'image'" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white font-d4">فشرده‌سازی و تبدیل به WebP</h3>
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                      {{ targetFormat.toUpperCase() }}
                    </span>
                  </div>

                  <!-- Format Selector -->
                  <div class="space-y-2">
                    <span class="text-[11px] font-semibold text-zinc-400">فرمت خروجی:</span>
                    <div class="grid grid-cols-4 gap-1.5">
                      <button
                        v-for="fmt in ['webp', 'avif', 'png', 'jpeg']"
                        :key="fmt"
                        type="button"
                        class="px-2 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer text-center font-mono"
                        :class="targetFormat === fmt
                          ? 'bg-najmgreen text-white shadow-xs'
                          : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-white/5'"
                        @click="targetFormat = fmt as any; calculateTargetSize()"
                      >
                        {{ fmt }}
                      </button>
                    </div>
                  </div>

                  <!-- Quality Slider -->
                  <div>
                    <div class="flex justify-between text-[11px] font-medium text-zinc-300 mb-1">
                      <span>کیفیت فشرده‌سازی</span>
                      <span class="font-mono text-emerald-400">{{ Math.round(targetQuality * 100) }}%</span>
                    </div>
                    <input
                      v-model.number="targetQuality"
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      class="w-full accent-emerald-500 cursor-pointer"
                      @change="calculateTargetSize"
                    />
                  </div>

                  <!-- Stats -->
                  <div class="p-3 rounded-2xl bg-zinc-900 border border-white/10 space-y-1.5 text-xs">
                    <div class="flex items-center justify-between">
                      <span class="text-zinc-400">حجم اولیه:</span>
                      <span class="font-mono text-zinc-200">{{ formatBytes(imageMeta.size || 250000) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-zinc-400">حجم بهینه‌شده:</span>
                      <span class="font-mono text-emerald-400 font-bold">{{ formatBytes(estimatedSize) }}</span>
                    </div>
                    <div v-if="savingsPercent > 0" class="pt-1 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span class="text-zinc-400">صرفه‌جویی در سرعت لود:</span>
                      <span class="text-emerald-400 font-bold">-{{ savingsPercent }}%</span>
                    </div>
                  </div>
                </div>

                <!-- TAB 4: UPLOAD & REPLACE -->
                <div v-else-if="activeTab === 'upload'" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white font-d4">آپلود و جایگزینی فایل جدید</h3>
                  </div>

                  <div
                    class="border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                    :class="isDraggingFile ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/15 bg-zinc-900/50 hover:border-white/30 hover:bg-zinc-900'"
                    @dragover.prevent="isDraggingFile = true"
                    @dragleave.prevent="isDraggingFile = false"
                    @drop.prevent="onFileDrop"
                    @click="triggerFileInput"
                  >
                    <input
                      ref="fileInputRef"
                      type="file"
                      class="hidden"
                      accept="*/*"
                      @change="onFileInputChange"
                    />
                    <div class="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <AdminIcon name="upload" class="w-5 h-5" />
                    </div>
                    <span class="font-semibold text-xs text-zinc-200 font-d4">
                      فایل را به اینجا بکشید یا برای انتخاب کلیک کنید
                    </span>
                    <span class="text-[10px] text-zinc-500 font-mono">
                      PNG, JPG, WEBP, AVIF, SVG, MP4, MP3, PDF, PSD, AI
                    </span>
                  </div>

                  <div v-if="isUploading" class="space-y-1.5 p-3 bg-zinc-900 rounded-2xl border border-white/10">
                    <div class="flex justify-between text-[11px] font-semibold text-zinc-300">
                      <span>در حال ارسال فایل...</span>
                      <span class="font-mono text-emerald-400">{{ uploadProgress }}%</span>
                    </div>
                    <div class="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-emerald-500 transition-all duration-150 rounded-full"
                        :style="{ width: `${uploadProgress}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- TAB 5: GALLERY -->
                <div v-else-if="activeTab === 'gallery'" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white font-d4">گالری فایل‌های سایت</h3>
                    <button
                      type="button"
                      class="text-zinc-400 hover:text-white cursor-pointer"
                      @click="fetchGalleryItems"
                    >
                      <AdminIcon name="rotate" class="w-3.5 h-3.5" :class="{ 'animate-spin': isFetchingGallery }" />
                    </button>
                  </div>

                  <!-- Category filter chips -->
                  <div class="flex items-center gap-1 overflow-x-auto p-1 bg-zinc-900 rounded-xl border border-white/5 custom-scrollbar text-[11px]">
                    <button
                      v-for="cat in galleryCategories"
                      :key="cat.id"
                      type="button"
                      class="px-2.5 py-1 rounded-lg font-semibold shrink-0 cursor-pointer font-d4"
                      :class="galleryCategory === cat.id ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400 hover:text-white'"
                      @click="galleryCategory = cat.id"
                    >
                      {{ cat.label }}
                    </button>
                  </div>

                  <div class="max-h-64 overflow-y-auto grid grid-cols-3 gap-2 custom-scrollbar">
                    <div
                      v-for="item in filteredGalleryItems"
                      :key="item.url"
                      class="group relative aspect-square rounded-xl bg-zinc-900 border border-white/10 overflow-hidden cursor-pointer hover:border-emerald-500/60 transition-all flex items-center justify-center p-1"
                      @click="loadFromGallery(item)"
                    >
                      <img
                        v-if="item.category === 'image' || item.category === 'vector'"
                        :src="item.url"
                        :alt="item.filename"
                        class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div v-else class="flex flex-col items-center justify-center gap-1 text-zinc-400">
                        <span class="font-mono text-[10px] font-bold uppercase text-emerald-400">{{ item.format }}</span>
                        <span class="text-[9px] truncate max-w-[60px]">{{ item.filename }}</span>
                      </div>

                      <span class="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-zinc-300 p-0.5 truncate text-center font-mono">
                        {{ item.filename }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sidebar Footer -->
              <div class="p-4 border-t border-white/10 bg-zinc-950 flex items-center justify-between gap-2">
                <button
                  type="button"
                  class="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                  @click="close"
                >
                  انصراف
                </button>

                <button
                  type="button"
                  class="flex-1 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer font-d4 disabled:opacity-50"
                  :disabled="isApplying"
                  @click="applyChanges"
                >
                  <AdminIcon
                    :name="isApplying ? 'spinner' : 'check'"
                    class="w-4 h-4"
                    :class="{ 'animate-spin': isApplying }"
                  />
                  <span>{{ isApplying ? 'در حال ذخیره...' : 'ذخیره در پیش‌نویس سایت' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  adminEditState as state,
  closeMediaStudio,
  setMediaDraftValue
} from '@/store/adminEditStore'
import { useAdminMedia, type Adjustments, type CropRect } from '@/composables/useAdminMedia'
import AdminIcon from '~/components/admin/AdminIcon.vue'

const {
  loadImage,
  getImageMetadata,
  renderAdjustments,
  compressCanvas,
  uploadMedia,
  formatBytes
} = useAdminMedia()

const activeTab = ref<'adjust' | 'crop' | 'compress' | 'upload' | 'gallery'>('adjust')
const previewCanvas = ref<HTMLCanvasElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const isLoadingMedia = ref(false)
const isApplying = ref(false)
const isUploading = ref(false)
const isDraggingFile = ref(false)
const isFetchingGallery = ref(false)
const uploadProgress = ref(0)
const zoomLevel = ref(1.0)
const showOriginal = ref(false)

const originalImage = ref<HTMLImageElement | null>(null)
const currentMediaUrl = ref('')

const imageMeta = reactive({
  format: 'PNG',
  width: 0,
  height: 0,
  size: 0
})

const mediaType = computed(() => {
  const f = imageMeta.format.toLowerCase()
  if (['mp4', 'webm', 'ogg', 'mov'].includes(f)) return 'video'
  if (['mp3', 'wav', 'm4a'].includes(f)) return 'audio'
  if (['pdf', 'psd', 'ai'].includes(f)) return 'document'
  return 'image' // png, jpg, webp, avif, svg, gif
})

const availableTabs = computed(() => {
  if (mediaType.value !== 'image') {
    return [
      { id: 'upload', icon: 'upload', label: 'جایگزینی و آپلود' },
      { id: 'gallery', icon: 'photo', label: 'گالری فایل‌ها' }
    ]
  }
  return [
    { id: 'adjust', icon: 'sparkles', label: 'نور و رنگ' },
    { id: 'crop', icon: 'crop', label: 'برش و ابعاد' },
    { id: 'compress', icon: 'compress', label: 'کاهش حجم' },
    { id: 'upload', icon: 'upload', label: 'آپلود عکس' },
    { id: 'gallery', icon: 'photo', label: 'گالری' }
  ]
})

const adj = reactive<Adjustments>({
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 0,
  hueRotate: 0,
  blur: 0,
  rotation: 0,
  flipH: false,
  flipV: false
})

const cropEnabled = ref(false)
const selectedRatio = ref('free')
const cropRect = reactive<CropRect>({ x: 0, y: 0, width: 0, height: 0 })

const targetFormat = ref<'webp' | 'avif' | 'png' | 'jpeg'>('webp')
const targetQuality = ref(0.85)
const targetMaxDim = ref(0)
const estimatedSize = ref(120000)

const galleryCategory = ref('all')
const galleryItems = ref<any[]>([])

const galleryCategories = [
  { id: 'all', label: 'همه فایل‌ها' },
  { id: 'image', label: 'عکس‌ها' },
  { id: 'video', label: 'ویدیوها' },
  { id: 'document', label: 'اسناد PDF/PSD/AI' },
  { id: 'vector', label: 'وکتور و SVG' }
]

const aspectRatios = [
  { label: 'Free', labelFa: 'آزاد', value: 'free' },
  { label: '1:1', labelFa: '۱:۱ مربع', value: '1:1' },
  { label: '4:3', labelFa: '۴:۳ استاندارد', value: '4:3' },
  { label: '16:9', labelFa: '۱۶:۹ واید', value: '16:9' },
  { label: '3:2', labelFa: '۳:۲ عکاسی', value: '3:2' }
]

const presets = [
  { name: 'Vibrant', nameFa: 'شاداب و درخشان', adj: { brightness: 105, contrast: 115, saturation: 125, exposure: 5, hueRotate: 0, blur: 0 } },
  { name: 'Warm', nameFa: 'گرم و طلایی', adj: { brightness: 102, contrast: 108, saturation: 110, exposure: 0, hueRotate: 15, blur: 0 } },
  { name: 'Clean Offset', nameFa: 'افست صنعتی', adj: { brightness: 100, contrast: 120, saturation: 105, exposure: 0, hueRotate: 0, blur: 0 } }
]

const hasAdjustments = computed(() => {
  return adj.brightness !== 100 || adj.contrast !== 100 || adj.saturation !== 100 || adj.hueRotate !== 0 || cropEnabled.value
})

const savingsPercent = computed(() => {
  const orig = imageMeta.size || 250000
  if (!estimatedSize.value || orig <= 0) return 0
  const saved = Math.round(((orig - estimatedSize.value) / orig) * 100)
  return Math.max(0, saved)
})

const cropOverlayStyle = computed(() => {
  if (!previewCanvas.value || !cropEnabled.value) return {}
  const cw = previewCanvas.value.clientWidth
  const ch = previewCanvas.value.clientHeight
  return {
    width: `${cw}px`,
    height: `${ch}px`
  }
})

const filteredGalleryItems = computed(() => {
  if (galleryCategory.value === 'all') return galleryItems.value
  return galleryItems.value.filter(i => i.category === galleryCategory.value)
})

function onWheelZoom(e: WheelEvent) {
  if (mediaType.value !== 'image') return
  const delta = e.deltaY < 0 ? 0.15 : -0.15
  zoomLevel.value = Math.max(0.25, Math.min(3.0, Number((zoomLevel.value + delta).toFixed(2))))
}

function resetAdjustments() {
  adj.brightness = 100
  adj.contrast = 100
  adj.saturation = 100
  adj.exposure = 0
  adj.hueRotate = 0
  adj.blur = 0
  renderLive()
}

function applyPreset(p: any) {
  Object.assign(adj, p.adj)
  renderLive()
}

function setAspectRatio(ratio: string) {
  selectedRatio.value = ratio
  cropEnabled.value = ratio !== 'free'
  renderLive()
}

function resetCrop() {
  selectedRatio.value = 'free'
  cropEnabled.value = false
  renderLive()
}

function rotate(deg: number) {
  adj.rotation = (adj.rotation + deg) % 360
  renderLive()
}

async function renderLive() {
  if (!previewCanvas.value || !originalImage.value || mediaType.value !== 'image') return
  if (showOriginal.value) {
    previewCanvas.value.width = originalImage.value.naturalWidth || 600
    previewCanvas.value.height = originalImage.value.naturalHeight || 600
    const ctx = previewCanvas.value.getContext('2d')
    if (ctx) {
      ctx.drawImage(originalImage.value, 0, 0)
    }
    return
  }

  const rendered = renderAdjustments(originalImage.value, adj, cropEnabled.value ? cropRect : null)
  if (rendered && previewCanvas.value) {
    previewCanvas.value.width = rendered.width
    previewCanvas.value.height = rendered.height
    const ctx = previewCanvas.value.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, rendered.width, rendered.height)
      ctx.drawImage(rendered, 0, 0)
    }
  }
}

function calculateTargetSize() {
  if (!previewCanvas.value || mediaType.value !== 'image') return
  compressCanvas(previewCanvas.value, targetFormat.value, targetQuality.value, targetMaxDim.value).then(res => {
    estimatedSize.value = res.size
  }).catch(() => {})
}

async function applyChanges() {
  isApplying.value = true
  try {
    let finalUrl = currentMediaUrl.value

    if (mediaType.value === 'image' && previewCanvas.value) {
      const res = await compressCanvas(previewCanvas.value, targetFormat.value, targetQuality.value, targetMaxDim.value)
      const file = new File([res.blob], `optimized-${Date.now()}.${targetFormat.value}`, { type: res.blob.type })
      const uploadRes = await uploadMedia(file)
      finalUrl = uploadRes.url || res.url
    }

    if (state.activeMediaPath) {
      setMediaDraftValue(state.activeMediaPath, state.language || 'fa', finalUrl)
    }

    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', text: 'فایل جدید با موفقیت در پیش‌نویس سایت ذخیره شد.' }
    }))
    close()
  } catch (err: any) {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'error', text: 'خطا در اعمال تغییرات.' }
    }))
  } finally {
    isApplying.value = false
  }
}

function close() {
  closeMediaStudio()
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onFileInputChange(e: any) {
  const file = e.target?.files?.[0]
  if (file) handleFile(file)
}

function onFileDrop(e: DragEvent) {
  isDraggingFile.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

async function handleFile(file: File) {
  isUploading.value = true
  uploadProgress.value = 20
  try {
    const res = await uploadMedia(file, (p) => { uploadProgress.value = p })
    if (res.url) {
      currentMediaUrl.value = res.url
      await loadActiveMedia(res.url)
      activeTab.value = mediaType.value === 'image' ? 'adjust' : 'upload'
    }
  } catch (err) {
  } finally {
    isUploading.value = false
  }
}

async function fetchGalleryItems() {
  isFetchingGallery.value = true
  try {
    const res: any = await $fetch('/api/admin/media')
    galleryItems.value = res?.items || []
  } catch (err) {
  } finally {
    isFetchingGallery.value = false
  }
}

function loadFromGallery(item: any) {
  currentMediaUrl.value = item.url
  loadActiveMedia(item.url)
  activeTab.value = item.category === 'image' ? 'adjust' : 'upload'
}

async function loadActiveMedia(url: string) {
  if (!url) return
  isLoadingMedia.value = true
  try {
    const clean = url.split('?')[0].toLowerCase()
    const ext = clean.split('.').pop() || 'png'
    imageMeta.format = ext.toUpperCase()

    if (['mp4', 'webm', 'ogg', 'mov', 'mp3', 'wav', 'm4a', 'pdf', 'psd', 'ai'].includes(ext)) {
      isLoadingMedia.value = false
      activeTab.value = 'upload'
      return
    }

    const img = await loadImage(url)
    originalImage.value = img
    const meta = await getImageMetadata(url)
    imageMeta.width = meta.width || img.naturalWidth || 600
    imageMeta.height = meta.height || img.naturalHeight || 600
    imageMeta.size = meta.size || 0

    cropRect.x = 0
    cropRect.y = 0
    cropRect.width = imageMeta.width
    cropRect.height = imageMeta.height

    // Reset adjustments for fresh image edit session
    adj.brightness = 100
    adj.contrast = 100
    adj.saturation = 100
    adj.exposure = 0
    adj.hueRotate = 0
    adj.blur = 0
    adj.rotation = 0
    adj.flipH = false
    adj.flipV = false
    cropEnabled.value = false
    selectedRatio.value = 'free'
    zoomLevel.value = 1.0

    isLoadingMedia.value = false
    await nextTick()
    await renderLive()
    calculateTargetSize()
  } catch (err) {
    console.error('[AdminMediaStudio] Error loading image:', err)
    isLoadingMedia.value = false
  }
}

// Watch both modal open state and active media URLs
watch(
  () => [state.mediaStudioOpen, state.activeMediaInitialUrl, state.activeMediaUrl],
  async ([isOpen, initialUrl, activeUrl]) => {
    if (isOpen) {
      const url = (initialUrl || activeUrl) as string
      if (url) {
        currentMediaUrl.value = url
        await nextTick()
        await loadActiveMedia(url)
      }
    }
  },
  { immediate: true }
)

watch(() => showOriginal.value, () => {
  renderLive()
})

onMounted(async () => {
  const url = state.activeMediaInitialUrl || state.activeMediaUrl
  if (state.mediaStudioOpen && url) {
    currentMediaUrl.value = url
    await nextTick()
    await loadActiveMedia(url)
  }

  fetchGalleryItems()
})
</script>

<style scoped>
.admin-modal-enter-active,
.admin-modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.admin-modal-enter-from,
.admin-modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
