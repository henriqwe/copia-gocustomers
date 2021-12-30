import { useTypedQuery } from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'

type ListContextProps = {
  outgoingOrdersData?: {
    Id: string
    Solicitante_Id: string
    Situacao: {
      Comentario: string
    }
  }[]

  outgoingOrdersRefetch: () => void
  outgoingOrdersLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const ListContext = createContext<ListContextProps>(
  {} as ListContextProps
)

export const ListProvider = ({ children }: ProviderProps) => {
  const {
    data: outgoingOrdersData,
    refetch: outgoingOrdersRefetch,
    loading: outgoingOrdersLoading
  } = useTypedQuery(
    {
      pedidosDeSaida_Pedidos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true },
            Situacao: {
              Valor: { _in: ['autorizado', 'entradaParcial'] }
            }
          }
        },
        {
          Id: true,
          Solicitante_Id: true,
          Situacao: {
            Comentario: true
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        outgoingOrdersData: outgoingOrdersData?.pedidosDeSaida_Pedidos,
        outgoingOrdersRefetch,
        outgoingOrdersLoading
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
