'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryDto } from '@/types/category'
import { fetchCategories } from '@/app/api/categories'
import { productsApi, ProductUpdateDto } from '@/api/productsApi'
import { toast } from 'react-hot-toast'
import AdminLayout from '@/components/Admin/AdminLayout'
import ImageUpload from '@/components/Common/ImageUpload'

interface ProductEditPageProps {
  params: {
    id: string
  }
}

const EditProductPage: React.FC<ProductEditPageProps> = ({ params }) => {
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [formData, setFormData] = useState<ProductUpdateDto>({
    id: id,
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    imageUrl: '',
    categoryId: '',
  })

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const response = await productsApi.getProductById(id)

        if (response.success) {
          const product = response.data
          setFormData({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            imageUrl: product.imageUrl,
            categoryId: product.categoryId,
          })
        } else {
          toast.error(response.message || 'Failed to load product')
          router.push('/admin/products')
        }
      } catch (error: any) {
        console.error('Error fetching product:', error)
        toast.error(
          error.message || 'An error occurred while loading the product'
        )
        router.push('/admin/products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id, router])

  // Fetch all categories for category selection
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await fetchCategories(1, 100) // Get up to 100 categories
        if (response.success) {
          setCategories(response.data)
        } else {
          toast.error(`Failed to load categories - ${response.message}`)
        }
      } catch (error: any) {
        toast.error(`Failed to load categories - ${error.message}`)
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stockQuantity'
          ? parseFloat(value) || 0
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      toast.error('Product name is required')
      return
    }

    if (!formData.categoryId) {
      toast.error('Please select a category')
      return
    }

    if (formData.price !== undefined && formData.price <= 0) {
      toast.error('Price must be greater than zero')
      return
    }

    if (formData.stockQuantity !== undefined && formData.stockQuantity < 0) {
      toast.error('Stock quantity cannot be negative')
      return
    }

    // Validate imageUrl is set
    if (!formData.imageUrl) {
      toast.error('Please upload an image for the product')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await productsApi.updateProduct(formData)

      if (response.success) {
        toast.success('Product updated successfully')
        router.push('/admin/products')
      } else {
        // Check for specific validation errors
        if (response.message?.includes('ImageUrl')) {
          toast.error('Image URL is required. Please upload an image.')
        } else {
          toast.error(response.message || 'Failed to update product')
        }
      }
    } catch (error: any) {
      console.error('Error updating product:', error)

      // Check for validation errors in the response
      if (error.response?.data?.errors?.ImageUrl) {
        toast.error(error.response.data.errors.ImageUrl[0])
      } else {
        toast.error(
          error.message || 'An error occurred while updating the product'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl,
    }))
  }

  // Organize categories into hierarchical structure for the dropdown
  const organizedCategories = () => {
    // Get top-level categories
    const topLevel = categories.filter((c) => !c.parentId && !c.isDeleted)

    // Function to get option label with proper indentation
    const getOptionLabel = (category: CategoryDto, level: number = 0) => {
      return {
        id: category.id,
        name: `${' '.repeat(level * 4)}${category.name}`,
      }
    }

    // Build the flat list with visual hierarchy
    const result: { id: string; name: string }[] = []

    // Add each top-level category and its children
    topLevel.forEach((category) => {
      result.push(getOptionLabel(category))

      // Add subcategories with indentation
      const subcategories = categories.filter(
        (c) => c.parentId === category.id && !c.isDeleted
      )
      subcategories.forEach((subCategory) => {
        result.push(getOptionLabel(subCategory, 1))
      })
    })

    return result
  }

  if (isLoading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Product">
      <div className="space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Category */}
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={loadingCategories}>
                <option value="">Select a category</option>
                {loadingCategories ? (
                  <option disabled>Loading categories...</option>
                ) : (
                  organizedCategories().map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label
                htmlFor="stockQuantity"
                className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                min="0"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Image URL */}
            <div className="col-span-2">
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImageUrl={formData.imageUrl}
                label="Product Image *"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload an image for this product
              </p>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default EditProductPage
