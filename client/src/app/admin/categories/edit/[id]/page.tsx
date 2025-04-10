'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryDto, UpdateCategoryDto } from '@/types/category'
import { getCategoryById, updateCategory } from '@/app/api/categories'
import { toast } from 'react-hot-toast'

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
  const [category, setCategory] = useState<CategoryDto | null>(null)
  const [formData, setFormData] = useState<UpdateCategoryDto>({
    name: '',
    description: '',
  })

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(id)
        setCategory(data)
        setFormData({
          name: data.name,
          description: data.description,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      toast.error('Category name is required')
      return
    }

    setSaving(true)
    try {
      await updateCategory(id, formData)
      toast.success('Category updated successfully')
      router.push('/admin/categories')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="p-6">
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
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Category</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-2xl">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {category.isDeleted && (
          <div className="mb-6">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              This category is currently deleted. You can restore it from the
              category list.
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300">
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
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
