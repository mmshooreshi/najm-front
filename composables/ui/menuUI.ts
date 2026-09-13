// composables/ui/menuUI.ts
import { computed } from 'vue'
import defaultMenuUIData from '@/schemas/menu-ui.json'
import { useLocale } from '@/composables/useLocale'
import { usePageUI } from '@/composables/ui/usePageUI'
import { useAdminEditable } from '@/composables/useAdminEditable'

export type MenuUIData = typeof defaultMenuUIData

export function useMenuUIData() {
  const { language } = useLocale()
  const { ui, allUi, refresh } = usePageUI('menu')
  useAdminEditable('menu', allUi)

  const localizedMenuData = computed(() => {
    // If live dynamic UI has menu data from admin drafts or PocketBase, use it
    if (ui.value && (ui.value.products || ui.value.services || ui.value.headerNav || ui.value.links)) {
      return {
        ...defaultMenuUIData,
        ...ui.value
      }
    }

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
          name: 'Resources & Articles',
          slug: '',
          type: 'hidden',
          order: 3,
          children: [
            { id: 1, name: 'Product Catalog', slug: '/catalog', type: 'link-simple', order: 1, children: [] },
            { id: 2, name: 'Articles & Blog', slug: '/blog', type: 'link-simple', order: 2, children: [] },
            { id: 3, name: 'News & Events', slug: '/news', type: 'link-simple', order: 3, children: [] },
            { id: 4, name: 'Technical Guides', slug: '/guides', type: 'link-simple', order: 4, children: [] }
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
        },
        headerNav: [
          { id: 1, name: 'Products & Packaging', slug: '/products', order: 1 },
          { id: 2, name: 'Offset Printing', slug: '/services/printing-and-packaging', order: 2 },
          { id: 3, name: 'Catalog', slug: '/catalog', order: 3 },
          { id: 4, name: 'About Us', slug: '/about', order: 4 },
          { id: 5, name: 'Contact', slug: '/contact', order: 5 }
        ]
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
          name: 'المصادر والمقالات',
          slug: '',
          type: 'hidden',
          order: 3,
          children: [
            { id: 1, name: 'الكتالوج الشامل', slug: '/catalog', type: 'link-simple', order: 1, children: [] },
            { id: 2, name: 'المدونة والمقالات', slug: '/blog', type: 'link-simple', order: 2, children: [] },
            { id: 3, name: 'الأخبار والفعاليات', slug: '/news', type: 'link-simple', order: 3, children: [] },
            { id: 4, name: 'الأدلة الفنية', slug: '/guides', type: 'link-simple', order: 4, children: [] }
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
        },
        headerNav: [
          { id: 1, name: 'المنتجات والتغليف', slug: '/products', order: 1 },
          { id: 2, name: 'طباعة الأوفست', slug: '/services/printing-and-packaging', order: 2 },
          { id: 3, name: 'الكتالوج', slug: '/catalog', order: 3 },
          { id: 4, name: 'حول الشركة', slug: '/about', order: 4 },
          { id: 5, name: 'اتصل بنا', slug: '/contact', order: 5 }
        ]
      }
    }

    return defaultMenuUIData
  })

  return {
    menuUIData: localizedMenuData,
    allUi,
    refresh
  }
}
