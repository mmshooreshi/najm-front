<!-- pages/products/industries/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12 select-none font-sans">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs text-gray-500" :class="isRTL ? 'text-right' : 'text-left'">
      <NuxtLink to="/" class="hover:text-najmgreen transition">{{ isRTL ? 'خانه' : 'Home' }}</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen transition">{{ isRTL ? 'محصولات' : 'Products' }}</NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-bold font-d4">{{ localizedHeader.badge }}</span>
    </nav>

    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 font-d4">
        {{ localizedHeader.badge }}
      </span>
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-d4 leading-tight">
        {{ localizedHeader.title }}
      </h1>
      <p class="text-xs sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
        {{ localizedHeader.description }}
      </p>
    </div>

    <!-- Industries Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="ind in industriesList"
        :key="ind.slug"
        class="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300 group"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-najmgreen flex items-center justify-center group-hover:scale-105 transition-transform">
            <Icon :name="ind.icon || 'mdi:factory'" class="w-6 h-6" />
          </div>

          <h3 class="text-lg font-bold text-gray-900 group-hover:text-najmgreen transition-colors font-d4 leading-snug">
            {{ ind.title }}
          </h3>

          <p class="text-xs text-gray-600 leading-relaxed line-clamp-3">
            {{ ind.desc }}
          </p>

          <div class="space-y-1.5 pt-2">
            <div v-for="(it, i) in ind.items" :key="i" class="flex items-center gap-2 text-xs text-gray-700">
              <span class="w-1.5 h-1.5 rounded-full bg-najmgreen shrink-0"></span>
              <span>{{ it }}</span>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-100 mt-6">
          <NuxtLink
            :to="`/products/industries/${ind.slug}`"
            class="w-full block py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold text-center transition font-d4 shadow-xs"
          >
            {{ isRTL ? 'مشاهده راهکارهای این صنعت' : 'View Industry Solutions' }}
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const activeLang = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
})

const localizedHeader = computed(() => {
  if (activeLang.value === 'en') {
    return {
      badge: 'Industry-Specific Packaging Solutions',
      title: 'Tailored Packaging for Key Manufacturing Sectors',
      description: 'Specialized packaging engineering complying with health regulations, barrier protections, and automated line speeds for food, pharma, saffron, and cosmetics.'
    }
  }
  if (activeLang.value === 'ar') {
    return {
      badge: 'حلول التغليف المتخصصة لمختلف القطاعات الصناعية',
      title: 'تغليف هندسي متخصص للأغذية، الأدوية، الزعفران ومستحضرات التجميل',
      description: 'معايير جودة عالية تلبي المتطلبات الصحية وحواجز الرطوبة والدهون لخطوط الإنتاج الآلية.'
    }
  }
  return {
    badge: 'راهکارهای تخصصی صنایع',
    title: 'بسته‌بندی و چاپ تخصصی برای صنایع پیشرو',
    description: 'مهندسی ساختار جعبه و کارتن با رعایت استانداردهای بهداشتی، خطوط پرکنی اتوماتیک و مقاومت فیزیکی بالا برای صنایع دارویی، غذایی، آرایشی و صادراتی.'
  }
})

