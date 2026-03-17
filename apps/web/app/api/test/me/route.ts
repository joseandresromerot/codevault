import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const GET = async () => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  return NextResponse.json({ userId: session.user.id })
}
