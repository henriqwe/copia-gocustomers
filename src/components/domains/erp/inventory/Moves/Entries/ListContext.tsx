import { useTypedQuery } from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'

type ListContextProps = {
  purchaseOrdersData?: {
    Id: string
    Situacao: {
      Comentario: string
    }
    Solicitante_Id: string
  }[]

  purchaseOrdersRefetch: () => void
  purchaseOrdersLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const ListContext = createContext<ListContextProps>(
  {} as ListContextProps
)

export const ListProvider = ({ children }: ProviderProps) => {
  const {
    data: purchaseOrdersData,
    refetch: purchaseOrdersRefetch,
    loading: purchaseOrdersLoading
  } = useTypedQuery(
    {
      pedidosDeCompra_Pedidos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Situacao_Id: { _eq: 'recebido' }
          }
        },
        {
          Id: true,
          Situacao: {
            Comentario: true
          },
          Solicitante_Id: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        purchaseOrdersData: purchaseOrdersData?.pedidosDeCompra_Pedidos,
        purchaseOrdersRefetch,
        purchaseOrdersLoading
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
