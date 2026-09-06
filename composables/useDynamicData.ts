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
        siteTitle: "مجتمع چاپ و بسته‌بندی نجم",
        phone: "۰۲۱-۶۶۷۹۷۹۱۱",
        mobile: "۰۹۹۰۳۴۰۰۰۷۴",
        email: "info@chapenajm.com",
        address: "تهران، بزرگراه فتح، زیر پل شیر پاستوریزه، ابتدای ۴۵ متری زرند، نبش کوچه تلفن‌خانه، پلاک ۱۶۶",
        workingHours: "شنبه تا چهارشنبه ۸:۳۰ الی ۱۸:۰۰",
        socialLinks: {
          whatsapp: "https://wa.me/989903400074",
          telegram: "https://t.me/chapenajm",
          instagram: "https://www.instagram.com/chape_najm/"
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

