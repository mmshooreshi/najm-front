// composables/useProductsAll.ts
import { ref, computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

export interface Product {
  id: number
  image: string
  slug: string
  name: string
  subtitle: string
  price: string
  buttonText: string
  type: 'printing' | 'packaging'
  group: string
}

const baseProducts: Product[] = [
  { id: 1, type: 'printing', group: 'پاکت CD و DVD', slug: '/products/pack_cd', name: 'چاپ پاکت CD و DVD', subtitle: 'حداقل ۵۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/2.png' },
  { id: 2, type: 'printing', group: 'کارت ضمانت', slug: '/products/warranty_card', name: 'چاپ کارت ضمانت و گارانتی', subtitle: 'حداقل ۲۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/3.png' },
  { id: 3, type: 'printing', group: 'دفترچه‌راهنما', slug: '/products/manual_booklet', name: 'چاپ دفترچه‌راهنمای محصول', subtitle: 'حداقل ۳۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/4.png' },
  { id: 4, type: 'printing', group: 'اوراق و اسناد مالی و اداری', slug: '/products/financial_docs', name: 'چاپ اسناد مالی و اداری', subtitle: 'حداقل ۱۵۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/5.png' },
  { id: 5, type: 'printing', group: 'فولدر و پوشه', slug: '/products/folder', name: 'چاپ فولدر گلاسه و مدیریتی', subtitle: 'حداقل ۲۵۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/1.png' },
  { id: 6, type: 'printing', group: 'کارت دعوت و یادبود', slug: '/products/invitation', name: 'چاپ کارت دعوت و همایش', subtitle: 'حداقل ۲۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/2.png' },
  { id: 7, type: 'printing', group: 'بنر و استند مناسبتی', slug: '/products/banner', name: 'چاپ بنر و استند سازمانی', subtitle: 'حداقل ۵۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/3.png' },
  { id: 8, type: 'printing', group: 'سررسید و تقویم', slug: '/products/calendar', name: 'چاپ سررسید و تقویم دیواری', subtitle: 'حداقل ۲۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/4.png' },
  { id: 9, type: 'printing', group: 'لیبل و استیکر', slug: '/products/label', name: 'چاپ لیبل رول و شیت', subtitle: 'حداقل ۵۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/5.png' },
  { id: 10, type: 'printing', group: 'پوستر و تراکت', slug: '/products/flyer', name: 'چاپ تراکت تبلیغاتی A5', subtitle: 'حداقل ۱۰۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/1.png' },
  { id: 11, type: 'printing', group: 'کتاب و مجلات', slug: '/products/booklet', name: 'چاپ کتابچه و ژورنال', subtitle: 'حداقل ۱۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/2.png' },
  { id: 12, type: 'printing', group: 'بروشورو کاتالوگ', slug: '/products/catalog', name: 'چاپ کاتالوگ و بروشور چندلت', subtitle: 'حداقل ۲۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/3.png' },
  { id: 13, type: 'printing', group: 'کارت‌ویزیت', slug: '/products/business_card', name: 'چاپ کارت‌ویزیت فوری لوکس', subtitle: 'حداقل ۵۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/4.png' },
  { id: 14, type: 'printing', group: 'پاکت‌نامه', slug: '/products/envelope', name: 'چاپ پاکت‌نامه و ملخی', subtitle: 'حداقل ۵۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/5.png' },
  { id: 15, type: 'printing', group: 'سربرگ', slug: '/products/letterhead', name: 'چاپ سربرگ رسمی A4 و A5', subtitle: 'حداقل ۳۰۰ عدد', price: '', buttonText: 'سفارش آنلاین', image: '/images/products/1.png' }
]

const productTranslations: Record<number, Record<'fa' | 'en' | 'ar', { name: string; subtitle: string; group: string }>> = {
  1: {
    fa: { name: 'چاپ پاکت CD و DVD', subtitle: 'حداقل ۵۰۰ عدد', group: 'پاکت CD و DVD' },
    en: { name: 'CD & DVD Sleeve Printing', subtitle: 'Min. 500 pcs', group: 'CD & DVD Pouch' },
    ar: { name: 'طباعة ظرف الأقراص المدمجة', subtitle: 'الحد الأدنى ٥۰۰ قطعة', group: 'ظرف الأقراص CD' }
  },
  2: {
    fa: { name: 'چاپ کارت ضمانت و گارانتی', subtitle: 'حداقل ۲۰۰ عدد', group: 'کارت ضمانت' },
    en: { name: 'Warranty & Guarantee Card', subtitle: 'Min. 200 pcs', group: 'Warranty Card' },
    ar: { name: 'طباعة بطاقات الضمان المعتمدة', subtitle: 'الحد الأدنى ۲۰۰ قطعة', group: 'بطاقة الضمان' }
  },
  3: {
    fa: { name: 'چاپ دفترچه‌راهنمای محصول', subtitle: 'حداقل ۳۰۰ عدد', group: 'دفترچه‌راهنما' },
    en: { name: 'Product User Manual Booklet', subtitle: 'Min. 300 pcs', group: 'User Manual' },
    ar: { name: 'طباعة كتيب إرشادات الاستخدام', subtitle: 'الحد الأدنى ۳۰۰ قطعة', group: 'كتيب الإرشادات' }
  },
  4: {
    fa: { name: 'چاپ اسناد مالی و اداری', subtitle: 'حداقل ۱۵۰ عدد', group: 'اوراق و اسناد مالی و اداری' },
    en: { name: 'Financial & Corporate Forms', subtitle: 'Min. 150 pcs', group: 'Financial Documents' },
    ar: { name: 'طباعة الوثائق المالية والرسمية', subtitle: 'الحد الأدنى ۱۵۰ قطعة', group: 'الوثائق المالية' }
  },
  5: {
    fa: { name: 'چاپ فولدر گلاسه و مدیریتی', subtitle: 'حداقل ۲۵۰ عدد', group: 'فولدر و پوشه' },
    en: { name: 'Executive Presentation Folder', subtitle: 'Min. 250 pcs', group: 'Corporate Folder' },
    ar: { name: 'طباعة مجلد وحافظة أوراق فاخرة', subtitle: 'الحد الأدنى ۲۵۰ قطعة', group: 'مجلد الملفات' }
  },
  6: {
    fa: { name: 'چاپ کارت دعوت و همایش', subtitle: 'حداقل ۲۰۰ عدد', group: 'کارت دعوت و یادبود' },
    en: { name: 'Event & Invitation Cards', subtitle: 'Min. 200 pcs', group: 'Invitation Card' },
    ar: { name: 'طباعة بطاقات الدعوة والمناسبات', subtitle: 'الحد الأدنى ۲۰۰ قطعة', group: 'بطاقات الدعوة' }
  },
  7: {
    fa: { name: 'چاپ بنر و استند سازمانی', subtitle: 'حداقل ۵۰ عدد', group: 'بنر و استند مناسبتی' },
    en: { name: 'Corporate Banner & Stand', subtitle: 'Min. 50 pcs', group: 'Banner & Stand' },
    ar: { name: 'طباعة رول آب وبانر المعارض', subtitle: 'الحد الأدنى ۵۰ قطعة', group: 'بانر وستاند' }
  },
  8: {
    fa: { name: 'چاپ سررسید و تقویم دیواری', subtitle: 'حداقل ۲۰۰ عدد', group: 'سررسید و تقویم' },
    en: { name: 'Executive Planner & Calendar', subtitle: 'Min. 200 pcs', group: 'Planner & Calendar' },
    ar: { name: 'طباعة التقويم والمفكرة السنوية', subtitle: 'الحد الأدنى ۲۰۰ قطعة', group: 'تقويم ومفكرة' }
  },
  9: {
    fa: { name: 'چاپ لیبل رول و شیت', subtitle: 'حداقل ۵۰۰ عدد', group: 'لیبل و استیکر' },
    en: { name: 'Roll & Sheet Adhesive Labels', subtitle: 'Min. 500 pcs', group: 'Labels & Stickers' },
    ar: { name: 'طباعة الملصقات والاستيكر المقاوم', subtitle: 'الحد الأدنى ۵۰۰ قطعة', group: 'ملصقات واستيكر' }
  },
  10: {
    fa: { name: 'چاپ تراکت تبلیغاتی A5', subtitle: 'حداقل ۱۰۰۰ عدد', group: 'پوستر و تراکت' },
    en: { name: 'Promotional Flyer & Leaflet A5', subtitle: 'Min. 1000 pcs', group: 'Flyer & Poster' },
    ar: { name: 'طباعة النشرات الدعائية والبوستر', subtitle: 'الحد الأدنى ۱۰۰۰ قطعة', group: 'نشرات وبوستر' }
  },
  11: {
    fa: { name: 'چاپ کتابچه و ژورنال', subtitle: 'حداقل ۱۰۰ عدد', group: 'کتاب و مجلات' },
    en: { name: 'Booklet & Journal Printing', subtitle: 'Min. 100 pcs', group: 'Books & Journals' },
    ar: { name: 'طباعة الكتيبات والمجلات الدورية', subtitle: 'الحد الأدنى ۱۰۰ قطعة', group: 'كتب ومجلات' }
  },
  12: {
    fa: { name: 'چاپ کاتالوگ و بروشور چندلت', subtitle: 'حداقل ۲۰۰ عدد', group: 'بروشورو کاتالوگ' },
    en: { name: 'Multi-Fold Brochure & Catalog', subtitle: 'Min. 200 pcs', group: 'Brochure & Catalog' },
    ar: { name: 'طباعة الكتالوجات والبروشورات', subtitle: 'الحد الأدنى ۲۰۰ قطعة', group: 'بروشور وكتالوج' }
  },
  13: {
    fa: { name: 'چاپ کارت‌ویزیت فوری لوکس', subtitle: 'حداقل ۵۰۰ عدد', group: 'کارت‌ویزیت' },
    en: { name: 'Luxury Business Cards', subtitle: 'Min. 500 pcs', group: 'Business Cards' },
    ar: { name: 'طباعة بطاقات العمل الفاخرة', subtitle: 'الحد الأدنى ۵۰۰ قطعة', group: 'بطاقات عمل' }
  },
  14: {
    fa: { name: 'چاپ پاکت‌نامه و ملخی', subtitle: 'حداقل ۵۰۰ عدد', group: 'پاکت‌نامه' },
    en: { name: 'Official Envelopes & Mailers', subtitle: 'Min. 500 pcs', group: 'Envelopes' },
    ar: { name: 'طباعة أظرف المراسلات الرسمية', subtitle: 'الحد الأدنى ۵۰۰ قطعة', group: 'أظرف بريدية' }
  },
  15: {
    fa: { name: 'چاپ سربرگ رسمی A4 و A5', subtitle: 'حداقل ۳۰۰ عدد', group: 'سربرگ' },
    en: { name: 'Corporate Letterheads A4/A5', subtitle: 'Min. 300 pcs', group: 'Letterheads' },
    ar: { name: 'طباعة الترويسات الرسمية للشركات', subtitle: 'الحد الأدنى ۳۰۰ قطعة', group: 'ترويسة رسمية' }
  }
}

export const useProductsAll = () => {
  const { language } = useLocale()

  const products = computed<Product[]>(() => {
    const rawLang = (language.value || 'FA').toLowerCase()
    const lang = (rawLang === 'en' || rawLang === 'ar' ? rawLang : 'fa') as 'fa' | 'en' | 'ar'

    return baseProducts.map((p) => {
      const trans = productTranslations[p.id]?.[lang] || productTranslations[p.id]?.['fa']
      return {
        ...p,
        name: trans?.name || p.name,
        subtitle: trans?.subtitle || p.subtitle,
        group: trans?.group || p.group
      }
    })
  })

  return { products }
}

export default baseProducts
