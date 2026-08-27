<!-- components/admin/AdminMediaStudioModal.client.vue -->
<template>
  <teleport to="body">
    <transition name="admin-modal">
      <div
        v-if="state.mediaStudioOpen"
        class="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none font-sans"
        @click.self="close"
      >
        <div class="bg-zinc-950 text-white rounded-3xl border border-white/15 shadow-2xl w-full max-w-6xl h-[90vh] max-h-[850px] flex flex-col overflow-hidden text-xs">
          <!-- Modal Header -->
          <div class="h-14 px-5 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <AdminIcon name="sparkles" class="w-4 h-4" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="font-bold text-sm text-white">Media Studio & Asset Manager</h2>
                  <span
                    v-if="state.activeMediaPath"
                    class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30 truncate max-w-[200px]"
                    :title="state.activeMediaPath"
                  >
                    {{ state.activeMediaPath }}
                  </span>
                </div>
                <p class="text-[11px] text-zinc-400">
                  {{ imageMeta.format.toUpperCase() }} &middot; {{ imageMeta.width }}×{{ imageMeta.height }} &middot; {{ formatBytes(imageMeta.size || 0) }}
                </p>
              </div>
            </div>

            <!-- Navigation Tabs -->
            <div class="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                v-for="t in tabs"
                :key="t.id"
                type="button"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                :class="activeTab === t.id
                  ? 'bg-zinc-800 text-white shadow-xs border border-white/10'
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
              title="Close (Esc)"
              @click="close"
            >
              <AdminIcon name="close" class="w-4 h-4" />
            </button>
          </div>

          <!-- Main Studio Body -->
          <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
            <!-- Left / Center: Interactive Live Canvas Workspace -->
            <div class="flex-1 bg-zinc-900/60 relative flex items-center justify-center p-4 overflow-hidden select-none">
              <!-- Loading Indicator -->
              <div v-if="isLoadingImage" class="flex flex-col items-center gap-3 text-zinc-400">
                <AdminIcon name="spinner" class="w-8 h-8 animate-spin text-emerald-400" />
                <span>Loading media asset...</span>
              </div>

              <!-- Main Interactive Image Canvas -->
              <div
                v-show="!isLoadingImage"
                class="relative max-w-full max-h-full flex items-center justify-center"
              >
                <canvas
                  ref="previewCanvas"
                  class="max-w-full max-h-[52vh] object-contain rounded-xl shadow-2xl border border-white/10 transition-transform duration-75"
                  :style="{
                    transform: `scale(${zoomLevel})`
                  }"
                ></canvas>

                <!-- Interactive Crop Bounding Box Overlay (in Crop tab) -->
                <div
                  v-if="activeTab === 'crop' && cropEnabled"
                  class="absolute inset-0 pointer-events-none border-2 border-emerald-400/80 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
                  :style="cropOverlayStyle"
                >
                  <!-- Rule of Thirds Grid Lines -->
                  <div class="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div class="border-r border-b border-emerald-400/30"></div>
                    <div class="border-r border-b border-emerald-400/30"></div>
                    <div class="border-b border-emerald-400/30"></div>
                    <div class="border-r border-b border-emerald-400/30"></div>
                    <div class="border-r border-b border-emerald-400/30"></div>
                    <div class="border-b border-emerald-400/30"></div>
                    <div class="border-r border-emerald-400/30"></div>
                    <div class="border-r border-emerald-400/30"></div>
                    <div></div>
                  </div>
                </div>
              </div>

              <!-- Zoom & Compare Controls Bar (Bottom Left) -->
              <div class="absolute bottom-4 left-4 flex items-center gap-1.5 bg-zinc-950/90 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                <button
                  type="button"
                  class="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono transition-colors"
                  @click="zoomLevel = Math.max(0.5, zoomLevel - 0.25)"
                  title="Zoom Out"
                >
                  -
                </button>
                <span class="px-1.5 text-[11px] text-zinc-400 font-mono">{{ Math.round(zoomLevel * 100) }}%</span>
                <button
                  type="button"
                  class="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono transition-colors"
                  @click="zoomLevel = Math.min(2.5, zoomLevel + 0.25)"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  class="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] transition-colors"
                  @click="zoomLevel = 1.0"
                  title="Reset Zoom"
                >
                  Reset
                </button>
              </div>

              <!-- Live Comparison Helper (Bottom Right) -->
              <div class="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 text-zinc-300 border border-white/10 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  @mousedown="showOriginal = true"
                  @mouseup="showOriginal = false"
                  @mouseleave="showOriginal = false"
                  title="Hold to see original unedited version"
                >
                  <AdminIcon name="eye" class="w-3.5 h-3.5" />
                  <span>Hold for Original</span>
                </button>
              </div>
            </div>

            <!-- Right Sidebar: Tool Settings Panel -->
            <div class="w-full md:w-84 bg-zinc-950 border-t md:border-t-0 md:border-l border-white/10 flex flex-col overflow-hidden">
              <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <!-- TAB 1: LIGHTING & ADJUSTMENTS -->
                <div v-if="activeTab === 'adjust'" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white uppercase tracking-wider">Lighting & Color Grading</h3>
                    <button
                      type="button"
                      class="text-[11px] text-zinc-400 hover:text-amber-300 underline cursor-pointer"
                      @click="resetAdjustments"
                    >
                      Reset All
                    </button>
                  </div>

                  <!-- Sliders -->
                  <div class="space-y-3">
                    <div>
                      <div class="flex justify-between text-[11px] font-medium text-zinc-300 mb-1">
                        <span>Brightness</span>
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
                        <span>Contrast</span>
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
                        <span>Saturation</span>
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
                        <span>Exposure / Highlights</span>
                        <span class="font-mono text-emerald-400">{{ adj.exposure > 0 ? `+${adj.exposure}` : adj.exposure }}%</span>
                      </div>
                      <input
                        v-model.number="adj.exposure"
                        type="range"
                        min="-60"
                        max="60"
                        class="w-full accent-emerald-500 cursor-pointer"
                        @input="renderLive"
                      />
                    </div>

                    <div>
                      <div class="flex justify-between text-[11px] font-medium text-zinc-300 mb-1">
                        <span>Hue / Temperature</span>
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
                        <span>Blur (Softness)</span>
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

                  <!-- Quick Presets -->
                  <div class="pt-2 border-t border-white/10">
                    <span class="text-[11px] font-semibold text-zinc-400 block mb-2">Preset Filters:</span>
                    <div class="grid grid-cols-3 gap-1.5">
                      <button
                        v-for="p in presets"
                        :key="p.name"
                        type="button"
                        class="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-medium border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer text-center"
                        @click="applyPreset(p)"
                      >
                        {{ p.name }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- TAB 2: CROP & GEOMETRY -->
                <div v-else-if="activeTab === 'crop'" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white uppercase tracking-wider">Crop & Geometry</h3>
                    <button
                      type="button"
                      class="text-[11px] text-zinc-400 hover:text-amber-300 underline cursor-pointer"
                      @click="resetCrop"
                    >
                      Reset Crop
                    </button>
                  </div>

                  <!-- Aspect Ratio Presets -->
                  <div class="space-y-2">
                    <span class="text-[11px] font-semibold text-zinc-400">Aspect Ratio:</span>
                    <div class="grid grid-cols-3 gap-1.5">
                      <button
                        v-for="ratio in aspectRatios"
                        :key="ratio.label"
                        type="button"
                        class="px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center"
                        :class="selectedRatio === ratio.value
                          ? 'bg-emerald-600 text-white border border-emerald-400 shadow-xs'
                          : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-white/5'"
                        @click="setAspectRatio(ratio.value)"
                      >
                        {{ ratio.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Rotation & Flips -->
                  <div class="pt-3 border-t border-white/10 space-y-2">
                    <span class="text-[11px] font-semibold text-zinc-400">Transform & Flip:</span>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        class="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                        @click="rotate(90)"
                      >
                        <AdminIcon name="rotate" class="w-3.5 h-3.5" />
                        <span>Rotate 90°</span>
                      </button>
                      <button
                        type="button"
                        class="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                        @click="rotate(-90)"
                      >
                        <AdminIcon name="rotate" class="w-3.5 h-3.5 -scale-x-100" />
                        <span>Rotate -90°</span>
                      </button>
                      <button
                        type="button"
                        class="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                        :class="{ 'border-emerald-500 text-emerald-300': adj.flipH }"
                        @click="adj.flipH = !adj.flipH; renderLive()"
                      >
                        <AdminIcon name="flip-horizontal" class="w-3.5 h-3.5" />
                        <span>Flip Horizontal</span>
                      </button>
                      <button
                        type="button"
                        class="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                        :class="{ 'border-emerald-500 text-emerald-300': adj.flipV }"
                        @click="adj.flipV = !adj.flipV; renderLive()"
                      >
                        <AdminIcon name="flip-vertical" class="w-3.5 h-3.5" />
                        <span>Flip Vertical</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- TAB 3: COMPRESS & FORMAT CONVERT -->
                <div v-else-if="activeTab === 'compress'" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white uppercase tracking-wider">Compression & Formats</h3>
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Target: {{ targetFormat.toUpperCase() }}
                    </span>
                  </div>

                  <!-- Format Selector -->
                  <div class="space-y-2">
                    <span class="text-[11px] font-semibold text-zinc-400">Target Image Format:</span>
                    <div class="grid grid-cols-4 gap-1.5">
                      <button
                        v-for="fmt in ['webp', 'avif', 'png', 'jpeg']"
                        :key="fmt"
                        type="button"
                        class="px-2 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer text-center"
                        :class="targetFormat === fmt
                          ? 'bg-emerald-600 text-white border border-emerald-400 shadow-xs'
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
                      <span>Compression Quality</span>
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

                  <!-- Max Dimension Resizing -->
                  <div class="space-y-2">
                    <span class="text-[11px] font-semibold text-zinc-400">Max Dimension Constraint:</span>
                    <div class="grid grid-cols-4 gap-1.5 text-[11px]">
                      <button
                        v-for="dim in [0, 1920, 1200, 800]"
                        :key="dim"
                        type="button"
                        class="py-1.5 rounded-lg border text-center transition-colors cursor-pointer"
                        :class="targetMaxDim === dim ? 'bg-zinc-700 text-white border-white/20' : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'"
                        @click="targetMaxDim = dim; calculateTargetSize()"
                      >
                        {{ dim === 0 ? 'Original' : `${dim}px` }}
                      </button>
                    </div>
                  </div>

                  <!-- Compression Stats Card -->
                  <div class="p-3 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-zinc-400">Original Size:</span>
                      <span class="font-mono text-zinc-200">{{ formatBytes(imageMeta.size || 250000) }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-zinc-400">Estimated Output:</span>
                      <span class="font-mono text-emerald-400 font-bold">{{ formatBytes(estimatedSize) }}</span>
                    </div>
                    <div v-if="savingsPercent > 0" class="pt-1 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span class="text-zinc-400">Bandwidth Saved:</span>
                      <span class="text-emerald-400 font-bold">-{{ savingsPercent }}%</span>
                    </div>
                  </div>
                </div>

                <!-- TAB 4: UPLOAD & DROPZONE -->
                <div v-else-if="activeTab === 'upload'" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white uppercase tracking-wider">Upload New Asset</h3>
                  </div>

                  <!-- Dropzone Area -->
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
                      accept="image/*,.webp,.avif,.svg,.gif,.png,.jpg,.jpeg,.pdf,.psd,.ai"
                      @change="onFileInputChange"
                    />
                    <div class="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <AdminIcon name="upload" class="w-5 h-5" />
                    </div>
                    <span class="font-semibold text-xs text-zinc-200">
                      Drag & Drop file here or Click to browse
                    </span>
                    <span class="text-[10px] text-zinc-500">
                      Supports PNG, JPG, WEBP, AVIF, GIF, SVG, PSD, AI, PDF
                    </span>
                  </div>

                  <!-- Upload Progress Bar -->
                  <div v-if="isUploading" class="space-y-1.5 p-3 bg-zinc-900 rounded-2xl border border-white/10">
                    <div class="flex justify-between text-[11px] font-semibold text-zinc-300">
                      <span>Uploading & Processing...</span>
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

                <!-- TAB 5: POCKETBASE GALLERY -->
                <div v-else-if="activeTab === 'gallery'" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-white uppercase tracking-wider">Media Gallery</h3>
                    <button
                      type="button"
                      class="text-zinc-400 hover:text-white"
                      @click="fetchGalleryItems"
                    >
                      <AdminIcon name="rotate" class="w-3.5 h-3.5" :class="{ 'animate-spin': isFetchingGallery }" />
                    </button>
                  </div>

                  <!-- Search input -->
                  <div class="relative">
                    <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2" />
                    <input
                      v-model="gallerySearch"
                      type="text"
                      placeholder="Search gallery files..."
                      class="w-full bg-zinc-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <!-- Gallery Grid -->
                  <div class="max-h-64 overflow-y-auto grid grid-cols-3 gap-2 custom-scrollbar">
                    <div
                      v-for="item in filteredGalleryItems"
                      :key="item.id"
                      class="group relative aspect-square rounded-xl bg-zinc-900 border border-white/10 overflow-hidden cursor-pointer hover:border-emerald-500/60 transition-all"
                      @click="loadFromGallery(item)"
                    >
                      <img
                        :src="item.url"
                        :alt="item.filename"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <span class="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-zinc-300 p-1 truncate text-center">
                        {{ item.filename }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- TAB 6: HISTORY & REVERT -->
                <div v-else-if="activeTab === 'history'" class="space-y-3">
                  <h3 class="text-xs font-bold text-white uppercase tracking-wider">Version Snapshots</h3>
                  <div class="p-3 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-semibold text-emerald-400 flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Original Baseline
                      </span>
                      <button
                        type="button"
                        class="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[10px] font-bold border border-rose-500/40 cursor-pointer"
                        @click="handleRevertToOriginal"
                      >
                        Revert to This
                      </button>
                    </div>
                    <p class="text-[10px] text-zinc-400 font-mono break-all">
                      {{ originalBaselineUrl }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Sidebar Footer: Apply & Save Actions -->
              <div class="p-4 border-t border-white/10 bg-zinc-950 flex items-center justify-between gap-2">
                <button
                  type="button"
                  class="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                  @click="close"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  class="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  :disabled="isApplying"
                  @click="applyChanges"
                >
                  <AdminIcon
                    :name="isApplying ? 'spinner' : 'check'"
                    class="w-4 h-4"
                    :class="{ 'animate-spin': isApplying }"
                  />
                  <span>{{ isApplying ? 'Exporting...' : 'Apply to Page Draft' }}</span>
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
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  adminEditState as state,
  closeMediaStudio,
  setMediaDraftValue,
  revertPath
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

const activeTab = ref<'adjust' | 'crop' | 'compress' | 'upload' | 'gallery' | 'history'>('adjust')
const previewCanvas = ref<HTMLCanvasElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const isLoadingImage = ref(true)
const isApplying = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const isDraggingFile = ref(false)
const isFetchingGallery = ref(false)
const showOriginal = ref(false)
const zoomLevel = ref(1.0)

let loadedImage: HTMLImageElement | null = null
let originalImageSrc = ''
const originalBaselineUrl = ref('')

const imageMeta = reactive({
  width: 0,
  height: 0,
  format: 'img',
  size: 0
})

// Tab specifications
const tabs = [
  { id: 'adjust', label: 'Lighting', icon: 'sparkles' },
  { id: 'crop', label: 'Crop & Rotate', icon: 'crop' },
  { id: 'compress', label: 'Compress', icon: 'sliders' },
  { id: 'upload', label: 'Upload', icon: 'upload' },
  { id: 'gallery', label: 'Gallery', icon: 'photo' },
  { id: 'history', label: 'History', icon: 'history' }
] as const

// Adjustments state
const adj = reactive<Adjustments>({
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 0,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  rotation: 0,
  flipH: false,
  flipV: false
})

// Preset Filter Definitions
const presets = [
  { name: 'Original', b: 100, c: 100, s: 100, g: 0, sep: 0, exp: 0 },
  { name: 'Vibrant', b: 105, c: 115, s: 135, g: 0, sep: 0, exp: 5 },
  { name: 'Dramatic B&W', b: 110, c: 140, s: 0, g: 100, sep: 0, exp: 10 },
  { name: 'Warm Vintage', b: 102, c: 108, s: 110, g: 0, sep: 25, exp: 5 },
  { name: 'Cool Minimal', b: 98, c: 110, s: 85, g: 0, sep: 0, exp: -5 },
  { name: 'High Contrast', b: 100, c: 130, s: 110, g: 0, sep: 0, exp: 0 }
]

// Crop & Geometry state
const cropEnabled = ref(false)
const selectedRatio = ref<number | null>(null)
const cropRect = reactive<CropRect>({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  unit: 'percent'
})

const aspectRatios = [
  { label: 'Freeform', value: null },
  { label: '1:1 Square', value: 1 },
  { label: '16:9 Wide', value: 16 / 9 },
  { label: '4:3 Standard', value: 4 / 3 },
  { label: '3:2 Classic', value: 3 / 2 },
  { label: '9:16 Story', value: 9 / 16 }
]

const cropOverlayStyle = computed(() => {
  return {
    top: `${cropRect.y}%`,
    left: `${cropRect.x}%`,
    width: `${cropRect.width}%`,
    height: `${cropRect.height}%`
  }
})

// Compression State
const targetFormat = ref<'webp' | 'avif' | 'png' | 'jpeg'>('webp')
const targetQuality = ref(0.82)
const targetMaxDim = ref(0)
const estimatedSize = ref(120000)

const savingsPercent = computed(() => {
  if (!imageMeta.size || !estimatedSize.value) return 0
  const diff = imageMeta.size - estimatedSize.value
  return Math.max(0, Math.round((diff / imageMeta.size) * 100))
})

// Gallery items
const galleryItems = ref<any[]>([])
const gallerySearch = ref('')

const filteredGalleryItems = computed(() => {
  const q = gallerySearch.value.trim().toLowerCase()
  if (!q) return galleryItems.value
  return galleryItems.value.filter(i => (i.filename || '').toLowerCase().includes(q))
})

/** Load and initialize target image on open */
async function initializeStudio() {
  const url = state.activeMediaInitialUrl
  if (!url) return

  isLoadingImage.value = true
  originalImageSrc = url
  originalBaselineUrl.value = url

  try {
    const meta = await getImageMetadata(url)
    imageMeta.width = meta.width
    imageMeta.height = meta.height
    imageMeta.format = meta.format || 'webp'
    imageMeta.size = meta.size || 250000

    loadedImage = await loadImage(url)
    renderLive()
    calculateTargetSize()
  } catch (err: any) {
    console.error('Failed to initialize media in studio:', err)
  } finally {
    isLoadingImage.value = false
  }
}

/** Render adjustments live to the canvas */
function renderLive() {
  if (!loadedImage || !previewCanvas.value) return

  const canvas = previewCanvas.value
  const activeImg = loadedImage

  // Check if user is holding original comparison toggle
  if (showOriginal.value) {
    const defaultAdj: Adjustments = {
      brightness: 100, contrast: 100, saturation: 100, exposure: 0,
      hueRotate: 0, blur: 0, grayscale: 0, sepia: 0, invert: 0,
      rotation: 0, flipH: false, flipV: false
    }
    const rendered = renderAdjustments(activeImg, defaultAdj, null)
    copyCanvas(rendered, canvas)
    return
  }

  const activeCrop = (activeTab.value === 'crop' && cropEnabled.value) ? cropRect : null
  const rendered = renderAdjustments(activeImg, adj, activeCrop)
  copyCanvas(rendered, canvas)
}

function copyCanvas(src: HTMLCanvasElement, dest: HTMLCanvasElement) {
  dest.width = src.width
  dest.height = src.height
  const ctx = dest.getContext('2d')!
  ctx.clearRect(0, 0, dest.width, dest.height)
  ctx.drawImage(src, 0, 0)
}

/** Calculate target compression size preview */
async function calculateTargetSize() {
  if (!loadedImage) return
  const tempCanvas = renderAdjustments(loadedImage, adj, cropEnabled.value ? cropRect : null, targetMaxDim.value || undefined)
  try {
    const res = await compressCanvas(tempCanvas, targetFormat.value, targetQuality.value)
    estimatedSize.value = res.size
  } catch {}
}

/** Rotate image in 90-degree steps */
function rotate(deg: number) {
  adj.rotation = (adj.rotation + deg + 360) % 360
  renderLive()
}

/** Set aspect ratio for cropping */
function setAspectRatio(ratio: number | null) {
  selectedRatio.value = ratio
  cropEnabled.value = true

  if (!ratio) {
    cropRect.x = 0
    cropRect.y = 0
    cropRect.width = 100
    cropRect.height = 100
  } else {
    // Center a crop box of the requested aspect ratio
    const currentAspect = (imageMeta.width || 1) / (imageMeta.height || 1)
    if (ratio > currentAspect) {
      // Wider than current
      const h = Math.round((currentAspect / ratio) * 100)
      cropRect.width = 100
      cropRect.height = h
      cropRect.x = 0
      cropRect.y = Math.round((100 - h) / 2)
    } else {
      // Taller than current
      const w = Math.round((ratio / currentAspect) * 100)
      cropRect.width = w
      cropRect.height = 100
      cropRect.x = Math.round((100 - w) / 2)
      cropRect.y = 0
    }
  }
  renderLive()
}

function resetCrop() {
  cropEnabled.value = false
  selectedRatio.value = null
  cropRect.x = 0
  cropRect.y = 0
  cropRect.width = 100
  cropRect.height = 100
  renderLive()
}

function applyPreset(p: any) {
  adj.brightness = p.b
  adj.contrast = p.c
  adj.saturation = p.s
  adj.grayscale = p.g || 0
  adj.sepia = p.sep || 0
  adj.exposure = p.exp || 0
  renderLive()
}

function resetAdjustments() {
  adj.brightness = 100
  adj.contrast = 100
  adj.saturation = 100
  adj.exposure = 0
  adj.hueRotate = 0
  adj.blur = 0
  adj.grayscale = 0
  adj.sepia = 0
  adj.invert = 0
  adj.rotation = 0
  adj.flipH = false
  adj.flipV = false
  renderLive()
}

/** File Upload Handlers */
function triggerFileInput() {
  fileInputRef.value?.click()
}

function onFileInputChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) handleUploadedFile(files[0])
}

function onFileDrop(e: DragEvent) {
  isDraggingFile.value = false
  const files = e.dataTransfer?.files
  if (files && files[0]) handleUploadedFile(files[0])
}

async function handleUploadedFile(file: File) {
  isUploading.value = true
  uploadProgress.value = 0

  try {
    const res = await uploadMedia(file, file.name, state.activeMediaPath || '', (p) => {
      uploadProgress.value = p
    })

    if (res.url) {
      originalImageSrc = res.url
      loadedImage = await loadImage(res.url)
      imageMeta.width = loadedImage.naturalWidth || loadedImage.width
      imageMeta.height = loadedImage.naturalHeight || loadedImage.height
      imageMeta.format = res.format || 'webp'
      imageMeta.size = res.size
      renderLive()
      calculateTargetSize()

      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `Uploaded "${file.name}" successfully!` } }))
    }
  } catch (err: any) {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: `Upload failed: ${err.message}` } }))
  } finally {
    isUploading.value = false
  }
}

