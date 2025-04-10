'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/Admin/AdminLayout'
import usersApi, { User, UpdateUserDto } from '@/api/usersApi'
import { useNotification } from '@/contexts/NotificationContext'
import Image from 'next/image'

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const userId = params ? params.id : ''
  const notification = useNotification()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [userData, setUserData] = useState<User | null>(null)

  // Define available roles
  const availableRoles = ['ADMIN', 'USER']

  // Form data
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  useEffect(() => {
    if (!userId) return

    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await usersApi.getUserById(userId)

        if (response.success) {
          setUserData(response.data)

          // Populate form
          setFirstName(response.data.firstName || '')
          setLastName(response.data.lastName || '')
          setEmail(response.data.email || '')
          setSelectedRoles(response.data.roles || [])
        } else {
          notification.error('Failed to load user data')
          router.push('/admin/users')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        notification.error('Failed to load user data')
        router.push('/admin/users')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId, notification, router])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!firstName.trim()) errors.firstName = 'First name is required'
    if (!lastName.trim()) errors.lastName = 'Last name is required'
    if (!email.trim()) errors.email = 'Email is required'
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email format'
    if (selectedRoles.length === 0)
      errors.roles = 'At least one role is required'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setSaving(true)

      const updateData: UpdateUserDto = {
        firstName,
        lastName,
        email,
        roles: selectedRoles,
      }

      const response = await usersApi.updateUser(userId, updateData)

      if (response.success) {
        notification.success('User updated successfully')
        router.push('/admin/users')
      } else {
        notification.error(response.message || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      notification.error('Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  if (loading) {
    return (
      <AdminLayout title="Edit User">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit User">
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Edit User</h2>

        {userData && (
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-20 w-20 relative">
              {userData.imageUrl ? (
                <Image
                  src={userData.imageUrl}
                  alt={userData.firstName}
                  className="h-20 w-20 rounded-full object-cover"
                  width={80}
                  height={80}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl font-medium">
                    {userData.firstName && userData.lastName
                      ? `${userData.firstName.charAt(
                          0
                        )}${userData.lastName.charAt(0)}`
                      : 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold">
                {userData.firstName} {userData.lastName}
              </h3>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles
            </label>
            <div className="flex flex-wrap gap-3">
              {availableRoles.map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`role-${role}`}
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`role-${role}`}
                    className={`ml-2 block text-sm ${
                      role === 'ADMIN'
                        ? 'text-red-600 font-medium'
                        : 'text-gray-700'
                    }`}>
                    {role}
                  </label>
                </div>
              ))}
            </div>
            {formErrors.roles && (
              <p className="mt-1 text-sm text-red-600">{formErrors.roles}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
