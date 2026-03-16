import { gql } from "urql"

export const GET_COLLECTIONS = gql`
  query GetCollections {
    collections {
      id
      name
      description
      createdAt
      snippets {
        snippet {
          id
          language
        }
      }
    }
  }
`

export const GET_COLLECTION = gql`
  query GetCollection($id: ID!) {
    collection(id: $id) {
      id
      name
      description
      createdAt
      snippets {
        snippet {
          id
          title
          description
          code
          language
          slug
          visibility
          createdAt
          tags {
            tag {
              id
              name
            }
          }
        }
      }
    }
  }
`

export const CREATE_COLLECTION = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
      name
    }
  }
`

export const UPDATE_COLLECTION = gql`
  mutation UpdateCollection($id: ID!, $input: UpdateCollectionInput!) {
    updateCollection(id: $id, input: $input) {
      id
      name
      description
    }
  }
`

export const DELETE_COLLECTION = gql`
  mutation DeleteCollection($id: ID!) {
    deleteCollection(id: $id)
  }
`

export const ADD_SNIPPET_TO_COLLECTION = gql`
  mutation AddSnippetToCollection($collectionId: ID!, $snippetId: ID!) {
    addSnippetToCollection(collectionId: $collectionId, snippetId: $snippetId) {
      id
    }
  }
`

export const REMOVE_SNIPPET_FROM_COLLECTION = gql`
  mutation RemoveSnippetFromCollection($collectionId: ID!, $snippetId: ID!) {
    removeSnippetFromCollection(collectionId: $collectionId, snippetId: $snippetId) {
      id
    }
  }
`
