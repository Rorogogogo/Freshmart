'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { productsApi, Product } from '@/api/productsApi'
import { categoriesApi, Category } from '@/api/categoriesApi'
import GroceryItem from '@/components/Grocery/GroceryItem'

export default function Home() {
  const router = useRouter()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch featured products
        const productsResponse = await productsApi.getProducts({
          pageSize: 8,
          sortBy: 'rating',
          sortDirection: 'desc',
        })

        // Fetch categories
        const categoriesResponse = await categoriesApi.getCategories({
          page: 1,
          pageSize: 6,
        })

        if (productsResponse.success && categoriesResponse.success) {
          setFeaturedProducts(productsResponse.data)
          setCategories(categoriesResponse.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleProductClick = (id: string) => {
    router.push(`/grocery?product=${id}`)
  }

  const handleSearchSubmit = (term: string) => {
    router.push(`/grocery?search=${encodeURIComponent(term)}`)
  }

  return (
    <main className="pt-16">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-r from-green-500 to-green-600 pt-28 pb-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full bg-white opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Fresh Groceries,{' '}
                <span className="text-yellow-300">Delivered Daily</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0">
                Shop from our wide selection of fresh, organic produce and
                pantry essentials. We deliver the freshest ingredients right to
                your doorstep.
              </p>

              {/* Search Form */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0">
                <input
                  type="text"
                  placeholder="Search for fruits, vegetables, etc."
                  className="flex-1 px-6 py-4 rounded-full text-gray-700 focus:outline-none shadow-md"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement
                      handleSearchSubmit(target.value)
                    }
                  }}
                />
                <button
                  onClick={() => router.push('/grocery')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-4 rounded-full shadow-md transition-colors duration-300">
                  Shop Now
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex justify-center items-center">
              <div className="bg-white/10 rounded-full p-12 w-80 h-80 flex items-center justify-center">
                <Icon
                  icon="ph:shopping-cart-fill"
                  className="text-white"
                  width={200}
                  height={200}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'ph:truck-light',
                title: 'Free Delivery',
                description: 'Free delivery on orders over $50',
              },
              {
                icon: 'ph:check-circle-light',
                title: 'Fresh Guarantee',
                description: 'Fresh produce or your money back',
              },
              {
                icon: 'ph:clock-light',
                title: 'Quick Delivery',
                description: 'Same-day delivery available',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center transition-transform hover:scale-105 duration-300">
                <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    icon={feature.icon}
                    className="text-green-600 dark:text-green-400"
                    width={28}
                    height={28}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse our wide selection of fresh, high-quality products
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm animate-pulse">
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 rounded-lg mb-4"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mx-auto"></div>
                    </div>
                  ))
              : categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/grocery?category=${category.id}`}
                    className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon
                        icon="ph:shopping-bag-light"
                        className="text-green-600 dark:text-green-400"
                        width={32}
                        height={32}
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                  </Link>
                ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/grocery"
              className="inline-flex items-center text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300">
              <span>View All Categories</span>
              <Icon icon="ph:arrow-right" className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our best-selling and highest-rated products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm animate-pulse">
                      <div className="w-full h-48 bg-gray-200 dark:bg-gray-600 rounded-lg mb-4"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                    </div>
                  ))
              : featuredProducts.map((product) => (
                  <GroceryItem
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    categoryName={product.categoryName}
                    imageUrl={product.imageUrl}
                    rating={product.rating || 4.5}
                    stockQuantity={product.stockQuantity}
                    onClickDetails={handleProductClick}
                  />
                ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/grocery"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full inline-flex items-center transition-colors duration-300">
              <span>View All Products</span>
              <Icon icon="ph:arrow-right" className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-10 lg:p-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Get 20% Off on Your First Order
                </h2>
                <p className="text-indigo-100 mb-8 text-lg">
                  Sign up for our newsletter and get an exclusive discount on
                  your first purchase. Fresh, high-quality groceries are just a
                  click away.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-3 rounded-full text-gray-700 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full transition-colors duration-300">
                    Subscribe
                  </button>
                </form>
              </div>
              <div className="hidden lg:flex items-center justify-center p-10">
                <div className="relative">
                  <Icon
                    icon="ph:apple"
                    className="text-white absolute -left-20 top-5 transform rotate-12"
                    width={80}
                    height={80}
                  />
                  <Icon
                    icon="ph:carrot"
                    className="text-yellow-300 absolute -right-24 bottom-5 transform -rotate-12"
                    width={80}
                    height={80}
                  />
                  <Icon
                    icon="ph:bread"
                    className="text-white/70 absolute left-0 bottom-0"
                    width={64}
                    height={64}
                  />
                  <div className="bg-white/20 rounded-full p-8 w-64 h-64 flex items-center justify-center">
                    <Icon
                      icon="ph:basket-fill"
                      className="text-white"
                      width={120}
                      height={120}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Read testimonials from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Regular Customer',
                avatar: '/images/testimonials/avatar-1.jpg',
                quote:
                  'The quality of produce from Freshmart is exceptional. Everything arrives fresh and lasts longer than what I get from supermarkets.',
              },
              {
                name: 'Michael Chen',
                role: 'Weekly Subscriber',
                avatar: '/images/testimonials/avatar-2.jpg',
                quote:
                  'Their subscription service has transformed how I shop for groceries. Fresh food delivered weekly without any hassle!',
              },
              {
                name: 'Jessica Williams',
                role: 'New Customer',
                avatar: '/images/testimonials/avatar-3.jpg',
                quote:
                  'I was skeptical about ordering groceries online, but Freshmart exceeded my expectations. The packaging is eco-friendly, and everything was perfectly fresh.',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mr-4">
                    <Icon
                      icon="ph:user"
                      className="text-gray-400 w-full h-full p-2"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="ph:star-fill"
                      className="text-yellow-400"
                      width={20}
                      height={20}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Promotion */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Download Our Mobile App
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Shop for fresh groceries anytime, anywhere with our easy-to-use
                mobile app. Get exclusive app-only deals and track your delivery
                in real-time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#"
                  className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg inline-flex items-center">
                  <Icon
                    icon="ph:app-store-logo"
                    className="mr-2"
                    width={24}
                    height={24}
                  />
                  <span>App Store</span>
                </Link>
                <Link
                  href="#"
                  className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg inline-flex items-center">
                  <Icon
                    icon="ph:google-play-logo"
                    className="mr-2"
                    width={24}
                    height={24}
                  />
                  <span>Google Play</span>
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-[260px] h-[520px] bg-gray-800 rounded-[36px] border-[10px] border-gray-900 overflow-hidden shadow-xl">
                  <div className="w-full h-full bg-gradient-to-b from-green-500 to-green-700 flex flex-col">
                    <div className="w-1/2 h-6 bg-black mx-auto rounded-b-xl"></div>
                    <div className="p-4 flex-1">
                      <div className="w-full h-8 bg-white/20 rounded-full mb-4"></div>
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="aspect-square bg-white/10 rounded-xl flex items-center justify-center">
                            <Icon
                              icon="ph:shopping-bag"
                              className="text-white"
                              width={32}
                              height={32}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="w-full h-20 bg-white/10 rounded-xl mt-4"></div>
                      <div className="w-full h-12 bg-white/10 rounded-xl mt-4"></div>
                      <div className="w-3/4 h-12 bg-yellow-400 rounded-xl mt-8 mx-auto"></div>
                    </div>
                    <div className="h-16 bg-black/20 flex items-center justify-around px-6">
                      <Icon
                        icon="ph:house"
                        className="text-white"
                        width={24}
                        height={24}
                      />
                      <Icon
                        icon="ph:shopping-cart"
                        className="text-white"
                        width={24}
                        height={24}
                      />
                      <Icon
                        icon="ph:user"
                        className="text-white"
                        width={24}
                        height={24}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tips, recipes, and news about fresh foods and healthy living
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '10 Superfoods to Boost Your Immune System',
                excerpt:
                  "Discover natural foods that can help strengthen your body's defenses.",
                icon: 'ph:heartbeat',
              },
              {
                title: 'How to Store Fresh Produce Longer',
                excerpt:
                  'Simple techniques to make your fruits and vegetables last longer and reduce food waste.',
                icon: 'ph:clock-countdown',
              },
              {
                title: 'Easy 30-Minute Recipes for Busy Weeknights',
                excerpt:
                  'Quick and nutritious meal ideas using fresh ingredients from your Freshmart delivery.',
                icon: 'ph:cooking-pot',
              },
            ].map((post, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Icon
                    icon={post.icon}
                    className="text-green-500 dark:text-green-400"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 inline-flex items-center">
                    <span>Read More</span>
                    <Icon
                      icon="ph:arrow-right"
                      className="ml-2"
                      width={16}
                      height={16}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="#"
              className="text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 inline-flex items-center">
              <span>View All Articles</span>
              <Icon icon="ph:arrow-right" className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
