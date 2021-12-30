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
import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext } from 'react'

type GiveBackContextProps = {
  inputKitData?: {
    Id: string
    CodigoReferencia: number
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
        Grupo: { Nome: string }
        Familia: { Nome: string }
      }
    }[]
    TiposDeKitDeInsumo: {
      Id: string
      Nome: string
    }
    Item: {
      Id: string
      Produto: {
        Nome: string
      }
    }
  }

  inputKitRefetch: () => void
  inputKitLoading: boolean
  giveBackInputType: (
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
  giveBackInputTypeLoading: boolean
  giveBackInputTypeItem: (
    options?: MutationFunctionOptions<
      {
        update_producao_KitDeInsumo_Itens_by_pk?: {
          Id: string
        }
      },
      OperationVariables,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult['data']>
  giveBackInputTypeItemLoading: boolean
}

type ProviderProps = {
  children: ReactNode
}

export const GiveBackContext = createContext<GiveBackContextProps>(
  {} as GiveBackContextProps
)

export const GiveBackProvider = ({ children }: ProviderProps) => {
  const router = useRouter()
  const [giveBackInputType, { loading: giveBackInputTypeLoading }] =
    useTypedMutation({
      update_producao_KitsDeInsumo_by_pk: [
        {
          pk_columns: { Id: router.query.id },
          _set: { updated_at: new Date() }
        },
        { Id: true }
      ],
      insert_movimentacoes_Movimentacoes: [
        {
          objects: $`data`
        },
        {
          returning: { Id: true }
        }
      ]
    })

  const [giveBackInputTypeItem, { loading: giveBackInputTypeItemLoading }] =
    useTypedMutation({
      update_producao_KitDeInsumo_Itens_by_pk: [
        {
          pk_columns: { Id: $`Id` },
          _set: { updated_at: new Date(), Quantidade: $`Quantidade` }
        },
        { Id: true }
      ]
    })

  const {
    data: inputKitData,
    refetch: inputKitRefetch,
    loading: inputKitLoading
  } = useTypedQuery(
    {
      producao_KitsDeInsumo_by_pk: [
        { Id: router.query.id },
        {
          Id: true,
          CodigoReferencia: true,
          Itens: [
            { where: { Quantidade: { _gt: 0 } } },
            {
              Id: true,
              Quantidade: true,
              Item: {
                Id: true,
                Produto: { Nome: true },
                Fabricante: { Nome: true },
                Modelo: { Nome: true },
                Grupo: { Nome: true },
                Familia: { Nome: true }
              }
            }
          ],
          TiposDeKitDeInsumo: {
            Id: true,
            Nome: true
          },
          Item: {
            Id: true,
            Produto: {
              Nome: true
            }
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <GiveBackContext.Provider
      value={{
        giveBackInputType,
        giveBackInputTypeLoading,
        inputKitData: inputKitData?.producao_KitsDeInsumo_by_pk,
        inputKitRefetch,
        inputKitLoading,
        giveBackInputTypeItem,
        giveBackInputTypeItemLoading
      }}
    >
      {children}
    </GiveBackContext.Provider>
  )
}

export const useGiveBack = () => {
  return useContext(GiveBackContext)
}
