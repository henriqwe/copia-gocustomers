import { useTypedQuery } from 'graphql/generated/zeus/apollo'
import { createContext, ReactNode, useContext } from 'react'

type ListContextProps = {
  MovesData?: {
    Data: Date
    Id: string
    Item: {
      Produto: {
        Nome: string
        UnidadeDeMedida_Id: string
      }
    }
    Quantidade: number
    Tipo: string
  }[]

  MovesRefetch: () => void
  MovesLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const ListContext = createContext<ListContextProps>(
  {} as ListContextProps
)

export const ListProvider = ({ children }: ProviderProps) => {
  const {
    data: MovesData,
    refetch: MovesRefetch,
    loading: MovesLoading
  } = useTypedQuery(
    {
      movimentacoes_Movimentacoes: [
        {
          order_by: [{ created_at: 'desc' }],
          where: {
            deleted_at: { _is_null: true }
          }
        },
        {
          Id: true,
          Data: true,
          Item: {
            Produto: {
              Nome: true,
              UnidadeDeMedida_Id: true
            }
          },
          Quantidade: true,
          Tipo: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        MovesData: MovesData?.movimentacoes_Movimentacoes,
        MovesRefetch,
        MovesLoading
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
