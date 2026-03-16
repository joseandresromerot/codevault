import { builder } from "../../lib/builder"
import { prisma } from "../../lib/prisma"

builder.queryFields((t) => ({
  tags: t.prismaField({
    type: ["Tag"],
    resolve: () => prisma.tag.findMany({ orderBy: { name: "asc" } }),
  }),
}))
