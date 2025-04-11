'use client'
import { useState } from 'react'
import Link from 'next/link'
import { HeaderItem } from '../../../../types/menu'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'

const MobileHeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const path = usePathname() || ''

  const isActive = path === item.href

  const handleToggle = (e: React.MouseEvent) => {
    if (item.submenu) {
      e.preventDefault()
      setSubmenuOpen(!submenuOpen)
    }
  }

  return (
    <div className="relative w-full">
      <Link
        href={item.href}
        onClick={handleToggle}
        className={`flex items-center justify-between w-full py-3 px-3 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-800'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}>
        <span>{item.label}</span>
        {item.submenu && (
          <Icon
            icon={submenuOpen ? 'ph:caret-up' : 'ph:caret-down'}
            className="ml-1"
            width={16}
            height={16}
          />
        )}
      </Link>

      {item.submenu && submenuOpen && (
        <div className="pl-4 space-y-1 mt-1">
          {item.submenu.map((subItem, index) => {
            // If this is a category with subcategories
            if (subItem.submenu && subItem.submenu.length > 0) {
              return (
                <MobileNestedSubmenu key={index} item={subItem} path={path} />
              )
            }

            const isSubActive = path === subItem.href

            return (
              <Link
                key={index}
                href={subItem.href}
                className={`block py-2 px-3 text-sm rounded-md ${
                  isSubActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                {subItem.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Component for nested submenu in mobile view
const MobileNestedSubmenu: React.FC<{
  item: HeaderItem
  path: string
}> = ({ item, path }) => {
  const [nestedSubmenuOpen, setNestedSubmenuOpen] = useState(false)
  const isActive = path === item.href

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    setNestedSubmenuOpen(!nestedSubmenuOpen)
  }

  return (
    <div className="w-full">
      <Link
        href={item.href}
        onClick={handleToggle}
        className={`flex items-center justify-between w-full py-2 px-3 text-sm rounded-md ${
          isActive
            ? 'text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-800'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}>
        <span>{item.label}</span>
        {item.submenu && (
          <Icon
            icon={nestedSubmenuOpen ? 'ph:caret-up' : 'ph:caret-down'}
            className="ml-1"
            width={14}
            height={14}
          />
        )}
      </Link>

      {item.submenu && nestedSubmenuOpen && (
        <div className="pl-4 space-y-1 mt-1">
          {item.submenu.map((nestedItem, index) => {
            const isNestedActive = path === nestedItem.href

            return (
              <Link
                key={index}
                href={nestedItem.href}
                className={`block py-2 px-2 text-xs rounded-md ${
                  isNestedActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                {nestedItem.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MobileHeaderLink
