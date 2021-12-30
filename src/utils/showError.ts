import { ApolloError } from '@apollo/client'
import { GraphQLError } from 'graphql'
import { notification } from './notification'

function handleGraphqlError(errors: readonly GraphQLError[]) {
  errors.map((erroGraphQl) => {
    let message = erroGraphQl.message
    if (erroGraphQl.message.search('duplicate key') != -1) {
      message = 'Ops! Registro já existente no banco de dados'
    }
    notification(message, 'error')
  })
}

export function showError(erro: ApolloError) {
  if (erro.graphQLErrors?.length) {
    handleGraphqlError(erro.graphQLErrors)
    return
  }

  notification(erro.message, 'error')
}
