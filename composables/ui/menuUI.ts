// composables/ui/menuUI.ts
import { computed } from 'vue'
import defaultMenuUIData from '@/schemas/menu-ui.json'
import { useLocale } from '@/composables/useLocale'

export type MenuUIData = typeof defaultMenuUIData

export function useMenuUIData() {
  const { language } = useLocale()

  const localizedMenuData = computed(() => {
    const lang = (language.value || 'FA').toUpperCase()

    if (lang === 'EN') {
      return {
        ...defaultMenuUIData,
        products: {
          ...defaultMenuUIData.products,
          name: 'Products & Packaging'
        },
        services: {
          ...defaultMenuUIData.services,
          name: 'Printing & Finishing Services',
          children: [
            { id: 1, name: 'Design & Layout', slug: 'design-and-layout', type: 'link', order: 1, children: [] },
            { id: 2, name: 'CTP Lithography', slug: 'lithography-and-plates', type: 'link', order: 2, children: [] },
            { id: 3, name: 'Offset Printing & Packaging', slug: 'printing-and-packaging', type: 'link', order: 3, children: [] },
            { id: 4, name: 'Post-Press Finishing', slug: 'finishing-services', type: 'link', order: 4, children: [] },
            { id: 5, name: 'Storage & Warehousing', slug: 'storage-and-warehousing', type: 'link', order: 5, children: [] }
          ]
        },
        links: {
          id: 1,
          name: 'Resources',
          slug: '',
          type: 'hidden',
          order: 3,
          children: [
            { id: 1, name: 'Catalog', slug: '/catalog', type: 'link-simple', order: 1, children: [] },
            { id: 2, name: 'Guides', slug: '/guides', type: 'link-simple', order: 2, children: [] }
          ]
        },
        contact: {
          id: 1,
          name: 'About & Contact',
          slug: '',
          type: 'hidden',
          order: 4,
          children: [
            { id: 1, name: 'About Us', slug: '/about', type: 'link-simple', order: 1, children: [] },
            { id: 2, name: 'Contact Us', slug: '/contact', type: 'link-simple', order: 2, children: [] }
          ]
        }
      }
    }

    if (lang === 'AR') {
      return {
        ...defaultMenuUIData,
        products: {
          ...defaultMenuUIData.products,
          name: 'المنتجات والتغليف'
        },
        services: {
          ...defaultMenuUIData.services,
          name: 'خدمات الطباعة والتشطيب',
          children: [
            { id: 1, name: 'التصميم والتجهيز', slug: 'design-and-layout', type: 'link', order: 1, children: [] },
            { id: 2, name: 'الليثوغرافيا وصفائح CTP', slug: 'lithography-and-plates', type: 'link', order: 2, children: [] },
            { id: 3, name: 'طباعة الأوفست والتغليف', slug: 'printing-and-packaging', type: 'link', order: 3, children: [] },
            { id: 4, name: 'خدمات ما بعد الطباعة', slug: 'finishing-services', type: 'link', order: 4, children: [] },
            { id: 5, name: 'التخزين والخدمات اللوجستية', slug: 'storage-and-warehousing', type: 'link', order: 5, children: [] }
          ]
        },
        links: {
          id: 1,
          name: 'المصادر',
          slug: '',
          type: 'hidden',
          order: 3,
          children: [
            { id: 1, name: 'الكتالوج', slug: '/catalog', type: 'link-simple', order: 1, children: [] },
            { id: 2, name: 'الأدلة الفنية', slug: '/guides', type: 'link-simple', order: 2, children: [] }
          ]
        },
        contact: {
          id: 1,
          name: 'اتصل بنا',
          slug: '',
          type: 'hidden',
          order: 4,
          children: [
            { id: 1, name: 'حول الشركة', slug: '/about', type: 'link-simple', order: 1, children: [] },
            { id: 2, name: 'اتصل بنا', slug: '/contact', type: 'link-simple', order: 2, children: [] }
          ]
        }
      }
    }

    return defaultMenuUIData
  })

  return { menuUIData: localizedMenuData }
}
