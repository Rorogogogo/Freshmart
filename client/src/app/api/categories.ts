import axios from 'axios'
import { API_URL } from '@/api/apiConfig'
import {
  CategoryDto,
  CreateCategoryDto,
  PagedList,
  UpdateCategoryDto,
} from '@/types/category'

export const fetchCategories = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string
): Promise<PagedList<CategoryDto>> => {
  try {
    const params = new URLSearchParams()
    params.append('pageNumber', page.toString())
    params.append('pageSize', pageSize.toString())
    if (searchTerm) {
      params.append('searchTerm', searchTerm)
    }

    const response = await axios.get(
      `${API_URL}/api/categories?${params.toString()}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const getCategoryById = async (id: string): Promise<CategoryDto> => {
  try {
    const response = await axios.get(`${API_URL}/api/categories/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error)
    throw error
  }
}

export const createCategory = async (
  category: CreateCategoryDto
): Promise<CategoryDto> => {
  try {
    const response = await axios.post(`${API_URL}/api/categories`, category)
    return response.data.data
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export const updateCategory = async (
  id: string,
  category: UpdateCategoryDto
): Promise<CategoryDto> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/categories/${id}`,
      category
    )
    return response.data.data
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error)
    throw error
  }
}

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/categories/${id}`)
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error)
    throw error
  }
}

export const restoreCategory = async (id: string): Promise<CategoryDto> => {
  try {
    const response = await axios.patch(
      `${API_URL}/api/categories/${id}/restore`
    )
    return response.data.data
  } catch (error) {
    console.error(`Error restoring category with id ${id}:`, error)
    throw error
  }
}

// Add a convenient alias for categoriesApi similar to other APIs
export const categoriesApi = {
  getCategories: async ({
    page = 1,
    pageSize = 10,
    searchTerm = '',
    includeDeleted = false,
    includeSubcategories = false,
  }: {
    page?: number
    pageSize?: number
    searchTerm?: string
    includeDeleted?: boolean
    includeSubcategories?: boolean
  } = {}): Promise<{
    success: boolean
    message: string
    data: any[]
    totalCount: number
    totalPages: number
  }> => {
    try {
      const params = new URLSearchParams()
      params.append('pageNumber', page.toString())
      params.append('pageSize', pageSize.toString())

      if (searchTerm) params.append('searchTerm', searchTerm)
      if (includeDeleted) params.append('includeDeleted', 'true')
      if (includeSubcategories) params.append('includeSubcategories', 'true')

      const response = await axios.get(
        `${API_URL}/api/categories?${params.toString()}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
}
