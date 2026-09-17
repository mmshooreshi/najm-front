<!-- pages/dash/requests.vue -->
<template>
  <div class="space-y-6">
    <!-- Header & Quick Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4 flex items-center gap-2">
          <span>مدیریت استعلام‌ها و لیدهای مشتریان (CRM)</span>
        </h2>
        <p class="text-xs text-zinc-400 font-d4">
          رهگیری زمان دقیق ثبت، پیگیری تماس‌های بی‌پاسخ، ارسال پیامک و ثبت یادداشت‌های داخلی
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="loadRequests"
          :disabled="loading"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          <AdminIcon name="refresh" class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" />
          <span>به‌روزرسانی لحظه‌ای</span>
        </button>
      </div>
    </div>

    <!-- Real Operational CRM Counters -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <!-- Total -->
      <button
        type="button"
        @click="activeTab = 'all'"
        class="p-3.5 rounded-2xl border text-right transition-all cursor-pointer space-y-1"
        :class="activeTab === 'all' ? 'bg-zinc-800 border-white/20 ring-1 ring-white/10' : 'bg-zinc-900/80 border-white/10 hover:border-white/20'"
      >
        <span class="text-[11px] text-zinc-400 font-d4 block">کل استعلام‌ها</span>
        <div class="text-lg sm:text-xl font-extrabold text-white font-mono">
          {{ requests.length }} <span class="text-[11px] font-normal text-zinc-400 font-d4">مورد</span>
        </div>
      </button>

      <!-- New -->
      <button
        type="button"
        @click="activeTab = 'new'"
        class="p-3.5 rounded-2xl border text-right transition-all cursor-pointer space-y-1"
        :class="activeTab === 'new' ? 'bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/20' : 'bg-zinc-900/80 border-white/10 hover:border-emerald-500/30'"
      >
        <div class="flex items-center justify-between">
          <span class="text-[11px] text-emerald-400 font-d4">جدید (بررسی‌نشده)</span>
          <span v-if="newCount > 0" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div class="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
          {{ newCount }} <span class="text-[11px] font-normal text-emerald-400/70 font-d4">استعلام</span>
        </div>
      </button>

      <!-- Called No Answer -->
      <button
        type="button"
        @click="activeTab = 'called_no_answer'"
        class="p-3.5 rounded-2xl border text-right transition-all cursor-pointer space-y-1"
        :class="activeTab === 'called_no_answer' ? 'bg-rose-950/40 border-rose-500/40 ring-1 ring-rose-500/20' : 'bg-zinc-900/80 border-white/10 hover:border-rose-500/30'"
      >
        <div class="flex items-center justify-between">
          <span class="text-[11px] text-rose-400 font-d4">تماس بی‌پاسخ 📵</span>
          <span v-if="noAnswerCount > 0" class="px-1.5 py-0.2 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">{{ noAnswerCount }}</span>
        </div>
        <div class="text-lg sm:text-xl font-extrabold text-rose-400 font-mono">
          {{ noAnswerCount }} <span class="text-[11px] font-normal text-rose-400/70 font-d4">مشتری</span>
        </div>
      </button>

      <!-- Contacted / In Negotiation -->
      <button
        type="button"
        @click="activeTab = 'contacted'"
        class="p-3.5 rounded-2xl border text-right transition-all cursor-pointer space-y-1"
        :class="activeTab === 'contacted' ? 'bg-amber-950/40 border-amber-500/40 ring-1 ring-amber-500/20' : 'bg-zinc-900/80 border-white/10 hover:border-amber-500/30'"
      >
        <span class="text-[11px] text-amber-400 font-d4 block">در حال پیگیری 📞</span>
        <div class="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
          {{ contactedCount }} <span class="text-[11px] font-normal text-amber-400/70 font-d4">مورد</span>
        </div>
      </button>

      <!-- Completed -->
      <button
        type="button"
        @click="activeTab = 'completed'"
        class="p-3.5 rounded-2xl border text-right transition-all cursor-pointer space-y-1"
        :class="activeTab === 'completed' ? 'bg-blue-950/40 border-blue-500/40 ring-1 ring-blue-500/20' : 'bg-zinc-900/80 border-white/10 hover:border-blue-500/30'"
      >
        <span class="text-[11px] text-blue-400 font-d4 block">پیش‌فاکتور / تکمیل ✅</span>
        <div class="text-lg sm:text-xl font-extrabold text-blue-400 font-mono">
          {{ completedCount }} <span class="text-[11px] font-normal text-blue-400/70 font-d4">سفارش</span>
        </div>
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative w-full md:w-96">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجوی نام مشتری، شرکت، تلفن، محصول یا یادداشت..."
          class="w-full h-9.5 pr-9 pl-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        />
        <AdminIcon name="search" class="w-4 h-4 text-zinc-500 absolute right-3 top-3 pointer-events-none" />
      </div>

      <!-- Quick Date / Needs Attention Filters -->
      <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 rounded-xl bg-zinc-950 border border-white/5 text-xs font-d4 custom-scrollbar">
        <button
          type="button"
          @click="dateFilter = 'all'"
          class="px-3 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer"
          :class="dateFilter === 'all' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'"
        >
          همه تاریخ‌ها
        </button>
        <button
          type="button"
          @click="dateFilter = 'today'"
          class="px-3 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          :class="dateFilter === 'today' ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400 hover:text-white'"
        >
          <span>ثبت امروز</span>
          <span v-if="todayCount > 0" class="px-1 rounded-full text-[10px] bg-white/20 font-mono">{{ todayCount }}</span>
        </button>
        <button
          type="button"
          @click="dateFilter = 'unanswered_urgent'"
          class="px-3 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          :class="dateFilter === 'unanswered_urgent' ? 'bg-rose-600 text-white font-bold' : 'text-zinc-400 hover:text-white'"
        >
          <span>نیازمند پیگیری فوری</span>
          <span v-if="urgentFollowUpCount > 0" class="px-1 rounded-full text-[10px] bg-white/20 font-mono">{{ urgentFollowUpCount }}</span>
        </button>
      </div>
    </div>

    <!-- Requests List with Detailed Journey, Exact Time & Direct Actions -->
    <div class="space-y-4">
      <div v-if="loading" class="p-16 text-center text-zinc-500 text-xs">
        <AdminIcon name="refresh" class="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-400" />
        در حال بارگذاری استعلام‌های مشتریان...
      </div>

      <div v-else-if="filteredRequests.length === 0" class="p-16 text-center text-zinc-500 text-xs space-y-2">
        <AdminIcon name="inbox" class="w-8 h-8 mx-auto text-zinc-600" />
        <p>درخواستی با مشخصات جستجو شده یافت نشد.</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="req in filteredRequests"
          :key="req.id"
          class="rounded-3xl bg-zinc-900/90 border border-white/10 p-5 space-y-4 transition-all shadow-lg hover:border-white/20"
          :class="{
            'border-emerald-500/30 bg-emerald-950/10': req.status === 'new',
            'border-rose-500/30 bg-rose-950/10': req.status === 'called_no_answer'
          }"
        >
          <!-- Customer Header, Exact Submission Time & Status -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div class="flex items-start sm:items-center gap-3.5">
              <!-- Customer Avatar Initial -->
              <div
                class="w-11 h-11 rounded-2xl font-bold text-sm flex items-center justify-center shrink-0 border"
                :class="getAvatarClass(req.status)"
              >
                {{ req.name ? req.name.charAt(0) : '؟' }}
              </div>

              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-sm sm:text-base font-bold text-white font-d4">{{ req.name || 'کاربر سایت' }}</h3>
                  
                  <span v-if="req.company" class="text-xs px-2.5 py-0.5 rounded-lg bg-white/5 text-zinc-300 font-d4 border border-white/5">
                    {{ req.company }}
                  </span>

                  <span
                    v-if="req.mockupRequested"
                    class="text-[10px] px-2.5 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 font-d4 font-semibold"
                  >
                    درخواست ماکت ۳D
                  </span>

                  <!-- Relative Time Pill -->
                  <span
                    class="text-[10px] px-2 py-0.5 rounded-md font-d4 border"
                    :class="getRelativeBadgeClass(req)"
                  >
                    {{ getRelativeTimeText(req) }}
                  </span>
                </div>

                <!-- Phone and Exact Time details -->
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 pt-0.5">
                  <div class="flex items-center gap-1.5 font-mono">
                    <span class="text-emerald-400 font-bold tracking-wider" dir="ltr">{{ req.phone }}</span>
                    <button
                      type="button"
                      @click="copyText(req.phone, 'شماره تماس کپی شد')"
                      class="text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors cursor-pointer"
                      title="کپی شماره"
                    >
                      <AdminIcon name="copy" class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span>&middot;</span>

                  <!-- Exact Date & Hour of Request -->
                  <div class="flex items-center gap-1.5 text-zinc-300 font-d4 text-[11px]">
                    <AdminIcon name="calendar" class="w-3.5 h-3.5 text-zinc-500" />
                    <span>{{ req.created }}</span>
                    <span v-if="req.createdTime" class="text-white font-bold bg-white/10 px-1.5 py-0.2 rounded font-mono">
                      {{ req.createdTime }}
                    </span>
                  </div>

                  <!-- Call Attempts Counter if > 0 -->
                  <div v-if="req.callAttempts && req.callAttempts > 0" class="flex items-center gap-1 text-rose-400 text-[11px] font-bold">
                    <span>&middot;</span>
                    <span>📵 {{ req.callAttempts }} بار تماس بی‌پاسخ</span>
                    <span v-if="req.lastCalledAt" class="text-[10px] font-normal text-zinc-400">({{ req.lastCalledAt }})</span>
                  </div>

                  <!-- SMS sent counter if > 0 -->
                  <div v-if="req.smsSentCount && req.smsSentCount > 0" class="flex items-center gap-1 text-purple-400 text-[11px] font-semibold">
                    <span>&middot;</span>
                    <span>✉️ {{ req.smsSentCount }} پیامک ارسال شد</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Dropdown & Action -->
            <div class="flex items-center gap-2.5 self-end lg:self-center">
              <span class="text-xs font-bold px-3 py-1 rounded-xl font-d4" :class="statusBadge(req.status)">
                {{ statusText(req.status) }}
              </span>

              <!-- Status Selector Dropdown -->
              <select
                :value="req.status"
                @change="onStatusSelect(req, ($event.target as HTMLSelectElement).value)"
                class="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer border border-white/10 font-d4 focus:outline-none focus:border-emerald-500"
              >
                <option value="new">استعلام جدید</option>
                <option value="called_no_answer">تماس بی‌پاسخ 📵</option>
                <option value="contacted">تماس گرفته شد / در مذاکره</option>
                <option value="completed">پیش‌فاکتور / تکمیل</option>
                <option value="cancelled">لغو / انصراف</option>
              </select>
            </div>
          </div>

          <!-- Smart Timing / Call Opportunity Indicator -->
          <div
            v-if="getTimingOpportunity(req)"
            class="p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 font-d4"
            :class="getTimingOpportunity(req)?.color"
          >
            <div class="flex items-center gap-2">
              <AdminIcon name="clock-bolt" class="w-4 h-4 shrink-0" />
              <span>{{ getTimingOpportunity(req)?.text }}</span>
            </div>
            <span class="text-[10px] opacity-75 shrink-0">بازه انتخابی مشتری: {{ req.timeSlot }}</span>
          </div>

          <!-- Packaging Requirements Specs Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-zinc-950/70 p-3.5 rounded-2xl border border-white/5">
            <div>
              <span class="text-zinc-500 text-[10px] block font-d4">محصول درخواستی:</span>
              <span class="font-bold text-zinc-200 font-d4">{{ formatCategory(req.category) }}</span>
            </div>
            <div>
              <span class="text-zinc-500 text-[10px] block font-d4">تیراژ برآوردی:</span>
              <span class="font-bold text-emerald-400 font-mono">{{ req.quantity }}</span>
            </div>
            <div>
              <span class="text-zinc-500 text-[10px] block font-d4">بازه زمانی مناسب برای تماس:</span>
              <span class="font-bold text-zinc-200 font-d4">{{ req.timeSlot || 'ساعات اداری' }}</span>
            </div>
            <div>
              <span class="text-zinc-500 text-[10px] block font-d4">دستگاه و مرورگر کاربر:</span>
              <span class="font-mono text-zinc-400 text-[11px]">{{ req.device || 'Mobile' }}</span>
            </div>
          </div>

          <!-- Customer Description / Notes -->
          <p v-if="req.description" class="text-xs text-zinc-300 bg-zinc-950/40 p-3 rounded-xl border border-white/5 leading-relaxed font-sans">
            <strong class="text-zinc-400 font-d4">توضیحات مشتری: </strong>{{ req.description }}
          </p>

          <!-- Internal CRM Staff Notes (Interactive Follow-up) -->
          <div class="p-3 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-zinc-300 font-d4 flex items-center gap-1.5">
                <AdminIcon name="pencil" class="w-3.5 h-3.5 text-emerald-400" />
                <span>یادداشت و سوابق پیگیری داخلی تیم فروش:</span>
              </span>
              <span v-if="req.updatedAt" class="text-[10px] text-zinc-500 font-mono">
                آخرین تغییر: {{ formatDateTime(req.updatedAt) }}
              </span>
            </div>

            <div class="flex gap-2">
              <input
                v-model="req._draftNotes"
                type="text"
                placeholder="مثلاً: با مشتری صحبت شد، منتظر تایید ابعاد هستند / ساعت ۱۶ مجدد تماس گرفته شود..."
                class="flex-1 h-8 px-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                @keyup.enter="saveNotes(req)"
              />
              <button
                type="button"
                @click="saveNotes(req)"
                :disabled="req._savingNotes"
                class="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer border border-white/10 transition-colors shrink-0 font-d4"
              >
                <span v-if="req._savingNotes">در حال ثبت...</span>
                <span v-else>ذخیره یادداشت</span>
              </button>
            </div>
          </div>

          <!-- Customer Journey & Attribution Tracker (Compact) -->
          <div v-if="req.journey || req.referer" class="p-2.5 rounded-xl bg-zinc-950/40 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
            <div class="flex items-center gap-1.5 truncate max-w-xl" dir="ltr">
              <AdminIcon name="sparkles" class="w-3 h-3 text-emerald-500/80 shrink-0" />
              <span class="font-mono text-zinc-400 truncate">{{ req.journey || 'صفحه اصلی' }}</span>
            </div>
            <div class="text-[10px] text-zinc-500 font-d4 shrink-0">
              <span>مدت حضور: {{ req.timeOnSite || '۱ دقیقه' }}</span>
              <span class="mx-1">&middot;</span>
              <span>منبع: {{ req.referer || 'ورود مستقیم' }}</span>
            </div>
          </div>

          <!-- Bottom Action Buttons: Fast Phone, Missed Call 1-Click, SMS, WhatsApp -->
          <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
            <div class="flex flex-wrap items-center gap-2">
              <!-- Direct Phone Call -->
              <a
                :href="`tel:${req.phone}`"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors font-d4"
              >
                <AdminIcon name="phone" class="w-3.5 h-3.5" />
                <span>تماس تلفنی</span>
              </a>

              <!-- 1-Click Missed Call ("تماس گرفتیم پاسخ نداد") -->
              <button
                type="button"
                @click="recordMissedCall(req)"
                class="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-d4"
                title="ثبت عدم پاسخ و باز کردن پیامک پیگیری"
              >
                <span>📵</span>
                <span>تماس گرفتیم پاسخ نداد</span>
                <span v-if="req.callAttempts && req.callAttempts > 0" class="px-1.5 py-0.2 rounded bg-rose-500/30 text-[10px] font-mono">
                  {{ req.callAttempts }}
                </span>
              </button>

              <!-- SMS Sender Drawer / Modal -->
              <button
                type="button"
                @click="openSmsModal(req)"
                class="px-3.5 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-d4"
              >
                <AdminIcon name="mail" class="w-3.5 h-3.5" />
                <span>ارسال پیامک پیگیری</span>
              </button>

              <!-- WhatsApp Direct Link -->
              <a
                :href="getWhatsAppUrl(req)"
                target="_blank"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors font-d4"
              >
                <AdminIcon name="chat" class="w-3.5 h-3.5" />
                <span>ارسال واتس‌اپ</span>
              </a>
            </div>

            <!-- Delete with Safe Confirmation -->
            <div class="flex items-center gap-1">
              <button
                v-if="deleteConfirmId !== req.id"
                type="button"
                @click="deleteConfirmId = req.id"
                class="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                title="حذف استعلام"
              >
                <AdminIcon name="trash" class="w-3.5 h-3.5" />
              </button>
              <div v-else class="flex items-center gap-1 bg-rose-950/60 p-1 rounded-xl border border-rose-500/40 text-[11px] font-d4">
                <span class="text-rose-300 px-1">حذف شود؟</span>
                <button
                  type="button"
                  @click="deleteRequest(req.id)"
                  class="px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold cursor-pointer"
                >
                  بله
                </button>
                <button
                  type="button"
                  @click="deleteConfirmId = null"
                  class="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  خیر
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SMS Follow-Up Modal / Drawer -->
    <div
      v-if="smsModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      @click.self="smsModalOpen = false"
    >
      <div class="w-full max-w-lg rounded-3xl bg-zinc-900 border border-white/15 p-6 shadow-2xl space-y-5 text-white">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <AdminIcon name="mail" class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold font-d4 text-white">
                ارسال پیامک به {{ activeSmsLead?.name || 'مشتری' }}
              </h3>
              <p class="text-[11px] text-zinc-400 font-mono" dir="ltr">
                {{ activeSmsLead?.phone }}
              </p>
            </div>
          </div>
          <button @click="smsModalOpen = false" class="text-zinc-400 hover:text-white p-1 cursor-pointer">
            <AdminIcon name="x" class="w-4 h-4" />
          </button>
        </div>

        <!-- Template Selector -->
        <div class="space-y-3 text-xs">
          <div class="space-y-1.5">
            <label class="font-bold text-zinc-300 font-d4 block">انتخاب الگوی پیامک آماده:</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                v-for="tpl in smsTemplates"
                :key="tpl.id"
                @click="selectSmsTemplate(tpl.id)"
                class="p-2.5 rounded-xl border text-right font-d4 transition-all cursor-pointer text-xs"
                :class="selectedSmsTemplateId === tpl.id ? 'bg-purple-950/40 border-purple-500/50 text-white font-bold' : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-zinc-200'"
              >
                <div class="font-bold">{{ tpl.title }}</div>
                <div class="text-[10px] text-zinc-500 truncate pt-0.5">{{ tpl.desc }}</div>
              </button>
            </div>
          </div>

          <!-- SMS Textarea Editable -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="font-bold text-zinc-300 font-d4">متن پیامک قابل ویرایش:</label>
              <span class="text-[10px] text-zinc-500 font-mono">{{ smsText.length }} کاراکتر</span>
            </div>
            <textarea
              v-model="smsText"
              rows="5"
              class="w-full p-3.5 rounded-2xl bg-zinc-950 border border-white/10 text-xs text-white leading-relaxed focus:border-purple-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        <!-- Practical 1-Click Fast Dispatch Options -->
        <div class="space-y-3 pt-2 border-t border-white/10">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <!-- 1-Click Native Mobile SMS -->
            <a
              :href="nativeSmsHref"
              @click="recordNativeSms"
              class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md font-d4 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <AdminIcon name="chat" class="w-3.5 h-3.5" />
              <span>باز کردن در پیامک موبایل</span>
            </a>

            <!-- Copy Text Button -->
            <button
              type="button"
              @click="copyText(smsText, 'متن پیامک با موفقیت کپی شد')"
              class="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-white/10 font-d4 flex items-center gap-1.5 cursor-pointer"
            >
              <AdminIcon name="copy" class="w-3.5 h-3.5" />
              <span>کپی متن پیامک</span>
            </button>

            <!-- Send via System API -->
            <button
              type="button"
              @click="sendSystemSms"
              :disabled="sendingSms"
              class="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-purple-300 font-semibold text-xs border border-purple-500/30 font-d4 flex items-center gap-1.5 cursor-pointer"
            >
              <AdminIcon name="mail" class="w-3.5 h-3.5" :class="sendingSms ? 'animate-spin' : ''" />
              <span>{{ sendingSms ? 'در حال ارسال...' : 'ثبت و ارسال سیستمی' }}</span>
            </button>
          </div>

          <p class="text-[10px] text-zinc-500 font-d4 text-center">
            نکته: با زدن دکمه «باز کردن در پیامک»، متن فوق مستقیماً در نرم‌افزار پیامک تلفن همراه شما باز می‌شود.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const loading = ref(true)
