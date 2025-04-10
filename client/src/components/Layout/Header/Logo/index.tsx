import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 text-gray-900 dark:text-white transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
      <Icon
        icon="ph:shopping-cart-simple-bold"
        className="text-indigo-600"
        width={28}
        height={28}
      />
      <span className="text-xl font-bold">FreshMart</span>
    </Link>
  )
}

export default Logo
