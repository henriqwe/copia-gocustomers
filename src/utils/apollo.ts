import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useMemo } from 'react'
import fetch from 'cross-fetch'

let apolloClient: ApolloClient<NormalizedCacheObject>

function createApolloClient(usuario) {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_URL,
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
    },
    fetch
  })

  const authLink = setContext((_, { headers }) => {
    const authorization = `Bearer ${usuario?.signInUserSession.idToken.jwtToken}`
    //const x = `Bearer ${usuario?.signInUserSession.idToken.jwtToken}`
    return {
      headers: { ...headers, authorization, 'x-hasura-user-aplicacao': '1' }
    }
  })

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // serve para verificar se já existe uma instância, para não criar outra
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })
}

// TODO: Impementar funções do apollo passando a sessão/usuário`
// TYPEME
export function initializeApollo(initialState = {}, usuario) {
  // serve para verificar se já existe uma instância, para não criar outra
  const apolloClientGlobal = apolloClient ?? createApolloClient()
  // se a página usar o apolloClient no lado client
  // hidratamos o estado inicial aqui
  if (initialState) {
    apolloClientGlobal.cache.restore(initialState)
  }
  // sempre inicializando no SSR com cache limpo
  if (typeof window === 'undefined') return apolloClientGlobal
  // cria o apolloClient se estiver no client side
  apolloClient = apolloClient ?? apolloClientGlobal

  // FIXME estudar e corrigir condicioamento para o estado do apollo
  // return apolloClient
  return createApolloClient(usuario)
}

// TYPEME
export function useApollo(initialState = undefined, usuario) {
  const store = useMemo(
    () => initializeApollo(initialState, usuario),
    [initialState, usuario]
  )
  return store
}
