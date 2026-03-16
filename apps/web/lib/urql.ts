import { createClient, cacheExchange, fetchExchange } from "urql"

export const urqlClient = createClient({
  url: process.env.NEXT_PUBLIC_API_URL + "/graphql",
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    credentials: "include",
  }),
})
