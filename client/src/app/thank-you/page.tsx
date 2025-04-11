'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { motion } from 'framer-motion'
import { useUser } from '@/contexts/UserContext'
import { toast } from 'react-hot-toast'

interface LastOrder {
  id: string
  orderNumber: string
  timestamp: string
}

const ThankYouPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, user, isLoading } = useUser()
  const { width, height } = useWindowSize()

  const [confettiActive, setConfettiActive] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Get order ID and number from URL params or localStorage
  const [orderId, setOrderId] = useState<string | null>(
    searchParams?.get('order')
  )
  const [orderNumber, setOrderNumber] = useState<string | null>(
    searchParams?.get('number')
  )

  // Attempt to get order details from localStorage if not in URL
  useEffect(() => {
    if ((!orderId || !orderNumber) && typeof window !== 'undefined') {
      try {
        const lastOrderJson = localStorage.getItem('lastOrder')
        if (lastOrderJson) {
          const lastOrder: LastOrder = JSON.parse(lastOrderJson)

          // Only use localStorage data if it's from the last hour
          const orderTime = new Date(lastOrder.timestamp).getTime()
          const oneHourAgo = Date.now() - 60 * 60 * 1000

          if (orderTime > oneHourAgo) {
            console.log('Using order details from localStorage:', lastOrder)
            if (!orderId) setOrderId(lastOrder.id)
            if (!orderNumber) setOrderNumber(lastOrder.orderNumber)
          } else {
            // Clear old order data
            localStorage.removeItem('lastOrder')
          }
        }
      } catch (err) {
        console.error('Failed to parse lastOrder from localStorage:', err)
      }
    }
  }, [orderId, orderNumber])

  useEffect(() => {
    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setConfettiActive(false)
    }, 5000)

    // Add loading animation
    setIsLoaded(true)

    // Protect the page - but only check after user data is loaded
    if (!isLoading && !isAuthenticated) {
      toast.error('Please sign in to access this page')
      router.push('/signin')
    }

    // Log the order details for debugging
    console.log('Thank you page loaded with order:', { orderId, orderNumber })

    // Cleanup
    return () => {
      clearTimeout(confettiTimer)
    }
  }, [isAuthenticated, router, isLoading, orderId, orderNumber])

  // Don't render content while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-16 flex justify-center items-center">
        <div className="text-center">
          <Icon
            icon="ph:spinner"
            className="animate-spin mx-auto text-indigo-600"
            width={32}
            height={32}
          />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If we don't have order details after checking everywhere, show a message
  if (!orderId && !orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-16 flex justify-center items-center">
        <div className="text-center max-w-md px-4">
          <Icon
            icon="ph:shopping-bag"
            className="mx-auto text-indigo-600"
            width={48}
            height={48}
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Thank You For Shopping With Us!
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            We couldn't retrieve your order details, but your order has been
            processed successfully.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/grocery"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md inline-flex items-center transition-colors">
              <Icon icon="ph:shopping-bag" className="mr-2" />
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md inline-flex items-center transition-colors">
              <Icon icon="ph:package" className="mr-2" />
              View Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const features = [
    {
      icon: 'ph:truck-light',
      title: 'Fast Delivery',
      description:
        'Your order is on its way to you. We deliver with trusted partners for a smooth experience.',
    },
    {
      icon: 'ph:credit-card-light',
      title: 'Secure Payment',
      description:
        'All payments are processed securely. Your financial information is never stored.',
    },
    {
      icon: 'ph:headset-light',
      title: '24/7 Support',
      description:
        'Questions about your order? Our support team is always ready to help.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-16">
      {confettiActive && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          colors={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
        />
      )}

      <motion.div
        className="max-w-4xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}>
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          variants={itemVariants}>
          {/* Success Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-8 px-8 text-center">
            <div className="bg-white dark:bg-gray-800 h-24 w-24 rounded-full mx-auto flex items-center justify-center mb-4">
              <Icon
                icon="ph:check-fat"
                className="text-green-500"
                width={64}
                height={64}
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-indigo-100 text-lg">
              Your order {orderNumber ? `#${orderNumber}` : ''} has been
              successfully placed.
            </p>
          </div>

          {/* Order Success Message */}
          <div className="p-8">
            <motion.div className="text-center mb-10" variants={itemVariants}>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                We've sent a confirmation email with all the details of your
                purchase. You can also view your order anytime in your account.
              </p>

              {orderId && (
                <Link
                  href={`/orders/${orderId}`}
                  className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300">
                  <span>View Order Details</span>
                  <Icon icon="ph:arrow-right" className="ml-2" />
                </Link>
              )}
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8"
              variants={itemVariants}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-shadow duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
                    <Icon icon={feature.icon} width={24} height={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Next Steps */}
            <motion.div className="mt-12 text-center" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                What's Next?
              </h2>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/grocery"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md inline-flex items-center transition-colors">
                  <Icon icon="ph:shopping-bag" className="mr-2" />
                  Continue Shopping
                </Link>

                <Link
                  href="/orders"
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md inline-flex items-center transition-colors">
                  <Icon icon="ph:package" className="mr-2" />
                  View All Orders
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Customer Support */}
        <motion.div
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          variants={itemVariants}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                <Icon
                  icon="ph:headset"
                  className="text-green-600 dark:text-green-400"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Need Help?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our customer service team is here for you
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ThankYouPage
