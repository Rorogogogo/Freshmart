'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryDto, UpdateCategoryDto } from '@/types/category'
import {
  getCategoryById,
  updateCategory,
  fetchCategories,
} from '@/app/api/categories'
import { toast } from 'react-hot-toast'
import AdminLayout from '@/components/Admin/AdminLayout'
import ImageUpload from '@/components/Common/ImageUpload'

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const router = useRouter()
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [category, setCategory] = useState<CategoryDto | null>(null)
  const [formData, setFormData] = useState<UpdateCategoryDto>({
    name: '',
    description: '',
    parentId: undefined,
    imageUrl: '',
  })

  // Fetch categories for parent selection
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

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(id)
        setCategory(data)
        setFormData({
          name: data.name,
          description: data.description,
          parentId: data.parentId || undefined,
          imageUrl: data.imageUrl || '',
        })
      } catch (error) {
        console.error('Error fetching category:', error)
        toast.error('Failed to load category data')
        router.push('/admin/categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id, router])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    // Handle the special case for parentId select
    if (name === 'parentId' && value === '') {
      setFormData((prev) => ({
        ...prev,
        parentId: undefined,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      toast.error('Category name is required')
      return
    }

    // Validate imageUrl is set
    if (!formData.imageUrl) {
      toast.error('Please upload an image for the category')
      return
    }

    setSaving(true)
    try {
      await updateCategory(id, formData)
      toast.success('Category updated successfully')
      router.push('/admin/categories')
    } catch (error: any) {
      console.error('Error updating category:', error)
      const errorMessage = error.response?.data?.errors?.ImageUrl
        ? error.response.data.errors.ImageUrl[0]
        : 'Failed to update category'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Category">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!category) {
    return (
      <AdminLayout title="Edit Category">
        <div className="max-w-2xl mx-auto bg-white dark:bg-darkmode p-6 rounded-lg shadow">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Category not found.
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push('/admin/categories')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Back to Categories
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Category">
      <div className="max-w-2xl mx-auto bg-white dark:bg-darkmode p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="parentId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parent Category
              </label>
              <select
                id="parentId"
                name="parentId"
                value={formData.parentId || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={loadingCategories}>
                <option value="">None (Top-Level Category)</option>
                {loadingCategories ? (
                  <option disabled>Loading categories...</option>
                ) : (
                  categories
                    // Filter out: the current category itself and its subcategories (to prevent circular references)
                    .filter(
                      (cat) =>
                        !cat.isDeleted &&
                        cat.id !== id &&
                        (!cat.parentId || cat.parentId !== id)
                    )
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                )}
              </select>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a parent category or none for a top-level category
              </p>
            </div>

            <div className="col-span-2">
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImageUrl={formData.imageUrl}
                label="Category Image"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload an image for this category (optional)
              </p>
            </div>

            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {category.isDeleted && (
            <div className="mt-4">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                This category is currently deleted. You can restore it from the
                category list.
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/categories')}
              className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800">
              {saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
