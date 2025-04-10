'use client'

import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'

export default function DevTools() {
  const { user, isAuthenticated, isLoading } = useUser()
  const [showLocalStorage, setShowLocalStorage] = useState(false)

  // Get all local storage items
  const getLocalStorageItems = () => {
    if (typeof window === 'undefined') return {}

    const items: Record<string, any> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        try {
          const value = localStorage.getItem(key)
          items[key] = value

          // Try to parse JSON values
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            try {
              items[`${key} (parsed)`] = JSON.parse(value)
            } catch (e) {
              // Not valid JSON, keep as string
            }
          }
        } catch (e) {
          items[key] = 'Error reading value'
        }
      }
    }
    return items
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Developer Tools</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">🔐</span> User Context
        </h2>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="font-medium">isAuthenticated:</div>
          <div className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {String(isAuthenticated)}
          </div>

          <div className="font-medium">isLoading:</div>
          <div>{String(isLoading)}</div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">User Object:</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-auto max-h-96 text-sm">
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </pre>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2
          className="text-xl font-semibold mb-4 flex items-center cursor-pointer"
          onClick={() => setShowLocalStorage(!showLocalStorage)}>
          <span className="mr-2">🗄️</span> Local Storage
          <span className="text-sm ml-2 text-gray-500">
            (click to {showLocalStorage ? 'hide' : 'show'})
          </span>
        </h2>

        {showLocalStorage && (
          <div className="mt-4">
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-auto max-h-96 text-sm">
              {JSON.stringify(getLocalStorageItems(), null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>
          This page is for development purposes only and should not be
          accessible in production.
        </p>
      </div>
    </div>
  )
}
