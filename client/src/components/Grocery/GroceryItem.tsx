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
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent onClick (opening product details)

    if (stockQuantity <= 0) {
      toast.error('This product is out of stock')
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

    toast.success(`${name} added to cart`)
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
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          {stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
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
            disabled={stockQuantity <= 0}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default GroceryItem