const industriesList = computed(() => {
  if (activeLang.value === 'en') {
    return [
      {
        slug: 'food-beverage-restaurant',
        icon: 'mdi:food',
        title: 'Food, Beverage & Restaurants',
        desc: 'Greaseproof food-grade folding cartons, fast-food boxes, takeaway carrier bags, and bakery boxes with hygienic coating.',
        items: ['Food-Grade SBS Folding Cartons', 'Greaseproof Fast Food Containers', 'Heavy Kraft Takeaway Bags']
      },
      {
        slug: 'pharma-health-medical',
        icon: 'mdi:pill',
        title: 'Pharmaceuticals & Medical Devices',
        desc: 'Automated tuck-end boxes with embossed Braille, anti-counterfeit security patterns, and certified paperboard.',
        items: ['Braille Embossed Cartons', 'Tamper-Evident Medicine Boxes', 'Folded Instruction Leaflets']
      },
      {
        slug: 'cosmetics-beauty-perfume',
        icon: 'mdi:lipstick',
        title: 'Cosmetics, Beauty & Perfumes',
        desc: 'Luxury rigid presentation boxes with velvet thermoformed trays, gold hot foil stamping, and holographic finishes.',
        items: ['Neodymium Magnet Rigid Boxes', 'Slide Sleeve Perfume Cartons', 'Holographic Stamped Boxes']
      },
      {
        slug: 'saffron-dry-fruits',
        icon: 'mdi:leaf',
        title: 'Saffron, Dried Fruits & Export Nuts',
        desc: 'High-end wooden & rigid export gift boxes with glass jar cavities, magnetic lids, and hermetic freshness seals.',
        items: ['Book-Style Rigid Saffron Boxes', 'Airtight Window Metalized Cartons', 'Export Master Shipping Cases']
      }
    ]
  }
  if (activeLang.value === 'ar') {
    return [
      {
        slug: 'food-beverage-restaurant',
        icon: 'mdi:food',
        title: 'الصناعات الغذائية والمطاعم',
        desc: 'علب كرتونية صحية مقاومة للدهون والرطوبة مع طلاء آمن للاستخدام الغذائي المباشر.',
        items: ['علب كرتون صحية فودجريد', 'علب الوجبات السريعة', 'أكياس كرافت سميكة للمطاعم']
      },
      {
        slug: 'pharma-health-medical',
        icon: 'mdi:pill',
        title: 'الصناعات الدوائية والطبية',
        desc: 'علب أدوية قياسية مع خطوط برايل البارزة للمكفوفين ونشرات دوائية دقيقة مطوية آلياً.',
        items: ['علب أدوية بطريقة برايل', 'علب محكمة الغلق لمنع العبث', 'نشرات طبية مطوية آلياً']
      },
      {
        slug: 'cosmetics-beauty-perfume',
        icon: 'mdi:lipstick',
        title: 'مستحضرات التجميل والعطور الفاخرة',
        desc: 'علب هاردبوكس فاخرة مع حشوات فوم مخملية وبصمة حرارية ذهبية ولمسات اليو في.',
        items: ['علب هاردبوكس مغناطيسية', 'علب عطور ذات سحاب داخلي', 'طباعة فاخرة بلمسات هولوغرام']
      },
      {
        slug: 'saffron-dry-fruits',
        icon: 'mdi:leaf',
        title: 'الزعفران والمكسرات للتصدير',
        desc: 'علب هدايا فاخرة للتصدير مجهزة بقواطع للأواني الزجاجية وأغطية مغناطيسية محكمة.',
        items: ['علب هاردبوكس على شكل كتاب للزعفران', 'علب كرتون بنافذة شفافة', 'كرتون شحن مصفح قوي للتصدير']
      }
    ]
  }
  return [
    {
      slug: 'food-beverage-restaurant',
      icon: 'mdi:food',
      title: 'صناعات غذایی، رستوران‌ها و نوشیدنی',
      desc: 'انواع جعبه‌های فودگرید بهداشتی، ظروف بیرون‌بر فست‌فود، کارتن‌های خرما و ساک‌های بیرون‌بر مقاوم به چربی.',
      items: ['جعبه مقوای ایندربرد بهداشتی', 'ظروف فست‌فود مقاوم به روغن', 'ساک‌های کرافت دسته‌دار']
    },
    {
      slug: 'pharma-health-medical',
      icon: 'mdi:pill',
      title: 'صنایع دارویی، بهداشتی و تجهیزات پزشکی',
      desc: 'جعبه‌های دارویی با خط بریل استاندارد نابینایان، بروشورهای راهنمای تاخورده (لیفتلت) و برچسب‌های پلمپ اصالت کالا.',
      items: ['جعبه‌های دارویی با خط بریل', 'بروشور و لیفتلت دارویی آکاردئونی', 'جعبه تجهیزات پزشکی لمینتی']
    },
    {
      slug: 'cosmetics-beauty-perfume',
      icon: 'mdi:lipstick',
      title: 'محصولات آرایشی، بهداشتی و عطر و ادکلن',
      desc: 'هاردباکس‌های فوق لوکس مگنتی، جعبه‌های کشویی با فوم‌های مخملی و جلوه‌های متالایز، طلاکوب و یووی برجسته.',
      items: ['هاردباکس مگنتی با فوم مخملی', 'جعبه ادکلن کشویی روکش‌دار', 'کارتن‌های لمینتی ست کادویی']
    },
    {
      slug: 'saffron-dry-fruits',
      icon: 'mdi:leaf',
      title: 'زعفران، خشکبار و آجیل صادراتی',
      desc: 'بسته‌بندی‌های صادراتی با حفظ کامل عطر و طعم، جعبه‌های چوبی روکش‌دار، هاردباکس کتابی و کارتن‌های مستر صادراتی.',
      items: ['هاردباکس کتابی مگنتی زعفران', 'جعبه با جای ظروف خاتم و کریستال', 'کارتن مستر ۵ لایه صادراتی']
    }
  ]
})
</script>
