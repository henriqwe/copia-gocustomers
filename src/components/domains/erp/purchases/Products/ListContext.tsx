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
  productsData?: {
    // Descricao: string
    Id: string
    Nome: string
    Utilizacao: string
    NCM: number
    UnidadeDeMedida_Id: string
  }[]

  productsRefetch: () => void
  productsLoading: boolean
  softDeleteProductLoading: boolean
  softDeleteProduct: (
    options?: MutationFunctionOptions<
      {
        update_Produtos_by_pk?: {
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
  const [softDeleteProduct, { loading: softDeleteProductLoading }] =
    useTypedMutation({
      update_Produtos_by_pk: [
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
    data: productsData,
    refetch: productsRefetch,
    loading: productsLoading
  } = useTypedQuery(
    {
      Produtos: [
        {
          order_by: [{ created_at: 'desc' }],
          where: { deleted_at: { _is_null: true } }
        },
        {
          Id: true,
          Nome: true,
          // Descricao: true,
          Utilizacao: true,
          NCM: true,
          UnidadeDeMedida_Id: true
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        productsData: productsData?.Produtos,
        productsRefetch,
        productsLoading,
        softDeleteProductLoading,
        softDeleteProduct
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
