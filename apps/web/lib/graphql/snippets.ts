import { gql } from "urql"

export const GET_SNIPPETS = gql`
  query GetSnippets($search: String, $language: String, $tag: String) {
    snippets(search: $search, language: $language, tag: $tag) {
      id
      title
      description
      code
      language
      visibility
      slug
      createdAt
      tags {
        tag {
          id
          name
        }
      }
    }
  }
`

export const GET_SNIPPET = gql`
  query GetSnippet($slug: String!) {
    snippet(slug: $slug) {
      id
      title
      description
      code
      language
      visibility
      slug
      createdAt
      updatedAt
      user {
        name
        username
        image
      }
      tags {
        tag {
          id
          name
        }
      }
    }
  }
`

export const CREATE_SNIPPET = gql`
  mutation CreateSnippet($input: CreateSnippetInput!) {
    createSnippet(input: $input) {
      id
      slug
      title
      language
    }
  }
`

export const UPDATE_SNIPPET = gql`
  mutation UpdateSnippet($id: ID!, $input: UpdateSnippetInput!) {
    updateSnippet(id: $id, input: $input) {
      id
      slug
      title
      language
    }
  }
`

export const DELETE_SNIPPET = gql`
  mutation DeleteSnippet($id: ID!) {
    deleteSnippet(id: $id)
  }
`
