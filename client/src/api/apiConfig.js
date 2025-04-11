import axios from 'axios'

// API base URL - handle different environment variable systems with fallback
const getApiUrl = () => {
  // Log environment to help debug
  console.log('Environment check:', {
    processExists: typeof process !== 'undefined',
    processEnv: typeof process !== 'undefined' ? !!process.env : false,
    nextPublicApiUrl: typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_API_URL : undefined,
    importMetaExists: typeof import.meta !== 'undefined',
    viteApiUrl: typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_URL : undefined
  })

  // Next.js environment variables (process.env.NEXT_PUBLIC_*)
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) {
    console.log('Using Next.js env var:', process.env.NEXT_PUBLIC_API_URL)
    return process.env.NEXT_PUBLIC_API_URL
  }

  // Vite environment variables (import.meta.env.VITE_*)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    console.log('Using Vite env var:', import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL
  }

  // Fallback to default
  console.log('Using fallback API URL: http://localhost:5118')
  return 'http://localhost:5118'
}

// Export the API URL
export const API_URL = getApiUrl()

// Log the final API URL
console.log('Final API_URL:', API_URL)

// Create axios instance with default headers
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add withCredentials to send cookies with cross-domain requests
  withCredentials: true
})

// Log when this module is loaded
console.log('API Config initialized with baseURL:', api.defaults.baseURL)

// Add a request interceptor to inject auth token
api.interceptors.request.use(
  (config) => {
    // Check if window is defined (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        console.log(`Adding Authorization header for request to ${config.url}`)
        config.headers.Authorization = `Bearer ${token}`
      } else {
        console.log(`No token available for request to ${config.url}`)
      }
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    // Client-side only operations
    if (typeof window !== 'undefined') {
      console.error('API response error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      })

      // Handle 401 Unauthorized errors (token expired)
      if (error.response && error.response.status === 401) {
        console.log('401 Unauthorized - clearing auth data')
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