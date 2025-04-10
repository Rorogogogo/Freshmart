import { useState } from 'react'
import { uploadProductImage } from '../api/productImagesApi'

const ImageUploader = ({ onImageUploaded }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload file
    handleUpload(file)
  }

  const handleUpload = async (file) => {
    try {
      setIsUploading(true)
      setError('')

      const response = await uploadProductImage(file)

      if (response.success) {
        // Call the parent component's callback with the image URL
        onImageUploaded(response.data)
      } else {
        setError(response.message || 'Failed to upload image')
      }
    } catch (err) {
      setError('Error uploading image. Please try again.')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="image-uploader">
      <div className="upload-container">
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
          </div>
        ) : (
          <label className="upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              disabled={isUploading}
            />
            <div className="upload-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="upload-icon">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Click to upload image</span>
            </div>
          </label>
        )}

        {isUploading && <div className="upload-status">Uploading...</div>}
        {error && <div className="upload-error">{error}</div>}
      </div>

      <style jsx>{`
        .image-uploader {
          width: 100%;
          margin-bottom: 1rem;
        }

        .upload-container {
          border: 2px dashed #ccc;
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .upload-container:hover {
          border-color: #4f46e5;
        }

        .upload-label {
          display: block;
          cursor: pointer;
        }

        .file-input {
          display: none;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          color: #6b7280;
        }

        .upload-icon {
          width: 2.5rem;
          height: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .preview-container {
          width: 100%;
          padding: 0.5rem;
        }

        .image-preview {
          max-width: 100%;
          max-height: 200px;
          margin: 0 auto;
          display: block;
          border-radius: 0.375rem;
        }

        .upload-status {
          margin-top: 0.5rem;
          color: #4f46e5;
          font-weight: 500;
        }

        .upload-error {
          margin-top: 0.5rem;
          color: #ef4444;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

export default ImageUploader
