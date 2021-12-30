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
  inputKitsData?: {
    Id: string
    CodigoReferencia: number
    Itens: {
      Id: string
      Item: { Id: string }
    }[]
    TiposDeKitDeInsumo: {
      Id: string
      Nome: string
    }
    Item: {
      Id: string
      Produto: { Nome: string }
      Movimentacoes: {
        Tipo: string
        Quantidade: number
      }[]
    }
    KitsDeInstalacao: { Id: true }[]
  }[]

  inputKitsRefetch: () => void
  inputKitsLoading: boolean
  softDeleteInputKitLoading: boolean
  softDeleteInputKit: (
    options?: MutationFunctionOptions<
      {
        update_producao_KitsDeInsumo_by_pk?: {
          Id: string
        }
        insert_movimentacoes_Movimentacoes?: {
          returning: {
            Id: string
          }[]
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
  const [softDeleteInputKit, { loading: softDeleteInputKitLoading }] =
    useTypedMutation({
      update_producao_KitsDeInsumo_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: {
            deleted_at: new Date()
          }
        },
        {
          Id: true
        }
      ],
      insert_movimentacoes_Movimentacoes: [
        {
          objects: $`data`
        },
        { returning: { Id: true } }
      ]
    })

  const {
    data: inputKitsData,
    refetch: inputKitsRefetch,
    loading: inputKitsLoading
  } = useTypedQuery(
    {
      producao_KitsDeInsumo: [
        { where: { deleted_at: { _is_null: true } } },
        {
          Id: true,
          CodigoReferencia: true,
          Itens: [{}, { Id: true, Item: { Id: true } }],
          TiposDeKitDeInsumo: {
            Id: true,
            Nome: true
          },
          Item: {
            Id: true,
            Produto: { Nome: true },
            Movimentacoes: [{}, { Tipo: true, Quantidade: true }]
          },
          KitsDeInstalacao: [{}, { Id: true }]
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        inputKitsData: inputKitsData?.producao_KitsDeInsumo,
        inputKitsRefetch,
        inputKitsLoading,
        softDeleteInputKitLoading,
        softDeleteInputKit
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