const searchQuery = ref('')
const activeTab = ref('all')
const dateFilter = ref('all')
const requests = ref<any[]>([])
const deleteConfirmId = ref<string | null>(null)

// SMS Modal States
const smsModalOpen = ref(false)
const activeSmsLead = ref<any>(null)
const selectedSmsTemplateId = ref('missed_call')
const smsText = ref('')
const sendingSms = ref(false)

const smsTemplates = [
  {
    id: 'missed_call',
    title: 'عدم پاسخگویی تماس 📵',
    desc: 'پیگیری تماس و اعلام آمادگی'
  },
  {
    id: 'quote_ready',
    title: 'صدور پیش‌فاکتور 📄',
    desc: 'اطلاع‌رسانی آماده‌شدن قیمت'
  },
  {
    id: 'mockup_ready',
    title: 'ماکت ۳D و تیغ 📦',
    desc: 'آماده‌سازی فایل فنی قالب'
  }
]

// Counters
const newCount = computed(() => requests.value.filter(r => r.status === 'new').length)
const noAnswerCount = computed(() => requests.value.filter(r => r.status === 'called_no_answer').length)
const contactedCount = computed(() => requests.value.filter(r => r.status === 'contacted').length)
const completedCount = computed(() => requests.value.filter(r => r.status === 'completed').length)

