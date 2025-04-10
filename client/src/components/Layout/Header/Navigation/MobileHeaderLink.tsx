'use client'
import { useState } from 'react'
import Link from 'next/link'
import { HeaderItem } from '../../../../types/menu'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'

const MobileHeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const path = usePathname()

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

      {submenuOpen && item.submenu && (
        <div className="pl-4 space-y-1 mt-1">
          {item.submenu.map((subItem, index) => {
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

export default MobileHeaderLink
