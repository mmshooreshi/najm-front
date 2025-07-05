// composables/ui/productsUI.ts
import { computed, Ref } from 'vue'
import { useFetch } from '#app'

// Define the Product interface to match your PocketBase schema
export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  shortDescription?: string
  price: number
  currency: string
  media?: string[]
}

interface ProductsResponse {
  page: number
  perPage: number
  totalPages: number
  totalItems: number
  items: Product[]
}

/**
 * Fetches a paginated list of products from PocketBase.
 * @param page - page number (default 1)
 * @param perPage - items per page (default 50)
 */
export function useProductsUI(
  page: number = 1,
  perPage: number = 50,
  sort: string = '-created'
) {
  const url =
    `https://aisland.co/najm/api/collections/products/records?page=${page}&perPage=${perPage}&sort=${encodeURIComponent(
      sort
    )}`

  const { data, pending, error } = useFetch<ProductsResponse>(
    url,
    {
      key: `products-list-${page}-${perPage}-${sort}`,
      // default shape in case of no data
      default: () => ({ page, perPage, totalPages: 0, totalItems: 0, items: [] })
    }
  )

  const products: Ref<Product[]> = computed(() => data.value?.items || [])

  return {
    products,
    pending,
    error,
    meta: computed(() => ({
      page: data.value?.page,
      perPage: data.value?.perPage,
      totalPages: data.value?.totalPages,
      totalItems: data.value?.totalItems
    }))
  }
}