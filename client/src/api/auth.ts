import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5118'

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Confirm email
export const confirmEmail = async (userId: string, token: string) => {
  try {
    const response = await apiClient.get(
      `/auth/confirm-email?userId=${userId}&token=${token}`
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data
    }
    return {
      success: false,
      message: 'An error occurred while confirming your email.',
    }
  }
}

export default apiClient
