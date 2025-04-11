'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useCart, CartItem } from '@/contexts/CartContext'
import { toast } from 'react-hot-toast'

const CartSidebar: React.FC = () => {
  const {
    items,
    isOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart()

  const [isHovering, setIsHovering] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  // Handle hover state for the cart
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false)
    }, 300) // Small delay to prevent flickering
  }

  // Handle click outside to close cart
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        isHovering
      ) {
        setIsHovering(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isHovering])

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Floating Cart Button */}
      <div
        className="fixed top-24 right-0 z-40 flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={cartRef}>
        {/* Cart Button */}
        <div className="bg-indigo-600 p-3 text-white rounded-l-lg shadow-lg cursor-pointer flex items-center justify-center">
          <div className="relative">
            <Icon icon="ph:shopping-cart" width={24} height={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        </div>

        {/* Cart Panel */}
        <div
          className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            isHovering ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Shopping Cart ({totalItems}{' '}
                {totalItems === 1 ? 'item' : 'items'})
              </h2>
              <button
                onClick={() => setIsHovering(false)}
                className="text-gray-500 hover:text-gray-700">
                <Icon icon="ph:x" width={24} height={24} />
              </button>
            </div>

            {/* Cart content */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-10">
                  <Icon
                    icon="ph:shopping-cart"
                    className="mx-auto text-gray-400"
                    width={48}
                    height={48}
                  />
                  <h3 className="mt-2 text-gray-500">Your cart is empty</h3>
                  <button
                    onClick={() => setIsHovering(false)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer with totals and checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                <div className="flex justify-between font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsHovering(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                    Continue Shopping
                  </button>
                  <Link
                    href="/checkout"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-center">
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

interface CartItemRowProps {
  item: CartItem
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onUpdateQuantity(item.id, 0) // This will trigger removal
      return
    }

    // Check if new quantity would exceed stock
    if (newQuantity > item.stockQuantity) {
      toast.error(`Maximum available quantity is ${item.stockQuantity}`)
      // Set to max available instead
      onUpdateQuantity(item.id, item.stockQuantity)
      return
    }

    onUpdateQuantity(item.id, newQuantity)
  }

  return (
    <li className="py-4 flex">
      <div className="flex-shrink-0 w-20 h-20 relative rounded overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="ml-4 flex-1 flex flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
            <p className="mt-1 text-sm text-gray-500">
              ${item.price.toFixed(2)} each
            </p>
            <p className="text-xs text-gray-400">
              In stock: {item.stockQuantity}
            </p>
          </div>
          <p className="text-sm font-medium text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
        <div className="flex-1 flex items-end justify-between">
          <div className="flex items-center border rounded">
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1 text-gray-500 hover:text-gray-700">
              <Icon icon="ph:minus" width={16} height={16} />
            </button>
            <span className="px-2 text-gray-900">{item.quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 text-gray-500 hover:text-gray-700">
              <Icon icon="ph:plus" width={16} height={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}

export default CartSidebar
