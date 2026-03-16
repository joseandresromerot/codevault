import { auth } from "@/lib/auth"
import { createHmac } from "crypto"
import { NextResponse } from "next/server"

const base64url = (str: string) =>
  Buffer.from(str).toString("base64url")

const signJwt = (payload: object, secret: string): string => {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = base64url(JSON.stringify(payload))
  const data = `${header}.${body}`
  const sig = createHmac("sha256", secret).update(data).digest("base64url")
  return `${data}.${sig}`
}

export const GET = async () => {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = signJwt(
    { userId: session.user.id, exp: Math.floor(Date.now() / 1000) + 3600 },
    process.env.JWT_SECRET!
  )

  return NextResponse.json({ token })
}
