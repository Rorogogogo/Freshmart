'use client'
import { useState } from 'react'
import Link from 'next/link'
import { HeaderItem } from '../../../../types/menu'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const path = usePathname() || ''

  const handleMouseEnter = () => {
    if (item.submenu) {
      setSubmenuOpen(true)
    }
  }

  const handleMouseLeave = () => {
    setSubmenuOpen(false)
  }

  const isActive = path === item.href

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <Link
        href={item.href}
        className={`flex items-center text-sm font-medium px-1 py-2 transition-colors ${
          isActive
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}>
        {item.label}
        {item.submenu && (
          <Icon icon="ph:caret-down" className="ml-1" width={16} height={16} />
        )}
      </Link>

      {/* Active indicator line */}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
      )}

      {/* Submenu */}
      {item.submenu && submenuOpen && (
        <div
          className="absolute left-0 mt-0 z-40 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={{ marginTop: '8px' }}>
          {/* Invisible hover bridge to prevent gap */}
          <div className="absolute h-2 w-full top-[-8px]"></div>
          {item.submenu.map((subItem, index) => (
            <SubMenuItem key={index} item={subItem} path={path} />
          ))}
        </div>
      )}
    </div>
  )
}

// SubMenuItem component for nested menus
const SubMenuItem: React.FC<{
  item: HeaderItem
  path: string
}> = ({ item, path }) => {
  const [nestedSubmenuOpen, setNestedSubmenuOpen] = useState(false)

  const handleMouseEnter = () => {
    if (item.submenu) {
      setNestedSubmenuOpen(true)
    }
  }

  const handleMouseLeave = () => {
    setNestedSubmenuOpen(false)
  }

  const hasSubmenu = item.submenu && item.submenu.length > 0

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <Link
        href={item.href}
        className={`block px-4 py-2 text-sm ${
          path === item.href
            ? 'bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        } ${hasSubmenu ? 'flex justify-between items-center' : ''}`}>
        <span>{item.label}</span>
        {hasSubmenu && (
          <Icon icon="ph:caret-right" className="ml-1" width={16} height={16} />
        )}
      </Link>

      {/* Nested submenu */}
      {hasSubmenu && nestedSubmenuOpen && (
        <div className="absolute left-full top-0 z-50 mt-0 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/* Invisible hover bridge to prevent gap */}
          <div className="absolute h-full w-2 top-0 left-[-8px]"></div>
          {item.submenu?.map((nestedItem, index) => (
            <Link
              key={index}
              href={nestedItem.href}
              className={`block px-4 py-2 text-sm ${
                path === nestedItem.href
                  ? 'bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
              {nestedItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeaderLink
