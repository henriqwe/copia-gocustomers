import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables
} from '@apollo/client'
import {
  $,
  useTypedMutation,
  useTypedQuery
} from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'

type ListContextProps = {
  outGoingOrdersData?: {
    Id: string
    Situacao: {
      Comentario: string
    }
    DataAbertura: Date
  }[]

  outGoingOrdersRefetch: () => void
  outGoingOrdersLoading: boolean
  softDeleteOutgoingOrderLoading: boolean
  softDeleteOutgoingOrder: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeSaida_Pedidos_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
}

type ProviderProps = {
  children: ReactNode
}

export const ListContext = createContext<ListContextProps>(
  {} as ListContextProps
)

export const ListProvider = ({ children }: ProviderProps) => {
  const [softDeleteOutgoingOrder, { loading: softDeleteOutgoingOrderLoading }] =
    useTypedMutation({
      update_pedidosDeSaida_Pedidos_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            deleted_at: new Date()
          }
        },
        {
          Id: true
        }
      ]
    })

  const {
    data: outGoingOrdersData,
    refetch: outGoingOrdersRefetch,
    loading: outGoingOrdersLoading
  } = useTypedQuery(
    {
      pedidosDeSaida_Pedidos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Situacao: {
            Comentario: true
          },
          DataAbertura: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        outGoingOrdersData: outGoingOrdersData?.pedidosDeSaida_Pedidos,
        outGoingOrdersRefetch,
        outGoingOrdersLoading,
        softDeleteOutgoingOrderLoading,
        softDeleteOutgoingOrder
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
