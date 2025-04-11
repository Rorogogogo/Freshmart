import { HeaderItem } from '@/types/menu'
import { categoriesApi, Category } from '@/api/categoriesApi'

// Base header items that are always shown
const baseHeaderItems: HeaderItem[] = [
  { label: 'About', href: '/about' },
  {
    label: 'Grocery',
    href: '/grocery',
    submenu: [],
  },
]

// Static headerData for backup / initial render
export const headerData: HeaderItem[] = baseHeaderItems

// Process categories into menu items
export const processCategoriesForMenu = (
  categories: Category[]
): HeaderItem[] => {
  // Process categories into the menu format
  const categoryMenuItems = categories
    .filter((category) => !category.parentId) // Filter for root categories
    .map((category) => {
      // Find all subcategories for this category
      const subcategories = categories.filter(
        (subcategory) => subcategory.parentId === category.id
      )

      // Build submenu items from subcategories
      const submenuItems = subcategories.map((sub) => ({
        label: sub.name,
        href: `/grocery?category=${sub.id}`,
        // Add proper category info to URL for better context
        submenu: [], // Initialize empty array to enable proper type checking
      }))

      // Return category with subcategories
      return {
        label: category.name,
        href: `/grocery?category=${category.id}`,
        submenu: submenuItems.length > 0 ? submenuItems : [],
      }
    })

  return categoryMenuItems
}

// Create the header items based on menu data and user roles
export const createHeaderItems = (
  menuItems: HeaderItem[],
  userRoles?: string[],
  isAuthenticated = true
): HeaderItem[] => {
  // Find and update the Grocery item with category submenu
  const updatedItems = menuItems.map((item) => item)

  // Add Orders link for authenticated users
  if (isAuthenticated) {
    updatedItems.push({
      label: 'My Orders',
      href: '/orders',
    })
  }

  // Add admin dashboard link if user has admin role
  if (userRoles?.some((role) => role.toUpperCase() === 'ADMIN')) {
    updatedItems.push({
      label: 'Admin',
      href: '/admin/products',
    })
  }

  return updatedItems
}

// This is the function to be used by components - no hooks in here
export const getHeaderItems = (
  userRoles?: string[],
  isAuthenticated = true
): HeaderItem[] => {
  return createHeaderItems(baseHeaderItems, userRoles, isAuthenticated)
}
