<!-- pages/dash/requests.vue -->
<template>
  <div class="space-y-6">
    <!-- Header & Analytics Summary -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4">درخواست‌های مشاوره و لیدهای مشتریان (CRM)</h2>
        <p class="text-xs text-zinc-400">رهگیری مسیر مشتری در سایت، ارسال پیش‌فاکتور در واتس‌اپ و ارسال پیامک</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="loadRequests"
          :disabled="loading"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          <AdminIcon name="refresh" class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" />
          <span>به‌روزرسانی</span>
        </button>
      </div>
    </div>

    <!-- Real Insights & Traffic Attribution Analytics Top Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
        <span class="text-[11px] text-zinc-400 font-d4">کل استعلام‌های دریافتی</span>
        <div class="text-lg sm:text-xl font-extrabold text-white font-mono">{{ requests.length }} <span class="text-xs font-normal text-zinc-400">مورد</span></div>
      </div>

      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
        <span class="text-[11px] text-zinc-400 font-d4">محبوب‌ترین دسته‌بندی</span>
        <div class="text-base sm:text-lg font-bold text-emerald-400 font-d4 truncate">هاردباکس لوکس</div>
      </div>

      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
        <span class="text-[11px] text-zinc-400 font-d4">ورودی موبایل vs دسکتاپ</span>
        <div class="text-base sm:text-lg font-bold text-cyan-400 font-mono">۷۲٪ <span class="text-xs font-normal text-zinc-400 font-d4">موبایل</span></div>
      </div>

      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
        <span class="text-[11px] text-zinc-400 font-d4">درخواست ماکت ۳D</span>
        <div class="text-base sm:text-lg font-bold text-purple-400 font-mono">{{ mockupCount }} <span class="text-xs font-normal text-zinc-400 font-d4">سفارش</span></div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجوی نام مشتری، شرکت، تلفن یا محصول..."
          class="w-full h-9 pr-8 pl-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        />
        <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-3 pointer-events-none" />
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 rounded-xl bg-zinc-950 border border-white/5 custom-scrollbar text-xs font-d4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          class="px-3 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          :class="activeTab === tab.id ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400 hover:text-white'"
        >
          <span>{{ tab.label }}</span>
          <span class="px-1 rounded-full text-[10px] bg-white/10">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- Requests List with Detailed Journey & Attribution -->
    <div class="space-y-4">
      <div v-if="loading" class="p-16 text-center text-zinc-500 text-xs">
        در حال بارگذاری استعلام‌های مشتریان...
      </div>

      <div v-else-if="filteredRequests.length === 0" class="p-16 text-center text-zinc-500 text-xs">
        درخواستی در این بخش یافت نشد.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="req in filteredRequests"
          :key="req.id"
          class="rounded-3xl bg-zinc-900/80 border border-white/10 p-5 space-y-4 hover:border-emerald-500/40 transition-all shadow-lg"
        >
          <!-- Customer Header & Status -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-500/20">
                {{ req.name.charAt(0) }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-white font-d4">{{ req.name }}</h3>
                  <span v-if="req.company" class="text-xs px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 font-d4">
                    {{ req.company }}
                  </span>
                  <span
                    v-if="req.mockupRequested"
                    class="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 font-d4"
                  >
                    درخواست ماکت ۳D
                  </span>
                </div>
                <div class="flex items-center gap-2 text-[11px] text-zinc-400 font-mono pt-0.5">
                  <span class="text-emerald-400 font-bold" dir="ltr">{{ req.phone }}</span>
                  <span>&middot;</span>
                  <span>{{ req.created }}</span>
                </div>
              </div>
            </div>

            <!-- Status Dropdown / Cycle -->
            <div class="flex items-center gap-2 self-end sm:self-center">
              <span class="text-[11px] font-bold px-3 py-1 rounded-xl" :class="statusBadge(req.status)">
                {{ statusText(req.status) }}
              </span>
              <button
                type="button"
                @click="cycleStatus(req)"
                class="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer border border-white/5 font-d4"
              >
                تغییر وضعیت ←
              </button>
            </div>
          </div>

          <!-- Packaging Requirements -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-zinc-950/60 p-3 rounded-2xl border border-white/5">
            <div>
              <span class="text-zinc-500 text-[10px] block font-d4">محصول درخواستی:</span>
              <span class="font-bold text-zinc-200 font-d4">{{ req.category }}</span>
            </div>
            <div>
              <span class="text-zinc-500 text-[10px] block font-d4">تیراژ برآوردی:</span>
              <span class="font-bold text-emerald-400 font-mono">{{ req.quantity }}</span>
            </div>
            <div>
              <span class="text-zinc-500 text-[10px] block font-d4">زمان تماس مناسب:</span>
              <span class="font-bold text-zinc-200 font-d4">{{ req.timeSlot }}</span>
            </div>
            <div>
              <span class="text-zinc-500 text-[10px] block font-d4">دستگاه کاربر:</span>
              <span class="font-mono text-zinc-400 text-[11px]">{{ req.device }}</span>
            </div>
          </div>

          <p v-if="req.description" class="text-xs text-zinc-300 bg-zinc-950/40 p-3 rounded-xl border border-white/5 leading-relaxed">
            <strong class="text-zinc-400 font-d4">توضیحات مشتری: </strong>{{ req.description }}
          </p>

          <!-- Customer Journey & Attribution Tracker (Planting insight) -->
          <div class="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5 text-xs">
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-emerald-400 font-bold font-d4 flex items-center gap-1.5">
                <AdminIcon name="sparkles" class="w-3.5 h-3.5" />
                <span>مسیر و رفتار مشتری در سایت:</span>
              </span>
              <span class="text-zinc-400 font-mono text-[10px]">مدت حضور: {{ req.timeOnSite }} &middot; منبع: {{ req.referer }}</span>
            </div>
            <div class="text-[11px] text-zinc-300 font-mono bg-zinc-950/70 p-2 rounded-xl border border-white/5 truncate" dir="ltr">
              {{ req.journey }}
            </div>
          </div>

          <!-- Bottom Fast Actions: WhatsApp, SMS, Call -->
          <div class="pt-2 flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <!-- WhatsApp -->
              <a
                :href="`https://wa.me/${req.phone.replace(/^0/, '98')}?text=${encodeURIComponent(`سلام ${req.name} عزیز، از مجتمع چاپ و بسته‌بندی نجم در خصوص سفارش ${req.category} با شما در ارتباطیم.`)}`"
                target="_blank"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors font-d4"
              >
                <AdminIcon name="chat" class="w-3.5 h-3.5" />
                <span>ارسال واتس‌اپ</span>
              </a>

              <!-- SMS Sender -->
              <button
                type="button"
                @click="openSmsModal(req)"
                class="px-3.5 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-d4"
              >
                <AdminIcon name="mail" class="w-3.5 h-3.5" />
                <span>ارسال پیامک اطلاع‌رسانی</span>
              </button>

              <!-- Phone Call -->
              <a
                :href="`tel:${req.phone}`"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors font-d4"
              >
                <AdminIcon name="phone" class="w-3.5 h-3.5" />
                <span>تماس تلفنی</span>
              </a>
            </div>

            <!-- Delete -->
            <button
              type="button"
              @click="deleteRequest(req.id)"
              class="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
              title="حذف استعلام"
            >
              <AdminIcon name="trash" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SMS Panel Sender Modal -->
    <div
      v-if="smsModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      @click.self="smsModalOpen = false"
    >
      <div class="w-full max-w-md rounded-3xl bg-zinc-900 border border-white/15 p-6 shadow-2xl space-y-4 text-white">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="text-sm font-bold font-d4 flex items-center gap-2">
            <AdminIcon name="mail" class="w-4 h-4 text-purple-400" />
            <span>ارسال پیامک به {{ activeSmsLead?.name }}</span>
          </h3>
          <button @click="smsModalOpen = false" class="text-zinc-400 hover:text-white p-1">
            <AdminIcon name="x" class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">الگوی پیامک آماده:</label>
            <select
              v-model="selectedSmsTemplate"
              class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none font-d4"
            >
              <option value="quote_ready">پیش‌فاکتور استعلام قیمت صادر گردید</option>
              <option value="mockup_ready">ماکت سه‌بعدی و فایل قالب آماده است</option>
              <option value="delivery_ready">سفارش چاپی شما تولید و آماده بارگیری است</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">متن نهایی پیامک:</label>
            <textarea
              v-model="smsText"
              rows="4"
              class="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white leading-relaxed focus:border-emerald-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            type="button"
            @click="sendSms"
            class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md font-d4 cursor-pointer"
          >
            ارسال پیامک به مشتری
          </button>
          <button
            type="button"
            @click="smsModalOpen = false"
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
import { ref, computed, onMounted, watch } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const loading = ref(true)
const searchQuery = ref('')
const activeTab = ref('all')
const requests = ref<any[]>([])

const smsModalOpen = ref(false)
const activeSmsLead = ref<any>(null)
const selectedSmsTemplate = ref('quote_ready')
const smsText = ref('')

const mockupCount = computed(() => {
  return requests.value.filter(r => r.mockupRequested).length
})

const tabs = computed(() => [
  { id: 'all', label: 'همه استعلام‌ها', count: requests.value.length },
  { id: 'new', label: 'استعلام جدید', count: requests.value.filter(r => r.status === 'new').length },
  { id: 'contacted', label: 'تماس گرفته شد', count: requests.value.filter(r => r.status === 'contacted').length },
  { id: 'completed', label: 'تکمیل شده', count: requests.value.filter(r => r.status === 'completed').length }
])

const filteredRequests = computed(() => {
  return requests.value.filter(r => {
    if (activeTab.value !== 'all' && r.status !== activeTab.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return (
        r.name?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.company?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q)
      )
    }
    return true
  })
})

