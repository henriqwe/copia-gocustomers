import {
  ApolloCache,
  ApolloError,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import * as yup from 'yup'

import { useTypedMutation, $ } from 'graphql/generated/zeus/apollo'

import { createContext, useContext, ReactNode } from 'react'
import { CPFValidation, CNPJValidation } from 'utils/validation'

type CreateContextProps = {
  createProvider: (
    options?: MutationFunctionOptions<
      {
        CadastrarFornecedor?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  createProviderLoading: boolean
  createProviderError: ApolloError | undefined
  CPFSchema: any
  CNPJSchema: any
}

export const CreateContext = createContext<CreateContextProps>(
  {} as CreateContextProps
)

type ProviderProps = {
  children: ReactNode
}

export const CreateProvider = ({ children }: ProviderProps) => {
  const [
    createProvider,
    { loading: createProviderLoading, error: createProviderError }
  ] = useTypedMutation({
    CadastrarFornecedor: [
      {
        Identificador: $`Identificador`,
        PessoaJuridica: $`PessoaJuridica`
      },
      {
        Id: true
      }
    ]
  })

  const CPFSchema = yup.object().shape({
    Identificador: yup
      .string()
      .required('Preencha o campo para continuar')
      .test('equal', 'Complete todos os campos', (val: string | undefined) => {
        return val?.toString().substring(13, 15) !== '_'
      })
      .test('equal', 'Digite um cpf válido', (val: string | undefined) => {
        return CPFValidation(val as string)
      })
  })

  const CNPJSchema = yup.object().shape({
    Identificador: yup
      .string()
      .required('Preencha o campo para continuar')
      .test('equal', 'Complete todos os campos', (val: string | undefined) => {
        return val?.toString().substring(17, 18) !== '_'
      })
      .test('equal', 'Digite um cnpj válido', (val: string | undefined) => {
        return CNPJValidation(val as string)
      })
  })

  return (
    <CreateContext.Provider
      value={{
        CPFSchema,
        CNPJSchema,
        createProvider,
        createProviderLoading,
        createProviderError
      }}
    >
      {children}
    </CreateContext.Provider>
  )
}

export const useCreate = () => {
  return useContext(CreateContext)
}
