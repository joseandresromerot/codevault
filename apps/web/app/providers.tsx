"use client"

import { UrqlProvider, ssrExchange } from "@urql/next"
import { cacheExchange, createClient, fetchExchange } from "urql"
import { useEffect, useMemo, useState } from "react"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [tokenReady, setTokenReady] = useState(false)

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch("/api/auth/token")
      if (res.ok) {
        const data = await res.json()
        setToken(data.token ?? null)
      }
      setTokenReady(true)
    }
    fetchToken()
  }, [])

  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({ isClient: true })
    const client = createClient({
      url: process.env.NEXT_PUBLIC_API_URL + "/graphql",
      exchanges: [cacheExchange, ssr, fetchExchange],
      fetchOptions: () => ({
        headers: token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>),
      }),
    })
    return [client, ssr]
  }, [token])

  if (!tokenReady) return null

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  )
}
