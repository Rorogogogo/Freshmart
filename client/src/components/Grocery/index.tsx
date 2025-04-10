'use client'
import React, { useState, useEffect } from 'react'
import GroceryItem from './GroceryItem'
import GroceryItemDetail from './GroceryItemDetail'
import { Icon } from '@iconify/react/dist/iconify.js'
import SearchBox from '@/components/Common/SearchBox'
import { useSearchParams } from 'next/navigation'
import { categoriesApi, Category } from '@/api/categoriesApi'
import { productsApi, Product } from '@/api/productsApi'

const GroceryStore = () => {
  const searchParams = useSearchParams()
  const initialSearchTerm = searchParams?.get('search') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch categories
        const categoriesResponse = await categoriesApi.getCategories()

        // Add "All" category
        const allCategories = [
          {
            id: 'all',
            name: 'All',
            description: 'All products',
            count: categoriesResponse.data.length,
            isDeleted: false,
            createdAt: new Date().toISOString(),
          },
          ...categoriesResponse.data,
        ]

        setCategories(allCategories)

        // Fetch products
        const productsResponse = await productsApi.getProducts({
          pageSize: 50, // Fetch up to 50 products
        })

        setProducts(productsResponse.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products based on category and search term
  const filteredProducts = React.useMemo(() => {
    let filtered = products

    if (selectedCategory !== 'All') {
      const categoryId = categories.find((c) => c.name === selectedCategory)?.id
      if (categoryId) {
        filtered = filtered.filter(
          (product) => product.categoryId === categoryId
        )
      }
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [products, categories, selectedCategory, searchTerm])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleItemClick = (id: string) => {
    setSelectedItem(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const selectedProductDetails =
    selectedItem !== null
      ? products.find((product) => product.id === selectedItem)
      : null

  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-28 overflow-hidden z-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Fresh Grocery Store
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Shop fresh, organic, and quality groceries delivered to your
            doorstep.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-darkmode shadow-md rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBox
              onSearch={handleSearch}
              initialValue={initialSearchTerm}
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleCategoryChange(category.name)}>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Loading products...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <Icon
              icon="ph:warning"
              className="mx-auto text-red-500"
              width={64}
              height={64}
            />
            <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
              Error
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        )}

        {/* Grid of Items */}
        {!loading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <GroceryItem
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    categoryName={
                      categories.find((c) => c.id === product.categoryId)
                        ?.name || 'Unknown'
                    }
                    imageUrl={product.imageUrl}
                    rating={product.rating || 4.5}
                    stockQuantity={product.stockQuantity}
                    onClickDetails={handleItemClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon
                  icon="ph:shopping-bag"
                  className="mx-auto text-gray-400 dark:text-gray-500"
                  width={64}
                  height={64}
                />
                <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
                  No items found
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedProductDetails && (
        <GroceryItemDetail
          id={selectedProductDetails.id}
          name={selectedProductDetails.name}
          price={selectedProductDetails.price}
          categoryName={
            categories.find((c) => c.id === selectedProductDetails.categoryId)
              ?.name || 'Unknown'
          }
          imageUrl={selectedProductDetails.imageUrl}
          description={selectedProductDetails.description}
          stockQuantity={selectedProductDetails.stockQuantity}
          rating={selectedProductDetails.rating || 4.5}
          reviewCount={selectedProductDetails.reviewCount || 0}
          nutrition={null} // No nutrition data available
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  )
}

export default GroceryStore
