// composables/ui/schemaRegistry.ts
type UiForLang = Record<string, any>
type AllUi = Record<string, UiForLang>

const localData = import.meta.glob<{ default: AllUi }>(
  '@/schemas/*-ui.json',
  { eager: true }
)

/**
 * Find the raw schema object for a given slug from the schemas/ folder.
 */
export function getLocalSchema(slug: string): AllUi {
  if (!slug) return {}
  
  // Try exact match
  let entry = Object.entries(localData).find(([key]) => key.endsWith(`/${slug}-ui.json`))
  if (!entry) {
    // Try sanitized slug match
    const clean = slug.replace(/[^a-zA-Z0-9-]/g, '')
    entry = Object.entries(localData).find(([key]) => key.endsWith(`/${clean}-ui.json`))
  }
  return (entry?.[1]?.default ?? {}) as AllUi
}

/**
 * Get the UI object for a specific slug and language.
 */
export function getBaseSchemaForSlugAndLang(slug: string, lang: string): UiForLang {
  const all = getLocalSchema(slug)
  const upper = lang ? lang.toUpperCase() : 'FA'
  const lower = lang ? lang.toLowerCase() : 'fa'
  return all[upper] || all[lower] || all['FA'] || all['fa'] || {}
}
