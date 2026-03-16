import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"

// Edge-compatible config — no Prisma adapter
export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = nextUrl.pathname.startsWith("/login")
      const isPublicSnippet = nextUrl.pathname.startsWith("/s/")

      if (!isLoggedIn && !isAuthPage && !isPublicSnippet) return false
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
  },
}
