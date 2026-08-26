// composables/useDynamicData.ts
import { useFetch } from "#app"
import { computed, watch } from "vue"
import { logger } from "~/utils/logger"

export function useSiteSettings() {
  const { data, pending, refresh } = useFetch("/api/settings", {
    key: "site-settings-global",
    default: () => ({
      ok: true,
      settings: {
        siteTitle: "مجتمع تخصصی چاپ و بسته‌بندی نجم",
        phone: "۰۲۱ - ۶۶۰۰ ۰۰۰۰",
        mobile: "۰۹۱۲ ۰۰۰ ۰۰۰۰",
        email: "info@chapnajm.com",
        address: "تهران، دفتر مرکزی و کارخانه چاپ نجم",
        workingHours: "شنبه تا چهارشنبه ۸:۳۰ الی ۱۸:۰۰",
        socialLinks: {
          whatsapp: "https://wa.me/989120000000",
          telegram: "https://t.me/chapnajm",
          instagram: "https://instagram.com/chapnajm"
        }
      }
    })
  })

  const settings = computed(() => data.value?.settings || {})
  return { settings, pending, refresh }
}

export function useDynamicProducts(categoryRef?: any, searchRef?: any, sortRef?: any) {
  const query = computed(() => ({
    category: categoryRef?.value || "all",
    search: searchRef?.value || "",
    sort: sortRef?.value || "popular"
  }))

  const { data, pending, refresh } = useFetch("/api/products", {
    key: "dynamic-products-list",
    query,
    watch: [query],
    default: () => ({ ok: true, items: [], total: 0 })
  })

  const products = computed(() => data.value?.items || [])
  const total = computed(() => data.value?.total || 0)

  if (process.dev) {
    watch(products, (items) => {
      if (items && items.length > 0) {
        logger.info("Catalog:Products", `Loaded ${items.length} dynamic products (Category: ${query.value.category}, Search: "${query.value.search}")`)
      }
    }, { immediate: true })
  }

  return { products, total, pending, refresh }
}

export function useDynamicPosts(categoryRef?: any, searchRef?: any) {
  const query = computed(() => ({
    category: categoryRef?.value || "all",
    search: searchRef?.value || ""
  }))

  const { data, pending, refresh } = useFetch("/api/posts", {
    key: "dynamic-posts-list",
    query,
    watch: [query],
    default: () => ({ ok: true, items: [], total: 0 })
  })

  const posts = computed(() => data.value?.items || [])
  const total = computed(() => data.value?.total || 0)

  if (process.dev) {
    watch(posts, (items) => {
      if (items && items.length > 0) {
        logger.info("Blog:Posts", `Loaded ${items.length} dynamic blog articles (Category: ${query.value.category})`)
      }
    }, { immediate: true })
  }

  return { posts, total, pending, refresh }
}

