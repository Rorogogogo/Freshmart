'use client'
import React from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'react-hot-toast'

interface GroceryItemProps {
  id: string
  name: string
  price: number
  categoryName: string
  imageUrl: string
  rating: number
  stockQuantity: number
  onClickDetails: (id: string) => void
}

const GroceryItem: React.FC<GroceryItemProps> = ({
  id,
  name,
  price,
  categoryName,
  imageUrl,
  rating,
  stockQuantity,
  onClickDetails,
}) => {
  const { addToCart, items } = useCart()

  // Check if item is already in cart
  const itemInCart = items.find((item) => item.id === id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent onClick (opening product details)

    if (stockQuantity <= 0) {
      toast.error('This product is out of stock')
      return
    }

    // Check if adding more would exceed stock
    if (itemInCart && itemInCart.quantity >= stockQuantity) {
      toast.error(`Maximum available quantity is ${stockQuantity}`)
      return
    }

    addToCart({
      id,
      name,
      price,
      categoryName,
      imageUrl,
      rating,
      stockQuantity,
      reviewCount: 0,
      description: '',
      categoryId: '',
      isDeleted: false,
      createdAt: '',
      updatedAt: null,
    })

    // Show different message if item is already in cart
    if (itemInCart) {
      toast.success(`Added another ${name} to cart`)
    } else {
      toast.success(`${name} added to cart`)
    }
  }

  return (
    <div
      className="bg-white dark:bg-darkmode rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={() => onClickDetails(id)}>
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={`object-cover ${
            stockQuantity <= 0 ? 'opacity-70 grayscale' : ''
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div
          className={`absolute top-2 right-2 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
            stockQuantity > 0
              ? stockQuantity < 5
                ? 'bg-orange-500'
                : 'bg-green-500'
              : 'bg-red-500'
          }`}>
          <Icon
            icon={
              stockQuantity > 0 ? 'ph:check-circle-fill' : 'ph:x-circle-fill'
            }
            width={14}
            height={14}
          />
          {stockQuantity > 0
            ? stockQuantity < 5
              ? `Only ${stockQuantity} left`
              : `${stockQuantity} in stock`
            : 'Out of Stock'}
        </div>
        <div className="absolute top-2 left-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
          {categoryName}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {name}
        </h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon={
                  i < Math.floor(rating)
                    ? 'ph:star-fill'
                    : i < rating
                    ? 'ph:star-half-fill'
                    : 'ph:star'
                }
                className="text-yellow-400"
                width={16}
                height={16}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {rating.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            ${price.toFixed(2)}
          </p>
          <button
            className={`px-3 py-1 rounded text-sm ${
              stockQuantity > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleAddToCart}
            disabled={stockQuantity <= 0}
            aria-label={stockQuantity > 0 ? 'Add to cart' : 'Out of stock'}>
            {itemInCart ? 'Add Again' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GroceryItem
