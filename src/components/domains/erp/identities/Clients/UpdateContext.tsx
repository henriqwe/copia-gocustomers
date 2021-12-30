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
  clientData?: {
    Id: string
    Pessoa: {
      Id: string
      Identificador: string
      Nome: string
      DadosDaApi: {
        name: string
        nome: string
        razaoSocial: string
      }
      PessoaJuridica: boolean
    }
  }
  clientLoading: boolean
  clientRefetch: () => void
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
  clientLogsData?: {
    Id: string
    created_at: string
    Operacao: string
  }[]
  clientLogsLoading: boolean
  clientLogsRefetch: () => void
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
    data: clientData,
    loading: clientLoading,
    refetch: clientRefetch
  } = useTypedQuery(
    {
      identidades_Clientes_by_pk: [
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
    data: clientLogsData,
    loading: clientLogsLoading,
    refetch: clientLogsRefetch
  } = useTypedQuery(
    {
      estoque_Logs: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { Tipo: { _eq: 'Clientes' }, Tipo_Id: { _eq: query.id } }
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
    RazaoSocial: clientData?.identidades_Clientes_by_pk?.Pessoa.PessoaJuridica
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
        clientData: clientData?.identidades_Clientes_by_pk,
        clientLoading,
        clientRefetch,
        updatePerson,
        updatePersonLoading,
        updatePersonError,
        pessoaSchema,
        clientLogsData: clientLogsData?.estoque_Logs,
        clientLogsLoading,
        clientLogsRefetch
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

export const useUpdate = () => {
  return useContext(UpdateContext)
}
