import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../../lib/prisma", () => ({
  prisma: {
    snippet: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    snippetTag: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock("../../lib/slug", () => ({
  generateSlug: vi.fn().mockResolvedValue("test-slug"),
}))

import { snippetsService } from "./snippets.service"
import { prisma } from "../../lib/prisma"

const mockSnippet = {
  id: "snippet-1",
  title: "Test Snippet",
  description: null,
  code: "console.log('hello')",
  language: "javascript",
  visibility: "PRIVATE" as const,
  slug: "test-slug",
  userId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  user: { id: "user-1", name: "Test User", email: "test@test.com" },
  tags: [],
  collections: [],
}

describe("snippetsService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("findBySlug", () => {
    it("calls prisma with correct slug", async () => {
      vi.mocked(prisma.snippet.findUnique).mockResolvedValue(mockSnippet as any)
      await snippetsService.findBySlug("test-slug")
      expect(prisma.snippet.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: "test-slug" } })
      )
    })
  })

  describe("findMany", () => {
    it("returns snippets for the given user", async () => {
      vi.mocked(prisma.snippet.findMany).mockResolvedValue([mockSnippet] as any)
      const result = await snippetsService.findMany({ userId: "user-1" })
      expect(prisma.snippet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ userId: "user-1" }) })
      )
      expect(result).toHaveLength(1)
    })

    it("filters by language when provided", async () => {
      vi.mocked(prisma.snippet.findMany).mockResolvedValue([])
      await snippetsService.findMany({ userId: "user-1", language: "typescript" })
      expect(prisma.snippet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ language: "typescript" }),
        })
      )
    })

    it("does not filter by language when not provided", async () => {
      vi.mocked(prisma.snippet.findMany).mockResolvedValue([])
      await snippetsService.findMany({ userId: "user-1" })
      const call = vi.mocked(prisma.snippet.findMany).mock.calls[0]?.[0]
      expect((call?.where as any)?.language).toBeUndefined()
    })
  })

  describe("create", () => {
    it("creates a snippet with generated slug", async () => {
      vi.mocked(prisma.snippet.create).mockResolvedValue(mockSnippet as any)
      await snippetsService.create("user-1", {
        title: "Test Snippet",
        code: "console.log('hello')",
        language: "javascript",
        visibility: "PRIVATE",
      })
      expect(prisma.snippet.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: "test-slug", userId: "user-1" }),
        })
      )
    })
  })

  describe("delete", () => {
    it("throws when snippet does not belong to user", async () => {
      vi.mocked(prisma.snippet.findFirst).mockResolvedValue(null)
      await expect(snippetsService.delete("snippet-1", "wrong-user")).rejects.toThrow(
        "Snippet not found or unauthorized"
      )
    })

    it("deletes the snippet when it belongs to the user", async () => {
      vi.mocked(prisma.snippet.findFirst).mockResolvedValue(mockSnippet as any)
      vi.mocked(prisma.snippet.delete).mockResolvedValue(mockSnippet as any)
      const result = await snippetsService.delete("snippet-1", "user-1")
      expect(prisma.snippet.delete).toHaveBeenCalledWith({ where: { id: "snippet-1" } })
      expect(result).toBe(true)
    })
  })

  describe("update", () => {
    it("throws when snippet does not belong to user", async () => {
      vi.mocked(prisma.snippet.findFirst).mockResolvedValue(null)
      await expect(snippetsService.update("snippet-1", "wrong-user", { title: "New title" })).rejects.toThrow(
        "Snippet not found or unauthorized"
      )
    })
  })
})
