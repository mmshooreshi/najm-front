<!-- pages/dash/calendar.vue -->
<template>
  <div class="space-y-6 select-none">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4">تقویم و جریان خط تولید کارخانه (Kanban)</h2>
        <p class="text-xs text-zinc-400">جابجایی آسان با درگ و دراپ (Drag & Drop)، اولویت‌بندی سفارشات و اعلام وضعیت به مشتری در واتس‌اپ</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="openNewJobModal"
          class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer"
        >
          <AdminIcon name="plus" class="w-4 h-4" />
          <span>ثبت سفارش جدید در خط تولید</span>
        </button>
      </div>
    </div>

    <!-- Quick Filter Bar -->
    <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-d4">
      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar">
        <span class="text-zinc-400 shrink-0 font-bold">فیلتر اولویت:</span>
        <button
          v-for="p in priorityFilters"
          :key="p.id"
          type="button"
          @click="selectedPriority = p.id"
          class="px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          :class="selectedPriority === p.id ? 'bg-najmgreen text-white font-bold' : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/5'"
        >
          <span>{{ p.label }}</span>
          <span class="px-1 rounded-full text-[10px] bg-white/10 font-mono">{{ getPriorityCount(p.id) }}</span>
        </button>
      </div>

      <!-- Stats pill -->
      <div class="flex items-center gap-3 text-zinc-400 text-xs font-mono self-end md:self-center">
        <span>مجموع سفارشات فعال: <strong class="text-emerald-400 font-bold">{{ jobs.length }}</strong></span>
      </div>
    </div>

    <!-- 4-Stage Drag-and-Drop Kanban Columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stage in stages"
        :key="stage.id"
        class="rounded-3xl bg-zinc-900/80 border transition-all flex flex-col min-h-[500px]"
        :class="dragOverStage === stage.id ? 'border-emerald-500 bg-emerald-950/20 shadow-xl' : 'border-white/10'"
        @dragover.prevent="dragOverStage = stage.id"
        @dragleave="dragOverStage = null"
        @drop="handleDrop(stage.id)"
      >
        <!-- Column Header -->
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" :class="stage.dotColor"></span>
            <h3 class="text-xs font-bold text-white font-d4">{{ stage.title }}</h3>
          </div>
          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-300 border border-white/5">
            {{ getJobsByStage(stage.id).length }}
          </span>
        </div>

        <!-- Cards Container -->
        <div class="flex-1 p-3 space-y-3 overflow-y-auto max-h-[600px] custom-scrollbar">
          <div
            v-if="getJobsByStage(stage.id).length === 0"
            class="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-[11px] text-zinc-500 font-d4"
          >
            سفارشی در این مرحله نیست
          </div>

          <!-- Draggable Job Card -->
          <div
            v-for="job in getJobsByStage(stage.id)"
            :key="job.id"
            draggable="true"
            @dragstart="handleDragStart(job)"
            class="p-4 rounded-2xl bg-zinc-950 border border-white/5 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 cursor-grab active:cursor-grabbing group"
          >
            <!-- Card Top: Client & Priority -->
            <div class="flex items-start justify-between gap-2">
              <div>
                <h4 class="font-bold text-white text-xs font-d4 group-hover:text-emerald-300 transition-colors">
                  {{ job.client }}
                </h4>
                <p class="text-[11px] text-zinc-400 font-d4 mt-0.5">{{ job.product }}</p>
              </div>
              <span
                class="px-2 py-0.5 rounded-md text-[9px] font-bold font-d4 shrink-0"
                :class="priorityBadgeClass(job.priority)"
              >
                {{ priorityLabel(job.priority) }}
              </span>
            </div>

            <!-- Specs Grid -->
            <div class="grid grid-cols-2 gap-1.5 text-[10px] bg-zinc-900/80 p-2.5 rounded-xl border border-white/5">
              <div>
                <span class="text-zinc-500 block">تیراژ:</span>
                <span class="font-bold text-zinc-200 font-mono">{{ job.qty }}</span>
              </div>
              <div>
                <span class="text-zinc-500 block">موعد تحویل:</span>
                <span class="font-bold text-amber-400 font-mono">{{ job.due }}</span>
              </div>
              <div class="col-span-2 pt-1 border-t border-white/5 truncate">
                <span class="text-zinc-500">ماشین / خط: </span>
                <span class="text-zinc-300">{{ job.machine }}</span>
              </div>
            </div>

            <!-- Bottom Fast Actions -->
            <div class="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
              <!-- WhatsApp notify -->
              <a
                :href="`https://wa.me/${job.phone.replace(/^0/, '98')}?text=${encodeURIComponent(`سلام ${job.client} عزیز، وضعیت سفارش ${job.product} در مرحله «${stage.title}» قرار دارد.`)}`"
                target="_blank"
                class="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-d4 cursor-pointer"
              >
                <AdminIcon name="chat" class="w-3.5 h-3.5" />
                <span>اطلاع وضعیت</span>
              </a>

              <!-- Advance Stage Trigger -->
              <button
                v-if="stage.id !== 'ready'"
                type="button"
                @click="advanceStage(job)"
                class="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold font-d4 cursor-pointer transition-colors"
              >
                مرحله بعد ←
              </button>
              <span v-else class="text-emerald-400 font-bold font-d4 text-[10px]">آماده بارگیری ✔</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for New Production Order -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans"
      @click.self="modalOpen = false"
    >
      <div class="w-full max-w-md rounded-3xl bg-zinc-900 border border-white/15 p-6 shadow-2xl space-y-4 text-white">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="text-sm font-bold font-d4">ثبت سفارش در جریان تولید</h3>
          <button @click="modalOpen = false" class="text-zinc-400 hover:text-white p-1 cursor-pointer">
            <AdminIcon name="x" class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">نام مشتری / شرکت سفارش‌دهنده:</label>
            <input
              v-model="newJob.client"
              type="text"
              placeholder="مثال: زعفران مصطفوی"
              class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">شماره تماس همراه:</label>
            <input
              v-model="newJob.phone"
              type="text"
              placeholder="09123456789"
              class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              dir="ltr"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">نوع جعبه / عنوان کار:</label>
            <input
              v-model="newJob.product"
              type="text"
              placeholder="مثال: هاردباکس کتابی مگنتی زعفران"
              class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">تیراژ سفارش:</label>
              <input
                v-model="newJob.qty"
                type="text"
                placeholder="۵,۰۰۰ عدد"
                class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">موعد تحویل:</label>
              <input
                v-model="newJob.due"
                type="text"
                placeholder="۱۴۰۳/۰۶/۱۰"
                class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">اولویت تولید:</label>
              <select
                v-model="newJob.priority"
                class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none font-d4"
              >
                <option value="urgent">فوری و حساس 🔴</option>
                <option value="normal">عادی 🟢</option>
                <option value="export">سفارش صادراتی 🟣</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="font-bold text-zinc-300 font-d4">تخصیص ماشین:</label>
              <select
                v-model="newJob.machine"
                class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none font-d4"
              >
                <option value="هایدلبرگ CD102 ۵ رنگ">هایدلبرگ CD102 ۵ رنگ</option>
                <option value="دایکات اتوماتیک بابست">دایکات اتوماتیک بابست</option>
                <option value="خط هاردباکس اتوماتیک">خط هاردباکس اتوماتیک</option>
                <option value="لیتوگرافی CTP Suprasetter">لیتوگرافی CTP Suprasetter</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            type="button"
            @click="saveJob"
            class="px-5 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white font-bold text-xs shadow-md font-d4 cursor-pointer"
          >
            ثبت در صف لیتوگرافی
          </button>
          <button
            type="button"
            @click="modalOpen = false"
            class="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer font-d4"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const modalOpen = ref(false)
