"use client"

import { UrqlProvider, ssrExchange } from "@urql/next"
import { cacheExchange, createClient, fetchExchange } from "urql"
import { useEffect, useMemo, useRef } from "react"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const tokenRef = useRef<string | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch("/api/auth/token")
      if (res.ok) {
        const data = await res.json()
        tokenRef.current = data.token
      }
    }
    fetchToken()
  }, [])

  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({ isClient: true })
    const client = createClient({
      url: process.env.NEXT_PUBLIC_API_URL + "/graphql",
      exchanges: [cacheExchange, ssr, fetchExchange],
      fetchOptions: () => ({
        headers: tokenRef.current
          ? { Authorization: `Bearer ${tokenRef.current}` }
          : ({} as Record<string, string>),
      }),
    })
    return [client, ssr]
  }, [])

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  )
}
