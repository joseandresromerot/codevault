import { builder } from "../../lib/builder"
import { collectionsService } from "./collections.service"

const CreateCollectionInput = builder.inputType("CreateCollectionInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string(),
  }),
})

const UpdateCollectionInput = builder.inputType("UpdateCollectionInput", {
  fields: (t) => ({
    name: t.string(),
    description: t.string(),
  }),
})

builder.queryFields((t) => ({
  collection: t.prismaField({
    type: "Collection",
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: (_, __, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return collectionsService.findById(String(args.id), ctx.userId)
    },
  }),

  collections: t.prismaField({
    type: ["Collection"],
    resolve: (_, __, _args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return collectionsService.findByUser(ctx.userId)
    },
  }),
}))

builder.mutationFields((t) => ({
  createCollection: t.prismaField({
    type: "Collection",
    args: { input: t.arg({ type: CreateCollectionInput, required: true }) },
    resolve: (_, __, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return collectionsService.create(ctx.userId, args.input)
    },
  }),

  updateCollection: t.prismaField({
    type: "Collection",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateCollectionInput, required: true }),
    },
    resolve: (_, __, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return collectionsService.update(String(args.id), ctx.userId, args.input)
    },
  }),

  deleteCollection: t.field({
    type: "Boolean",
    args: { id: t.arg.id({ required: true }) },
    resolve: (_, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return collectionsService.delete(String(args.id), ctx.userId)
    },
  }),

  addSnippetToCollection: t.prismaField({
    type: "Collection",
    args: {
      collectionId: t.arg.id({ required: true }),
      snippetId: t.arg.id({ required: true }),
    },
    resolve: (_, __, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return collectionsService.addSnippet(String(args.collectionId), String(args.snippetId), ctx.userId)
    },
  }),

  removeSnippetFromCollection: t.prismaField({
    type: "Collection",
    args: {
      collectionId: t.arg.id({ required: true }),
      snippetId: t.arg.id({ required: true }),
    },
    resolve: (_, __, args, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return collectionsService.removeSnippet(String(args.collectionId), String(args.snippetId), ctx.userId)
    },
  }),
}))
