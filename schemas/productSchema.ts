// schemas/productSchema.ts
export interface Product {
    id: number
    title: string
    image: string
    productType: string
    industry: string[]
    useCase: string[]
    // …other PB fields…
  }