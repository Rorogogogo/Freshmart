import axios from 'axios'
import apiClient from './auth'

// Define response types for better TypeScript support
export interface ImageUploadResponse {
  success: boolean
  message: string
  statusCode: number
  data: string // The direct URL string for the uploaded image
}

/**
 * Product Images API - Handles image uploads to Cloudinary
 */
export const productImagesApi = {
  /**
   * Upload a file (image) to Cloudinary
   * @param file The file to upload
   * @returns Response with image URL and other details
   */
  uploadProductImage: async (file: File): Promise<ImageUploadResponse> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiClient.post('/ProductImages/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  /**
   * Upload a base64-encoded image to Cloudinary
   * @param base64Image The base64-encoded image data
   * @param fileName Optional filename
   * @returns Response with image URL and other details
   */
  uploadBase64Image: async (
    base64Image: string,
    fileName: string = 'image'
  ): Promise<ImageUploadResponse> => {
    try {
      const response = await apiClient.post(
        '/ProductImages/upload-base64',
        { base64Image, fileName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error uploading base64 image:', error)
      throw error
    }
  },
}

// For backward compatibility
export const uploadProductImage = productImagesApi.uploadProductImage
export const uploadBase64Image = productImagesApi.uploadBase64Image

export default productImagesApi
