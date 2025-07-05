// composables/useProductsAll.ts
import { ref } from 'vue'

export interface Product {
  id: number
  image: string
  slug: string
  name: string
  subtitle: string
  price: string
  buttonText: string
  type: 'printing' | 'packaging'
  group:
    | 'پاکت CD و DVD'
    | 'کارت ضمانت'
    | 'دفترچه‌راهنما'
    | 'اوراق و اسناد مالی و اداری'
    | 'فولدر و پوشه'
    | 'کارت دعوت و یادبود'
    | 'بنر و استند مناسبتی'
    | 'سررسید و تقویم'
    | 'لیبل و استیکر'
    | 'پوستر و تراکت'
    | 'تقویم و سررسید'
    | 'کتاب و مجلات'
    | 'بروشورو کاتالوگ'
    | 'کارت‌ویزیت'
    | 'پاکت‌نامه'
    | 'سربرگ'


}

const defaultProducts = ref<Product[]>([
    {
      "id": 1,
      "type": "packaging",
      "group": "پاکت CD و DVD",
      "slug": "/products/pack_cd_packaging",
      "name": "پاکت CD بسته‌بندی",
      "subtitle": "حداقل ۵۰۰ عدد",
      "price": "قیمت: ۱۲۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/1.png"
    },
    {
      "id": 2,
      "type": "packaging",
      "group": "کارت ضمانت",
      "slug": "/products/waranty_packaging",
      "name": "جعبه کارت ضمانت",
      "subtitle": "حداقل ۲۰۰ عدد",
      "price": "قیمت: ۲۵۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/2.png"
    },
    {
      "id": 3,
      "type": "packaging",
      "group": "دفترچه‌راهنما",
      "slug": "/products/manual_packaging",
      "name": "جعبه دفترچه‌راهنما",
      "subtitle": "حداقل ۳۰۰ عدد",
      "price": "قیمت: ۳۵۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/3.png"
    },
    {
      "id": 4,
      "type": "packaging",
      "group": "اوراق و اسناد مالی و اداری",
      "slug": "/products/doc_packaging",
      "name": "جعبه اسناد مالی",
      "subtitle": "حداقل ۱۵۰ عدد",
      "price": "قیمت: ۴۰۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/4.png"
    },
    {
      "id": 5,
      "type": "packaging",
      "group": "فولدر و پوشه",
      "slug": "/products/folder_packaging",
      "name": "جعبه فولدر",
      "subtitle": "حداقل ۲۵۰ عدد",
      "price": "قیمت: ۲۲۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/5.png"
    },
    {
      "id": 6,
      "type": "packaging",
      "group": "کارت دعوت و یادبود",
      "slug": "/products/invite_packaging",
      "name": "جعبه کارت دعوت",
      "subtitle": "حداقل ۲۰۰ عدد",
      "price": "قیمت: ۳۰۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/1.png"
    },
    {
      "id": 7,
      "type": "packaging",
      "group": "بنر و استند مناسبتی",
      "slug": "/products/banner_packaging",
      "name": "جعبه استند بنر",
      "subtitle": "حداقل ۵۰ عدد",
      "price": "قیمت: ۵۰۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/2.png"
    },
    {
      "id": 8,
      "type": "packaging",
      "group": "سررسید و تقویم",
      "slug": "/products/diary_packaging",
      "name": "جعبه سررسید",
      "subtitle": "حداقل ۲۰۰ عدد",
      "price": "قیمت: ۳۸۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/3.png"
    },
    {
      "id": 9,
      "type": "packaging",
      "group": "لیبل و استیکر",
      "slug": "/products/sticker_packaging",
      "name": "جعبه استیکر",
      "subtitle": "حداقل ۵۰۰ عدد",
      "price": "قیمت: ۱۰۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/4.png"
    },
    {
      "id": 10,
      "type": "packaging",
      "group": "پوستر و تراکت",
      "slug": "/products/leaflet_packaging",
      "name": "جعبه تراکت",
      "subtitle": "حداقل ۱۰۰۰ عدد",
      "price": "قیمت: ۲۸۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/5.png"
    },
    {
      "id": 11,
      "type": "packaging",
      "group": "تقویم و سررسید",
      "slug": "/products/calendar_packaging",
      "name": "جعبه تقویم",
      "subtitle": "حداقل ۱۵۰ عدد",
      "price": "قیمت: ۳۴۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/1.png"
    },
    {
      "id": 12,
      "type": "packaging",
      "group": "کتاب و مجلات",
      "slug": "/products/booklet_packaging",
      "name": "جعبه کتاب",
      "subtitle": "حداقل ۱۰۰ عدد",
      "price": "قیمت: ۴۵۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/2.png"
    },
    {
      "id": 13,
      "type": "packaging",
      "group": "بروشورو کاتالوگ",
      "slug": "/products/catalog_packaging",
      "name": "جعبه کاتالوگ",
      "subtitle": "حداقل ۲۰۰ عدد",
      "price": "قیمت: ۳۲۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/3.png"
    },
    {
      "id": 14,
      "type": "packaging",
      "group": "کارت‌ویزیت",
      "slug": "/products/cardpack_packaging",
      "name": "جعبه کارت‌ویزیت",
      "subtitle": "حداقل ۵۰۰ عدد",
      "price": "قیمت: ۲۷۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/4.png"
    },
    {
      "id": 15,
      "type": "packaging",
      "group": "پاکت‌نامه",
      "slug": "/products/envelope_packaging",
      "name": "پاکت‌نامه بسته‌بندی",
      "subtitle": "حداقل ۵۰۰ عدد",
      "price": "قیمت: ۱۸۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/5.png"
    },
    {
      "id": 16,
      "type": "packaging",
      "group": "سربرگ",
      "slug": "/products/letterhead_packaging",
      "name": "جعبه سربرگ",
      "subtitle": "حداقل ۳۰۰ عدد",
      "price": "قیمت: ۲۹۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/1.png"
    },
    {
      "id": 101,
      "type": "printing",
      "group": "پاکت CD و DVD",
      "slug": "/products/pack_cd_print",
      "name": "چاپ پاکت CD",
      "subtitle": "حداقل ۵۰۰ عدد",
      "price": "قیمت: ۹۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/2.png"
    },
    {
      "id": 102,
      "type": "printing",
      "group": "کارت ضمانت",
      "slug": "/products/waranty_print",
      "name": "چاپ کارت ضمانت",
      "subtitle": "حداقل ۲۰۰ عدد",
      "price": "قیمت: ۱۸۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/3.png"
    },
    {
      "id": 103,
      "type": "printing",
      "group": "دفترچه‌راهنما",
      "slug": "/products/manual_print",
      "name": "چاپ دفترچه‌راهنما",
      "subtitle": "حداقل ۳۰۰ عدد",
      "price": "قیمت: ۲۲۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/4.png"
    },
    {
      "id": 104,
      "type": "printing",
      "group": "اوراق و اسناد مالی و اداری",
      "slug": "/products/doc_print",
      "name": "چاپ اسناد مالی",
      "subtitle": "حداقل ۱۵۰ عدد",
      "price": "قیمت: ۲۵۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/5.png"
    },
    {
      "id": 105,
      "type": "printing",
      "group": "فولدر و پوشه",
      "slug": "/products/folder_print",
      "name": "چاپ پوشه گلاسه",
      "subtitle": "حداقل ۲۰۰ عدد",
      "price": "قیمت: ۲۱۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/1.png"
    },
    {
      "id": 106,
      "type": "printing",
      "group": "کارت دعوت و یادبود",
      "slug": "/products/invite_print",
      "name": "چاپ کارت دعوت",
      "subtitle": "حداقل ۲۰۰ عدد",
      "price": "قیمت: ۲۷۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/2.png"
    },
    {
      "id": 107,
      "type": "printing",
      "group": "بنر و استند مناسبتی",
      "slug": "/products/banner_print",
      "name": "چاپ بنر",
      "subtitle": "حداقل ۵۰ عدد",
      "price": "قیمت: ۴۵۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/3.png"
    },
    {
      "id": 108,
      "type": "printing",
      "group": "سررسید و تقویم",
      "slug": "/products/diary_print",
      "name": "چاپ سررسید",
      "subtitle": "حداقل ۲۰۰ عدد",
      "price": "قیمت: ۳۵۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/4.png"
    },
    {
      "id": 109,
      "type": "printing",
      "group": "لیبل و استیکر",
      "slug": "/products/sticker_print",
      "name": "چاپ لیبل",
      "subtitle": "حداقل ۵۰۰ عدد",
      "price": "قیمت: ۷۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/5.png"
    },
    {
      "id": 110,
      "type": "printing",
      "group": "پوستر و تراکت",
      "slug": "/products/leaflet_print",
      "name": "چاپ تراکت A5",
      "subtitle": "حداقل ۱۰۰۰ عدد",
      "price": "قیمت: ۸۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/1.png"
    },
    {
      "id": 111,
      "type": "printing",
      "group": "تقویم و سررسید",
      "slug": "/products/calendar_print",
      "name": "چاپ تقویم رومیزی",
      "subtitle": "حداقل ۱۵۰ عدد",
      "price": "قیمت: ۳۲۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/2.png"
    },
    {
      "id": 112,
      "type": "printing",
      "group": "کتاب و مجلات",
      "slug": "/products/booklet_print",
      "name": "چاپ کتابچه",
      "subtitle": "حداقل ۱۰۰ عدد",
      "price": "قیمت: ۲۸۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/3.png"
    },
    {
      "id": 113,
      "type": "printing",
      "group": "بروشورو کاتالوگ",
      "slug": "/products/catalog_print",
      "name": "چاپ کاتالوگ",
      "subtitle": "حداقل ۲۰۰ عدد",
      "price": "قیمت: ۳۰۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/4.png"
    },
    {
      "id": 114,
      "type": "printing",
      "group": "کارت‌ویزیت",
      "slug": "/products/cardprint_print",
      "name": "چاپ کارت‌ویزیت فوری",
      "subtitle": "حداقل ۵۰۰ عدد",
      "price": "قیمت: ۱۲۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/5.png"
    },
    {
      "id": 115,
      "type": "printing",
      "group": "پاکت‌نامه",
      "slug": "/products/envelope_print",
      "name": "چاپ پاکت‌نامه",
      "subtitle": "حداقل ۵۰۰ عدد",
      "price": "قیمت: ۱۱۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/1.png"
    },
    {
      "id": 116,
      "type": "printing",
      "group": "سربرگ",
      "slug": "/products/letterhead_print",
      "name": "چاپ سربرگ اداری",
      "subtitle": "حداقل ۳۰۰ عدد",
      "price": "قیمت: ۲۰۰,۰۰۰ تومان",
      "buttonText": "نمایش ابعاد",
      "image": "/images/products/2.png"
    }
  ]
  )



export const useProductsAll = () => {
  // you can swap ref() for useState() if you need it to be global across pages
  const products = ref(defaultProducts)
  return { products }
}
