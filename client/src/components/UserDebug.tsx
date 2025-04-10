'use client'

import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'

// Add function to decode JWT token
function decodeJwt(token: string) {
  try {
    // Split the token and get the payload part (second part)
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    // Decode the base64 string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    // Parse the JSON
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT token:', error)
    return null
  }
}

export default function UserDebug() {
  const { user, isAuthenticated, isLoading } = useUser()
  const [decodedToken, setDecodedToken] = useState<any>(null)

  // Don't show anything in production
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const decodeStoredToken = () => {
    if (typeof window !== 'undefined') {
      // Try from session storage first
      let token = sessionStorage.getItem('next-auth.session-token')
      // Or from user's localStorage
      if (!token) {
        const userJson = localStorage.getItem('user')
        if (userJson) {
          const userData = JSON.parse(userJson)
          token = userData.accessToken
        }
      }

      if (token) {
        const decoded = decodeJwt(token)
        setDecodedToken(decoded)
      } else {
        setDecodedToken({ error: 'No token found in storage' })
      }
    }
  }

  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-black bg-opacity-80 text-white rounded-lg z-50 max-w-md overflow-auto max-h-80">
      <h3 className="text-lg font-semibold mb-2">User Context Debug</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>isAuthenticated:</div>
        <div>{String(isAuthenticated)}</div>

        <div>isLoading:</div>
        <div>{String(isLoading)}</div>
      </div>

      <div className="mt-2">
        <div className="font-semibold">User:</div>
        <pre className="text-xs mt-1 overflow-auto">
          {user ? JSON.stringify(user, null, 2) : 'null'}
        </pre>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={decodeStoredToken}
          className="px-2 py-1 bg-blue-600 rounded text-xs">
          Decode Token
        </button>

        {decodedToken && (
          <button
            onClick={() => setDecodedToken(null)}
            className="px-2 py-1 bg-red-600 rounded text-xs">
            Clear
          </button>
        )}
      </div>

      {decodedToken && (
        <div className="mt-2">
          <div className="font-semibold">Decoded Token:</div>
          <pre className="text-xs mt-1 overflow-auto">
            {JSON.stringify(decodedToken, null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={() => document.querySelector('.user-debug')?.remove()}
        className="absolute top-2 right-2 text-gray-400 hover:text-white">
        ×
      </button>
    </div>
  )
}
