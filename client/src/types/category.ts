export interface CategoryDto {
  id: string
  name: string
  description: string
  productsCount: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  parentId?: string
  subCategories?: CategoryDto[]
  imageUrl?: string
}

export interface CreateCategoryDto {
  name: string
  description: string
  parentId?: string
  imageUrl?: string
}

export interface UpdateCategoryDto {
  name?: string
  description?: string
  parentId?: string
  imageUrl?: string
}

export interface CategoryHierarchy {
  id: string
  name: string
  description: string
  productsCount: number
  subCategories: CategoryDto[]
  imageUrl?: string
}

export interface PagedList<T> {
  data: T[]
  page: number
  pageSize: number
  totalPages: number
  totalCount: number
  success: boolean
  message: string
  statusCode: number
}