const todayCount = computed(() => {
  return requests.value.filter(r => isToday(r)).length
})

const urgentFollowUpCount = computed(() => {
  return requests.value.filter(r => r.status === 'new' || r.status === 'called_no_answer').length
})

function isToday(req: any): boolean {
  const ts = req.timestamp || (req.createdAt ? new Date(req.createdAt).getTime() : 0)
  if (!ts) return false
  const d = new Date(ts)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

// Filtered Requests
const filteredRequests = computed(() => {
  return requests.value.filter(r => {
    // Tab filter
    if (activeTab.value !== 'all' && r.status !== activeTab.value) return false

    // Date filter
    if (dateFilter.value === 'today' && !isToday(r)) return false
    if (dateFilter.value === 'unanswered_urgent' && r.status !== 'new' && r.status !== 'called_no_answer') return false

    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return (
        r.name?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.company?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.notes?.toLowerCase().includes(q) ||
        r._draftNotes?.toLowerCase().includes(q) ||
        r.created?.includes(q)
      )
    }

    return true
  })
})

function formatCategory(cat?: string): string {
  if (!cat) return 'بسته‌بندی اختصاصی'
  const dict: Record<string, string> = {
    'folding-carton': 'جعبه مقوایی و ایندربرد',
    'luxury-hardbox': 'هاردباکس لوکس (جعبه سخت)',
    'corrugated': 'کارتن و لمینت ۳ و ۵ لایه',
    'shopping-bag': 'ساک دستی اختصاصی و کرافت',
    'hangtag-labels': 'اتیکت و لیبل برجسته'
  }
  return dict[cat] || cat
}