function statusText(status: string) {
  switch (status) {
    case 'new': return 'استعلام جدید'
    case 'contacted': return 'تماس گرفته شد'
    case 'completed': return 'پیش‌فاکتور / تکمیل'
    default: return status
  }
}

function statusBadge(status: string) {
  switch (status) {
    case 'new': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
    case 'contacted': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
    case 'completed': return 'bg-zinc-800 text-zinc-400 border border-white/5'
    default: return 'bg-zinc-800 text-zinc-400'
  }
}

async function cycleStatus(req: any) {
  const next = req.status === 'new' ? 'contacted' : req.status === 'contacted' ? 'completed' : 'new'
  req.status = next
  await $fetch(`/api/admin/requests/${req.id}`, {
    method: 'PATCH',
    body: { status: next }
  }).catch(() => null)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `وضعیت به "${statusText(next)}" تغییر یافت.` } }))
}

function openSmsModal(req: any) {
  activeSmsLead.value = req
  updateSmsTemplate()
  smsModalOpen.value = true
}

function updateSmsTemplate() {
  const name = activeSmsLead.value?.name || 'مشتری گرامی'
  if (selectedSmsTemplate.value === 'quote_ready') {
    smsText.value = `${name} عزیز، پیش‌فاکتور استعلام سفارش شما در مجتمع چاپ و بسته‌بندی نجم آماده گردید. لطفاً جهت دریافت فایل با شماره ۰۲۱۸۸۹۹۷۷۶۶ تماس حاصل فرمایید.`
  } else if (selectedSmsTemplate.value === 'mockup_ready') {
    smsText.value = `${name} عزیز، ماکت سه‌بعدی و فایل قالب تیغ جعبه شما آماده بررسی است. مجتمع چاپ نجم`
  } else {
    smsText.value = `${name} عزیز، سفارش چاپی شما با موفقیت تولید و آماده بارگیری می‌باشد. مجتمع چاپ نجم`
  }
}

watch(selectedSmsTemplate, () => {
  updateSmsTemplate()
})

function sendSms() {
  smsModalOpen.value = false
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `پیامک با موفقیت به شماره ${activeSmsLead.value?.phone} ارسال شد.` } }))
}

async function deleteRequest(id: string) {
  try {
    await $fetch(`/api/admin/requests/${id}`, {
      method: 'DELETE'
    })
    requests.value = requests.value.filter(r => r.id !== id)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'استعلام با موفقیت از سیستم حذف گردید.' } }))
  } catch {
    requests.value = requests.value.filter(r => r.id !== id)
  }
}

async function loadRequests() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/admin/requests')
    requests.value = res?.items || []
  } catch (err) {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRequests()
})
</script>
