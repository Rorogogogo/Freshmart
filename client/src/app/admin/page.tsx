'use client'

import React from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'
import AdminLayout from '@/components/Admin/AdminLayout'

export default function AdminHomePage() {
  const cards = [
    {
      title: 'Products',
      description: 'Manage your products inventory, prices, and details',
      icon: 'ph:package',
      link: '/admin/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Categories',
      description: 'Manage product categories and hierarchical structure',
      icon: 'ph:folders',
      link: '/admin/categories',
      color: 'bg-green-500',
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      icon: 'ph:shopping-cart',
      link: '/admin/orders',
      color: 'bg-yellow-500',
    },
    {
      title: 'Users',
      description: 'Manage user accounts and permissions',
      icon: 'ph:users',
      link: '/admin/users',
      color: 'bg-purple-500',
    },
  ]

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Link key={index} href={card.link}>
              <div className="bg-white dark:bg-darkmode rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer h-full flex flex-col">
                <div
                  className={`${card.color} text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                  <Icon icon={card.icon} width={24} height={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">
                  {card.description}
                </p>
                <div className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center">
                  Manage
                  <Icon icon="ph:arrow-right" className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white dark:bg-darkmode rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">New Features Guide</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                <Icon icon="ph:folders" className="inline-block mr-2" />
                Hierarchical Categories
              </h3>
              <p className="mb-2">
                The new category system supports a two-level hierarchy with
                parent categories and subcategories.
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600 dark:text-gray-300">
                <li>
                  Parent categories appear as top-level menu items in the
                  navigation
                </li>
                <li>
                  Subcategories appear in dropdown menus under their parent
                  categories
                </li>
                <li>
                  In the admin panel, you can expand parent categories to see
                  their subcategories
                </li>
                <li>
                  When creating a new category, you can optionally select a
                  parent category
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                <Icon icon="ph:cloud-arrow-up" className="inline-block mr-2" />
                Cloudinary Image Uploads
              </h3>
              <p className="mb-2">
                All image uploads now use Cloudinary for reliable image hosting
                and optimization.
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600 dark:text-gray-300">
                <li>Images can be uploaded directly from your device</li>
                <li>Drag and drop functionality is supported</li>
                <li>Uploads are automatically optimized for web delivery</li>
                <li>Both products and categories can have images</li>
                <li>Maximum file size is 5MB</li>
                <li>Supported formats: JPEG, PNG, GIF, WebP</li>
              </ul>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-md">
              <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                <Icon icon="ph:info" className="inline-block mr-2" />
                Best Practices
              </h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  Create parent categories for broad product groups (e.g.,
                  "Fruits", "Vegetables")
                </li>
                <li>
                  Use subcategories for more specific groups (e.g., "Citrus
                  Fruits", "Leafy Greens")
                </li>
                <li>
                  Upload high-quality, square ratio images for consistent
                  display
                </li>
                <li>Keep category names short and descriptive</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
