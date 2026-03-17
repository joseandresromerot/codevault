import { builder } from "../../lib/builder"

export const VisibilityRef = builder.enumType("Visibility", {
  values: {
    PUBLIC: { value: "PUBLIC" },
    PRIVATE: { value: "PRIVATE" },
  },
})

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    username: t.exposeString("username", { nullable: true }),
    bio: t.exposeString("bio", { nullable: true }),
    image: t.exposeString("image", { nullable: true }),
    createdAt: t.field({ type: "String", resolve: (u) => u.createdAt.toISOString() }),
    snippets: t.relation("snippets"),
    collections: t.relation("collections"),
  }),
})

builder.prismaObject("Tag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
})

builder.prismaObject("Snippet", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    code: t.exposeString("code"),
    language: t.exposeString("language"),
    visibility: t.expose("visibility", { type: VisibilityRef }),
    slug: t.exposeString("slug"),
    createdAt: t.field({ type: "String", resolve: (s) => s.createdAt.toISOString() }),
    updatedAt: t.field({ type: "String", resolve: (s) => s.updatedAt.toISOString() }),
    user: t.relation("user"),
    tags: t.relation("tags"),
    collections: t.relation("collections"),
  }),
})

builder.prismaObject("SnippetTag", {
  fields: (t) => ({
    tag: t.relation("tag"),
  }),
})

builder.prismaObject("Collection", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description", { nullable: true }),
    createdAt: t.field({ type: "String", resolve: (c) => c.createdAt.toISOString() }),
    user: t.relation("user"),
    snippets: t.relation("snippets"),
  }),
})

builder.prismaObject("CollectionItem", {
  fields: (t) => ({
    snippet: t.relation("snippet"),
  }),
})
