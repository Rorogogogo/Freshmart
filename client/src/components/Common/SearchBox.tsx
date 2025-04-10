'use client'
import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation'

interface SearchBoxProps {
  placeholder?: string
  className?: string
  onSearch?: (term: string) => void
  initialValue?: string
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search by name, category, or description...',
  className = '',
  onSearch,
  initialValue = '',
}) => {
  const [searchTerm, setSearchTerm] = React.useState(initialValue)
  const router = useRouter()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSearch) {
      // If no onSearch prop is provided, navigate to search page
      router.push(`/grocery?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex-grow max-w-md ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Icon
        icon="ph:magnifying-glass"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        width={20}
        height={20}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-500"
        aria-label="Search">
        <Icon icon="ph:arrow-right" width={20} height={20} />
      </button>
    </form>
  )
}

export default SearchBox
