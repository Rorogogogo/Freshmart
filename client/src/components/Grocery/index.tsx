'use client'
import React, { useState, useEffect } from 'react'
import GroceryItem from './GroceryItem'
import GroceryItemDetail from './GroceryItemDetail'
import { groceryItems, categories } from '@/app/api/groceryData'
import { Icon } from '@iconify/react/dist/iconify.js'
import SearchBox from '@/components/Common/SearchBox'
import { useSearchParams } from 'next/navigation'

const GroceryStore = () => {
  const searchParams = useSearchParams()
  const initialSearchTerm = searchParams.get('search') || ''

  const [items, setItems] = useState(groceryItems)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter items based on category and search term
  useEffect(() => {
    let filteredItems = groceryItems

    if (selectedCategory !== 'All') {
      filteredItems = filteredItems.filter(
        (item) => item.category === selectedCategory
      )
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim()
      filteredItems = filteredItems.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      )
    }

    setItems(filteredItems)
  }, [selectedCategory, searchTerm])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleItemClick = (id: number) => {
    setSelectedItem(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const selectedItemDetails =
    selectedItem !== null
      ? groceryItems.find((item) => item.id === selectedItem)
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
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid of Items */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <GroceryItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                category={item.category}
                imgSrc={item.imgSrc}
                rating={item.rating}
                stock={item.stock}
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
      </div>

      {/* Item Detail Modal */}
      {selectedItemDetails && (
        <GroceryItemDetail
          {...selectedItemDetails}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  )
}

export default GroceryStore