function statusText(status: string) {
  switch (status) {
    case 'new': return 'استعلام جدید'
    case 'called_no_answer': return 'تماس بی‌پاسخ 📵'
    case 'contacted': return 'تماس گرفته شد'
    case 'completed': return 'پیش‌فاکتور / تکمیل'
    case 'cancelled': return 'لغو شده'
    default: return status || 'جدید'
  }
}

function statusBadge(status: string) {
  switch (status) {
    case 'new': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
    case 'called_no_answer': return 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
    case 'contacted': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
    case 'completed': return 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
    case 'cancelled': return 'bg-zinc-800 text-zinc-500 border border-white/5'
    default: return 'bg-zinc-800 text-zinc-400'
  }
}

function getAvatarClass(status: string) {
  switch (status) {
    case 'new': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    case 'called_no_answer': return 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    case 'contacted': return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    case 'completed': return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    default: return 'bg-zinc-800 text-zinc-400 border-white/10'
  }
}

function getRelativeTimeText(req: any): string {
  const ts = req.timestamp || (req.createdAt ? new Date(req.createdAt).getTime() : 0)
  if (!ts) return req.created || 'اخیراً'

  const diffMs = Date.now() - ts
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'همین الان'
  if (diffMinutes < 60) return `${diffMinutes} دقیقه پیش`
  if (diffHours < 24) {
    const isT = new Date(ts).toDateString() === new Date().toDateString()
    if (isT) return `امروز (${diffHours} ساعت پیش)`
    return 'دیروز'
  }
  if (diffDays === 1) return 'دیروز'
  if (diffDays < 7) return `${diffDays} روز پیش`
  return `${Math.floor(diffDays / 7)} هفته پیش`
}

