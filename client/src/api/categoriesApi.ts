import apiClient from './auth'
import { AxiosResponse } from 'axios'

export interface Category {
  id: string
  name: string
  description?: string
  count?: number
  isDeleted: boolean
  createdAt: string
  updatedAt?: string
}

export interface CategoryCreateDto {
  name: string
  description?: string
}

export interface CategoryUpdateDto extends Partial<CategoryCreateDto> {
  id: string
}

export interface CategoriesApiResponse {
  success: boolean
  message: string
  statusCode: number
  data: Category[]
  totalCount?: number
  pageSize?: number
  currentPage?: number
}

export interface CategoryApiResponse {
  success: boolean
  message: string
  statusCode: number
  data: Category
}

export interface CategoriesSearchParams {
  page?: number
  pageSize?: number
  searchTerm?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  includeDeleted?: boolean
}

export const categoriesApi = {
  // Get all categories with optional filtering and pagination
  getCategories: async (
    params: CategoriesSearchParams = {}
  ): Promise<CategoriesApiResponse> => {
    try {
      const queryParams = new URLSearchParams()

      if (params.page) queryParams.append('page', params.page.toString())
      if (params.pageSize)
        queryParams.append('pageSize', params.pageSize.toString())
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm)
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.sortDirection)
        queryParams.append('sortDirection', params.sortDirection)
      if (params.includeDeleted)
        queryParams.append('includeDeleted', params.includeDeleted.toString())

      const response: AxiosResponse<CategoriesApiResponse> =
        await apiClient.get(`/categories?${queryParams.toString()}`)

      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // Get a single category by ID
  getCategoryById: async (id: string): Promise<CategoryApiResponse> => {
    try {
      const response: AxiosResponse<CategoryApiResponse> = await apiClient.get(
        `/categories/${id}`
      )
      return response.data
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error)
      throw error
    }
  },

  // Create a new category
  createCategory: async (
    categoryData: CategoryCreateDto
  ): Promise<CategoryApiResponse> => {
    try {
      const response: AxiosResponse<CategoryApiResponse> = await apiClient.post(
        '/categories',
        categoryData
      )
      return response.data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },

  // Update an existing category
  updateCategory: async (
    categoryData: CategoryUpdateDto
  ): Promise<CategoryApiResponse> => {
    try {
      const response: AxiosResponse<CategoryApiResponse> = await apiClient.put(
        `/categories/${categoryData.id}`,
        categoryData
      )
      return response.data
    } catch (error) {
      console.error(
        `Error updating category with ID ${categoryData.id}:`,
        error
      )
      throw error
    }
  },

  // Soft delete a category
  deleteCategory: async (id: string): Promise<CategoryApiResponse> => {
    try {
      const response: AxiosResponse<CategoryApiResponse> =
        await apiClient.delete(`/categories/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error)
      throw error
    }
  },

  // Restore a soft-deleted category
  restoreCategory: async (id: string): Promise<CategoryApiResponse> => {
    try {
      const response: AxiosResponse<CategoryApiResponse> = await apiClient.post(
        `/categories/${id}/restore`
      )
      return response.data
    } catch (error) {
      console.error(`Error restoring category with ID ${id}:`, error)
      throw error
    }
  },

  // Get categories with product counts
  getCategoriesWithCounts: async (): Promise<CategoriesApiResponse> => {
    try {
      const response: AxiosResponse<CategoriesApiResponse> =
        await apiClient.get('/categories/with-counts')
      return response.data
    } catch (error) {
      console.error('Error fetching categories with counts:', error)
      throw error
    }
  },
}
