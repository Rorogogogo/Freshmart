import apiClient from './auth'
import { AxiosResponse } from 'axios'

export interface Product {
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

export interface ProductCreateDto {
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: string
  categoryId: string
}

export interface ProductUpdateDto {
  id: string
  name?: string
  description?: string
  price?: number
  stockQuantity?: number
  imageUrl?: string
  categoryId?: string
}

export interface ProductsApiResponse {
  success: boolean
  message: string
  statusCode: number
  data: Product[]
  totalCount: number
  totalPages: number
  pageSize: number
  page: number
}

export interface ProductApiResponse {
  success: boolean
  message: string
  statusCode: number
  data: Product
}

export interface ProductsSearchParams {
  page?: number
  pageSize?: number
  searchTerm?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

export interface RateProductRequest {
  rating: number
  review?: string
}

export const productsApi = {
  // Get all products with optional filtering and pagination
  getProducts: async (
    params: ProductsSearchParams = {}
  ): Promise<ProductsApiResponse> => {
    try {
      const queryParams = new URLSearchParams()

      if (params.page) queryParams.append('page', params.page.toString())
      if (params.pageSize)
        queryParams.append('pageSize', params.pageSize.toString())
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm)
      if (params.categoryId) queryParams.append('categoryId', params.categoryId)
      if (params.minPrice)
        queryParams.append('minPrice', params.minPrice.toString())
      if (params.maxPrice)
        queryParams.append('maxPrice', params.maxPrice.toString())
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.sortDirection)
        queryParams.append('sortDirection', params.sortDirection)

      const response: AxiosResponse<ProductsApiResponse> = await apiClient.get(
        `/products?${queryParams.toString()}`
      )

      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Get a single product by ID
  getProductById: async (id: string): Promise<ProductApiResponse> => {
    try {
      const response: AxiosResponse<ProductApiResponse> = await apiClient.get(
        `/products/${id}`
      )
      return response.data
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error)
      throw error
    }
  },

  // Create a new product
  createProduct: async (
    productData: ProductCreateDto
  ): Promise<ProductApiResponse> => {
    try {
      const response: AxiosResponse<ProductApiResponse> = await apiClient.post(
        '/products',
        productData
      )
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  // Update an existing product
  updateProduct: async (
    productData: ProductUpdateDto
  ): Promise<ProductApiResponse> => {
    try {
      const { id, ...updateData } = productData
      const response: AxiosResponse<ProductApiResponse> = await apiClient.put(
        `/products/${id}`,
        updateData
      )
      return response.data
    } catch (error) {
      console.error(`Error updating product with ID ${productData.id}:`, error)
      throw error
    }
  },

  // Soft delete a product
  deleteProduct: async (id: string): Promise<ProductApiResponse> => {
    try {
      const response: AxiosResponse<ProductApiResponse> =
        await apiClient.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error)
      throw error
    }
  },

  // Restore a soft-deleted product
  restoreProduct: async (id: string): Promise<ProductApiResponse> => {
    try {
      const response: AxiosResponse<ProductApiResponse> = await apiClient.post(
        `/products/${id}/restore`
      )
      return response.data
    } catch (error) {
      console.error(`Error restoring product with ID ${id}:`, error)
      throw error
    }
  },

  // Rate a product
  rateProduct: async (
    id: string,
    rateData: RateProductRequest
  ): Promise<ProductApiResponse> => {
    try {
      const response: AxiosResponse<ProductApiResponse> = await apiClient.post(
        `/products/${id}/rate`,
        rateData
      )
      return response.data
    } catch (error) {
      console.error(`Error rating product with ID ${id}:`, error)
      throw error
    }
  },
}
