'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useNotification } from '@/contexts/NotificationContext'
import Logo from '@/components/Layout/Header/Logo'
import { useState } from 'react'
import Loader from '@/components/Common/Loader'
import { Icon } from '@iconify/react/dist/iconify.js'

const SignUp = () => {
  const router = useRouter()
  const notification = useNotification()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: any) => {
    e.preventDefault()

    setLoading(true)
    const data = new FormData(e.currentTarget)
    const value = Object.fromEntries(data.entries())
    const finalData = { ...value }

    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || 'Registration failed')
        }
        return data
      })
      .then((data) => {
        notification.success(data.message || 'Successfully registered')
        setLoading(false)
        router.push('/signin')
      })
      .catch((err) => {
        notification.error(err.message || 'Registration failed')
        setLoading(false)
      })
  }

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true)
      console.log('Starting Google sign-up process...')

      // Use a more detailed signIn call with callback options
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false, // Prevent automatic redirect to handle errors
      })

      console.log('Google sign-up result:', result)

      if (result?.error) {
        notification.error(`Authentication failed: ${result.error}`)
        console.error('Google sign-up failed:', result.error)
      } else if (result?.ok) {
        notification.success('Successfully signed up with Google!')
        router.push(result.url || '/')
      }
    } catch (error) {
      console.error('Google sign-up error:', error)
      notification.error('Failed to sign up with Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-8 text-center">
        <Logo />
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Create Account
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-xs">
        Join Freshmart to discover fresh products and convenient shopping
      </p>

      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon
                  icon="ph:user"
                  className="text-gray-400"
                  width={20}
                  height={20}
                />
              </div>
              <input
                id="name"
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-gray-700 dark:text-gray-200 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon
                  icon="ph:envelope"
                  className="text-gray-400"
                  width={20}
                  height={20}
                />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-gray-700 dark:text-gray-200 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon
                  icon="ph:lock"
                  className="text-gray-400"
                  width={20}
                  height={20}
                />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-10 py-2.5 text-gray-700 dark:text-gray-200 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:placeholder-gray-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Icon
                    icon={showPassword ? 'ph:eye-slash' : 'ph:eye'}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="terms"
              className="block text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <a
                href="/#"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/#"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70">
            {loading ? <Loader /> : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="mx-4 flex-shrink text-gray-500 dark:text-gray-400 text-sm">
            or
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-70">
          {googleLoading ? (
            <Loader />
          ) : (
            <>
              <Icon
                icon="flat-color-icons:google"
                className="mr-2"
                width={20}
                height={20}
              />
              Sign up with Google
            </>
          )}
        </button>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
