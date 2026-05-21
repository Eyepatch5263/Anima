import type { TypedDocumentString } from './graphql'
 
export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
 
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
 
  const json = await response.json()
  
  if (json.errors) {
    throw new Error(json.errors[0].message || 'GraphQL Error')
  }

  return json.data as TResult
}