function getRelativeBadgeClass(req: any): string {
  if (isToday(req)) {
    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  }
  return 'bg-white/5 text-zinc-400 border-white/10'
}

function getTimingOpportunity(req: any) {
  const slot = req.timeSlot || ''
  if (!isToday(req)) {
    if (req.status === 'new' || req.status === 'called_no_answer') {
      return {
        text: '⚡ ثبت شده در روزهای گذشته: در اولین فرصت ساعات کاری تماس گرفته شود.',
        color: 'bg-amber-950/20 text-amber-300 border-amber-500/30'
      }
    }
    return null
  }

  const currentHour = new Date().getHours()
  if (slot.includes('عصر') || slot.includes('۱۵') || slot.includes('۱۸')) {
    if (currentHour < 18) {
      return {
        text: '⚡ بازه مناسب تماس: امروز بعدازظهر (ساعت ۱۵ الی ۱۸) - در صورت امکان در همین بازه تماس بگیرید.',
        color: 'bg-emerald-950/30 text-emerald-300 border-emerald-500/40'
      }
    }
  } else if (slot.includes('ظهر') || slot.includes('۱۲')) {
    if (currentHour < 15) {
      return {
        text: '⚡ بازه مناسب تماس: امروز ظهر (ساعت ۱۲ الی ۱۵)',
        color: 'bg-cyan-950/30 text-cyan-300 border-cyan-500/40'
      }
    }
  } else if (slot.includes('صبح') || slot.includes('۹')) {
    if (currentHour < 12) {
      return {
        text: '⚡ بازه مناسب تماس: امروز صبح (ساعت ۹ الی ۱۲)',
        color: 'bg-teal-950/30 text-teal-300 border-teal-500/40'
      }
    }
  }

  return {
    text: `بازه انتخابی مشتری: ${slot || 'ساعات کاری رسمی'}`,
    color: 'bg-zinc-950/40 text-zinc-300 border-white/10'
  }
}

