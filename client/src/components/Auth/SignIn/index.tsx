'use client'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useNotification } from '@/contexts/NotificationContext'
import Logo from '@/components/Layout/Header/Logo'
import Loader from '@/components/Common/Loader'
import { Icon } from '@iconify/react/dist/iconify.js'

const Signin = () => {
  const router = useRouter()
  const notification = useNotification()

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    checkboxToggle: false,
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const loginUser = (e: any) => {
    e.preventDefault()

    setLoading(true)
    signIn('credentials', { ...loginData, redirect: false })
      .then((callback) => {
        if (callback?.error) {
          notification.error(callback?.error)
          console.log(callback?.error)
          setLoading(false)
          return
        }

        if (callback?.ok && !callback?.error) {
          notification.success('Login successful')
          setLoading(false)
          router.push('/')
        }
      })
      .catch((err) => {
        setLoading(false)
        console.log(err.message)
        notification.error(err.message)
      })
  }

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true)
      console.log('Starting Google sign-in process...')

      // Use a more detailed signIn call with callback options
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false, // Prevent automatic redirect to handle errors
      })

      console.log('Google sign-in result:', result)

      if (result?.error) {
        notification.error(`Authentication failed: ${result.error}`)
        console.error('Google sign-in failed:', result.error)
      } else if (result?.ok) {
        notification.success('Successfully signed in with Google!')
        router.push(result.url || '/')
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      notification.error('Failed to sign in with Google')
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
        Welcome Back
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-xs">
        Sign in to your account to continue your shopping experience
      </p>

      <div className="w-full max-w-sm">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 w-full">
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
                placeholder="you@example.com"
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
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
                placeholder="••••••••"
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
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

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    checkboxToggle: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Forgot password?
            </Link>
          </div>

          <button
            onClick={loginUser}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70">
            {loading ? <Loader /> : 'Sign In'}
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
          onClick={handleGoogleSignIn}
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
              Sign in with Google
            </>
          )}
        </button>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account yet?{' '}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signin
