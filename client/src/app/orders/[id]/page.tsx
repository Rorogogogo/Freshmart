'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-hot-toast'
import { useUser } from '@/contexts/UserContext'
import { getOrderById, sendOrderConfirmation } from '@/api/ordersApi'
import { Order } from '@/types/order'

const OrderDetail: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewOrder = searchParams?.get('new') === 'true'
  const { isAuthenticated } = useUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [resendingEmail, setResendingEmail] = useState(false)

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast.error('Please sign in to view order details')
      router.push('/signin?redirect=orders')
      return
    }

    // Redirect if params.id is missing
    if (!params || !params.id) {
      toast.error('Invalid order ID')
      router.push('/orders')
      return
    }

    // Redirect to thank-you page if this is a new order
    if (searchParams?.get('new') === 'true') {
      router.push(`/thank-you?order=${params.id}`)
      return
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const orderId = params.id.toString()
        const response = await getOrderById(orderId)

        if (response.success) {
          setOrder(response.data)

          // Also redirect to thank-you page with order number if it's a new order
          if (searchParams?.get('new') === 'true') {
            router.push(
              `/thank-you?order=${response.data.id}&number=${response.data.orderNumber}`
            )
            return
          }
        } else {
          toast.error(response.message || 'Failed to load order details')
        }
      } catch (error: any) {
        toast.error(error.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [isAuthenticated, params, router, searchParams])

  const handleResendEmail = async () => {
    if (!order || resendingEmail) return

    setResendingEmail(true)

    try {
      const response = await sendOrderConfirmation(order.id)

      if (response.success) {
        toast.success('Order confirmation email sent')
      } else {
        toast.error(response.message || 'Failed to send confirmation email')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setResendingEmail(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 md:pt-40 pb-16 md:pb-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center">
            <Icon
              icon="ph:spinner"
              className="animate-spin text-indigo-600"
              width={32}
              height={32}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Loading order details...
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 md:pt-40 pb-16 md:pb-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-darkmode rounded-lg shadow-md p-8 text-center">
            <Icon
              icon="ph:shopping-bag-open"
              className="mx-auto text-gray-400"
              width={48}
              height={48}
            />
            <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
              Order Not Found
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <button
              onClick={() => router.push('/orders')}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 md:pt-40 pb-16 md:pb-28">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Order Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Placed on {formatDate(order.orderDate)}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'Completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : order.status === 'Processing'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  : order.status === 'Cancelled'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
              {order.status}
            </span>

            <button
              onClick={() => router.push('/orders')}
              className="ml-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              Back to Orders
            </button>
          </div>
        </div>

        {/* Order Invoice Card */}
        <div className="bg-white dark:bg-darkmode rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Invoice
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Order confirmation sent to {order.email}
              </p>
            </div>

            <button
              onClick={handleResendEmail}
              disabled={resendingEmail}
              className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">
              {resendingEmail ? (
                <>
                  <Icon icon="ph:spinner" className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Icon icon="ph:envelope" className="mr-2" />
                  Resend Email
                </>
              )}
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Shipping Information
                </h3>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>{order.shippingAddress}</p>
                  <p>
                    {order.city}, {order.state} {order.zipCode}
                  </p>
                  <p>{order.country}</p>
                  <p className="mt-2">Phone: {order.phoneNumber}</p>
                  <p>Email: {order.email}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Order Summary
                </h3>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                  <span>Subtotal:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-darkmode rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Order Items
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}{' '}
              in your order
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-6 flex flex-col md:flex-row md:items-center">
                <div className="flex items-center flex-grow">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-16 w-16 flex items-center justify-center overflow-hidden">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="h-14 w-14 object-cover"
                      />
                    ) : (
                      <Icon
                        icon="ph:package"
                        className="text-gray-400"
                        width={24}
                        height={24}
                      />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.productName}
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>Quantity: {item.quantity}</span>
                      <span className="md:ml-3 md:pl-3 md:border-l md:border-gray-300 dark:md:border-gray-700">
                        Price: ${item.unitPrice.toFixed(2)}
                        {item.quantity > 1 && (
                          <span className="text-xs ml-2">
                            (${item.unitPrice.toFixed(2)} each)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4 text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Subtotal:
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Shipping:
              </span>
              <span className="text-gray-800 dark:text-gray-200">Free</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-white font-bold">
                Total:
              </span>
              <span className="text-xl text-gray-900 dark:text-white font-bold">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white dark:bg-darkmode rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            What's Next?
          </h2>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Icon
                  icon="ph:check-circle"
                  className="text-green-500 mt-1"
                  width={20}
                  height={20}
                />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Order Received
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your order has been received and is being processed.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <Icon
                  icon={
                    order.status === 'Processing' ||
                    order.status === 'Completed'
                      ? 'ph:check-circle'
                      : 'ph:circle'
                  }
                  className={
                    order.status === 'Processing' ||
                    order.status === 'Completed'
                      ? 'text-green-500 mt-1'
                      : 'text-gray-400 mt-1'
                  }
                  width={20}
                  height={20}
                />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Processing Order
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your order is being prepared for shipping.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <Icon
                  icon={
                    order.status === 'Completed'
                      ? 'ph:check-circle'
                      : 'ph:circle'
                  }
                  className={
                    order.status === 'Completed'
                      ? 'text-green-500 mt-1'
                      : 'text-gray-400 mt-1'
                  }
                  width={20}
                  height={20}
                />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Order Completed
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your order has been delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
