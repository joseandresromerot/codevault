import { prisma } from "@/lib/prisma"
import { encode } from "@auth/core/jwt"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const GET = async () => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 })
  }

  const user = await prisma.user.upsert({
    where: { email: "e2e@test.com" },
    update: {},
    create: {
      email: "e2e@test.com",
      name: "E2E User",
    },
  })

  const token = await encode({
    token: {
      sub: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    secret: process.env.AUTH_SECRET!,
    salt: "authjs.session-token",
  })

  const cookieStore = await cookies()
  cookieStore.set("authjs.session-token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL ?? "http://localhost:3000"))
}
