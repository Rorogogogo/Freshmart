'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Logo from '@/components/Layout/Header/Logo'
import { confirmEmail } from '@/api'

export default function ConfirmEmail() {
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const userId = searchParams?.get('userId')
        const token = searchParams?.get('token')

        if (!userId || !token) {
          setMessage('Invalid verification link. Missing userId or token.')
          setSuccess(false)
          setLoading(false)
          return
        }

        const response = await confirmEmail(userId, token)

        if (response.success) {
          setSuccess(true)
          setMessage('Your email has been confirmed successfully!')
        } else {
          setSuccess(false)
          setMessage(response.message || 'Failed to confirm email.')
        }
      } catch (error) {
        setSuccess(false)
        setMessage('An error occurred while confirming your email.')
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Email Confirmation
          </h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner mb-4"></div>
              <p>Verifying your email...</p>
            </div>
          ) : success ? (
            <div className="text-center text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-xl font-semibold">{message}</p>
              <p className="mt-4">You can now log in to your account.</p>
            </div>
          ) : (
            <div className="text-center text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="text-xl font-semibold">Verification Failed</p>
              <p className="mt-2">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
