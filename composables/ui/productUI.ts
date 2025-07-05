// composables/ui/productUI.ts
import { computed, Ref } from 'vue'
import { useFetch } from '#app'

// Define the Product interface to match your PocketBase schema
export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: number
  currency: string
  categories?: number[]
  tags?: string[]
  media?: string[]
  variants?: any[]
  inventory?: any
  sections?: any[]
  created?: string
  updated?: string
}

// Response wrapper for list endpoints
interface ProductsResponse {
  page: number
  perPage: number
  totalPages: number
  totalItems: number
  items: Product[]
}

// Fetches a paginated list of products
export function useProductsUI(
  page: number = 1,
  perPage: number = 50,
  sort: string = '-created'
) {
  const url =
    `/api/collections/products/records?page=${page}&perPage=${perPage}&sort=${encodeURIComponent(
      sort
    )}`

  const { data, pending, error } = useFetch<ProductsResponse>(
    url,
    {
      key: `products-list-${page}-${perPage}-${sort}`,
      default: () => ({ page, perPage, totalPages: 0, totalItems: 0, items: [] })
    }
  )

  const products: Ref<Product[]> = computed(() => data.value?.items || [])
  const meta = computed(() => ({
    page: data.value?.page,
    perPage: data.value?.perPage,
    totalPages: data.value?.totalPages,
    totalItems: data.value?.totalItems
  }))

  return { products, pending, error, meta }
}

// Response wrapper for detail endpoint (we use list API with filter)
interface ProductDetailResponse {
  items: Product[]
}

// Fetches a single product by slug
export function useProductUI(
  slug: string | Ref<string>
) {
  const slugValue = typeof slug === 'string' ? slug : slug.value
  const url =
    `https://aisland.co/najm/api/collections/products/records?filter=slug="${encodeURIComponent(
      slugValue
    )}"&page=1&perPage=1`

  const { data, pending, error } = useFetch<ProductDetailResponse>(
    url,
    {
      key: `product-detail-${slugValue}`,
      default: () => ({ items: [] })
    }
  )

  const product = computed<Product | null>(() => data.value.items[0] || null)
  return { product, pending, error }
}