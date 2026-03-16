import { prisma } from "../../lib/prisma"

type CreateCollectionInput = {
  name: string
  description?: string | null
}

type UpdateCollectionInput = {
  name?: string
  description?: string | null
}

export const collectionsService = {
  findById: (id: string, userId: string) =>
    prisma.collection.findFirst({
      where: { id, userId },
      include: { user: true, snippets: { include: { snippet: true } } },
    }),

  findByUser: (userId: string) =>
    prisma.collection.findMany({
      where: { userId },
      include: { user: true, snippets: { include: { snippet: true } } },
      orderBy: { createdAt: "desc" },
    }),

  create: (userId: string, input: CreateCollectionInput) =>
    prisma.collection.create({
      data: { ...input, userId },
      include: { user: true, snippets: { include: { snippet: true } } },
    }),

  update: async (id: string, userId: string, input: UpdateCollectionInput) => {
    const collection = await prisma.collection.findFirst({ where: { id, userId } })
    if (!collection) throw new Error("Collection not found or unauthorized")

    return prisma.collection.update({
      where: { id },
      data: input,
      include: { user: true, snippets: { include: { snippet: true } } },
    })
  },

  delete: async (id: string, userId: string) => {
    const collection = await prisma.collection.findFirst({ where: { id, userId } })
    if (!collection) throw new Error("Collection not found or unauthorized")

    await prisma.collection.delete({ where: { id } })
    return true
  },

  addSnippet: async (collectionId: string, snippetId: string, userId: string) => {
    const collection = await prisma.collection.findFirst({ where: { id: collectionId, userId } })
    if (!collection) throw new Error("Collection not found or unauthorized")

    await prisma.collectionItem.upsert({
      where: { collectionId_snippetId: { collectionId, snippetId } },
      create: { collectionId, snippetId },
      update: {},
    })

    return prisma.collection.findUniqueOrThrow({
      where: { id: collectionId },
      include: { user: true, snippets: { include: { snippet: true } } },
    })
  },

  removeSnippet: async (collectionId: string, snippetId: string, userId: string) => {
    const collection = await prisma.collection.findFirst({ where: { id: collectionId, userId } })
    if (!collection) throw new Error("Collection not found or unauthorized")

    await prisma.collectionItem.delete({
      where: { collectionId_snippetId: { collectionId, snippetId } },
    })

    return prisma.collection.findUniqueOrThrow({
      where: { id: collectionId },
      include: { user: true, snippets: { include: { snippet: true } } },
    })
  },
}
