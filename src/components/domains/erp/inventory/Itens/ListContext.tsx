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
  itensData?: {
    Id: string
    Classificacao: string
    Criticidade: string
    EstoqueMinimo: number
    Familia: {
      Id: string
      Nome: string
    }
    Grupo: {
      Id: string
      Nome: string
    }
    Produto: {
      Id: string
      Nome: string
    }
    Fabricante: {
      Id: string
      Nome: string
    }
    Modelo?: {
      Id: string
      Nome: string
    }
    Movimentacoes: {
      Tipo: string
      Quantidade: number
    }[]
  }[]

  itensRefetch: () => void
  itensLoading: boolean
  softDeleteItemLoading: boolean
  softDeleteItem: (
    options?: MutationFunctionOptions<
      {
        update_estoque_Itens_by_pk?: {
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
  const [softDeleteItem, { loading: softDeleteItemLoading }] = useTypedMutation(
    {
      update_estoque_Itens_by_pk: [
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
    }
  )

  const {
    data: itensData,
    refetch: itensRefetch,
    loading: itensLoading
  } = useTypedQuery(
    {
      estoque_Itens: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Classificacao: true,
          Criticidade: true,
          EstoqueMinimo: true,
          Familia: {
            Id: true,
            Nome: true
          },
          Grupo: {
            Id: true,
            Nome: true
          },
          Produto: {
            Id: true,
            Nome: true
          },
          Fabricante: {
            Id: true,
            Nome: true
          },
          Modelo: {
            Id: true,
            Nome: true
          },
          Movimentacoes: [{}, { Tipo: true, Quantidade: true }]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        itensData: itensData?.estoque_Itens,
        itensRefetch,
        itensLoading,
        softDeleteItemLoading,
        softDeleteItem
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
