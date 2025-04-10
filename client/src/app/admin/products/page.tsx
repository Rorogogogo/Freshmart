'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ProductDto } from '@/types/product'
import AdminLayout from '@/components/Admin/AdminLayout'
import { productsApi } from '@/api/productsApi'
import { useNotification } from '@/contexts/NotificationContext'
import { Product } from '@/api/productsApi'

export default function ProductsAdminPage() {
  const router = useRouter()
  const notification = useNotification()
  const [products, setProducts] = useState<ProductDto[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    // Apply filtering when products or search term changes
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Update total pages based on filtered results
    setTotalPages(Math.ceil(filtered.length / pageSize))

    // Apply pagination to filtered results
    const start = (currentPage - 1) * pageSize
    const paginatedProducts = filtered.slice(start, start + pageSize)

    setFilteredProducts(paginatedProducts)
  }, [products, searchTerm, currentPage, pageSize])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      // Fetch all products at once for client-side filtering
      const response = await productsApi.getProducts({
        pageSize: 100, // Get more products at once to enable client-side filtering
        sortBy: 'name',
        sortDirection: 'asc',
      })

      if (response.success) {
        // Map API Products to ProductDto
        const productDtos: ProductDto[] = response.data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          stockQuantity: p.stockQuantity,
          imageUrl: p.imageUrl,
          categoryId: p.categoryId,
          categoryName: p.categoryName,
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
          isDeleted: p.isDeleted,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt || null,
        }))

        setProducts(productDtos)
        // Initial filtering will happen in the useEffect
      } else {
        notification.error(response.message || 'Failed to fetch products')
        setProducts([])
        setFilteredProducts([])
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      notification.error('Failed to fetch products. Please try again.')
      setProducts([])
      setFilteredProducts([])
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    // The actual filtering happens in the useEffect
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await productsApi.deleteProduct(id)

        if (response.success) {
          notification.success('Product deleted successfully')
          // Update both main products list and filtered list
          const updatedProducts = products.map((p) =>
            p.id === id ? { ...p, isDeleted: true } : p
          )
          setProducts(updatedProducts)
          // Filtered products will update via useEffect
        } else {
          notification.error(response.message || 'Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        notification.error('Failed to delete product. Please try again.')
      }
    }
  }

  const handleRestoreProduct = async (id: string) => {
    try {
      const response = await productsApi.restoreProduct(id)

      if (response.success) {
        notification.success('Product restored successfully')
        // Update both main products list and filtered list
        const updatedProducts = products.map((p) =>
          p.id === id ? { ...p, isDeleted: false } : p
        )
        setProducts(updatedProducts)
        // Filtered products will update via useEffect
      } else {
        notification.error(response.message || 'Failed to restore product')
      }
    } catch (error) {
      console.error('Error restoring product:', error)
      notification.error('Failed to restore product. Please try again.')
    }
  }

  return (
    <AdminLayout title="Manage Products">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Product List</h2>
          <Link
            href="/admin/products/create"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Add New Product
          </Link>
        </div>

        {/* Search and filters */}
        <div className="bg-gray-50 rounded-lg p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Search
            </button>
          </form>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-lg overflow-hidden border">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products found. Try a different search term or add a new
              product.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className={product.isDeleted ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-10 w-10 rounded-full object-cover"
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  No img
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stockQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.categoryName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.isDeleted ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Deleted
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                          {product.isDeleted ? (
                            <button
                              onClick={() => handleRestoreProduct(product.id)}
                              className="text-green-600 hover:text-green-900">
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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
