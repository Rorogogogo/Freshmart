'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useNotification } from './NotificationContext'

// Function to decode JWT token and extract role
function decodeJwt(token: string) {
  try {
    console.log('Decoding JWT token...')
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
    const decoded = JSON.parse(jsonPayload)
    console.log('Full decoded JWT token:', decoded)
    return decoded
  } catch (error) {
    console.error('Error decoding JWT token:', error)
    return null
  }
}

interface UserContextType {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any | null>(null)
  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user
  const notification = useNotification()

  // Check localStorage token on mount
  useEffect(() => {
    console.log('UserProvider mounted, checking localStorage for token')
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      console.log(
        'Token in localStorage:',
        token ? 'Present (length: ' + token.length + ')' : 'Not found'
      )

      // Check for user data in localStorage
      const storedUser = localStorage.getItem('user')
      console.log('User in localStorage:', storedUser ? 'Present' : 'Not found')

      // If we have session but no token, we need to save the token
      if (session?.user?.accessToken && !token) {
        console.log('Found session token but not in localStorage, saving token')
        localStorage.setItem('token', session.user.accessToken)
      }
    }
  }, [session])

  useEffect(() => {
    if (session?.user) {
      console.log('Session user in UserContext:', session.user)

      // Store the access token in localStorage if available
      if (session.user.accessToken) {
        console.log('Saving access token to localStorage')
        localStorage.setItem('token', session.user.accessToken)
      }

      // Create a copy of the user object
      const enhancedUser = { ...session.user }

      // Add roles array if we have a token
      if (enhancedUser.accessToken) {
        // Force admin role for specific user ID
        if (enhancedUser.id === '01961eab-deb4-7898-be73-d19ac8092d0c') {
          console.log('Setting admin role for specific user ID')
          enhancedUser.roles = ['Admin']
        } else if (!enhancedUser.roles) {
          // Extract from JWT only if roles not already present
          console.log('Processing JWT token in UserContext...')
          const decodedToken = decodeJwt(enhancedUser.accessToken)
          if (decodedToken) {
            console.log('Full decoded token in UserContext:', decodedToken)

            // Check for role claim in the token (Microsoft standard claim)
            const roleClaim =
              decodedToken[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
              ]

            console.log('Role claim found in UserContext:', roleClaim)
            console.log('Role claim type:', typeof roleClaim)

            // If we have a role claim, add it to the user object
            if (roleClaim) {
              // Convert to array if it's a string (handles both single role and multiple roles cases)
              enhancedUser.roles = Array.isArray(roleClaim)
                ? roleClaim
                : [roleClaim]
              console.log('Extracted roles for user:', enhancedUser.roles)
            } else {
              console.log('No role claim found in token')
              enhancedUser.roles = []
            }
          }
        }
      }

      console.log('Final enhanced user object:', enhancedUser)
      setUser(enhancedUser)

      // Store the enhanced user object in localStorage
      localStorage.setItem('user', JSON.stringify(enhancedUser))
    } else {
      setUser(null)
    }
  }, [session])

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      notification.success('Logged out successfully')
      // Clear any local storage items if needed
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } catch (error) {
      console.error('Logout error:', error)
      notification.error('Failed to log out')
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    logout,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
