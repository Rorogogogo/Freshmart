import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'

// Extend session types with custom properties
interface ExtendedSession extends Session {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    accessToken: string
  }
}

// Create the API route handler
const handler = NextAuth({
  providers: [
    // Google provider
    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        '611965747312-htoflcsn0dtn1lpvl9hq8k6uska446r0.apps.googleusercontent.com',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        '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',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // Credentials provider for email/password
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Make a request to your API server for authentication
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5118'
            }/api/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          )

          const data = await res.json()

          if (data.success) {
            // Return the user data to be stored in the session
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              name: `${data.data.user.firstName} ${data.data.user.lastName}`,
              image: data.data.user.imageUrl,
              accessToken: data.data.token,
            }
          }

          // Check for specific error messages and provide more user-friendly errors
          if (data.message && data.message.includes('not confirmed')) {
            throw new Error(
              'Email not confirmed. Please check your inbox for the confirmation email.'
            )
          } else if (data.message && data.message.includes('locked')) {
            throw new Error(
              'Account is temporarily locked. Please try again later.'
            )
          }

          // If authentication failed with other reasons
          throw new Error(data.message || 'Authentication failed')
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/signin',
  },
  callbacks: {
    // Handle the sign-in callback (important for Google provider)
    async signIn({ user, account, profile }) {
      // If it's a Google sign-in
      if (account?.provider === 'google' && profile?.email) {
        try {
          console.log('Google sign-in attempt with profile:', profile)

          // Make a request to your backend Google login endpoint
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5118'
            }/api/auth/google-login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                idToken: account.id_token,
              }),
            }
          )

          const data = await response.json()
          console.log('Backend response for Google login:', data)

          if (data.success) {
            // Store token from your backend in the user object
            user.accessToken = data.data.token
            user.id = data.data.user.id
            user.name = `${data.data.user.firstName} ${data.data.user.lastName}`
            user.image = data.data.user.imageUrl

            return true
          }

          console.error('Google login failed:', data.message)
          return false
        } catch (error) {
          console.error('Error during Google login:', error)
          return false
        }
      }

      return true
    },

    // Callback when JWT is created/updated
    async jwt({ token, user, account }) {
      // When new sign in
      if (user) {
        token.id = user.id
        token.accessToken = (user as any).accessToken

        // For Google sign-in, set email from user
        if (account?.provider === 'google') {
          token.email = user.email
        }
      }
      return token
    },

    // Callback to customize session object
    async session({
      session,
      token,
    }: {
      session: any
      token: JWT
    }): Promise<ExtendedSession> {
      if (session.user) {
        session.user.id = token.id as string
        session.user.accessToken = token.accessToken as string
      }
      return session as ExtendedSession
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true, // Enable debugging for all environments to see what's happening
  secret: process.env.NEXTAUTH_SECRET || 'freshmart-secret-key',
})

export { handler as GET, handler as POST }
