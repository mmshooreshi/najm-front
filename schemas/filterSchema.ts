// schemas/filterSchema.ts
export interface FilterOption {
    value: string
    label: string
  }
  
  export interface FilterGroup {
    key: string               // → query param
    label: string             // UI title
    openByDefault?: boolean   // collapse state
    options: FilterOption[]   // fetched from PB or default
  }
  
  // fallback defaults used if PB fails
  export const defaultFilterSchema: FilterGroup[] = [
    {
      key: 'productType',
      label: 'نوع محصول',
      openByDefault: true,
      options: [
        { value: 'packaging', label: 'بسته‌بندی' },
        { value: 'print',     label: 'چاپ'       },
      ]
    },
    // …other groups…
  ]
  