'use client'

import React, { useState, useRef } from 'react'
import { productImagesApi } from '@/api/productImagesApi'
import { toast } from 'react-hot-toast'
import { Icon } from '@iconify/react/dist/iconify.js'

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  currentImageUrl?: string
  className?: string
  label?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl = '',
  className = '',
  label = 'Upload Image',
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      toast.error(
        'Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).'
      )
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size is too large. Maximum allowed size is 5MB.')
      return
    }

    try {
      setIsUploading(true)

      // Create a local preview of the image
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary through our API
      const response = await productImagesApi.uploadProductImage(file)

      if (response.success) {
        // The data is a direct URL string, not an object with imageUrl property
        onImageUploaded(response.data)
        toast.success('Image uploaded successfully')
      } else {
        toast.error(response.message || 'Failed to upload image')
      }
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files && files.length > 0 && fileInputRef.current) {
      fileInputRef.current.files = files
      const event = {
        target: { files },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileUpload(event)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400 transition-colors"
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        <div className="space-y-1 text-center">
          {previewUrl ? (
            <div className="relative mx-auto">
              <img
                src={previewUrl}
                alt="Preview"
                className="mx-auto h-32 w-auto object-contain"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                  <Icon
                    icon="ph:spinner"
                    className="animate-spin text-gray-500"
                    width={32}
                    height={32}
                  />
                </div>
              )}
            </div>
          ) : (
            <Icon
              icon="ph:cloud-arrow-up"
              className="mx-auto h-12 w-12 text-gray-400"
            />
          )}

          <div className="flex text-sm text-gray-600">
            <div className="relative w-full">
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />

              <p className="text-center">
                <span className="text-indigo-600 font-medium">
                  {isUploading ? 'Uploading...' : 'Click to upload'}
                </span>{' '}
                or drag and drop
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload
