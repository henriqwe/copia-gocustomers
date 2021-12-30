import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import {
  useTypedMutation,
  useTypedQuery,
  $
} from 'graphql/generated/zeus/apollo'
import { createContext, useContext, ReactNode } from 'react'

type ListContextProps = {
  providersData?: {
    Id: string
    Pessoa?: {
      Id: string
      Identificador: string
      Nome: string
    }
  }[]
  providersRefetch: () => void
  providersLoading: boolean
  softDeleteProvider: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Fornecedores_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  softDeleteProviderLoading: boolean
}

export const ListContext = createContext<ListContextProps>(
  {} as ListContextProps
)

type ProviderProps = {
  children: ReactNode
}

export const ListProvider = ({ children }: ProviderProps) => {
  const {
    data: providersData,
    refetch: providersRefetch,
    loading: providersLoading
  } = useTypedQuery(
    {
      identidades_Fornecedores: [
        {
          order_by: [
            {
              created_at: 'desc'
            }
          ],
          where: {
            deleted_at: {
              _is_null: true
            }
          }
        },
        {
          Id: true,
          Pessoa_Id: true,
          Pessoa: {
            Id: true,
            Identificador: true,
            Nome: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const [softDeleteProvider, { loading: softDeleteProviderLoading }] =
    useTypedMutation({
      update_identidades_Fornecedores_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: { deleted_at: new Date() }
        },
        {
          Id: true
        }
      ]
    })

  return (
    <ListContext.Provider
      value={{
        providersData: providersData?.identidades_Fornecedores,
        providersRefetch,
        providersLoading,
        softDeleteProvider,
        softDeleteProviderLoading
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