function formatDateTime(isoStr?: string): string {
  if (!isoStr) return ''
  try {
    const d = new Date(isoStr)
    return new Intl.DateTimeFormat('fa-IR', {
      timeZone: 'Asia/Tehran',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d)
  } catch {
    return ''
  }
}

function getWhatsAppUrl(req: any): string {
  const cleanPhone = (req.phone || '').replace(/^0/, '98').replace(/\s+/g, '')
  const msg = `سلام ${req.name || 'همکار'} عزیز، از مجتمع چاپ و بسته‌بندی نجم در خصوص درخواست مشاوره ${formatCategory(req.category)} با شما در ارتباطیم.`
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
}

// Status Updates
async function onStatusSelect(req: any, newStatus: string) {
  req.status = newStatus
  await $fetch(`/api/admin/requests/${req.id}`, {
    method: 'PATCH',
    body: { status: newStatus }
  }).catch(() => null)
  window.dispatchEvent(new CustomEvent('toast', {
    detail: { type: 'success', text: `وضعیت استعلام به "${statusText(newStatus)}" تغییر یافت.` }
  }))
}

// 1-Click "تماس گرفتیم پاسخ نداد" Flow
async function recordMissedCall(req: any) {
  const now = new Date()
  const timeStr = new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit'
  }).format(now)

  const prevAttempts = typeof req.callAttempts === 'number' ? req.callAttempts : 0
  const newAttempts = prevAttempts + 1
  const lastCalledAt = `امروز ساعت ${timeStr}`

  req.status = 'called_no_answer'
  req.callAttempts = newAttempts
  req.lastCalledAt = lastCalledAt

  // Persist to backend
  await $fetch(`/api/admin/requests/${req.id}`, {
    method: 'PATCH',
    body: {
      status: 'called_no_answer',
      callAttempts: newAttempts,
      lastCalledAt
    }
  }).catch(() => null)

  window.dispatchEvent(new CustomEvent('toast', {
    detail: { type: 'info', text: `عدم پاسخ ثبت شد (تلاش ${newAttempts} بار). الگوی پیامک آماده شد.` }
  }))

  // Automatically open SMS modal with Reihane's missed call template pre-selected
  openSmsModal(req, 'missed_call')
}