const selectedPriority = ref('all')
const draggedJob = ref<any>(null)
const dragOverStage = ref<string | null>(null)

const stages = [
  { id: 'prepress', title: '۱. لیتوگرافی و قالب‌سازی', dotColor: 'bg-amber-400' },
  { id: 'printing', title: '۲. خط چاپ افست هایدلبرگ', dotColor: 'bg-cyan-400 animate-pulse' },
  { id: 'finishing', title: '۳. دایکات، طلاکوب و جعبه‌چسبانی', dotColor: 'bg-purple-400' },
  { id: 'ready', title: '۴. انبار تحویل و بارگیری', dotColor: 'bg-emerald-400' }
]

const priorityFilters = [
  { id: 'all', label: 'همه اولویت‌ها' },
  { id: 'urgent', label: 'فوری 🔴' },
  { id: 'export', label: 'صادراتی 🟣' },
  { id: 'normal', label: 'عادی 🟢' }
]

const jobs = ref([
  {
    id: 'job-1',
    client: 'زعفران الماس قائنات',
    phone: '09123456789',
    product: 'هاردباکس کتابی ۲ لایه طلاکوب',
    qty: '۵,۰۰۰ عدد',
    due: '۱۴۰۳/۰۶/۰۵',
    priority: 'export',
    machine: 'خط هاردباکس اتوماتیک',
    stage: 'prepress'
  },
  {
    id: 'job-2',
    client: 'داروسازی پویا طب',
    phone: '09198765432',
    product: 'جعبه ایندربرد دارویی با خط بریل',
    qty: '۵۰,۰۰۰ عدد',
    due: '۱۴۰۳/۰۶/۰۳',
    priority: 'urgent',
    machine: 'هایدلبرگ CD102 ۵ رنگ',
    stage: 'printing'
  },
  {
    id: 'job-3',
    client: 'خشکبار تبریز',
    phone: '09351112233',
    product: 'کارتن لمینتی ۵ لایه صادراتی',
    qty: '۱۰,۰۰۰ عدد',
    due: '۱۴۰۳/۰۶/۰۲',
    priority: 'export',
    machine: 'دایکات اتوماتیک بابست',
    stage: 'finishing'
  },
  {
    id: 'job-4',
    client: 'صنایع غذایی مانا',
    phone: '09120001122',
    product: 'جعبه مقوایی لمینت ای‌فلوت',
    qty: '۲۵,۰۰۰ عدد',
    due: 'امروز',
    priority: 'normal',
    machine: 'انبار مرکزی شماره ۲',
    stage: 'ready'
  }
])

