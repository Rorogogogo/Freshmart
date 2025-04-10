import { api, API_URL } from './apiConfig'

// Confirm email function
export const confirmEmail = async (userId, token) => {
  try {
    const response = await api.get(`/auth/confirm-email?userId=${userId}&token=${token}`)
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

// Auth API facade
export const authApi = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  // Login with email and password
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  // Login with Google
  googleLogin: async (idToken) => {
    try {
      const response = await api.post('/auth/google-login', { idToken })
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  },

  // Confirm email
  confirmEmail,

  // Send password reset email
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', JSON.stringify(email))
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData)
      return response.data
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user data')
    }
  },

  // Save auth data to localStorage
  saveAuthData: (data) => {
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
  },

  // Clear auth data from localStorage
  clearAuthData: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Get user data from local storage
  getUserData: () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  },

  // Logout user
  logout: () => {
    authApi.clearAuthData()
  }
}

export default authApi 