// Save internal staff notes
async function saveNotes(req: any) {
  req._savingNotes = true
  try {
    const text = req._draftNotes || ''
    req.notes = text
    await $fetch(`/api/admin/requests/${req.id}`, {
      method: 'PATCH',
      body: { notes: text }
    })
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', text: 'یادداشت داخلی با موفقیت ذخیره شد.' }
    }))
  } catch {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'error', text: 'خطا در ثبت یادداشت' }
    }))
  } finally {
    req._savingNotes = false
  }
}

// SMS Drawer / Modal Logic
function openSmsModal(req: any, templateId = 'missed_call') {
  activeSmsLead.value = req
  selectedSmsTemplateId.value = templateId
  selectSmsTemplate(templateId)
  smsModalOpen.value = true
}

function selectSmsTemplate(tplId: string) {
  selectedSmsTemplateId.value = tplId
  const name = activeSmsLead.value?.name || 'مشتری گرامی'

  if (tplId === 'missed_call') {
    // Exact template requested by Reihane
    smsText.value = `سلام وقت بخیر
از مجتمع چاپ و بسته‌بندی نجم تماس گرفتم خدمتتون جهت پیگیری سفارشتون. هر زمان تمایل داشتید تماس بگیرید در خدمتتون هستیم.
با تشکر
📞 ۰۲۱۶۶۷۹۷۹۱۱
📱 ۰۹۹۰۳۴۰۰۰۷۴`
  } else if (tplId === 'quote_ready') {
    smsText.value = `${name} عزیز، پیش‌فاکتور استعلام سفارش شما در مجتمع چاپ و بسته‌بندی نجم صادر گردید. جهت دریافت فایل یا هماهنگی نهایی با شماره ۰۲۱۶۶۷۹۷۹۱۱ یا واتس‌اپ ۰۹۹۰۳۴۰۰۰۷۴ در تماس باشید.`
  } else if (tplId === 'mockup_ready') {
    smsText.value = `${name} عزیز، ماکت سه‌بعدی و فایل قالب تیغ بسته‌بندی شما آماده بررسی است. کارشناسان ما آماده پاسخگویی و اعمال تغییرات هستند. مجتمع چاپ نجم ۰۲۱۶۶۷۹۷۹۱۱`
  }
}

