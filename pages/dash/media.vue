<!-- pages/dash/media.vue -->
<template>
  <div class="space-y-6 select-none font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4 flex items-center gap-2">
          <AdminIcon name="photo" class="w-5 h-5 text-emerald-400" />
          <span>مدیریت فایل‌ها، پوشه‌ها و رسانه‌های مجتمع نجم</span>
        </h2>
        <p class="text-xs text-zinc-400">
          مرورگر پوشه‌ای، کشیدن و رها کردن (Drag & Drop)، آپلود در مسیر دلخواه و ویرایشگر پیشرفته ۳۱۰+ فایل
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          @click="openNewFolderModal"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer font-d4"
        >
          <AdminIcon name="folder-plus" class="w-4 h-4 text-emerald-400" />
          <span>پوشه جدید</span>
        </button>

        <button
          type="button"
          @click="triggerUpload"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer"
        >
          <AdminIcon name="upload" class="w-4 h-4" />
          <span>آپلود در پوشه جاری</span>
        </button>
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          multiple
          accept="*/*"
          @change="onFileSelected"
        />
      </div>
    </div>

    <!-- Drag & Drop Dropzone (Bound to Current Folder Path) -->
    <div
      class="border-2 border-dashed rounded-3xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 relative overflow-hidden"
      :class="isDragging ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 bg-zinc-900/60 hover:border-emerald-500/40 hover:bg-zinc-900/90'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDropFile"
      @click="triggerUpload"
    >
      <div class="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
        <AdminIcon name="upload" class="w-5 h-5" />
      </div>
      <div>
        <div class="font-bold text-xs text-zinc-200 font-d4">
          فایل‌های خود را به اینجا بکشید یا برای انتخاب از سیستم کلیک کنید
        </div>
        <div class="flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-mono mt-1">
          <span>مسیر آپلود مقصد:</span>
          <span class="px-2 py-0.5 rounded-md bg-zinc-950 border border-emerald-500/30 text-emerald-300 font-bold">
            {{ currentFolder ? `/${currentFolder}` : '/ (ریشه اصلی)' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Upload Progress Bar -->
    <div v-if="isUploading" class="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
      <div class="flex justify-between text-xs font-semibold text-zinc-200 font-d4">
        <span>در حال آپلود در مسیر "{{ currentFolder || 'root' }}"...</span>
        <span class="font-mono text-emerald-400">{{ uploadProgress }}%</span>
      </div>
      <div class="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          class="h-full bg-emerald-500 transition-all duration-150 rounded-full"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- MAIN TWO-COLUMN WORKSPACE: FOLDER TREE (Left) + FILE EXPLORER (Right) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
      <!-- 1. HIERARCHICAL COLLAPSIBLE FOLDER TREE (4 Cols) -->
      <div class="md:col-span-4 lg:col-span-3 bg-zinc-900/90 rounded-3xl border border-white/10 p-4 space-y-3 shadow-lg">
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center gap-2">
            <AdminIcon name="folder" class="w-4 h-4 text-emerald-400" />
            <h3 class="font-bold text-xs text-white font-d4">ساختار درختی پوشه‌ها</h3>
          </div>
          <div class="flex items-center gap-1">
            <button
              type="button"
              @click="toggleExpandAll"
              class="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-semibold transition-colors cursor-pointer font-d4"
              :title="allExpanded ? 'بستن همه پوشه‌ها' : 'باز کردن همه پوشه‌ها'"
            >
              {{ allExpanded ? 'بستن همه' : 'باز کردن همه' }}
            </button>
            <button
              type="button"
              @click="openNewFolderModal"
              class="p-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
              title="ایجاد پوشه جدید"
            >
              <AdminIcon name="plus" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Folder Search Input -->
        <div class="relative">
          <input
            v-model="folderSearchQuery"
            type="text"
            placeholder="جستجو در ساختار پوشه‌ها..."
            class="w-full h-8 pr-7 pl-2.5 rounded-xl bg-zinc-950 border border-white/10 text-[11px] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
            dir="ltr"
          />
          <AdminIcon name="search" class="w-3 h-3 text-zinc-500 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        <!-- Hierarchical Tree Container -->
        <div class="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar pr-0.5">
          <!-- Root / All Files -->
          <div
            @click="currentFolder = ''"
            @dragover.prevent
            @drop.prevent="onDropOnFolder('')"
            class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border"
            :class="currentFolder === ''
              ? 'bg-najmgreen text-white font-bold border-emerald-500 shadow-xs'
              : 'text-zinc-300 hover:text-white hover:bg-white/5 border-transparent'"
          >
            <div class="flex items-center gap-2 truncate">
              <AdminIcon name="folder-open" class="w-4 h-4 shrink-0 text-emerald-400" />
              <span class="truncate font-d4">ریشه اصلی (/root)</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-white/10 shrink-0">
              {{ items.length }}
            </span>
          </div>

          <!-- Recursive Hierarchical Collapsible Nodes -->
          <FolderTreeNode
            v-for="rootNode in hierarchicalFolderTree"
            :key="rootNode.path"
            :node="rootNode"
            :selected-path="currentFolder"
            :expanded-paths="expandedFolders"
            @select="currentFolder = $event"
            @toggle="toggleFolderExpand($event)"
            @drop-file="onDropOnFolder($event)"
          />
        </div>

        <!-- Quick Folder Utility Buttons -->
        <div class="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
          <span>{{ allFolderPaths.length }} پوشه ثبت شده</span>
          <button
            type="button"
            @click="copyCurrentPath"
            class="hover:text-emerald-400 underline cursor-pointer font-d4"
          >
            کپی مسیر انتخابی
          </button>
        </div>
      </div>

      <!-- 2. FILE EXPLORER & CONTROLS (8-9 Cols) -->
      <div class="md:col-span-8 lg:col-span-9 space-y-4">
        <!-- Interactive Breadcrumb Path Bar -->
        <div class="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-1.5 text-xs text-zinc-300 overflow-x-auto custom-scrollbar py-1">
            <button
              type="button"
              @click="currentFolder = ''"
              class="px-2 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1 shrink-0 font-d4 cursor-pointer"
            >
              <AdminIcon name="folder" class="w-3.5 h-3.5 text-emerald-400" />
              <span>ریشه</span>
            </button>

            <template v-if="currentFolder">
              <span class="text-zinc-500">/</span>
              <template v-for="(seg, idx) in breadcrumbSegments" :key="seg.path">
                <button
                  type="button"
                  @click="currentFolder = seg.path"
                  class="px-2 py-1 rounded-lg font-mono text-xs transition-colors shrink-0 cursor-pointer"
                  :class="idx === breadcrumbSegments.length - 1
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300'"
                >
                  {{ seg.name }}
                </button>
                <span v-if="idx < breadcrumbSegments.length - 1" class="text-zinc-500">/</span>
              </template>
            </template>
          </div>

          <!-- Fast Utilities: Copy Path & Up One Level -->
          <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              v-if="currentFolder"
              type="button"
              @click="goUpFolder"
              class="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer font-d4"
              title="یک سطح بالاتر"
            >
              <AdminIcon name="chevron-right" class="w-3.5 h-3.5" />
              <span>پوشه بالا</span>
            </button>

            <button
              type="button"
              @click="copyCurrentPath"
              class="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer font-d4"
              title="کپی آدرس مسیر جاری"
            >
              <AdminIcon name="link" class="w-3.5 h-3.5 text-emerald-400" />
              <span>کپی مسیر</span>
            </button>
          </div>
        </div>

        <!-- Filter, Search & View Modes Bar -->
        <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-3">
          <!-- Search Input -->
          <div class="relative w-full lg:w-72">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو در نام فایل، پسوند یا مسیر..."
              class="w-full h-9 pr-8 pl-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
            <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          <!-- Category Chips -->
          <div class="flex items-center gap-1 overflow-x-auto w-full lg:w-auto p-1 rounded-xl bg-zinc-950 border border-white/5 custom-scrollbar text-xs font-d4">
            <button
              v-for="cat in categories"
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

          <!-- View Switcher (Grid / Cards / List) -->
          <div class="flex items-center p-1 rounded-xl bg-zinc-950 border border-white/10 text-zinc-400 self-end lg:self-auto shrink-0">
            <button
              type="button"
              @click="viewMode = 'grid'"
              class="p-1.5 rounded-lg cursor-pointer transition-colors"
              :class="viewMode === 'grid' ? 'bg-najmgreen text-white font-bold' : 'hover:text-white'"
              title="نمایش شبکه‌ای متراکم"
            >
              <AdminIcon name="dashboard" class="w-4 h-4" />
            </button>
            <button
              type="button"
              @click="viewMode = 'cards'"
              class="p-1.5 rounded-lg cursor-pointer transition-colors"
              :class="viewMode === 'cards' ? 'bg-najmgreen text-white font-bold' : 'hover:text-white'"
              title="نمایش کارت همراه با جزئیات"
            >
              <AdminIcon name="layout" class="w-4 h-4" />
            </button>
            <button
              type="button"
              @click="viewMode = 'list'"
              class="p-1.5 rounded-lg cursor-pointer transition-colors"
              :class="viewMode === 'list' ? 'bg-najmgreen text-white font-bold' : 'hover:text-white'"
              title="نمایش سطری"
            >
              <AdminIcon name="file" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Batch Selection Action Strip -->
        <div
          v-if="selectedFileIds.length > 0"
          class="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs"
        >
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold text-white font-d4">{{ selectedFileIds.length }} فایل انتخاب شده</span>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              @click="copySelectedPaths"
              class="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold font-d4 cursor-pointer"
            >
              کپی مسیر همه
            </button>
            <button
              type="button"
              @click="openMoveBatchModal"
              class="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 border border-emerald-500/30 text-xs font-semibold font-d4 cursor-pointer"
            >
              انتقال به پوشه...
            </button>
            <button
              type="button"
              @click="selectedFileIds = []"
              class="px-2 py-1 rounded-lg text-zinc-400 hover:text-white text-xs cursor-pointer font-d4"
            >
              لغو انتخاب
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-16 text-center text-zinc-500 text-xs font-d4">
          در حال بارگذاری فایل‌ها و پوشه‌ها...
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredItems.length === 0" class="p-16 text-center text-zinc-500 text-xs font-d4 bg-zinc-900/40 rounded-3xl border border-white/5 space-y-2">
          <div>فایلی در این مسیر یا دسته‌بندی یافت نشد.</div>
          <div class="text-[11px] text-zinc-400 font-mono">مسیر فعلی: /{{ currentFolder }}</div>
          <button
            type="button"
            @click="triggerUpload"
            class="px-4 py-2 rounded-xl bg-najmgreen text-white text-xs font-bold font-d4 cursor-pointer mt-2 inline-block"
          >
            آپلود اولین فایل در این پوشه
          </button>
        </div>

        <!-- 1. GRID VIEW (Compact Visual Grid) -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          <div
            v-for="item in filteredItems"
            :key="item.url"
            draggable="true"
            @dragstart="onDragStartFile($event, item)"
            class="group rounded-2xl bg-zinc-900/90 border transition-all flex flex-col justify-between overflow-hidden shadow-sm"
            :class="selectedFileIds.includes(item.id) ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-white/10 hover:border-emerald-500/50'"
          >
            <!-- Visual Box -->
            <div class="relative aspect-square bg-zinc-950 flex items-center justify-center p-2 overflow-hidden">
              <img
                v-if="item.category === 'image' || item.category === 'vector'"
                :src="item.url"
                :alt="item.filename"
                class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />

              <div v-else-if="item.category === 'video'" class="flex flex-col items-center justify-center gap-1.5 text-cyan-400">
                <AdminIcon name="play" class="w-8 h-8" />
                <span class="text-[10px] font-mono font-bold uppercase">ویدیو</span>
              </div>

              <div v-else-if="item.category === 'audio'" class="flex flex-col items-center justify-center gap-1.5 text-purple-400">
                <AdminIcon name="sparkles" class="w-8 h-8" />
                <span class="text-[10px] font-mono font-bold uppercase">صدا</span>
              </div>

              <div v-else class="flex flex-col items-center justify-center gap-1.5 text-amber-400">
                <AdminIcon name="download" class="w-8 h-8" />
                <span class="text-[10px] font-mono font-bold uppercase">{{ item.format }}</span>
              </div>

              <!-- Selection Checkbox -->
              <input
                type="checkbox"
                :checked="selectedFileIds.includes(item.id)"
                @change="toggleSelectFile(item.id)"
                class="absolute top-2 left-2 w-4 h-4 rounded accent-emerald-500 cursor-pointer z-10"
              />

              <!-- Format Badge -->
              <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-zinc-950/80 text-zinc-300 border border-white/10 backdrop-blur-md">
                {{ item.format }}
              </span>

              <!-- Hover Fast Actions Overlay -->
              <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 z-10">
                <button
                  v-if="item.category === 'image'"
                  type="button"
                  @click="openInStudio(item)"
                  class="w-full py-1 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-[11px] font-bold font-d4 flex items-center justify-center gap-1 shadow-md cursor-pointer"
                >
                  <AdminIcon name="sparkles" class="w-3.5 h-3.5" />
                  <span>ویرایش تصویر</span>
                </button>

                <div class="flex items-center gap-1 w-full">
                  <button
                    type="button"
                    @click="copyUrl(item.url)"
                    class="flex-1 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer font-d4"
                    title="کپی لینک مستقیم"
                  >
                    <AdminIcon name="link" class="w-3 h-3 text-emerald-400" />
                    <span>لینک</span>
                  </button>

                  <button
                    type="button"
                    @click="copyRelativePath(item.path || item.url)"
                    class="flex-1 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer font-d4"
                    title="کپی مسیر نسبی"
                  >
                    <span>مسیر</span>
                  </button>
                </div>

                <div class="flex items-center gap-1 w-full">
                  <button
                    type="button"
                    @click="openMoveModal(item)"
                    class="flex-1 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer font-d4"
                    title="تغییر پوشه"
                  >
                    <AdminIcon name="folder" class="w-3 h-3 text-amber-400" />
                    <span>انتقال</span>
                  </button>

                  <button
                    type="button"
                    @click="deleteItem(item)"
                    class="p-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] flex items-center justify-center cursor-pointer"
                    title="حذف فایل"
                  >
                    <AdminIcon name="trash" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Caption -->
            <div class="p-2.5 border-t border-white/5 space-y-0.5 bg-zinc-950/40">
              <div class="text-[11px] font-medium text-white truncate font-mono" :title="item.filename">
                {{ item.filename }}
              </div>
              <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>{{ item.size ? formatBytes(item.size) : 'لوکال' }}</span>
                <span class="truncate max-w-[90px]" dir="ltr">/{{ item.folder || '' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. DETAILED CARDS VIEW -->
        <div v-else-if="viewMode === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="item in filteredItems"
            :key="item.url"
            draggable="true"
            @dragstart="onDragStartFile($event, item)"
            class="rounded-3xl bg-zinc-900/90 border border-white/10 hover:border-emerald-500/50 transition-all p-4 flex flex-col justify-between gap-3 shadow-sm"
          >
            <div class="flex items-start gap-3">
              <div class="w-16 h-16 rounded-2xl bg-zinc-950 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  v-if="item.category === 'image' || item.category === 'vector'"
                  :src="item.url"
                  :alt="item.filename"
                  class="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
                <span v-else class="text-[11px] font-mono font-bold text-emerald-400 uppercase">{{ item.format }}</span>
              </div>

              <div class="flex-1 min-w-0 space-y-1">
                <div class="font-bold text-xs text-white truncate font-mono" :title="item.filename">
                  {{ item.filename }}
                </div>
                <div class="text-[10px] text-zinc-400 font-mono truncate" dir="ltr" :title="item.path || item.url">
                  {{ item.path || item.url }}
                </div>
                <div class="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <span class="px-1.5 py-0.2 rounded bg-white/5 uppercase">{{ item.format }}</span>
                  <span>{{ item.size ? formatBytes(item.size) : 'سرور' }}</span>
                </div>
              </div>
            </div>

            <!-- Actions Bar -->
            <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-1.5 text-xs font-d4">
              <button
                v-if="item.category === 'image'"
                type="button"
                @click="openInStudio(item)"
                class="px-2.5 py-1.5 rounded-xl bg-najmgreen/20 text-emerald-300 border border-emerald-500/30 hover:bg-najmgreen/30 font-bold flex items-center gap-1 cursor-pointer"
              >
                <AdminIcon name="sparkles" class="w-3.5 h-3.5" />
                <span>ادیتور</span>
              </button>

              <button
                type="button"
                @click="copyUrl(item.url)"
                class="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                title="کپی لینک CDN"
              >
                <AdminIcon name="link" class="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                @click="openMoveModal(item)"
                class="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 cursor-pointer"
                title="انتقال به پوشه دیگر"
              >
                <AdminIcon name="folder" class="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                @click="deleteItem(item)"
                class="p-1.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                title="حذف"
              >
                <AdminIcon name="trash" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- 3. LIST / TABLE VIEW -->
        <div v-else class="rounded-3xl bg-zinc-900/80 border border-white/10 overflow-hidden divide-y divide-white/5 text-xs">
          <div
            v-for="item in filteredItems"
            :key="item.url"
            draggable="true"
            @dragstart="onDragStartFile($event, item)"
            class="p-3.5 flex items-center justify-between gap-4 hover:bg-zinc-900 transition-colors"
          >
            <div class="flex items-center gap-3 truncate">
              <input
                type="checkbox"
                :checked="selectedFileIds.includes(item.id)"
                @change="toggleSelectFile(item.id)"
                class="w-4 h-4 rounded accent-emerald-500 cursor-pointer shrink-0"
              />

              <div class="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  v-if="item.category === 'image' || item.category === 'vector'"
                  :src="item.url"
                  :alt="item.filename"
                  class="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
                <span v-else class="text-[10px] font-mono font-bold text-emerald-400 uppercase">{{ item.format }}</span>
              </div>

              <div class="truncate">
                <div class="font-bold text-white font-mono truncate" :title="item.filename">{{ item.filename }}</div>
                <div class="text-[10px] text-zinc-400 font-mono truncate" dir="ltr">{{ item.path || item.url }}</div>
              </div>
            </div>

            <div class="flex items-center gap-2.5 shrink-0">
              <span class="text-[11px] text-zinc-400 font-mono">{{ item.size ? formatBytes(item.size) : 'سرور' }}</span>
              <span class="px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 font-mono text-[10px] uppercase font-bold">{{ item.format }}</span>

              <button
                v-if="item.category === 'image'"
                type="button"
                @click="openInStudio(item)"
                class="px-2.5 py-1 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold font-d4 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <AdminIcon name="sparkles" class="w-3.5 h-3.5" />
                <span>ادیتور</span>
              </button>

              <button
                type="button"
                @click="openMoveModal(item)"
                class="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                title="تغییر پوشه"
              >
                <AdminIcon name="folder" class="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                type="button"
                @click="copyUrl(item.url)"
                class="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                title="کپی آدرس فایل"
              >
                <AdminIcon name="link" class="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                @click="deleteItem(item)"
                class="p-1.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                title="حذف"
              >
                <AdminIcon name="trash" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 1: CREATE NEW FOLDER -->
    <div
      v-if="showNewFolderModal"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showNewFolderModal = false"
    >
      <div class="w-full max-w-md bg-zinc-950 rounded-3xl border border-white/15 p-5 space-y-4 text-xs shadow-2xl">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="font-bold text-sm text-white font-d4 flex items-center gap-2">
            <AdminIcon name="folder-plus" class="w-4 h-4 text-emerald-400" />
            <span>ایجاد پوشه جدید</span>
          </h3>
          <button @click="showNewFolderModal = false" class="text-zinc-400 hover:text-white cursor-pointer">
            <AdminIcon name="x" class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">نام پوشه:</label>
            <input
              v-model="newFolderName"
              type="text"
              placeholder="مثال: banners یا products/boxes"
              class="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:border-emerald-500 focus:outline-none text-xs"
              dir="ltr"
            />
          </div>

          <div class="p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-[11px] text-zinc-400 font-mono">
            مسیر نهایی: /{{ currentFolder ? `${currentFolder}/${newFolderName}` : newFolderName }}
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            @click="showNewFolderModal = false"
            class="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold cursor-pointer font-d4"
          >
            انصراف
          </button>
          <button
            type="button"
            @click="confirmCreateFolder"
            class="px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white font-bold cursor-pointer font-d4 shadow-xs"
          >
            ایجاد پوشه
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: MOVE FILE(S) TO FOLDER -->
    <div
      v-if="showMoveModal"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showMoveModal = false"
    >
      <div class="w-full max-w-md bg-zinc-950 rounded-3xl border border-white/15 p-5 space-y-4 text-xs shadow-2xl">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="font-bold text-sm text-white font-d4 flex items-center gap-2">
            <AdminIcon name="folder" class="w-4 h-4 text-amber-400" />
            <span>انتقال فایل به پوشه دیگر</span>
          </h3>
          <button @click="showMoveModal = false" class="text-zinc-400 hover:text-white cursor-pointer">
            <AdminIcon name="x" class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3">
          <div class="text-zinc-300 font-d4">
            {{ movingTargetItem ? `فایل: ${movingTargetItem.filename}` : `${selectedFileIds.length} فایل انتخاب شده` }}
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">انتخاب پوشه مقصد:</label>
            <select
              v-model="targetMoveFolder"
              class="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:border-emerald-500 focus:outline-none text-xs"
              dir="ltr"
            >
              <option value="">/ (ریشه اصلی)</option>
              <option v-for="f in allFolderPaths" :key="f" :value="f">/{{ f }}</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            @click="showMoveModal = false"
            class="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold cursor-pointer font-d4"
          >
            انصراف
          </button>
          <button
            type="button"
            @click="confirmMoveFile"
            class="px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white font-bold cursor-pointer font-d4 shadow-xs"
          >
            تایید و انتقال
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { openMediaStudio } from '@/store/adminEditStore'
import { useAdminMedia } from '@/composables/useAdminMedia'
import AdminIcon from '~/components/admin/AdminIcon.vue'
import FolderTreeNode, { type FolderNode } from '~/components/admin/FolderTreeNode.vue'

definePageMeta({
  layout: 'dash'
})

const { formatBytes, uploadMedia } = useAdminMedia()

const loading = ref(true)
const isUploading = ref(false)
const isDragging = ref(false)
const uploadProgress = ref(0)
const searchQuery = ref('')
const folderSearchQuery = ref('')
const activeCategory = ref('all')
const viewMode = ref<'grid' | 'cards' | 'list'>('grid')
const fileInputRef = ref<HTMLInputElement | null>(null)

const currentFolder = ref('')
const customFolders = ref<string[]>([])
const selectedFileIds = ref<string[]>([])

// Collapsible Folders State
const expandedFolders = ref<Set<string>>(new Set(['images', 'images/sections']))

function toggleFolderExpand(path: string) {
  if (expandedFolders.value.has(path)) {
    expandedFolders.value.delete(path)
  } else {
    expandedFolders.value.add(path)
  }
}

const allExpanded = computed(() => {
  if (allFolderPaths.value.length === 0) return false
  return allFolderPaths.value.every(p => expandedFolders.value.has(p))
})

function toggleExpandAll() {
  if (allExpanded.value) {
    expandedFolders.value.clear()
  } else {
    for (const p of allFolderPaths.value) {
      expandedFolders.value.add(p)
    }
  }
}

// Modals
const showNewFolderModal = ref(false)
const newFolderName = ref('')
const showMoveModal = ref(false)
const movingTargetItem = ref<any>(null)
const targetMoveFolder = ref('')

const items = ref<any[]>([])

const categories = [
  { id: 'all', label: 'همه رسانه‌ها' },
  { id: 'image', label: 'عکس‌ها' },
  { id: 'video', label: 'ویدیوها' },
  { id: 'document', label: 'اسناد PDF/PSD/AI' },
  { id: 'vector', label: 'وکتور و SVG' }
]

function extractFolderFromPath(pathStr: string): string {
  if (!pathStr) return ''
  const clean = pathStr.replace(/^\/+/, '').replace(/\/{2,}/g, '/')
  const parts = clean.split('/')
  if (parts.length <= 1) return ''
  parts.pop() // remove filename
  return parts.join('/')
}

const allFolderPaths = computed(() => {
  const set = new Set<string>()
  for (const it of items.value) {
    const f = it.folder || extractFolderFromPath(it.path || it.url)
    if (f) set.add(f)
  }
  for (const cf of customFolders.value) {
    if (cf) set.add(cf)
  }
  return Array.from(set).sort()
})

/**
 * Builds a hierarchical tree of FolderNode objects from flat paths
 */
const hierarchicalFolderTree = computed<FolderNode[]>(() => {
  const fullPathSet = new Set<string>()
  for (const p of allFolderPaths.value) {
    if (!p) continue
    const parts = p.split('/')
    let curr = ''
    for (const part of parts) {
      curr = curr ? `${curr}/${part}` : part
      fullPathSet.add(curr)
    }
  }

  const sortedPaths = Array.from(fullPathSet).sort((a, b) => a.localeCompare(b))
  const nodeMap = new Map<string, FolderNode>()

  for (const p of sortedPaths) {
    const parts = p.split('/')
    const name = parts[parts.length - 1]
    const depth = parts.length - 1

    const count = items.value.filter(i => {
      const itemFolder = i.folder || extractFolderFromPath(i.path || i.url)
      return itemFolder === p
    }).length

    const totalCount = items.value.filter(i => {
      const itemFolder = i.folder || extractFolderFromPath(i.path || i.url)
      return itemFolder === p || itemFolder.startsWith(`${p}/`)
    }).length

    const node: FolderNode = {
      name,
      path: p,
      depth,
      count,
      totalCount,
      children: []
    }
    nodeMap.set(p, node)
  }

  // Connect child nodes to parent nodes
  const rootNodes: FolderNode[] = []
  for (const [pathStr, node] of nodeMap.entries()) {
    const lastSlash = pathStr.lastIndexOf('/')
    if (lastSlash === -1) {
      rootNodes.push(node)
    } else {
      const parentPath = pathStr.slice(0, lastSlash)
      const parentNode = nodeMap.get(parentPath)
      if (parentNode) {
        parentNode.children.push(node)
      } else {
        rootNodes.push(node)
      }
    }
  }

  // If user searched in folder search, filter tree and auto-expand matches
  if (folderSearchQuery.value) {
    const q = folderSearchQuery.value.toLowerCase()
    function filterNode(n: FolderNode): FolderNode | null {
      const matchSelf = n.name.toLowerCase().includes(q) || n.path.toLowerCase().includes(q)
      const matchingChildren = n.children
        .map(c => filterNode(c))
        .filter(Boolean) as FolderNode[]

      if (matchSelf || matchingChildren.length > 0) {
        expandedFolders.value.add(n.path)
        return {
          ...n,
          children: matchingChildren
        }
      }
      return null
    }

    return rootNodes.map(r => filterNode(r)).filter(Boolean) as FolderNode[]
  }

  return rootNodes
})

const breadcrumbSegments = computed(() => {
  if (!currentFolder.value) return []
  const parts = currentFolder.value.split('/')
  const res: { name: string; path: string }[] = []
  let acc = ''
  for (const p of parts) {
    acc = acc ? `${acc}/${p}` : p
    res.push({ name: p, path: acc })
  }
  return res
})

function goUpFolder() {
  if (!currentFolder.value) return
  const parts = currentFolder.value.split('/')
  parts.pop()
  currentFolder.value = parts.join('/')
}

function getCategoryCount(catId: string): number {
  const inFolder = items.value.filter(i => {
    if (!currentFolder.value) return true
    const f = i.folder || extractFolderFromPath(i.path || i.url)
    return f === currentFolder.value || f.startsWith(`${currentFolder.value}/`)
  })
  if (catId === 'all') return inFolder.length
  return inFolder.filter(i => i.category === catId).length
}

const filteredItems = computed(() => {
  return items.value.filter(item => {
    // 1. Folder match
    if (currentFolder.value) {
      const f = item.folder || extractFolderFromPath(item.path || item.url)
      if (f !== currentFolder.value && !f.startsWith(`${currentFolder.value}/`)) {
        return false
      }
    }

    // 2. Category match
    if (activeCategory.value !== 'all' && item.category !== activeCategory.value) {
      return false
    }

    // 3. Search match
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return (
        item.filename?.toLowerCase().includes(q) ||
        item.format?.toLowerCase().includes(q) ||
        item.path?.toLowerCase().includes(q) ||
        item.url?.toLowerCase().includes(q)
      )
    }
    return true
  })
})

function triggerUpload() {
  fileInputRef.value?.click()
}

function onFileSelected(e: any) {
  const files = e.target?.files
  if (files && files.length > 0) {
    handleMultipleUpload(Array.from(files))
  }
}

function onDropFile(e: DragEvent) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleMultipleUpload(Array.from(files))
  }
}

function onDropOnFolder(targetPath: string) {
  currentFolder.value = targetPath
  triggerUpload()
}

function onDragStartFile(e: DragEvent, item: any) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', item.id)
  }
}

