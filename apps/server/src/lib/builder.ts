import SchemaBuilder from "@pothos/core"
import PrismaPlugin from "@pothos/plugin-prisma"
import type PrismaTypes from "./pothos-types"
import { prisma } from "./prisma"
import { Prisma } from "@prisma/client"

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: {
    userId: string | null
  }
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
})

builder.queryType({})
builder.mutationType({})
