import { useRuntimeConfig, useAsyncData } from '#app'
import { defaultFilterSchema, type FilterGroup } from '~/schemas/filterSchema'
import { computed } from 'vue'

export function useFilterSchema() {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl

  // Fetch filter groups from PocketBase
  const { data: rawSchema, pending } = useAsyncData<FilterGroup[]>(
    'filter-schema',
    async () => {
      const res = await $fetch<{ items: FilterGroup[] }>(
        `${pbUrl}/api/collections/filterGroups/records`
      )
      return res.items
    },
    {
      server: true,
      lazy: false
    }
  )

  // Fallback to default schema if fetch fails or is undefined
  const filterSchema = computed<FilterGroup[]>(
    () => rawSchema.value ?? defaultFilterSchema
  )

  return { filterSchema, loading: pending }
}