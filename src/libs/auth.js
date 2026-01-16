// Third-party Imports
import CredentialsProvider from 'next-auth/providers/credentials'
import AuthService from '@/services/authService'
import NextAuth, { CredentialsSignin } from 'next-auth'


class InvalidLoginError extends CredentialsSignin {
  code = "custom";
  constructor(message) {
    super(message);
    this.code = message;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await AuthService.login({ 
            email: credentials.email, 
            password: credentials.password 
          })

          if (res.statusCode !== 200) {
            throw new InvalidLoginError(res.message || 'Login failed');
          }
          
          // Ensure we return a proper user object
          if (res && res.data) {
            return {
              id: res.data.user.id || res.data.user._id,
              email: res.data.user.email,
              accessToken: res.data.accessToken,
              user: res.data.user
            }
          }
          
          return null
        } catch (error) {
          console.error('Auth error:', error)
          throw new InvalidLoginError(error.response?.data?.message || 'Login failed');
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60 // 1 days
  },
  pages: {
    signIn: '/login',
    error: '/auth/error2'
  },
  // trustHosts: ['http://localhost:8000',  'https://gamsgroup.in'],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // when login succeeds
        token.accessToken = user.accessToken
        token.user = user.user 
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
      }
      if (token?.user) {
        session.user = token.user
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET
})
