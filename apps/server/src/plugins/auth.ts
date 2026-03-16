import type { FastifyInstance, FastifyRequest } from "fastify"
import jwt from "@fastify/jwt"

export const authPlugin = async (app: FastifyInstance) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret",
  })
}

export const authenticate = async (request: FastifyRequest) => {
  await request.jwtVerify()
}
