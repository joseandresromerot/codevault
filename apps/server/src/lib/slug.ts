import { prisma } from "./prisma"

export const generateSlug = async (title: string): Promise<string> => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50)

  const existing = await prisma.snippet.count({ where: { slug: { startsWith: base } } })
  return existing === 0 ? base : `${base}-${Date.now()}`
}
