import Link from 'next/link'
import Image from 'next/image'
import LogoSvg from './logo.svg'

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center space-x-1 text-gray-900 dark:text-white transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
      <div className="relative w-20 h-20">
        <Image
          src={LogoSvg}
          alt="FreshMart Logo"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <span className="text-xl font-bold">FreshMart</span>
    </Link>
  )
}

export default Logo