/** Fetch PocketBase Gallery items */
async function fetchGalleryItems() {
  isFetchingGallery.value = true
  try {
    const res: any = await $fetch('/api/admin/media')
    if (res?.items && Array.isArray(res.items)) {
      galleryItems.value = res.items
    }
  } catch {
  } finally {
    isFetchingGallery.value = false
  }
}

async function loadFromGallery(item: any) {
  if (!item?.url) return
  isLoadingImage.value = true
  try {
    originalImageSrc = item.url
    loadedImage = await loadImage(item.url)
    imageMeta.width = item.width || loadedImage.naturalWidth
    imageMeta.height = item.height || loadedImage.naturalHeight
    imageMeta.format = item.format || 'webp'
    imageMeta.size = item.size || 200000
    renderLive()
    calculateTargetSize()
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: `Loaded "${item.filename}" from gallery` } }))
  } catch (err) {
  } finally {
    isLoadingImage.value = false
  }
}

function handleRevertToOriginal() {
  if (!state.activeMediaPath) return
  revertPath(state.activeMediaPath, state.language || 'fa')
  close()
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: 'Reverted media to original baseline' } }))
}

/** Apply Changes and Export to Page Draft */
async function applyChanges() {
  if (!loadedImage || !state.activeMediaPath) return
  isApplying.value = true

  try {
    const activeCrop = cropEnabled.value ? cropRect : null
    const finalCanvas = renderAdjustments(loadedImage, adj, activeCrop, targetMaxDim.value || undefined)
    const exportResult = await compressCanvas(finalCanvas, targetFormat.value, targetQuality.value)

    // Save as media draft
    const lang = state.language || 'fa'
    setMediaDraftValue(state.activeMediaPath, lang, exportResult.url, {
      format: targetFormat.value,
      width: exportResult.width,
      height: exportResult.height,
      size: exportResult.size,
      blob: exportResult.blob
    })

    window.dispatchEvent(new CustomEvent('toast', {
      detail: {
        type: 'success',
        text: `Applied updated media (${exportResult.format.toUpperCase()} ${formatBytes(exportResult.size)})`
      }
    }))
    close()
  } catch (err: any) {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: `Apply error: ${err.message}` } }))
  } finally {
    isApplying.value = false
  }
}

function close() {
  closeMediaStudio()
}

// Watchers & Life Cycle
watch(() => state.mediaStudioOpen, (open) => {
  if (open) {
    initializeStudio()
    if (galleryItems.value.length === 0) {
      fetchGalleryItems()
    }
  }
})

watch(showOriginal, () => renderLive())

onMounted(() => {
  const onTabChange = (e: any) => {
    if (e.detail?.tab && tabs.some(t => t.id === e.detail.tab)) {
      activeTab.value = e.detail.tab
    }
  }
  window.addEventListener('admin:media-studio-tab', onTabChange)
  ;(window as any)._adminStudioCleanup = () => {
    window.removeEventListener('admin:media-studio-tab', onTabChange)
  }
})

onBeforeUnmount(() => {
  ;(window as any)._adminStudioCleanup?.()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
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
