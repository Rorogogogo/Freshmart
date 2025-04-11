'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-hot-toast'
import { useUser } from '@/contexts/UserContext'
import { getUserOrders } from '@/api/ordersApi'
import { Order } from '@/types/order'

const OrdersPage: React.FC = () => {
  const router = useRouter()
  const { isAuthenticated } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast.error('Please sign in to view your orders')
      router.push('/signin?redirect=orders')
      return
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders(currentPage)

        if (response.success) {
          setOrders(response.data)
          setTotalPages(response.totalPages)
        } else {
          toast.error(response.message || 'Failed to load orders')
        }
      } catch (error: any) {
        toast.error(error.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, currentPage, router])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 md:pt-40 pb-16 md:pb-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center">
            <Icon
              icon="ph:spinner"
              className="animate-spin text-indigo-600"
              width={32}
              height={32}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Loading your orders...
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 md:pt-40 pb-16 md:pb-28">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-darkmode rounded-lg shadow-md p-8 text-center">
            <Icon
              icon="ph:shopping-bag"
              className="mx-auto text-gray-400"
              width={48}
              height={48}
            />
            <h2 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">
              No Orders Yet
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              You haven't placed any orders yet.
            </p>
            <Link
              href="/grocery"
              className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-darkmode rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Order #{order.orderNumber}
                      </h2>
                      <span
                        className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
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
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Placed on {formatDate(order.orderDate)}
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center">
                    <span className="text-lg font-medium text-gray-900 dark:text-white mr-6">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm">
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div key={item.id} className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden relative flex-shrink-0">
                          <img
                            src={item.productImageUrl}
                            alt={item.productName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                            {item.productName}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 4 && (
                      <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          +{order.items.length - 4} more items
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav>
                  <ul className="flex space-x-2">
                    <li>
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50">
                        <Icon icon="ph:caret-left" />
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i}>
                        <button
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-1 rounded ${
                            currentPage === i + 1
                              ? 'bg-indigo-600 text-white'
                              : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    <li>
                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50">
                        <Icon icon="ph:caret-right" />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
