import { prisma } from "../../lib/prisma"
import { generateSlug } from "../../lib/slug"

type CreateSnippetInput = {
  title: string
  description?: string | null
  code: string
  language: string
  visibility: "PUBLIC" | "PRIVATE"
  tags?: string[]
}

type UpdateSnippetInput = {
  title?: string
  description?: string | null
  code?: string
  language?: string
  visibility?: "PUBLIC" | "PRIVATE"
  tags?: string[]
}

export const snippetsService = {
  findBySlug: (slug: string) =>
    prisma.snippet.findUnique({
      where: { slug },
      include: { user: true, tags: { include: { tag: true } }, collections: true },
    }),

  findMany: (args: {
    userId: string
    search?: string | null
    language?: string | null
    tag?: string | null
    visibility?: "PUBLIC" | "PRIVATE" | null
    limit?: number | null
    offset?: number | null
  }) => {
    const { userId, search, language, tag, visibility, limit = 20, offset = 0 } = args

    return prisma.snippet.findMany({
      where: {
        userId,
        ...(language && { language }),
        ...(visibility && { visibility }),
        ...(tag && { tags: { some: { tag: { name: tag } } } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: { user: true, tags: { include: { tag: true } }, collections: true },
      orderBy: { createdAt: "desc" },
      take: limit ?? 20,
      skip: offset ?? 0,
    })
  },

  findPublic: (args: {
    search?: string | null
    language?: string | null
    tag?: string | null
    limit?: number | null
    offset?: number | null
  }) => {
    const { search, language, tag, limit = 20, offset = 0 } = args

    return prisma.snippet.findMany({
      where: {
        visibility: "PUBLIC",
        ...(language && { language }),
        ...(tag && { tags: { some: { tag: { name: tag } } } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: { user: true, tags: { include: { tag: true } }, collections: true },
      orderBy: { createdAt: "desc" },
      take: limit ?? 20,
      skip: offset ?? 0,
    })
  },

  create: async (userId: string, input: CreateSnippetInput) => {
    const slug = await generateSlug(input.title)

    return prisma.snippet.create({
      data: {
        ...input,
        slug,
        userId,
        tags: input.tags
          ? {
              create: input.tags.map((name) => ({
                tag: {
                  connectOrCreate: { where: { name }, create: { name } },
                },
              })),
            }
          : undefined,
      },
      include: { user: true, tags: { include: { tag: true } }, collections: true },
    })
  },

  update: async (id: string, userId: string, input: UpdateSnippetInput) => {
    const snippet = await prisma.snippet.findFirst({ where: { id, userId } })
    if (!snippet) throw new Error("Snippet not found or unauthorized")

    return prisma.$transaction(async (tx) => {
      if (input.tags !== undefined) {
        await tx.snippetTag.deleteMany({ where: { snippetId: id } })
      }

      return tx.snippet.update({
        where: { id },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.code && { code: input.code }),
          ...(input.language && { language: input.language }),
          ...(input.visibility && { visibility: input.visibility }),
          ...(input.tags !== undefined && {
            tags: {
              create: input.tags.map((name) => ({
                tag: {
                  connectOrCreate: { where: { name }, create: { name } },
                },
              })),
            },
          }),
        },
        include: { user: true, tags: { include: { tag: true } }, collections: true },
      })
    })
  },

  delete: async (id: string, userId: string) => {
    const snippet = await prisma.snippet.findFirst({ where: { id, userId } })
    if (!snippet) throw new Error("Snippet not found or unauthorized")

    await prisma.snippet.delete({ where: { id } })
    return true
  },
}
