'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  headerData,
  getHeaderItems,
  processCategoriesForMenu,
  createHeaderItems,
} from '../Header/Navigation/menuData'
import Logo from './Logo'
import HeaderLink from '../Header/Navigation/HeaderLink'
import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
import Signin from '@/components/Auth/SignIn'
import SignUp from '@/components/Auth/SignUp'
import { useTheme } from 'next-themes'
import { Icon } from '@iconify/react/dist/iconify.js'
import SearchBox from '@/components/Common/SearchBox'
import { useUser } from '@/contexts/UserContext'
import { useNotification } from '@/contexts/NotificationContext'
import { useCart } from '@/contexts/CartContext'
import { categoriesApi } from '@/api/categoriesApi'

const Header: React.FC = () => {
  const pathUrl = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout } = useUser()
  const notification = useNotification()
  const { toggleCart, totalItems } = useCart()

  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const navbarRef = useRef<HTMLDivElement>(null)
  const signInRef = useRef<HTMLDivElement>(null)
  const signUpRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Don't show search on certain pages
  const excludedPaths = [
    '/cart',
    '/checkout',
    '/delivery',
    '/order-confirmation',
    '/grocery', // Grocery page has its own search
  ]

  const showSearch =
    !pathUrl || !excludedPaths.some((path) => pathUrl.startsWith(path))

  const handleScroll = () => {
    setSticky(window.scrollY >= 80)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false)
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false)
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false)
    }
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target as Node) &&
      isProfileMenuOpen
    ) {
      setIsProfileMenuOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen, isSignInOpen, isSignUpOpen, isProfileMenuOpen])

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen])

  useEffect(() => {
    if (user) {
      console.log('User data in header:', user)
      console.log('User roles:', user.roles)
      console.log(
        'Has admin role:',
        user?.roles?.some((role: string) => role.toUpperCase() === 'ADMIN')
      )
    }
  }, [user])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    console.log('Logout initiated...')

    // Close the profile menu
    setIsProfileMenuOpen(false)

    // Call the logout function from context
    logout()
  }

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        sticky
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {getHeaderItems(
              isAuthenticated ? user?.roles : undefined,
              isAuthenticated
            ).map((item, index) => (
              <HeaderLink key={`${item.label}-${index}`} item={item} />
            ))}
          </nav>

          {/* Search Bar for Desktop */}
          {showSearch && (
            <div className="hidden md:block flex-grow max-w-lg mx-8">
              <SearchBox className="w-full" placeholder="Search products..." />
            </div>
          )}

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            {showSearch && (
              <button
                onClick={() => setSearchVisible(!searchVisible)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle search">
                <Icon
                  icon="ph:magnifying-glass"
                  className="text-gray-700 dark:text-gray-200"
                  width={22}
                  height={22}
                />
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme">
              {theme === 'dark' ? (
                <Icon
                  icon="ph:sun"
                  className="text-yellow-400"
                  width={24}
                  height={24}
                />
              ) : (
                <Icon
                  icon="ph:moon"
                  className="text-indigo-600"
                  width={24}
                  height={24}
                />
              )}
            </button>

            {/* Desktop Authentication Buttons or User Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Add Admin Dashboard button before profile dropdown */}
                  {user?.roles?.some(
                    (role: string) => role.toUpperCase() === 'ADMIN'
                  ) && (
                    <Link
                      href="/admin/products"
                      className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 focus:outline-none">
                      <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        {user?.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || 'User'}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-sm font-medium">
                            {user?.name?.charAt(0) ||
                              user?.email?.charAt(0) ||
                              'U'}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <Icon
                        icon="ph:caret-down"
                        className="text-gray-500"
                        width={16}
                        height={16}
                      />
                    </button>

                    {/* User Profile Dropdown */}
                    {isProfileMenuOpen && (
                      <div
                        ref={profileMenuRef}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                        {user?.roles?.some(
                          (role: string) => role.toUpperCase() === 'ADMIN'
                        ) && (
                          <Link
                            href="/admin/products"
                            className="block px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <Icon
                icon={navbarOpen ? 'ph:x' : 'ph:list'}
                className="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Conditionally Rendered */}
        {showSearch && searchVisible && (
          <div className="md:hidden py-3 pb-4 px-2 animate-fadeIn">
            <SearchBox placeholder="Search products..." />
          </div>
        )}
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          navbarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <Logo />
          <button
            onClick={() => setNavbarOpen(false)}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Icon icon="ph:x" width={24} height={24} />
          </button>
        </div>

        {/* Search in Mobile Menu */}
        {showSearch && (
          <div className="px-4 pt-4 pb-2">
            <SearchBox placeholder="Search products..." />
          </div>
        )}

        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {getHeaderItems(
            isAuthenticated ? user?.roles : undefined,
            isAuthenticated
          ).map((item, index) => (
            <MobileHeaderLink
              key={`mobile-${item.label}-${index}`}
              item={item}
            />
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          {isAuthenticated ? (
            <div className="px-4 space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-sm font-medium">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-base font-medium text-gray-800 dark:text-white">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              {user?.roles?.some(
                (role: string) => role.toUpperCase() === 'ADMIN'
              ) && (
                <Link
                  href="/admin/products"
                  className="block w-full text-left py-2 px-4 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                  onClick={() => setNavbarOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="block w-full text-left py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                Profile
              </Link>
              <Link
                href="/orders"
                className="block w-full text-left py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30">
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4 px-4">
              <Link
                href="/signin"
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center"
                onClick={() => setNavbarOpen(false)}>
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center"
                onClick={() => setNavbarOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div
            ref={signInRef}
            className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsSignInOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                <Icon icon="ph:x" width={24} height={24} />
              </button>
            </div>
            <div className="p-8">
              <Signin />
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {isSignUpOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div
            ref={signUpRef}
            className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsSignUpOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                <Icon icon="ph:x" width={24} height={24} />
              </button>
            </div>
            <div className="p-8">
              <SignUp />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
