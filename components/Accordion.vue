<!-- components/Accordion.vue -->
<template>
  <div class="w-full h-max max-h-full p-0 md:py-0 accordion flex flex-col gap-1 md:gap-1">
    <AccordionItem
      v-for="(item, index) in items"
      :delay="index * 0.1"
      :key="index"
      :index="index ?? 0"
      :title="item.title"
      :content="item.content"
      :link="getItemLink(item, index)"
      :isOpen="openIndex === index"
      :hasAnyOpen="openIndex != null"
      @toggle="() => openIndex = openIndex === index ? null : index"
    />
  </div>
</template>

<script setup lang="ts">
import AccordionItem from "./AccordionItem.vue"
import { ref, computed, onMounted } from "vue"
import { useLocale } from "~/composables/useLocale"

const { language } = useLocale()
const homeUI = inject<any>('homeUI') ?? {}
const items = computed(() => homeUI?.value?.accordion ?? [])
const openIndex = ref<number | null>(0)

const defaultOrganicLinks: Record<number, { fa: { text: string; url: string }; en: { text: string; url: string }; ar: { text: string; url: string } }> = {
  0: {
    fa: { text: 'درخواست مشاوره مهندسی و نمونه ماکت ۳D', url: '/consultation' },
    en: { text: 'Request Engineering Consultation & 3D Mockup', url: '/consultation' },
    ar: { text: 'طلب استشارة هندسية ونموذج أولي ثلاثي الأبعاد', url: '/consultation' }
  },
  1: {
    fa: { text: 'مشاهده مرکز قالب‌های تیغ و راهنماهای طراحی', url: '/resources' },
    en: { text: 'Explore Die-Cut Templates & Design Guides', url: '/resources' },
    ar: { text: 'استكشف مركز قوالب القطع وأدلة التصميم', url: '/resources' }
  },
  2: {
    fa: { text: 'آشنایی با ماشین‌آلات هایدلبرگ و سالن CTP', url: '/facilities' },
    en: { text: 'Discover Heidelberg Machinery & CTP Facilities', url: '/facilities' },
    ar: { text: 'تعرف على معدات هايدلبرغ وقسم CTP', url: '/facilities' }
  },
  3: {
    fa: { text: 'مشاهده خدمات چاپ افست و جعبه‌سازی', url: '/services/printing-and-packaging' },
    en: { text: 'View 5-Color Offset & Packaging Services', url: '/services/printing-and-packaging' },
    ar: { text: 'عرض خدمات طباعة الأوفست وصناعة العلب', url: '/services/printing-and-packaging' }
  },
  4: {
    fa: { text: 'جزییات خدمات طلاکوب، یووی موضعی و تکمیلی', url: '/services/finishing-services' },
    en: { text: 'Explore Finishing, Hot Foil & Spot UV Services', url: '/services/finishing-services' },
    ar: { text: 'تفاصيل خدمات الختم الحراري والطلاء التكميلي', url: '/services/finishing-services' }
  },
  5: {
    fa: { text: 'درباره تاریخچه و استانداردهای کیفی کارخانه', url: '/about' },
    en: { text: 'Learn About Najm History & Quality Standards', url: '/about' },
    ar: { text: 'عن تاريخ المجمع ومعايير الجودة المعتمدة', url: '/about' }
  },
  6: {
    fa: { text: 'ارتباط مستقیم با کارخانه و پشتیبانی مشتریان', url: '/contact' },
    en: { text: 'Contact Factory Directly & Client Support', url: '/contact' },
    ar: { text: 'تواصل مباشرة مع إدارة المصنع وخدمة العملاء', url: '/contact' }
  }
}

function getItemLink(item: any, index: number) {
  if (item?.link && item.link.url) return item.link
  const langKey = (language.value || 'FA').toLowerCase() as 'fa' | 'en' | 'ar'
  const def = defaultOrganicLinks[index]
  if (!def) return null
  return def[langKey] || def.fa
}

onMounted(() => {
  openIndex.value = 0
})
</script>
  
  <style scoped>
  .accordion {
    margin: auto;
    /* border: 1px solid #ddd; */
    /* border-radius: 8px; */
    overflow: hidden;
  }
  </style>
  