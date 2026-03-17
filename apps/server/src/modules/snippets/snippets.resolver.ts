import { builder } from "../../lib/builder"
import { snippetsService } from "./snippets.service"
import { VisibilityRef } from "./snippets.type"

const CreateSnippetInput = builder.inputType("CreateSnippetInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    description: t.string(),
    code: t.string({ required: true }),
    language: t.string({ required: true }),
    visibility: t.field({ type: VisibilityRef, required: true }),
    tags: t.stringList(),
  }),
})

const UpdateSnippetInput = builder.inputType("UpdateSnippetInput", {
  fields: (t) => ({
    title: t.string(),
    description: t.string(),
    code: t.string(),
    language: t.string(),
    visibility: t.field({ type: VisibilityRef }),
    tags: t.stringList(),
  }),
})

builder.queryFields((t) => ({
  snippet: t.prismaField({
    type: "Snippet",
    nullable: true,
    args: { slug: t.arg.string({ required: true }) },
    resolve: (_, __, args) => snippetsService.findBySlug(args.slug),
  }),

  snippetById: t.prismaField({
    type: "Snippet",
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: (_, __, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return snippetsService.findById(String(args.id), ctx.userId)
    },
  }),

  snippets: t.prismaField({
    type: ["Snippet"],
    args: {
      search: t.arg.string(),
      language: t.arg.string(),
      tag: t.arg.string(),
      visibility: t.arg({ type: VisibilityRef }),
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: (_, __, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return snippetsService.findMany({
        userId: ctx.userId,
        search: args.search,
        language: args.language,
        tag: args.tag,
        visibility: args.visibility as "PUBLIC" | "PRIVATE" | null | undefined,
        limit: args.limit,
        offset: args.offset,
      })
    },
  }),

  publicSnippets: t.prismaField({
    type: ["Snippet"],
    args: {
      search: t.arg.string(),
      language: t.arg.string(),
      tag: t.arg.string(),
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: (_, __, args) => snippetsService.findPublic(args),
  }),
}))

builder.mutationFields((t) => ({
  createSnippet: t.prismaField({
    type: "Snippet",
    args: { input: t.arg({ type: CreateSnippetInput, required: true }) },
    resolve: (_, __, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return snippetsService.create(ctx.userId, {
        ...args.input,
        visibility: args.input.visibility as "PUBLIC" | "PRIVATE",
        tags: args.input.tags ?? undefined,
      })
    },
  }),

  updateSnippet: t.prismaField({
    type: "Snippet",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateSnippetInput, required: true }),
    },
    resolve: (_, __, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return snippetsService.update(String(args.id), ctx.userId, {
        title: args.input.title ?? undefined,
        description: args.input.description,
        code: args.input.code ?? undefined,
        language: args.input.language ?? undefined,
        visibility: args.input.visibility as "PUBLIC" | "PRIVATE" | undefined,
        tags: args.input.tags ?? undefined,
      } as Parameters<typeof snippetsService.create>[1])
    },
  }),

  deleteSnippet: t.field({
    type: "Boolean",
    args: { id: t.arg.id({ required: true }) },
    resolve: (_, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return snippetsService.delete(String(args.id), ctx.userId)
    },
  }),
}))
