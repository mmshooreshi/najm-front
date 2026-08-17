<!-- pages/about/index.vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-najmback">
    <!-- Stable Fixed Sub Navigation (Scroll-spy) -->
    <nav class="fixed top-16 inset-x-0 z-30 bg-white/90 backdrop-blur-md border-b border-najmborder/60 shadow-2xs py-2.5 px-4 transition-all">
      <ul class="flex items-center gap-2 overflow-x-auto whitespace-nowrap mx-auto w-max py-0.5 navcont">
        <li
          v-for="item in sections"
          :key="item.id"
          class="transition-all duration-200 rounded-full"
        >
          <button
            @click="scrollToSection(item.id)"
            class="block px-4 py-1.5 text-xs text-d4 rounded-full transition-all cursor-pointer"
            :class="[
              activeSection === item.id
                ? 'bg-najmgreen text-white shadow-xs font-bold'
                : 'bg-najmgrey text-gray-700 hover:bg-gray-200 font-medium'
            ]"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </nav>

    <!-- Main Content Container -->
    <div class="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      <!-- Section 1: Hero & Vision (with staff.png and machines-back.png) -->
      <section id="vision" class="scroll-mt-36 space-y-8">
        <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-najmborder/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-5">
            <span class="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
              درباره مجتمع چاپ و بسته‌بندی نجم
            </span>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight text-d4">
              نوآوری در چاپ افست، دقت در ساختار بسته‌بندی
            </h1>
            <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
              مجتمع چاپ نجم با اتکا به بیش از دو دهه سابقه صنعتی، تجهیز خطوط پیشرفته هایدلبرگ و سیستم‌های تمام‌اتوماتیک پس از چاپ، به عنوان بازوی اجرایی معتبرترین برندهای دارویی، آرایشی، غذایی و تجاری کشور فعالیت می‌کند.
            </p>
            
            <!-- Quick Stats -->
            <div class="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-center">
              <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
                <div class="text-xl sm:text-2xl font-extrabold text-najmgreen mb-0.5 text-d4">+۲۵ سال</div>
                <div class="text-[11px] text-gray-600">سابقه مستمر صنعتی</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
                <div class="text-xl sm:text-2xl font-extrabold text-najmgreen mb-0.5 text-d4">+۱۵ میلیون</div>
                <div class="text-[11px] text-gray-600">تیراژ تولید سالانه</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
                <div class="text-xl sm:text-2xl font-extrabold text-najmgreen mb-0.5 text-d4">۹۹.۸٪</div>
                <div class="text-[11px] text-gray-600">انطباق دقیق رنگی</div>
              </div>
            </div>
          </div>

          <!-- Hero Image Asset -->
          <div class="lg:col-span-5 relative rounded-3xl overflow-hidden bg-najmgrey border border-najmborder/40 aspect-[4/3] lg:aspect-square flex items-center justify-center group shadow-xs">
            <img
              src="/images/about/staff.png"
              alt="تیم متخصص و خطوط تولید چاپ نجم"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
            <div class="absolute bottom-4 right-4 text-white text-right">
              <div class="text-xs font-bold text-d4">تیم متخصص مهندسی چاپ و تولید</div>
              <div class="text-[10px] text-white/80">مجتمع تخصصی چاپ و بسته‌بندی نجم</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Our Heritage & Engineering Leads (person-1, person-2, person-3) -->
      <section id="story" class="scroll-mt-36 space-y-8">
        <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-najmborder/40 space-y-8">
          <div class="max-w-3xl space-y-3">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgrey text-gray-800 border border-gray-200 text-d4">
              سرمایه انسانی و تخصص فنی
            </span>
            <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 text-d4">
              تیم متخصص؛ قلب تپنده کیفیت و دقت در چاپ نجم
            </h2>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              هر مرحله از فرآیند تولید زیر نظر کارشناسان خبره لیتوگرافی، اپراتورهای ارشد چاپ افست و متخصصان کنترل کیفی هدایت می‌شود تا کیفیت نهایی همواره فراتر از انتظار مشتری باشد.
            </p>
          </div>

          <!-- Team Spotlight Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Lead 1 -->
            <div class="rounded-2xl bg-najmgrey/40 border border-najmborder/40 p-5 space-y-4 hover:border-najmgreen transition group">
              <div class="aspect-square rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center relative">
                <img
                  src="/images/about/person-1.png"
                  alt="سرپرست لیتوگرافی و کنترل رنگ CTP"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-najmgreen text-white text-[10px] font-bold text-d4">
                  پیش از چاپ
                </span>
              </div>
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-gray-900 text-d4">واحد لیتوگرافی و تفکیک رنگ CTP</h3>
                <p class="text-xs text-gray-500 leading-relaxed">کنترل تفکیک رنگ‌های اسپات و تهیه زینک‌های حرارتی با بالاترین وضوح</p>
              </div>
            </div>

            <!-- Lead 2 -->
            <div class="rounded-2xl bg-najmgrey/40 border border-najmborder/40 p-5 space-y-4 hover:border-najmgreen transition group">
              <div class="aspect-square rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center relative">
                <img
                  src="/images/about/person-2.png"
                  alt="مدیریت خطوط چاپ افست هایدلبرگ"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-najmgreen text-white text-[10px] font-bold text-d4">
                  خطوط چاپ
                </span>
              </div>
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-gray-900 text-d4">اپراتوری خطوط افست ۵ رنگ</h3>
                <p class="text-xs text-gray-500 leading-relaxed">تنظیم دانسیته مرکب، تعادل آب و رنگ و پایش ثبات در تیراژهای میلیونی</p>
              </div>
            </div>

            <!-- Lead 3 -->
            <div class="rounded-2xl bg-najmgrey/40 border border-najmborder/40 p-5 space-y-4 hover:border-najmgreen transition group">
              <div class="aspect-square rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center relative">
                <img
                  src="/images/about/person-3.png"
                  alt="کنترل کیفیت، دایکات و جعبه‌چسبانی"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-najmgreen text-white text-[10px] font-bold text-d4">
                  پس از چاپ
                </span>
              </div>
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-gray-900 text-d4">تست استحکام و خطوط تکمیلی</h3>
                <p class="text-xs text-gray-500 leading-relaxed">نظارت بر تیغ‌زنی دقیق، سلفون‌کشی حرارتی و چسب لاک‌باتم اتوماتیک</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Core Values -->
      <section id="values" class="scroll-mt-36 space-y-8">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
            اصول بنیادین
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 text-d4">
            ارزش‌هایی که مسیر ما را هدایت می‌کنند
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
              <Icon name="mdi:target" class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-gray-900 text-d4">دقت و ثبات کیفیت</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              استفاده از سیستم‌های پیشرفته کنترل رنگ اسپکتروفتومتری برای اطمینان از یکنواختی کامل در تمامی دوره‌های چاپ.
            </p>
          </div>
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
              <Icon name="mdi:lightning-bolt-outline" class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-gray-900 text-d4">سرعت و تعهد به زمان</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              خطوط تولید موازی و مدیریت زنجیره تامین هوشمند که تحویل سفارشات در سریع‌ترین زمان را بدون افت کیفیت ممکن می‌سازد.
            </p>
          </div>
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
              <Icon name="mdi:leaf" class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-gray-900 text-d4">مسئولیت زیست‌محیطی</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              بهره‌گیری از مرکب‌های پایه گیاهی و مقواهای بازیافت‌پذیر استاندارد با کمترین میزان ضایعات کاغذ در فرآیند لیتوگرافی.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 4: Pinned Solutions Section (solution-1, solution-2, solution-3, solution-4) -->
      <section id="solutions" class="scroll-mt-36">
        <SolutionsSection />
      </section>

      <!-- Section 5: Facilities & Machinery Fleet (machines-1, 2, 3, 4, 5, machines-small-1) -->
      <section id="facility" class="scroll-mt-36 space-y-8">
        <div class="text-center max-w-3xl mx-auto space-y-2">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgrey text-gray-800 border border-gray-200 text-d4">
            ناوگان ماشین‌آلات صنعتی
          </span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 text-d4">
            تجهیزات و خطوط پیشرفته تولید چاپ نجم
          </h2>
          <p class="text-xs sm:text-sm text-gray-600">
            سرمایه‌گذاری مستمر در به‌روزترین ماشین‌آلات چاپ افست، دایکات اتوماتیک و خطوط جعبه‌چسبانی پرسرعت.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Machine 1 -->
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-najmgrey/60 border border-najmborder/30 mb-4 flex items-center justify-center">
                <img
                  src="/images/about/machines-1.png"
                  alt="دستگاه چاپ افست ۵ رنگ هایدلبرگ"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-najmgreen text-d4">
                HEIDELBERG SPEEDMASTER
              </span>
              <h3 class="text-base font-bold text-gray-900 mt-2 mb-1 text-d4">چاپ افست ۵ رنگ ورقی</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                مجهز به سیستم کنترل رنگ آنلاین Prinect Inpress Control با قابلیت چاپ رنگ‌های اختصاصی پنتون و ورنی همزمان.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
              <span>حداکثر ابعاد: ۷۲×۱۰۲ سانتی‌متر</span>
              <span class="font-bold text-gray-800 text-d4">۱۵,۰۰۰ برگ/ساعت</span>
            </div>
          </div>

          <!-- Machine 2 -->
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-najmgrey/60 border border-najmborder/30 mb-4 flex items-center justify-center">
                <img
                  src="/images/about/machines-2.png"
                  alt="ماشین دایکات اتوماتیک بوبست"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-najmgreen text-d4">
                BOBST DIE-CUTTING
              </span>
              <h3 class="text-base font-bold text-gray-900 mt-2 mb-1 text-d4">دایکات و پوشال‌برداری اتوماتیک</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                تیغ‌زنی، خط‌تا و برجسته‌سازی انواع مقواهای ایندربرد و فلوت‌دار با دقت میکرونی و سرعت صنعتی بالا.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
              <span>فشار تیغ: ۳۰۰ تن</span>
              <span class="font-bold text-gray-800 text-d4">۸,۰۰۰ شیت/ساعت</span>
            </div>
          </div>

          <!-- Machine 3 -->
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-najmgrey/60 border border-najmborder/30 mb-4 flex items-center justify-center">
                <img
                  src="/images/about/machines-3.png"
                  alt="سیستم لیتوگرافی CTP هایدلبرگ"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-najmgreen text-d4">
                HEIDELBERG SUPRASETTER CTP
              </span>
              <h3 class="text-base font-bold text-gray-900 mt-2 mb-1 text-d4">خروجی مستقیم زینک حرارتی (CTP)</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                تولید زینک‌های بدون شیمیایی و حرارتی با تفکیک ترام ۱ الی ۹۹ درصد جهت بالاترین وضوح در تصاویر چاپی.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
              <span>رزولوشن: ۲۵۴۰ DPI</span>
              <span class="font-bold text-gray-800 text-d4">۲۴ پلیت/ساعت</span>
            </div>
          </div>

          <!-- Machine 4 -->
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-najmgrey/60 border border-najmborder/30 mb-4 flex items-center justify-center">
                <img
                  src="/images/about/machines-4.png"
                  alt="خط جعبه‌چسبانی تمام‌اتوماتیک"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-najmgreen text-d4">
                AUTO FOLDER-GLUER
              </span>
              <h3 class="text-base font-bold text-gray-900 mt-2 mb-1 text-d4">جعبه‌چسبانی خطی و لاک‌باتم</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                چسب‌زنی ۴ و ۶ نقطه جعبه‌های دارویی، غذایی و بهداشتی مجهز به سیستم‌های تزریق چسب سرد و گرم پیشرفته.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
              <span>قابلیت: لاک‌باتم + خطی</span>
              <span class="font-bold text-gray-800 text-d4">۵۰,۰۰۰ جعبه/ساعت</span>
            </div>
          </div>

          <!-- Machine 5 -->
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-najmgrey/60 border border-najmborder/30 mb-4 flex items-center justify-center">
                <img
                  src="/images/about/machines-5.png"
                  alt="خط سلفون‌کشی حرارتی و یووی موضعی"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-najmgreen text-d4">
                THERMAL LAMINATOR & UV
              </span>
              <h3 class="text-base font-bold text-gray-900 mt-2 mb-1 text-d4">سلفون حرارتی و پوشش‌های UV</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                اعمال انواع سلفون مات، براق، سافت‌تاچ، ضدخش و یووی موضعی برجسته با چسبندگی فوق‌العاده روی شیت چاپی.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
              <span>پوشش: مات، براق، شنی</span>
              <span class="font-bold text-gray-800 text-d4">۶,۵۰۰ شیت/ساعت</span>
            </div>
          </div>

          <!-- Machine 6 (small lab) -->
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition group">
            <div>
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-najmgrey/60 border border-najmborder/30 mb-4 flex items-center justify-center">
                <img
                  src="/images/about/machines-small-1.png"
                  alt="آزمایشگاه کنترل کیفیت و تست مقوا"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-najmgreen text-d4">
                QUALITY CONTROL LAB
              </span>
              <h3 class="text-base font-bold text-gray-900 mt-2 mb-1 text-d4">آزمایشگاه کنترل کیفیت مقوا</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                تست رطوبت‌سنجی، مقاومت به خمش و سایش، تست چسبندگی و انطباق رنگ در شرایط نوری استاندارد D50.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
              <span>استاندارد: ISO 12647-2</span>
              <span class="font-bold text-gray-800 text-d4">تست ۱۰۰٪ پچ‌ها</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 6: Closing Invitation & CTA -->
      <section id="aboutus" class="scroll-mt-36 bg-najmgreen text-white rounded-3xl p-8 sm:p-14 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-3 max-w-2xl text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 text-d4">
            بازدید و مشاوره حضوری
          </span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-d4 leading-tight">
            از خطوط تولید و شوروم چاپ نجم بازدید فرمایید
          </h2>
          <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            ما از مدیران برندها، تیم‌های توسعه محصول و طراحان بسته‌بندی دعوت می‌کنیم تا با حضور در کارخانه نجم، از نزدیک نظاره‌گر دقت ساخت و فرآیند تولید سفارشات باشند.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <NuxtLink
            to="/contact"
            class="px-8 py-3.5 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition text-center shadow-xs whitespace-nowrap text-d4"
          >
            هماهنگی بازدید و استعلام
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition text-center border border-white/20 whitespace-nowrap text-d4"
          >
            دانلود کاتالوگ جامع
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SolutionsSection from '~/components/about/SolutionsSectionGPinned.vue'

definePageMeta({
  name: 'درباره ما - چاپ نجم',
  layout: 'default'
})

const sections = [
  { id: 'vision', label: 'چشم‌انداز و معرفی' },
  { id: 'story', label: 'تیم و تخصص فنی' },
  { id: 'values', label: 'ارزش‌های کیفی' },
  { id: 'solutions', label: 'راهکارها و ویژگی‌ها' },
  { id: 'facility', label: 'ماشین‌آلات و تجهیزات' },
  { id: 'aboutus', label: 'دعوت به بازدید' }
]

const activeSection = ref('vision')

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  
  // Calculate precise offset considering header (64px) + subnav (~48px) + padding
  const yOffset = -135
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
  
  window.scrollTo({
    top: y,
    behavior: 'smooth'
  })
  activeSection.value = id
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { rootMargin: '-15% 0px -65% 0px' }
  )

  sections.forEach(s => {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  })
})
</script>

<style scoped>
.navcont {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.navcont::-webkit-scrollbar {
  display: none;
}
</style>