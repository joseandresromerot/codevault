// Import all types and resolvers so they register with the builder
import "../modules/snippets/snippets.type"
import "../modules/snippets/snippets.resolver"
import "../modules/collections/collections.resolver"
import "../modules/tags/tags.resolver"

import { builder } from "../lib/builder"

export const schema = builder.toSchema()
