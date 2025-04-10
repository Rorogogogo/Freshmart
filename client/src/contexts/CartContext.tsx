'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ProductDto } from '@/types/product'

export interface CartItem extends ProductDto {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  toggleCart: () => void
  addToCart: (product: ProductDto, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [subtotal, setSubtotal] = useState(0)

  // Load cart from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e)
        }
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items))
    }

    // Calculate total items and subtotal
    const total = items.reduce((sum, item) => sum + item.quantity, 0)
    setTotalItems(total)

    const price = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    setSubtotal(price)
  }, [items])

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  const addToCart = (product: ProductDto, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Calculate new quantity and ensure it doesn't exceed stock
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          product.stockQuantity
        )

        // If already at max stock, don't change anything
        if (newQuantity === existingItem.quantity) {
          return prevItems
        }

        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        )
      } else {
        // For new items, ensure quantity doesn't exceed stock
        const safeQuantity = Math.min(quantity, product.stockQuantity)
        return [...prevItems, { ...product, quantity: safeQuantity }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => {
      const item = prevItems.find((item) => item.id === productId)
      if (!item) return prevItems

      // Ensure the new quantity doesn't exceed stock
      const safeQuantity = Math.min(quantity, item.stockQuantity)

      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: safeQuantity } : item
      )
    })
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
