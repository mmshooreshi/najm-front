<!-- pages/products/applications/index.vue -->
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

    <!-- Applications Packages Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="app in applicationsList"
        :key="app.slug"
        class="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300 group"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-najmgreen flex items-center justify-center group-hover:scale-105 transition-transform">
            <Icon :name="app.icon || 'mdi:package-variant-closed'" class="w-6 h-6" />
          </div>

          <h3 class="text-lg font-bold text-gray-900 group-hover:text-najmgreen transition-colors font-d4 leading-snug">
            {{ app.title }}
          </h3>

          <p class="text-xs text-gray-600 leading-relaxed line-clamp-3">
            {{ app.desc }}
          </p>

          <div class="space-y-1.5 pt-2">
            <div v-for="(it, i) in app.items" :key="i" class="flex items-center gap-2 text-xs text-gray-700">
              <span class="w-1.5 h-1.5 rounded-full bg-najmgreen shrink-0"></span>
              <span>{{ it }}</span>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-100 mt-6">
          <NuxtLink
            :to="`/products/applications/${app.slug}`"
            class="w-full block py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold text-center transition font-d4 shadow-xs"
          >
            {{ isRTL ? 'مشاهده پکیج کامل و اقلام' : 'View Package Details' }}
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
      badge: 'Integrated Product Packages',
      title: 'Targeted Packaging & Branding Bundles',
      description: 'Unified packaging and marketing packages designed for trade shows, corporate branding, retail launches, and product rollouts.'
    }
  }
  if (activeLang.value === 'ar') {
    return {
      badge: 'باقات المنتجات المتكاملة',
      title: 'باقات التغليف والهوية المؤسسية الشاملة',
      description: 'باقات متناسقة تجمع بين علب المنتجات، أكياس التسوق، والمطبوعات الفاخرة لتعزيز حضور علامتك التجارية.'
    }
  }
  return {
    badge: 'پکیج‌های هدفمند و کاربردی',
    title: 'مجموعه‌های یکپارچه چاپ، بسته‌بندی و هویت بصری',
    description: 'پکیج‌های مهندسی‌شده شامل جعبه‌های محصول، ساک‌های خرید، فولدر و هدایای تبلیغاتی برای رویدادها و توسعه بازار.'
  }
})

const applicationsList = computed(() => {
  if (activeLang.value === 'en') {
    return [
      {
        slug: 'office-packaging',
        icon: 'mdi:briefcase-outline',
        title: 'Corporate Identity & Office Suite',
        desc: 'Complete stationery, luxury presentation folders, customized planners, and letterheads with 100% color consistency.',
        items: ['Letterheads & Envelopes', 'Die-cut Presentation Folders', 'Corporate Executive Planners']
      },
      {
        slug: 'exhibition-bundle',
        icon: 'mdi:store-outline',
        title: 'Trade Show & Event Marketing Package',
        desc: 'Eye-catching shopping bags, multi-page catalogs, promotional boxes, and sample holders for expo visitors.',
        items: ['Luxury Coated Shopping Bags', 'Multi-Fold Product Catalogs', 'Sample Gift Packaging']
      },
      {
        slug: 'retail-launch',
        icon: 'mdi:shopping-outline',
        title: 'Retail Store Product Launch Bundle',
        desc: 'Custom folding cartons, hang tags, shelf talkers, and branded wrapping paper ready for shelf display.',
        items: ['Custom Folding Cartons', 'Hot-Stamped Product Tags', 'Branded Tissue Paper']
      }
    ]
  }
  if (activeLang.value === 'ar') {
    return [
      {
        slug: 'office-packaging',
        icon: 'mdi:briefcase-outline',
        title: 'باقة الهوية المؤسسية والمكتبية',
        desc: 'أوراق رسمية، مجلدات فاخرة، مفكرات وبطاقات عمل بتطابق لوني كامل مع ألوان علامتك التجارية.',
        items: ['أوراق الخطابات والأظرف', 'مجلدات العروض التقديمية', 'مفكرات سنوية مخصصة']
      },
      {
        slug: 'exhibition-bundle',
        icon: 'mdi:store-outline',
        title: 'باقة المعارض والفعاليات التسويقية',
        desc: 'أكياس تسوق فاخرة، كتالوجات منتجات متعددة الطيات، وعلب توزيعات لزوار المعارض.',
        items: ['أكياس تسوق مصفحة فاخرة', 'كتالوجات تسويقية شاملة', 'علب هدايا ترويجية']
      },
      {
        slug: 'retail-launch',
        icon: 'mdi:shopping-outline',
        title: 'باقة إطلاق المنتجات في منافذ البيع',
        desc: 'علب كرتونية مخصصة، بطاقات أسعار فاخرة، وورق تغليف يحمل شعار شركتك.',
        items: ['علب كرتونية فودجريد', 'بطاقات ملصقات فاخرة', 'ورق تغليف مطبوع']
      }
    ]
  }
  return [
    {
      slug: 'office-packaging',
      icon: 'mdi:briefcase-outline',
      title: 'پکیج سازمانی و ست اداری یکپارچه',
      desc: 'مجموعه کامل سربرگ، پاکت‌های ملخی و A4، فولدرهای اسناد، سررسید و کارت ویزیت با تضمین یکدستی رنگ.',
      items: ['ست کامل سربرگ و پاکت‌ها', 'فولدر اسناد با جای کارت و CD', 'دفتر یادداشت و سررسید مدیریتی']
    },
    {
      slug: 'exhibition-bundle',
      icon: 'mdi:store-outline',
      title: 'پکیج نمایشگاهی و رویدادهای تجاری',
      desc: 'ساک دستی اختصاصی، کاتالوگ جامع چندلت، بروشورهای محصول و هدایای تبلیغاتی جهت جذب حداکثری مخاطبان غرفه.',
      items: ['ساک دستی گلاسه با بند روبانی', 'کاتالوگ جامع محصولات و خدمات', 'جعبه ویژه هدایای تبلیغاتی']
    },
    {
      slug: 'retail-launch',
      icon: 'mdi:shopping-outline',
      title: 'پکیج لانچ محصول در فروشگاه‌های زنجیره‌ای',
      desc: 'انواع جعبه‌های قفسه‌ای (Shelf-Ready Packaging)، استندهای رومیزی و برچسب‌های امنیتی جهت ورود پرقدرت به بازار.',
      items: ['جعبه‌های کارتنی تاشو', 'تگ و لیبل‌های متالایز طلاکوب', 'استندهای مقوایی رومیزی']
    }
  ]
})
</script>
