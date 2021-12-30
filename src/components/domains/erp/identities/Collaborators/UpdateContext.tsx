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
  collaboratorData?: {
    Id: string
    Pessoa: {
      Id: string
      Identificador: string
      Nome: string
      PessoaJuridica: boolean
    }
  }
  collaboratorLoading: boolean
  collaboratorRefetch: () => void
  updatePerson: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Pessoas_by_pk?: {
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
  collaboratorLogsData?: {
    Id: string
    created_at: string
    Operacao: string
  }[]
  collaboratorLogsLoading: boolean
  collaboratorLogsRefetch: () => void
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
    data: collaboratorData,
    loading: collaboratorLoading,
    refetch: collaboratorRefetch
  } = useTypedQuery(
    {
      identidades_Colaboradores_by_pk: [
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
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const {
    data: collaboratorLogsData,
    loading: collaboratorLogsLoading,
    refetch: collaboratorLogsRefetch
  } = useTypedQuery(
    {
      estoque_Logs: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { Tipo: { _eq: 'Colaboradores' }, Tipo_Id: { _eq: query.id } }
        },
        {
          Id: true,
          Operacao: true,
          created_at: true
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
    ]
  })
  const pessoaSchema = yup.object().shape({
    Nome: yup.string().required('Preencha o campo para continuar'),
    Identificador: yup.string().required('Preencha o campo para continuar'),
    RazaoSocial: collaboratorData?.identidades_Colaboradores_by_pk?.Pessoa
      .PessoaJuridica
      ? yup.string().required('Preencha o campo para continuar')
      : yup.string(),
    CEP: yup.string().required('Preencha o campo para continuar'),
    Logradouro: yup.string().required('Preencha o campo para continuar'),
    Numero: yup.string(),
    Bairro: yup.string().required('Preencha o campo para continuar'),
    Cidade: yup.string().required('Preencha o campo para continuar'),
    Estado: yup.string().required('Preencha o campo para continuar')
  })
  return (
    <UpdateContext.Provider
      value={{
        collaboratorData: collaboratorData?.identidades_Colaboradores_by_pk,
        collaboratorLoading,
        collaboratorRefetch,
        updatePerson,
        updatePersonLoading,
        updatePersonError,
        pessoaSchema,
        collaboratorLogsData: collaboratorLogsData?.estoque_Logs,
        collaboratorLogsLoading,
        collaboratorLogsRefetch
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
