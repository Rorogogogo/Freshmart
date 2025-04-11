'use client'
import React, { useState, useEffect } from 'react'
import GroceryItem from './GroceryItem'
import GroceryItemDetail from './GroceryItemDetail'
import { Icon } from '@iconify/react/dist/iconify.js'
import SearchBox from '@/components/Common/SearchBox'
import { useSearchParams, useRouter } from 'next/navigation'
import { categoriesApi, Category } from '@/api/categoriesApi'
import { productsApi, Product } from '@/api/productsApi'

const GroceryStore = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearchTerm = searchParams?.get('search') || ''
  const initialCategoryId = searchParams?.get('category') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryTree, setCategoryTree] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch categories
        const categoriesResponse = await categoriesApi.getCategories({
          includeSubcategories: true,
        })

        if (categoriesResponse.success) {
          // Create flat list of all categories
          const allCategories = categoriesResponse.data
          setCategories(allCategories)

          // Create category tree for sidebar display
          const rootCategories = allCategories.filter((cat) => !cat.parentId)
          setCategoryTree(rootCategories)

          // Set initial category and subcategory from URL if provided
          if (initialCategoryId) {
            const category = allCategories.find(
              (c) => c.id === initialCategoryId
            )
            if (category) {
              // If it's a subcategory, set both category and subcategory
              if (category.parentId) {
                const parentId = category.parentId // Store in a local variable to ensure it's not undefined
                setSelectedCategory(parentId)
                setSelectedSubcategory(category.id)
                // Automatically expand the parent category
                setExpandedCategories((prev) => [...prev, parentId])
              } else {
                // It's a main category
                setSelectedCategory(category.id)
                setSelectedSubcategory('')
              }
            }
          }
        }

        // Fetch products
        const productsResponse = await productsApi.getProducts({
          pageSize: 50, // Fetch up to 50 products
        })

        if (productsResponse.success) {
          setProducts(productsResponse.data)
        }

        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialCategoryId])

  // Find current category and subcategory objects
  const currentCategory =
    selectedCategory !== 'all'
      ? categories.find((c) => c.id === selectedCategory)
      : null

  const currentSubcategory = selectedSubcategory
    ? categories.find((c) => c.id === selectedSubcategory)
    : null

  // Get subcategories for the currently selected category
  const subcategories = React.useMemo(() => {
    if (selectedCategory === 'all') return []
    return categories.filter((cat) => cat.parentId === selectedCategory)
  }, [categories, selectedCategory])

  // Filter products based on category, subcategory and search term
  const filteredProducts = React.useMemo(() => {
    let filtered = products

    // Filter by subcategory first, if selected
    if (selectedSubcategory) {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedSubcategory
      )
    }
    // Otherwise filter by main category, if not "All"
    else if (selectedCategory !== 'all') {
      const categoryIds = [selectedCategory]

      // Include all subcategories of the selected category
      subcategories.forEach((subcat) => {
        categoryIds.push(subcat.id)
      })

      filtered = filtered.filter((product) =>
        categoryIds.includes(product.categoryId)
      )
    }

    // Then filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    subcategories,
    searchTerm,
  ])

  // Toggle a category's expanded state in the sidebar
  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  // Check if a category is expanded
  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId)
  }

  // Set the category and update URL
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory('')

    // Update URL to reflect the selection
    const url =
      categoryId === 'all' ? '/grocery' : `/grocery?category=${categoryId}`

    router.push(url)
  }

  // Set the subcategory and update URL
  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)

    // Update URL to reflect the selection
    router.push(`/grocery?category=${subcategoryId}`)
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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Fresh Grocery Store
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Shop fresh, organic, and quality groceries delivered to your
            doorstep.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-darkmode shadow-md rounded-lg p-4 mb-8">
          <SearchBox
            onSearch={handleSearch}
            initialValue={initialSearchTerm}
            className="w-full"
          />
        </div>

        {/* Page Content with Sidebar and Products */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-darkmode shadow-md rounded-lg p-4 sticky top-28">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b pb-2">
                Categories
              </h2>

              <ul className="space-y-1">
                {/* All Categories Option */}
                <li>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleCategoryChange('all')}>
                    All Products
                  </button>
                </li>

                {/* Category Tree */}
                {categoryTree.map((category) => {
                  // Find subcategories
                  const catSubcategories = categories.filter(
                    (cat) => cat.parentId === category.id
                  )
                  const hasSubcategories = catSubcategories.length > 0
                  const isExpanded = isCategoryExpanded(category.id)
                  const isActive = selectedCategory === category.id

                  return (
                    <li key={category.id} className="space-y-1">
                      <div className="flex items-center">
                        {/* Expand/collapse button for categories with subcategories */}
                        {hasSubcategories && (
                          <button
                            onClick={() => toggleCategoryExpanded(category.id)}
                            className="p-1 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <Icon
                              icon={
                                isExpanded ? 'ph:caret-down' : 'ph:caret-right'
                              }
                              width={14}
                              height={14}
                            />
                          </button>
                        )}

                        {/* Category button */}
                        <button
                          className={`flex-grow text-left px-3 py-2 rounded-md text-sm ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => handleCategoryChange(category.id)}>
                          {category.name}
                          {category.count ? ` (${category.count})` : ''}
                        </button>
                      </div>

                      {/* Subcategories (if expanded) */}
                      {hasSubcategories && isExpanded && (
                        <ul className="ml-6 space-y-1 mt-1">
                          {catSubcategories.map((subcategory) => (
                            <li key={subcategory.id}>
                              <button
                                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                                  selectedSubcategory === subcategory.id
                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                                onClick={() =>
                                  handleSubcategoryChange(subcategory.id)
                                }>
                                {subcategory.name}
                                {subcategory.count
                                  ? ` (${subcategory.count})`
                                  : ''}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Products Main Content */}
          <div className="flex-1">
            {/* Category/Subcategory Breadcrumb and Info */}
            <div className="bg-white dark:bg-darkmode shadow-md rounded-lg p-4 mb-4">
              <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                      <Icon
                        icon="ph:house"
                        className="mr-2"
                        width={16}
                        height={16}
                      />
                      All Products
                    </button>
                  </li>

                  {currentCategory && (
                    <li>
                      <div className="flex items-center">
                        <Icon
                          icon="ph:caret-right"
                          className="mx-1"
                          width={16}
                          height={16}
                        />
                        <button
                          onClick={() =>
                            handleCategoryChange(currentCategory.id)
                          }
                          className={`ml-1 text-sm font-medium ${
                            !currentSubcategory
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                          }`}>
                          {currentCategory.name}
                        </button>
                      </div>
                    </li>
                  )}

                  {currentSubcategory && (
                    <li>
                      <div className="flex items-center">
                        <Icon
                          icon="ph:caret-right"
                          className="mx-1"
                          width={16}
                          height={16}
                        />
                        <span className="ml-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {currentSubcategory.name}
                        </span>
                      </div>
                    </li>
                  )}
                </ol>
              </nav>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentSubcategory
                  ? currentSubcategory.name
                  : currentCategory
                  ? currentCategory.name
                  : 'All Products'}
              </h2>

              {(currentCategory || currentSubcategory) && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentSubcategory?.description ||
                    currentCategory?.description}
                </p>
              )}

              {/* Subcategory chips/filters - only show these if a main category is selected and no subcategory */}
              {selectedCategory !== 'all' &&
                !selectedSubcategory &&
                subcategories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-xs"
                        onClick={() => handleSubcategoryChange(subcategory.id)}>
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
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
