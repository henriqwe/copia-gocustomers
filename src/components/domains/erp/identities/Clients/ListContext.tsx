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
  clientsData?: {
    Id: string
    Pessoa?: {
      Id: string
      Identificador: string
      Nome: string
    }
    Tickets: {
      Id: string
    }[]
  }[]
  clientsRefetch: () => void
  clientsLoading: boolean
  softDeleteClient: (
    options?: MutationFunctionOptions<
      {
        update_identidades_Clientes_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  softDeleteClientLoading: boolean
}

export const ListContext = createContext<ListContextProps>(
  {} as ListContextProps
)

type ProviderProps = {
  children: ReactNode
}

export const ListProvider = ({ children }: ProviderProps) => {
  const {
    data: clientsData,
    refetch: clientsRefetch,
    loading: clientsLoading
  } = useTypedQuery(
    {
      identidades_Clientes: [
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
          },
          Tickets: [
            {},
            {
              Id: true
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  const [softDeleteClient, { loading: softDeleteClientLoading }] =
    useTypedMutation({
      update_identidades_Clientes_by_pk: [
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
        clientsData: clientsData?.identidades_Clientes,
        clientsRefetch,
        clientsLoading,
        softDeleteClient,
        softDeleteClientLoading
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
