import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FilterGroup } from '~/schemas/filterSchema'

/**
 * Keeps filter selections reactive and URL-synced.
 */
export function useFilters(schema: FilterGroup[]) {
  const route = useRoute()
  const router = useRouter()

  // Initialize reactive filters from query params (comma-separated)
  const filters = reactive(
    Object.fromEntries(
      schema.map(g => [
        g.key,
        route.query[g.key]?.toString().split(',').filter(Boolean) || []
      ])
    ) as Record<string, string[]>
  )

  // Sync reactive filters back to URL (as comma-separated values)
  watch(
    filters,
    () => {
      const query: Record<string, string> = {}
      for (const key in filters) {
        if (filters[key].length) {
          query[key] = filters[key].join(',')
        }
      }
      router.replace({ query })
    },
    { deep: true }
  )

  return filters
}