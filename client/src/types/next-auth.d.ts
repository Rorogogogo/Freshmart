import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      accessToken: string
      roles?: string[]
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    accessToken: string
    roles?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    accessToken: string
    roles?: string[]
  }
}