const newJob = reactive({
  client: '',
  phone: '09123456789',
  product: '',
  qty: '۵,۰۰۰ عدد',
  due: '۱۴۰۳/۰۶/۱۰',
  priority: 'normal',
  machine: 'هایدلبرگ CD102 ۵ رنگ',
  stage: 'prepress'
})

function getJobsByStage(stageId: string) {
  return jobs.value.filter(j => {
    if (j.stage !== stageId) return false
    if (selectedPriority.value !== 'all' && j.priority !== selectedPriority.value) return false
    return true
  })
}

function getPriorityCount(pId: string) {
  if (pId === 'all') return jobs.value.length
  return jobs.value.filter(j => j.priority === pId).length
}

function priorityLabel(p: string) {
  switch (p) {
    case 'urgent': return 'فوری'
    case 'export': return 'صادراتی'
    default: return 'عادی'
  }
}

function priorityBadgeClass(p: string) {
  switch (p) {
    case 'urgent': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    case 'export': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    default: return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
  }
}

function handleDragStart(job: any) {
  draggedJob.value = job
}

function handleDrop(targetStageId: string) {
  if (draggedJob.value) {
    draggedJob.value.stage = targetStageId
    draggedJob.value = null
    dragOverStage.value = null
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `سفارش به مرحله "${stages.find(s => s.id === targetStageId)?.title}" منتقل شد.` } }))
  }
}

function advanceStage(job: any) {
  const stageIds = ['prepress', 'printing', 'finishing', 'ready']
  const cur = stageIds.indexOf(job.stage)
  if (cur < stageIds.length - 1) {
    job.stage = stageIds[cur + 1]
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `سفارش "${job.client}" به مرحله بعدی منتقل گردید.` } }))
  }
}

function openNewJobModal() {
  newJob.client = ''
  newJob.product = ''
  modalOpen.value = true
}

function saveJob() {
  if (!newJob.client) return
  jobs.value.unshift({
    id: `job-${Date.now()}`,
    ...newJob
  })
  modalOpen.value = false
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'سفارش جدید در خط تولید ثبت شد.' } }))
}
</script>
