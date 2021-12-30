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
  kitsTypesData?: {
    Id: string
    Nome: string
    Itens: {
      Id: string
      Quantidade: number
      Item: {
        Id: string
        Produto: {
          Nome: string
        }
        Fabricante: { Nome: string }
        Modelo?: { Nome: string }
        Movimentacoes: { Tipo: string; Quantidade: number }[]
        Grupo: { Nome: string }
        Familia: { Nome: string }
      }
    }[]
  }[]

  kitsTypesRefetch: () => void
  kitsTypesLoading: boolean
  softDeleteKitTypeLoading: boolean
  softDeleteKitType: (
    options?: MutationFunctionOptions<
      {
        update_producao_TiposDeKitDeInsumo_by_pk?: {
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
  const [softDeleteKitType, { loading: softDeleteKitTypeLoading }] =
    useTypedMutation({
      update_producao_TiposDeKitDeInsumo_by_pk: [
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
    data: kitsTypesData,
    refetch: kitsTypesRefetch,
    loading: kitsTypesLoading
  } = useTypedQuery(
    {
      producao_TiposDeKitDeInsumo: [
        { where: { deleted_at: { _is_null: true } } },
        {
          Id: true,
          Nome: true,
          Itens: [
            {},
            {
              Id: true,
              Quantidade: true,
              Item: {
                Id: true,
                Produto: { Nome: true },
                Fabricante: { Nome: true },
                Modelo: { Nome: true },
                Movimentacoes: [{}, { Tipo: true, Quantidade: true }],
                Grupo: { Nome: true },
                Familia: { Nome: true }
              }
            }
          ]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        kitsTypesData: kitsTypesData?.producao_TiposDeKitDeInsumo,
        kitsTypesRefetch,
        kitsTypesLoading,
        softDeleteKitTypeLoading,
        softDeleteKitType
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
