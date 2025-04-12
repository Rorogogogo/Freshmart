'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { HeaderItem } from '@/types/menu'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'
import { categoriesApi } from '@/api/categoriesApi'
import { processCategoriesForMenu } from '../Navigation/menuData'

type MobileHeaderLinkProps = {
  item: HeaderItem
}

const MobileHeaderLink: React.FC<MobileHeaderLinkProps> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [dynamicSubmenu, setDynamicSubmenu] = useState<HeaderItem[]>(
    item.submenu || []
  )
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const path = usePathname() || ''

  const handleToggleSubmenu = async (e: React.MouseEvent) => {
    e.preventDefault()

    // For Grocery items with empty submenu, load categories on first expand
    if (
      item.label === 'Grocery' &&
      dynamicSubmenu.length === 0 &&
      !isLoadingCategories &&
      !submenuOpen
    ) {
      setIsLoadingCategories(true)
      try {
        console.log('Fetching mobile categories on expand...')
        const response = await categoriesApi.getCategories({
          includeSubcategories: true,
          includeDeleted: false,
        })

        if (response.success && response.data.length > 0) {
          const categoryMenuItems = processCategoriesForMenu(response.data)
          console.log('Mobile categories loaded:', categoryMenuItems.length)
          setDynamicSubmenu(categoryMenuItems)
        } else {
          console.warn('No mobile categories found')
        }
      } catch (error) {
        console.error('Error loading mobile categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    setSubmenuOpen(!submenuOpen)
  }

  const hasSubmenu =
    (item.submenu && item.submenu.length > 0) || item.label === 'Grocery'
  const isActive = path === item.href

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href={hasSubmenu ? '#' : item.href}
          onClick={hasSubmenu ? handleToggleSubmenu : undefined}
          className={`block py-2 px-3 rounded-md text-base font-medium ${
            isActive
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}>
          {item.label}
        </Link>
        {hasSubmenu && (
          <button
            onClick={handleToggleSubmenu}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Icon
              icon={submenuOpen ? 'ph:caret-up' : 'ph:caret-down'}
              className={isLoadingCategories ? 'animate-pulse' : ''}
              width={16}
              height={16}
            />
          </button>
        )}
      </div>

      {/* Submenu */}
      {hasSubmenu && submenuOpen && (
        <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700">
          {/* Loading indicator */}
          {isLoadingCategories && (
            <div className="flex items-center py-2 px-3 text-sm text-gray-500">
              <Icon
                icon="ph:spinner"
                className="animate-spin mr-2"
                width={14}
                height={14}
              />
              Loading...
            </div>
          )}

          {/* Show dynamic submenu if available, otherwise fall back to static */}
          {dynamicSubmenu.length > 0
            ? dynamicSubmenu.map((subItem, index) => (
                <MobileSubMenuItem key={index} item={subItem} />
              ))
            : item.submenu?.map((subItem, index) => (
                <MobileSubMenuItem key={index} item={subItem} />
              ))}
        </div>
      )}
    </div>
  )
}

const MobileSubMenuItem: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [nestedSubmenuOpen, setNestedSubmenuOpen] = useState(false)
  const path = usePathname() || ''
  const hasSubmenu = item.submenu && item.submenu.length > 0
  const isActive = path === item.href

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href={hasSubmenu ? '#' : item.href}
          onClick={
            hasSubmenu
              ? () => setNestedSubmenuOpen(!nestedSubmenuOpen)
              : undefined
          }
          className={`block py-2 px-3 text-sm ${
            isActive
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}>
          {item.label}
        </Link>
        {hasSubmenu && (
          <button
            onClick={() => setNestedSubmenuOpen(!nestedSubmenuOpen)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Icon
              icon={nestedSubmenuOpen ? 'ph:caret-up' : 'ph:caret-down'}
              width={14}
              height={14}
            />
          </button>
        )}
      </div>

      {/* Nested Submenu */}
      {hasSubmenu && nestedSubmenuOpen && (
        <div className="pl-4 mt-1 mb-2 space-y-1 border-l-2 border-gray-100 dark:border-gray-800">
          {item.submenu?.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className={`block py-2 px-3 text-sm ${
                path === subItem.href
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}>
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MobileHeaderLink
