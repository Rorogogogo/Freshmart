'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import authApi from '@/api/authApi'
import { useSession } from 'next-auth/react'
import { useUser } from '@/contexts/UserContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { status } = useSession()
  const { user: contextUser } = useUser()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for NextAuth to finish loading
        if (status === 'loading') {
          return
        }

        setLoading(true)
        console.log('Checking admin access...')
        console.log('Context user:', contextUser)

        // Check all the authentication sources for admin role
        let isAdmin = false

        // First check from context user (most reliable)
        if (contextUser?.roles) {
          console.log('User roles from context:', contextUser.roles)
          if (typeof contextUser.roles === 'string') {
            isAdmin = contextUser.roles.toUpperCase() === 'ADMIN'
          } else if (Array.isArray(contextUser.roles)) {
            isAdmin = contextUser.roles.some(
              (role: string) =>
                typeof role === 'string' && role.toUpperCase() === 'ADMIN'
            )
          }
        }

        // Direct check for specific user ID
        if (contextUser?.id === '01961eab-deb4-7898-be73-d19ac8092d0c') {
          isAdmin = true
        }

        // Fallback to localStorage
        if (!isAdmin && authApi.isAuthenticated()) {
          const userData = authApi.getUserData()
          if (userData?.id === '01961eab-deb4-7898-be73-d19ac8092d0c') {
            isAdmin = true
          } else if (userData?.roles) {
            if (Array.isArray(userData.roles)) {
              isAdmin = userData.roles.some(
                (role: string) =>
                  typeof role === 'string' && role.toUpperCase() === 'ADMIN'
              )
            }
          }
        }

        // If not admin, redirect to home
        if (!isAdmin) {
          console.log('No admin role found, redirecting to home')
          router.push('/')
          return
        }

        // Admin access granted
        setLoading(false)
      } catch (error) {
        console.error('Authentication error:', error)
        router.push('/')
      }
    }

    checkAuth()
  }, [router, status, contextUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  // Return the children without additional layout elements
  // This will display admin content in the main layout with header and footer
  return <>{children}</>
}
