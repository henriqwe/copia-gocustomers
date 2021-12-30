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
  purchaseOrderData?: {
    Id: string
    Solicitante_Id: string
    Situacao: {
      Comentario: string
    }
    DataAbertura: Date
  }[]

  purchaseOrderRefetch: () => void
  purchaseOrderLoading: boolean
  softDeletePurchaseOrderLoading: boolean
  softDeletePurchaseOrder: (
    options?: MutationFunctionOptions<
      {
        update_pedidosDeCompra_Pedidos_by_pk?: {
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
  const [softDeletePurchaseOrder, { loading: softDeletePurchaseOrderLoading }] =
    useTypedMutation({
      update_pedidosDeCompra_Pedidos_by_pk: [
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
    data: purchaseOrderData,
    refetch: purchaseOrderRefetch,
    loading: purchaseOrderLoading
  } = useTypedQuery(
    {
      pedidosDeCompra_Pedidos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Situacao: {
            Comentario: true
          },
          Solicitante_Id: true,
          DataAbertura: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        purchaseOrderData: purchaseOrderData?.pedidosDeCompra_Pedidos,
        purchaseOrderRefetch,
        purchaseOrderLoading,
        softDeletePurchaseOrderLoading,
        softDeletePurchaseOrder
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
