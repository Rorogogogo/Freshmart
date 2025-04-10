import apiClient from './auth'
import { AxiosResponse } from 'axios'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  imageUrl: string | null
  roles: string[]
  createdAt?: string
  updatedAt?: string
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  email?: string
  roles?: string[]
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface UserProfileDto {
  id: string
  email: string
  firstName: string
  lastName: string
  imageUrl: string | null
}

export interface UserApiResponse {
  success: boolean
  message: string
  statusCode: number
  data: User
}

export interface UsersApiResponse {
  success: boolean
  message: string
  statusCode: number
  data: User[]
  totalCount: number
  totalPages: number
  pageSize: number
  page: number
}

export interface UserProfileResponse {
  success: boolean
  message: string
  statusCode: number
  data: UserProfileDto
}

const usersApi = {
  // Get all users (admin only)
  getUsers: async (): Promise<UsersApiResponse> => {
    try {
      const response: AxiosResponse<UsersApiResponse> = await apiClient.get(
        '/users'
      )
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Get user by ID (admin only)
  getUserById: async (id: string): Promise<UserApiResponse> => {
    try {
      const response: AxiosResponse<UserApiResponse> = await apiClient.get(
        `/users/${id}`
      )
      return response.data
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error)
      throw error
    }
  },

  // Get current user profile
  getUserProfile: async (): Promise<UserProfileResponse> => {
    try {
      const response: AxiosResponse<UserProfileResponse> = await apiClient.get(
        '/users/profile'
      )
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  },

  // Update user (admin only)
  updateUser: async (
    id: string,
    userData: UpdateUserDto
  ): Promise<UserApiResponse> => {
    try {
      const response: AxiosResponse<UserApiResponse> = await apiClient.put(
        `/users/${id}`,
        userData
      )
      return response.data
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error)
      throw error
    }
  },

  // Update user profile
  updateProfile: async (
    profileData: Partial<UserProfileDto>
  ): Promise<UserProfileResponse> => {
    try {
      const response: AxiosResponse<UserProfileResponse> = await apiClient.put(
        '/users/profile',
        profileData
      )
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  // Change password
  changePassword: async (
    passwordData: ChangePasswordDto
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.put(
        '/users/change-password',
        passwordData
      )
      return response.data
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  },

  // Delete user (admin only)
  deleteUser: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error)
      throw error
    }
  },
}

export default usersApi
