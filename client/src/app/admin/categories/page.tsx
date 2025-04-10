'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CategoryDto, PagedList } from '@/types/category'
import {
  fetchCategories,
  deleteCategory,
  restoreCategory,
} from '@/app/api/categories'
import { toast } from 'react-hot-toast'
import AdminLayout from '@/components/Admin/AdminLayout'

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)

  useEffect(() => {
    loadCategories(searchTerm, currentPage, 10)
  }, [currentPage])

  const loadCategories = async (
    search: string,
    page: number,
    pageSize: number
  ) => {
    try {
      setLoading(true)
      const response = await fetchCategories(page, pageSize, search)

      if (response.success) {
        setCategories(response.data)
        setTotalPages(response.totalPages)
        setTotalCount(response.totalCount)
      } else {
        toast.error(`Failed to load categories - ${response.message}`)
      }
    } catch (error: any) {
      toast.error(`Failed to load categories - ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadCategories(searchTerm, currentPage, 10)
  }

  const handleDeleteCategory = async (id: string) => {
    // Optimistic UI update
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, isDeleted: true } : cat))
    )

    try {
      await deleteCategory(id)
      toast.success('Category deleted successfully')
    } catch (error) {
      // Revert on error
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, isDeleted: false } : cat))
      )
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleRestoreCategory = async (id: string) => {
    // Optimistic UI update
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, isDeleted: false } : cat))
    )

    try {
      await restoreCategory(id)
      toast.success('Category restored successfully')
    } catch (error) {
      // Revert on error
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, isDeleted: true } : cat))
      )
      console.error('Error restoring category:', error)
      toast.error('Failed to restore category')
    }
  }

  return (
    <AdminLayout title="Manage Categories">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Category List</h2>
          <Link
            href="/admin/categories/create"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Add Category
          </Link>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search categories..."
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Search
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg overflow-hidden border">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories && categories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500">
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    categories &&
                    categories.map((category) => (
                      <tr
                        key={category.id}
                        className={`hover:bg-gray-50 ${
                          category.isDeleted ? 'bg-red-50' : ''
                        }`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.productsCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              category.isDeleted
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                            {category.isDeleted ? 'Deleted' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/categories/edit/${category.id}`}
                              className="text-blue-600 hover:text-blue-900">
                              Edit
                            </Link>
                            {category.isDeleted ? (
                              <button
                                onClick={() =>
                                  handleRestoreCategory(category.id)
                                }
                                className="text-green-600 hover:text-green-900">
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                className="text-red-600 hover:text-red-900">
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-3 flex justify-between items-center border-t">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50">
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
