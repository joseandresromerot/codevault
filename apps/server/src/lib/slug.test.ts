import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("./prisma", () => ({
  prisma: {
    snippet: {
      count: vi.fn(),
    },
  },
}))

import { generateSlug } from "./slug"
import { prisma } from "./prisma"

describe("generateSlug", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("converts title to lowercase hyphenated slug", async () => {
    vi.mocked(prisma.snippet.count).mockResolvedValue(0)
    const slug = await generateSlug("My Awesome Snippet")
    expect(slug).toBe("my-awesome-snippet")
  })

  it("removes special characters", async () => {
    vi.mocked(prisma.snippet.count).mockResolvedValue(0)
    const slug = await generateSlug("Hello, World! @#$%")
    expect(slug).not.toMatch(/[,!@#$%]/)
  })

  it("trims leading and trailing whitespace", async () => {
    vi.mocked(prisma.snippet.count).mockResolvedValue(0)
    const slug = await generateSlug("  my snippet  ")
    expect(slug).toBe("my-snippet")
  })

  it("truncates slug to 50 characters", async () => {
    vi.mocked(prisma.snippet.count).mockResolvedValue(0)
    const slug = await generateSlug("a".repeat(100))
    expect(slug.length).toBeLessThanOrEqual(50)
  })

  it("appends timestamp when slug already exists", async () => {
    vi.mocked(prisma.snippet.count).mockResolvedValue(1)
    const slug = await generateSlug("my snippet")
    expect(slug).toMatch(/^my-snippet-\d+$/)
  })

  it("returns base slug when no collision", async () => {
    vi.mocked(prisma.snippet.count).mockResolvedValue(0)
    const slug = await generateSlug("fetch api example")
    expect(slug).toBe("fetch-api-example")
  })
})
