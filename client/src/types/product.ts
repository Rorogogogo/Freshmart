export interface ProductDto {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: string
  categoryId: string
  categoryName: string
  rating: number
  reviewCount: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string | null
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: string
  categoryId: string
}

export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  stockQuantity?: number
  imageUrl?: string
  categoryId?: string
}

export interface RateProductDto {
  rating: number
  review?: string
}
