"use client"

import { UrqlProvider, ssrExchange } from "@urql/next"
import { cacheExchange, createClient, fetchExchange } from "urql"
import { useMemo } from "react"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({ isClient: true })
    const client = createClient({
      url: process.env.NEXT_PUBLIC_API_URL + "/graphql",
      exchanges: [cacheExchange, ssr, fetchExchange],
      fetchOptions: { credentials: "include" },
    })
    return [client, ssr]
  }, [])

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  )
}
