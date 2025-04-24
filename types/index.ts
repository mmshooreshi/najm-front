// /types/index.ts

/**
 * A single product item within a package.
 */
export interface Product {
  /** Unique identifier for the product */
  id: number
  /** Display name of the product */
  name: string
  /** URL or path to the product image */
  image: string
  /** Key/value pairs of product specifications (e.g., size, format) */
  specs: Record<string,string>
}

/**
 * A package containing multiple products.
 */
export interface Package {
  /** Unique identifier for the package */
  id: number
  /** List of products included in this package */
  products: Product[]
  // …any other metadata your slide needs (e.g., title, description)
}
