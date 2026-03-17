import Fastify from "fastify"
import mercurius from "mercurius"
import { corsPlugin } from "./plugins/cors"
import { authPlugin } from "./plugins/auth"
import { schema } from "./graphql/schema"

const app = Fastify({
  logger: {
    transport:
      process.env.NODE_ENV === "development"
        ? { target: "pino-pretty" }
        : undefined,
  },
})

async function bootstrap() {
  await corsPlugin(app)
  await authPlugin(app)

  app.get("/health", async () => ({ status: "ok" }))

  await app.register(mercurius, {
    schema,
    graphiql: process.env.NODE_ENV === "development",
    context: async (request) => {
      try {
        const payload = await request.jwtVerify<{ userId: string }>()
        return { userId: payload.userId }
      } catch {
        return { userId: null }
      }
    },
  })

  const port = Number(process.env.PORT) || Number(process.env.SERVER_PORT) || 3001
  await app.listen({ port, host: "0.0.0.0" })
  app.log.info(`Server running on http://localhost:${port}`)
}

bootstrap().catch((err) => {
  process.stderr.write(`${err}\n`)
  process.exit(1)
})
