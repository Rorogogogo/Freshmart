import { api } from './apiConfig'

const usersApi = {
  // Get current user profile
  getCurrentProfile: async () => {
    try {
      const response = await api.get('/users/profile')
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/change-password', passwordData)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  },

  // Update profile picture
  updateProfilePicture: async (imageFile) => {
    try {
      const formData = new FormData()
      formData.append('file', imageFile)

      const response = await api.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  },

  // Delete account (soft delete)
  deleteAccount: async () => {
    try {
      const response = await api.delete('/users/account')
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }
}

export default usersApi 