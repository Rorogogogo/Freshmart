import { HeaderItem } from '@/types/menu'

// Base header items that are always shown
const baseHeaderItems: HeaderItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Grocery', href: '/grocery' },
]

// Function to get header items based on user roles
export const getHeaderItems = (userRoles?: string[]): HeaderItem[] => {
  // Clone the base items
  const items = [...baseHeaderItems]

  // Add admin dashboard link if user has admin role
  if (userRoles?.some((role) => role.toUpperCase() === 'ADMIN')) {
    items.push({
      label: 'Admin',
      href: '/admin/products',
    })
  }

  return items
}

// Keep headerData for backward compatibility
export const headerData: HeaderItem[] = baseHeaderItems
