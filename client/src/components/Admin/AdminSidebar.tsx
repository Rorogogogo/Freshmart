'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()

  // Function to check if a link is active
  const isActive = (path: string) => {
    return pathname === path || (pathname && pathname.startsWith(`${path}/`))
  }

  return (
    <div className="w-64 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <Link
          href="/admin/products"
          className="text-lg font-semibold text-green-600">
          Freshmart Admin
        </Link>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin/products"
              className={`block p-2 rounded ${
                isActive('/admin/products')
                  ? 'bg-green-100 text-green-700'
                  : 'hover:bg-gray-100'
              }`}>
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/admin/categories"
              className={`block p-2 rounded ${
                isActive('/admin/categories')
                  ? 'bg-green-100 text-green-700'
                  : 'hover:bg-gray-100'
              }`}>
              Categories
            </Link>
          </li>
          <li className="pt-4 mt-4 border-t">
            <Link href="/" className="block p-2 hover:bg-gray-100 rounded">
              Back to Store
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
