import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'

const Footer = () => {
  const footerLinks = {
    shop: [
      'Grocery',
      'Fresh Fruits',
      'Vegetables',
      'Dairy Products',
      'Special Offers',
    ],
    company: ['About Us', 'Contact', 'Terms & Conditions', 'Privacy Policy'],
    account: ['My Account', 'My Orders', 'Shopping Cart', 'Wishlist'],
  }

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Logo and Social Icons */}
            <div className="md:col-span-4">
              <Link href="/" className="inline-block">
                <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  Freshmart
                </h2>
              </Link>
              <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
                Your one-stop shop for fresh produce, groceries, and everyday
                essentials.
              </p>
              <div className="mt-6 flex space-x-4">
                <Link
                  href="https://facebook.com"
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  aria-label="Facebook">
                  <Icon icon="ph:facebook-logo" width={24} height={24} />
                </Link>
                <Link
                  href="https://twitter.com"
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  aria-label="Twitter">
                  <Icon icon="ph:twitter-logo" width={24} height={24} />
                </Link>
                <Link
                  href="https://instagram.com"
                  className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  aria-label="Instagram">
                  <Icon icon="ph:instagram-logo" width={24} height={24} />
                </Link>
              </div>
            </div>

            {/* Shop Links */}
            <div className="md:col-span-2 md:ml-auto">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Shop
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.shop.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-base text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-base text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Links */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Account
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.account.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-base text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Subscribe
              </h3>
              <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                Get updates on new products and seasonal specials.
              </p>
              <div className="mt-4">
                <div className="flex">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your email"
                    className="flex-1 min-w-0 px-4 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Icon icon="ph:paper-plane-right" className="mr-2" />
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer - Copyright and links */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Freshmart. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href="/privacy-policy"
                className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                Privacy Policy
              </Link>
              <Link
                href="/terms-&-conditions"
                className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
