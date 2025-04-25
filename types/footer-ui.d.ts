// types/footer-ui.d.ts
export interface FooterUIData {
  hero: {
    paragraphs: string[]
    logo?: string          // مسیر لوگو اگر لازم باشد
  }
  sections: FooterSection[]
  contact: {
    items: ContactItem[]
    mapUrl?: string        // آدرس گوگل‌مپ
  }
  seals?: { img: string; alt: string; url?: string }[] // لوگوهای اینماد و ساماندهی
  copyright: string
}

export interface FooterSection {
  id: string
  name: string
  slug: string
  type: 'accordion' | 'label' | 'hidden'
  tabs?: Tab[]
  children?: MenuItem[]
}

export interface Tab {
  id: string
  name: string
  slug: string
}

export interface MenuItem {
  id: string
  name: string
  slug: string
  children?: MenuItem[]
}

export interface ContactItem {
  id: string
  name: string
  value: string
  slug?: string          // tel: | mailto: | …
}


