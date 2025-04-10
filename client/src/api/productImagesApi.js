import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5118/api'

// Create axios instance with base URL for product images
const apiClient = axios.create({
  baseURL: `${API_URL}/ProductImages`,
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})

// Add authorization token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const uploadProductImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/upload', formData)
    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const uploadBase64Image = async (base64Image, fileName) => {
  try {
    // Update content type for JSON requests
    const response = await axios.post(`${API_URL}/ProductImages/upload-base64`,
      { base64Image, fileName },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error uploading base64 image:', error)
    throw error
  }
}

export default {
  uploadProductImage,
  uploadBase64Image
} 