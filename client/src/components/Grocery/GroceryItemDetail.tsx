'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react/dist/iconify.js'
import { productsApi, RateProductRequest } from '@/api/productsApi'
import { toast } from 'react-hot-toast'
import { useCart } from '@/contexts/CartContext'

interface Nutrition {
  calories: number
  protein: string
  carbs: string
  fat: string
}

interface GroceryItemDetailProps {
  id: string
  name: string
  price: number
  categoryName: string
  imageUrl: string
  description: string
  stockQuantity: number
  rating: number
  reviewCount: number
  nutrition: Nutrition | null
  isOpen: boolean
  onClose: () => void
}

const GroceryItemDetail: React.FC<GroceryItemDetailProps> = ({
  id,
  name,
  price,
  categoryName,
  imageUrl,
  description,
  stockQuantity,
  rating,
  reviewCount,
  nutrition,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  const [quantity, setQuantity] = useState(1)
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
  const [displayedRating, setDisplayedRating] = useState(rating)
  const [displayedReviews, setDisplayedReviews] = useState(reviewCount)

  const { addToCart } = useCart()

  const handleIncrement = () => {
    if (quantity < stockQuantity) setQuantity(quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const handleAddToCart = () => {
    if (stockQuantity <= 0) {
      toast.error('This product is out of stock')
      return
    }

    // Check if adding this quantity would exceed stock
    if (quantity > stockQuantity) {
      toast.error(
        `Only ${stockQuantity} items available in stock. Adjusted quantity.`
      )
      // Update the local quantity display
      setQuantity(stockQuantity)
    }

    addToCart(
      {
        id,
        name,
        price,
        categoryName,
        imageUrl,
        rating: displayedRating,
        stockQuantity,
        reviewCount: displayedReviews,
        description,
        categoryId: '',
        isDeleted: false,
        createdAt: '',
        updatedAt: null,
      },
      quantity
    )

    const actualQtyAdded = Math.min(quantity, stockQuantity)
    toast.success(
      `${actualQtyAdded} ${
        actualQtyAdded === 1 ? 'item' : 'items'
      } of ${name} added to cart`
    )
    onClose()
  }

  const handleRatingHover = (hoveredValue: number) => {
    setHoveredRating(hoveredValue)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  const handleRatingClick = async (selectedRating: number) => {
    setUserRating(selectedRating)

    try {
      setIsSubmittingRating(true)

      const rateData: RateProductRequest = {
        rating: selectedRating,
      }

      const response = await productsApi.rateProduct(id, rateData)

      if (response.success) {
        // Update the displayed rating and review count with data from response or fallback to current values
        setDisplayedRating(response.data.rating || displayedRating)
        // Use reviewCount if available, otherwise increment the current count
        setDisplayedReviews(displayedReviews + 1)
        toast.success('Thank you for your rating!')
      } else {
        toast.error('Failed to submit rating. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred while submitting your rating.')
      console.error('Rating error:', error)
    } finally {
      setIsSubmittingRating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="relative max-w-4xl w-full mx-4 bg-white dark:bg-darkmode rounded-lg shadow-lg overflow-hidden">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
          onClick={onClose}>
          <Icon icon="ph:x" width={24} height={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4 bg-indigo-500 text-white px-2 py-1 rounded-full text-sm">
              {categoryName}
            </div>
          </div>

          <div className="md:w-1/2 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {name}
            </h2>

            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    icon={
                      i < Math.floor(displayedRating)
                        ? 'ph:star-fill'
                        : i < displayedRating
                        ? 'ph:star-half-fill'
                        : 'ph:star'
                    }
                    className="text-yellow-400"
                    width={20}
                    height={20}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {displayedRating.toFixed(1)} ({displayedReviews} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              ${price.toFixed(2)}
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {description}
            </p>

            {/* Rating Component */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Rate This Product
              </h3>
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={isSubmittingRating}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={handleRatingLeave}
                    onClick={() => handleRatingClick(star)}
                    className="mr-1 text-2xl transition-colors duration-200">
                    <Icon
                      icon={
                        (
                          hoveredRating > 0
                            ? star <= hoveredRating
                            : star <= userRating
                        )
                          ? 'ph:star-fill'
                          : 'ph:star'
                      }
                      className={
                        (
                          hoveredRating > 0
                            ? star <= hoveredRating
                            : star <= userRating
                        )
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }
                      width={28}
                      height={28}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isSubmittingRating
                  ? 'Submitting your rating...'
                  : userRating > 0
                  ? 'Thank you for your rating!'
                  : 'Click to rate this product'}
              </p>
            </div>

            {nutrition && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nutrition Facts
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      Calories
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {nutrition.calories}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      Protein
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {nutrition.protein}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      Carbs
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {nutrition.carbs}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      Fat
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {nutrition.fat}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="flex items-center mb-2">
                <Icon
                  icon={
                    stockQuantity > 0
                      ? 'ph:check-circle-fill'
                      : 'ph:x-circle-fill'
                  }
                  className={
                    stockQuantity > 0 ? 'text-green-500' : 'text-red-500'
                  }
                  width={20}
                  height={20}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {stockQuantity > 0
                    ? `In Stock (${stockQuantity} available)`
                    : 'Out of Stock'}
                </span>
              </p>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}>
                  <Icon icon="ph:minus" width={16} height={16} />
                </button>
                <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                  {quantity}
                </span>
                <button
                  className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
                  onClick={handleIncrement}
                  disabled={quantity >= stockQuantity}>
                  <Icon icon="ph:plus" width={16} height={16} />
                </button>
              </div>
            </div>

            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={stockQuantity <= 0}>
              {stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroceryItemDetail
