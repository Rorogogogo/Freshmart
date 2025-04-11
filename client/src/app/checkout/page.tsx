'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useUser } from '@/contexts/UserContext'
import { useCart } from '@/contexts/CartContext'
import { createOrder } from '@/api/ordersApi'
import { CreateOrderRequest, ShippingAddress } from '@/types/order'

const CheckoutPage: React.FC = () => {
  const router = useRouter()
  const { isAuthenticated, user } = useUser()
  const { items, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
    email: user?.email || '',
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to proceed with checkout')
      router.push('/signin?redirect=checkout')
    }
  }, [isAuthenticated, router])

  // Redirect if cart is empty
  useEffect(() => {
    // Only redirect if we're not in the checkout submission process
    // and the cart is empty
    if (items.length === 0 && !isSubmitting) {
      toast.error('Your cart is empty')
      router.push('/grocery')
    }
  }, [items, router, isSubmitting])

  // Update email from user data
  useEffect(() => {
    if (user?.email) {
      setShippingAddress((prev) => ({
        ...prev,
        email: user.email,
      }))
    }
  }, [user])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error('You must be signed in to place an order')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsSubmitting(true)

    try {
      // First, check product availability before submitting the order
      const outOfStockItems = []
      const insufficientStockItems = []

      // Simulate a check for product availability - in a real app, this would be an API call
      for (const item of items) {
        try {
          // Example API call to check stock availability
          const response = await fetch(
            `/api/products/${item.id}/check-stock?quantity=${item.quantity}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          )

          if (!response.ok) {
            const data = await response.json()

            if (data.stockQuantity === 0) {
              outOfStockItems.push(item.name)
            } else if (data.stockQuantity < item.quantity) {
              insufficientStockItems.push({
                name: item.name,
                requested: item.quantity,
                available: data.stockQuantity,
              })
            }
          }
        } catch (error) {
          // Continue checking other items even if one fails
          console.error(`Failed to check stock for ${item.name}:`, error)
        }
      }

      // If any items are out of stock or have insufficient quantity, notify the user
      if (outOfStockItems.length > 0 || insufficientStockItems.length > 0) {
        let message = ''

        if (outOfStockItems.length > 0) {
          message += `The following items are no longer in stock: ${outOfStockItems.join(
            ', '
          )}. `
        }

        if (insufficientStockItems.length > 0) {
          message += `The following items have insufficient stock: ${insufficientStockItems
            .map(
              (item) =>
                `${item.name} (requested: ${item.requested}, available: ${item.available})`
            )
            .join(', ')}.`
        }

        toast.error(message)
        setIsSubmitting(false)
        return
      }

      // Format order data
      const orderData: CreateOrderRequest = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phoneNumber: shippingAddress.phoneNumber,
        email: shippingAddress.email,
      }

      // Place order
      const response = await createOrder(orderData)

      if (response.success) {
        // Show success first
        toast.success('Order placed successfully!')

        // Create the thank you URL
        const thankYouUrl = `/thank-you?order=${response.data.id}&number=${response.data.orderNumber}`
        console.log('Redirecting to:', thankYouUrl)

        // Save order details to localStorage as a backup
        try {
          localStorage.setItem(
            'lastOrder',
            JSON.stringify({
              id: response.data.id,
              orderNumber: response.data.orderNumber,
              timestamp: new Date().toISOString(),
            })
          )
        } catch (err) {
          console.error('Failed to save order to localStorage:', err)
        }

        // First start navigation to thank you page
        // This prevents the empty cart useEffect from redirecting
        router.push(thankYouUrl)

        // Set a very small timeout to ensure navigation starts before clearing cart
        // This allows React to process the navigation before the cart is cleared
        setTimeout(() => {
          // Clear cart only after navigation has been initiated
          clearCart()
        }, 100)
      } else {
        // If the error is due to stock issues, display a specific message
        if (response.message && response.message.includes('stock')) {
          toast.error(
            'Some items in your order are no longer available. Please review your cart.'
          )
          router.push('/cart') // Redirect to cart page to review
        } else {
          toast.error(response.message || 'Failed to place order')
        }
      }
    } catch (error: any) {
      // Check if error is related to stock availability
      if (error.message && error.message.includes('stock')) {
        toast.error(
          'Some items in your order are no longer available. Please review your cart.'
        )
        router.push('/cart') // Redirect to cart page to review
      } else {
        toast.error(error.message || 'An error occurred during checkout')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add validation checks for the form
  const validateForm = () => {
    // Basic validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingAddress.email)) {
      return false
    }

    // Basic validation for phone format (simple version)
    const phoneRegex = /^\+?[0-9]{8,15}$/
    if (!phoneRegex.test(shippingAddress.phoneNumber.replace(/\s+/g, ''))) {
      return false
    }

    // Check that all required fields have values
    return Object.values(shippingAddress).every((value) => value.trim() !== '')
  }

  const isFormValid = validateForm()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 md:pt-40 pb-16 md:pb-28">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-darkmode rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Shipping Information
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="col-span-2">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Street Address*
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State/Province*
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ZIP/Postal Code*
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Country*
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={shippingAddress.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email (for order confirmation)*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className={`w-full py-3 rounded-lg font-medium flex justify-center items-center ${
                      isFormValid
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}>
                    {isSubmitting ? (
                      <>
                        <Icon icon="ph:spinner" className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-darkmode rounded-lg shadow-md p-6 sticky top-28">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden relative flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right font-medium text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    Subtotal
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    Shipping
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    Free
                  </p>
                </div>

                <div className="flex justify-between py-2 border-t border-b border-gray-200 dark:border-gray-700">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
