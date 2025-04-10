import axios from 'axios'

// API base URL - handle different environment variable systems with fallback
const getApiUrl = () => {
  // Next.js environment variables (process.env.NEXT_PUBLIC_*)
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }

  // Vite environment variables (import.meta.env.VITE_*)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // Fallback to default
  return 'http://localhost:5118/api'
}

// Export the API URL
export const API_URL = getApiUrl()

// Create axios instance with default headers
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to inject auth token
api.interceptors.request.use(
  (config) => {
    // Check if window is defined (client-side only)
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

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Client-side only operations
    if (typeof window !== 'undefined') {
      // Handle 401 Unauthorized errors (token expired)
      if (error.response && error.response.status === 401) {
        // Clear local storage and redirect to login if needed
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('expiryDate')

        // You could dispatch an event or use a state management solution
        // to notify the app about logout
        window.dispatchEvent(new Event('auth:logout'))
      }
    }

    return Promise.reject(error)
  }
) 