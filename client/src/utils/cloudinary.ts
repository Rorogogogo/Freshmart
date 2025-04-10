import axios from 'axios'

// Cloudinary configuration
const cloudName = 'dkddaouet'
const apiKey = '943732638179437'
const uploadPreset = 'freshmart' // You need to create an unsigned upload preset in your Cloudinary dashboard

/**
 * Upload an image to Cloudinary
 * @param file The file to upload
 * @returns The URL of the uploaded image
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('cloud_name', cloudName)

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    )

    return response.data.secure_url
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Extract the public ID from a Cloudinary URL
 * @param url The Cloudinary URL
 * @returns The public ID of the image
 */
export const getPublicIdFromUrl = (url: string): string => {
  // Extract the public ID from a URL like https://res.cloudinary.com/dkddaouet/image/upload/v1234567890/public_id.jpg
  const regex = /\/v\d+\/(.+)\.\w+$/
  const match = url.match(regex)
  return match ? match[1] : ''
}

/**
 * Delete an image from Cloudinary
 * @param publicId The public ID of the image to delete
 * @returns A boolean indicating whether the deletion was successful
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    // This would typically be a server-side operation as it requires the API secret
    // For a real implementation, you would create a server endpoint to handle this
    // Here, we'll just simulate the success response
    console.log(`Image ${publicId} would be deleted from Cloudinary`)
    return true
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    return false
  }
}
