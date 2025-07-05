// composables/useProducts.ts
import { ref, computed, watch } from 'vue'
import { useAsyncData, useRuntimeConfig } from '#app'
import type { Product } from '~/schemas/productSchema'

interface ProductsResponse {
  items: Product[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

export function useProducts(
  filters: Record<string, string[]>,
  perPage = 12
) {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl
  const page = ref(1)

  const filterExpr = computed(() => {
    const clauses: string[] = []
    for (const [key, vals] of Object.entries(filters)) {
      if (!vals.length) continue
      const expr = vals
        .map(v =>
          (key === 'industry' || key === 'useCase')
            ? `${key} ~ \"${v}\"`
            : `${key} = \"${v}\"`
        )
        .join(' || ')
      clauses.push(`(${expr})`)
    }
    return clauses.join(' && ')
  })

  // Keyless: omit explicit key so Nuxt auto-keys
  const { data, pending, refresh, error } = useAsyncData<ProductsResponse, ProductsResponse>(
    async () => {
      try {
        return await $fetch<ProductsResponse>(
          `${pbUrl}/api/collections/products/records`,
          { params: { filter: filterExpr.value, page: page.value, perPage } }
        )
      } catch {
        return {
          items: [],
          page: 1,
          perPage,
          totalItems: 0,
          totalPages: 1,
        }
      }
    },
    {
      default: () => ({ items: [], page: 1, perPage, totalItems: 0, totalPages: 1 }),
      server: true,
      lazy:   true,
    }
  )

  const products = computed(() => data.value?.items ?? [])
  const meta = computed(() => ({
    page:       data.value?.page       ?? page.value,
    perPage:    data.value?.perPage    ?? perPage,
    totalItems: data.value?.totalItems ?? 0,
    totalPages: data.value?.totalPages ?? 1,
  }))

  watch([filterExpr, page], () => refresh(), { immediate: true })

  return { products, meta, loading: pending, error, page }
}