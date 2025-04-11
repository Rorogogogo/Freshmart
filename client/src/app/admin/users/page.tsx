'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/Admin/AdminLayout'
import { usersApi } from '@/api/usersApi'
import { User } from '@/api/usersApi'
import { useNotification } from '@/contexts/NotificationContext'

// Mockup data until API connection is fixed
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    imageUrl: null,
    roles: ['ADMIN'],
    emailConfirmed: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    imageUrl: null,
    roles: ['USER'],
    emailConfirmed: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function UsersAdminPage() {
  const router = useRouter()
  const notification = useNotification()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    console.log('UsersAdminPage mounted - Fetching users...')
    fetchUsers()
  }, [])

  useEffect(() => {
    // Apply filtering when users or search term changes
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.roles &&
          user.roles.some((role) =>
            role.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    )

    // Update total pages based on filtered results
    setTotalPages(Math.ceil(filtered.length / pageSize))

    // Apply pagination to filtered results
    const start = (currentPage - 1) * pageSize
    const paginatedUsers = filtered.slice(start, start + pageSize)

    setFilteredUsers(paginatedUsers)
  }, [users, searchTerm, currentPage, pageSize])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log('Starting API request to fetch users...')
      setApiError(null)

      // Check if usersApi exists and has getUsers method
      if (!usersApi || typeof usersApi.getUsers !== 'function') {
        console.error('usersApi or usersApi.getUsers is not available')
        setApiError('API client not properly initialized')
        setUsers(MOCK_USERS)
        return
      }

      // Try to fetch from API first
      try {
        const response = await usersApi.getUsers()
        console.log('Users API response:', response)

        if (response.success) {
          setUsers(response.data)
          return // Exit early if API call succeeds
        } else {
          console.warn('API returned success:false', response.message)
          setApiError(`API error: ${response.message}`)
        }
      } catch (err) {
        console.error('API call failed:', err)
        setApiError(
          `API call error: ${err instanceof Error ? err.message : String(err)}`
        )
      }

      // Fallback to mock data if API fails
      console.log('Using mock user data as fallback')
      setUsers(MOCK_USERS)
    } catch (error) {
      console.error('Error in fetchUsers:', error)
      notification.error('Failed to fetch users. Using mock data instead.')
      setUsers(MOCK_USERS)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    // The actual filtering happens in the useEffect
  }

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await usersApi.deleteUser(id)

        if (response.success) {
          notification.success('User deleted successfully')
          // Refetch users after deletion
          fetchUsers()
        } else {
          notification.error(response.message || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        notification.error('Failed to delete user. Please try again.')
      }
    }
  }

  return (
    <AdminLayout title="Manage Users">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">User List</h2>
        </div>

        {apiError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            <p>
              <strong>Note:</strong> {apiError}
            </p>
            <p className="text-sm mt-1">
              Using mock data instead. Please ensure the backend API is running
              and authentication is configured correctly.
            </p>
          </div>
        )}

        {/* Search */}
        <div className="bg-gray-50 rounded-lg p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Search
            </button>
          </form>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-lg overflow-hidden border">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users found. Try a different search term.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {user.imageUrl ? (
                              <Image
                                src={user.imageUrl}
                                alt={user.firstName}
                                className="h-10 w-10 rounded-full object-cover"
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-sm font-medium">
                                  {user.firstName && user.lastName
                                    ? `${user.firstName.charAt(
                                        0
                                      )}${user.lastName.charAt(0)}`
                                    : 'U'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.roles &&
                            user.roles.map((role, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  role === 'ADMIN'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                {role}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/users/edit/${user.id}`}
                            className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredUsers.length > 0 && (
            <div className="px-6 py-3 flex justify-between items-center border-t">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50">
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