async function handleMultipleUpload(files: File[]) {
  isUploading.value = true
  uploadProgress.value = 10
  const targetPath = currentFolder.value ? `images/${currentFolder.value}` : 'images/uploads'

  try {
    let completed = 0
    for (const file of files) {
      const res = await uploadMedia(file, (p) => {
        uploadProgress.value = Math.round(((completed + p / 100) / files.length) * 100)
      }, targetPath)

      if (res.url) {
        items.value.unshift({
          id: res.id || `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          filename: file.name,
          file: file.name,
          format: file.name.split('.').pop()?.toUpperCase() || 'PNG',
          size: file.size,
          url: res.url,
          path: `/${targetPath}/${file.name}`,
          folder: currentFolder.value,
          category: 'image'
        })
      }
      completed++
    }
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `${files.length} فایل با موفقیت آپلود گردید.` } }))
  } catch (err) {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', text: 'خطا در آپلود برخی فایل‌ها.' } }))
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

function openNewFolderModal() {
  newFolderName.value = ''
  showNewFolderModal.value = true
}

function confirmCreateFolder() {
  if (!newFolderName.value.trim()) return
  const cleanName = newFolderName.value.trim().replace(/^\/+|\/+$/g, '')
  const fullPath = currentFolder.value ? `${currentFolder.value}/${cleanName}` : cleanName
  if (!customFolders.value.includes(fullPath)) {
    customFolders.value.push(fullPath)
  }
  currentFolder.value = fullPath
  showNewFolderModal.value = false
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `پوشه "/${fullPath}" با موفقیت ایجاد شد.` } }))
}

function openMoveModal(item: any) {
  movingTargetItem.value = item
  targetMoveFolder.value = item.folder || ''
  showMoveModal.value = true
}

function openMoveBatchModal() {
  movingTargetItem.value = null
  targetMoveFolder.value = currentFolder.value || ''
  showMoveModal.value = true
}

async function confirmMoveFile() {
  const dest = targetMoveFolder.value
  if (movingTargetItem.value) {
    // Single move
    const it = movingTargetItem.value
    it.folder = dest
    const fn = it.filename || 'file'
    it.path = dest ? `/${dest}/${fn}` : `/${fn}`
    await $fetch('/api/admin/media/move', {
      method: 'POST',
      body: { id: it.id, targetPath: it.path }
    }).catch(() => null)
  } else if (selectedFileIds.value.length > 0) {
    // Batch move
    for (const id of selectedFileIds.value) {
      const it = items.value.find(i => i.id === id)
      if (it) {
        it.folder = dest
        const fn = it.filename || 'file'
        it.path = dest ? `/${dest}/${fn}` : `/${fn}`
        $fetch('/api/admin/media/move', {
          method: 'POST',
          body: { id: it.id, targetPath: it.path }
        }).catch(() => null)
      }
    }
    selectedFileIds.value = []
  }
  showMoveModal.value = false
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'فایل‌ها با موفقیت منتقل شدند.' } }))
}

async function deleteItem(item: any) {
  if (!confirm(`آیا از حذف فایل "${item.filename}" اطمینان دارید؟`)) return
  items.value = items.value.filter(i => i.id !== item.id)
  await $fetch('/api/admin/media/delete', {
    method: 'POST',
    body: { id: item.id }
  }).catch(() => null)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'فایل با موفقیت حذف شد.' } }))
}

function toggleSelectFile(id: string) {
  const idx = selectedFileIds.value.indexOf(id)
  if (idx !== -1) selectedFileIds.value.splice(idx, 1)
  else selectedFileIds.value.push(id)
}

function copySelectedPaths() {
  const paths = items.value
    .filter(i => selectedFileIds.value.includes(i.id))
    .map(i => i.path || i.url)
    .join('\n')
  if (navigator.clipboard) {
    navigator.clipboard.writeText(paths)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'مسیر تمامی فایل‌های انتخاب شده کپی گردید.' } }))
  }
}

function openInStudio(item: any) {
  openMediaStudio({
    path: item.path || `media.${item.filename}`,
    url: item.url,
    meta: {
      format: item.format.toLowerCase(),
      width: item.width || 800,
      height: item.height || 600,
      size: item.size
    }
  })
}

function copyUrl(url: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'آدرس مستقیم فایل در کلیپ‌بورد کپی شد.' } }))
  }
}

function copyRelativePath(pathStr: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(pathStr)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `مسیر نسبی "${pathStr}" کپی شد.` } }))
  }
}

function copyCurrentPath() {
  const p = currentFolder.value ? `/${currentFolder.value}` : '/'
  if (navigator.clipboard) {
    navigator.clipboard.writeText(p)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `مسیر پوشه "${p}" در کلیپ‌بورد کپی شد.` } }))
  }
}

async function loadMedia() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/admin/media')
    const rawItems = res?.items || []
    items.value = rawItems.map((item: any) => ({
      ...item,
      folder: extractFolderFromPath(item.path || item.url)
    }))
  } catch (err) {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMedia()
})
</script>
