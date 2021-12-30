import {
  ApolloCache,
  ApolloError,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'

import {
  useTypedMutation,
  $,
  useTypedQuery
} from 'graphql/generated/zeus/apollo'
import * as yup from 'yup'

import { useRouter } from 'next/router'
import { createContext, useContext, ReactNode } from 'react'

type UpdateContextProps = {
  providerData?: {
    Id: string
    Pessoa: {
      Id: string
      Identificador: string
      Nome: string
      PessoaJuridica: boolean
      DadosDaApi: {
        razaoSocial: string
        alias: string
      }
    }
    PrecoDoKm: number
    PrestadorDeServico: boolean
  }
  providerLoading: boolean
  providerRefetch: () => void
  updatePerson: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Pessoas_by_pk?: {
          Id: string
        }
        update_identidades_Fornecedores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  updatePersonLoading: boolean
  updatePersonError: ApolloError | undefined
  pessoaSchema: any
}

export const UpdateContext = createContext<UpdateContextProps>(
  {} as UpdateContextProps
)

type ProviderProps = {
  children: ReactNode
}

export const UpdateProvider = ({ children }: ProviderProps) => {
  const { query } = useRouter()

  const {
    data: providerData,
    loading: providerLoading,
    refetch: providerRefetch
  } = useTypedQuery(
    {
      identidades_Fornecedores_by_pk: [
        {
          Id: query.id
        },
        {
          Id: true,
          Pessoa: {
            Id: true,
            Identificador: true,
            Nome: true,
            DadosDaApi: true,
            PessoaJuridica: true
          },
          PrecoDoKm: true,
          PrestadorDeServico: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const [
    updatePerson,
    { loading: updatePersonLoading, error: updatePersonError }
  ] = useTypedMutation({
    update_identidades_Pessoas_by_pk: [
      {
        pk_columns: {
          Id: $`Id`
        },
        _set: {
          Nome: $`Nome`,
          Identificador: $`Identificador`,
          DadosDaApi: $`DadosDaApi`
        }
      },
      {
        Id: true
      }
    ],
    update_identidades_Fornecedores_by_pk: [
      {
        pk_columns: { Id: $`Fornecedor_Id` },
        _set: {
          PrecoDoKm: $`PrecoDoKm`,
          PrestadorDeServico: $`PrestadorDeServico`
        }
      },
      {
        Id: true
      }
    ]
  })

  const pessoaSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Identificador: yup.string().required('Preencha o campo para continuar'),
    RazaoSocial: providerData?.identidades_Fornecedores_by_pk?.Pessoa
      .PessoaJuridica
      ? yup.string().required('Preencha o campo para continuar')
      : yup.string()
  })

  return (
    <UpdateContext.Provider
      value={{
        providerData: providerData?.identidades_Fornecedores_by_pk,
        providerLoading,
        providerRefetch,
        updatePerson,
        updatePersonLoading,
        updatePersonError,
        pessoaSchema
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