const nativeSmsHref = computed(() => {
  const phone = (activeSmsLead.value?.phone || '').replace(/\s+/g, '')
  return `sms:${phone}?body=${encodeURIComponent(smsText.value)}`
})

async function recordNativeSms() {
  if (!activeSmsLead.value) return
  const lead = activeSmsLead.value
  lead.smsSentCount = (lead.smsSentCount || 0) + 1

  await $fetch(`/api/admin/requests/${lead.id}`, {
    method: 'PATCH',
    body: { smsSentCount: lead.smsSentCount }
  }).catch(() => null)

  window.dispatchEvent(new CustomEvent('toast', {
    detail: { type: 'success', text: 'پیامک در اپلیکیشن باز شد و در سیستم ثبت گردید.' }
  }))
}

async function sendSystemSms() {
  if (!activeSmsLead.value) return
  sendingSms.value = true
  try {
    const res: any = await $fetch('/api/admin/requests/sms', {
      method: 'POST',
      body: {
        leadId: activeSmsLead.value.id,
        phone: activeSmsLead.value.phone,
        name: activeSmsLead.value.name,
        message: smsText.value,
        templateTitle: smsTemplates.find(t => t.id === selectedSmsTemplateId.value)?.title
      }
    })

    activeSmsLead.value.smsSentCount = (activeSmsLead.value.smsSentCount || 0) + 1
    smsModalOpen.value = false

    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', text: res.message || 'پیامک در سامانه ثبت گردید.' }
    }))
  } catch (err: any) {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'error', text: err?.data?.error || 'خطا در ارسال پیامک' }
    }))
  } finally {
    sendingSms.value = false
  }
}

function copyText(str: string, successMsg: string) {
  if (!str) return
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(str).then(() => {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'success', text: successMsg }
      }))
    }).catch(() => {})
  }
}

async function deleteRequest(id: string) {
  try {
    await $fetch(`/api/admin/requests/${id}`, {
      method: 'DELETE'
    })
    requests.value = requests.value.filter(r => r.id !== id)
    deleteConfirmId.value = null
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', text: 'استعلام با موفقیت از سیستم حذف گردید.' }
    }))
  } catch {
    requests.value = requests.value.filter(r => r.id !== id)
    deleteConfirmId.value = null
  }
}

async function loadRequests() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/admin/requests')
    const rawItems = res?.items || []
    requests.value = rawItems.map((item: any) => ({
      ...item,
      _draftNotes: item.notes || '',
      _savingNotes: false
    }))
  } catch (err) {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRequests()
})
</script>
