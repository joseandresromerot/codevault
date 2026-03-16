import type { FastifyInstance } from "fastify"
import cors from "@fastify/cors"

export const corsPlugin = async (app: FastifyInstance) => {
  await app.register(cors, {
    origin: process.env.WEB_URL ?? "http://localhost:3000",
    credentials: true,
  })
}
