import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Hardcoded credentials
        if (credentials?.username === "pk" && credentials?.password === "1122") {
          return {
            id: "1",
            name: "pk",
            email: "pk@devportal.com"
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = request.nextUrl.pathname.startsWith('/login')

      if (isOnLoginPage) {
        return true // Allow access to login page
      }

      return isLoggedIn // Require auth for all other pages
    },
  },
})
