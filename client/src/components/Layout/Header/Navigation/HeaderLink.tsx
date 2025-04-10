'use client'
import { useState } from 'react'
import Link from 'next/link'
import { HeaderItem } from '../../../../types/menu'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const path = usePathname()

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
      {submenuOpen && item.submenu && (
        <div
          className="absolute left-0 mt-2 z-10 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={{ marginTop: '0.5rem' }}>
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className={`block px-4 py-2 text-sm ${
                path === subItem.href
                  ? 'bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeaderLink
