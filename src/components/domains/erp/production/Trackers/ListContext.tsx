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
  trackersData?: {
    Id: string
    CodigoReferencia: number
    Chip: {
      Id: string
      Iccid: string
      Item?: { Id: string }
    }
    Equipamento: {
      Id: string
      Identificador: number
      Item: { Id: string }
    }
    Item: {
      Id: string
      Produto: { Nome: string }
      Fabricante: { Nome: string }
      Modelo?: { Nome: string }
      Movimentacoes: { Tipo: string; Quantidade: number }[]
    }
  }[]

  trackersRefetch: () => void
  trackersLoading: boolean
  softDeleteTrackerLoading: boolean
  softDeleteTracker: (
    options?: MutationFunctionOptions<
      {
        update_producao_Rastreadores_by_pk?: {
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
  const [softDeleteTracker, { loading: softDeleteTrackerLoading }] =
    useTypedMutation({
      update_producao_Rastreadores_by_pk: [
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
          objects: [
            {
              Data: new Date(),
              Item_Id: $`Item_Id`,
              Valor: 0,
              Quantidade: 1,
              Tipo: 'saida',
              Motivo_Id: 'exclusaoDeRastreador'
            },
            {
              Data: new Date(),
              Item_Id: $`ItemChip_Id`,
              Valor: 0,
              Quantidade: 1,
              Tipo: 'entrada',
              Motivo_Id: 'exclusaoDeRastreador'
            },
            {
              Data: new Date(),
              Item_Id: $`ItemEquipamento_Id`,
              Valor: 0,
              Quantidade: 1,
              Tipo: 'entrada',
              Motivo_Id: 'exclusaoDeRastreador'
            }
          ]
        },
        { returning: { Id: true } }
      ]
    })

  const {
    data: trackersData,
    refetch: trackersRefetch,
    loading: trackersLoading
  } = useTypedQuery(
    {
      producao_Rastreadores: [
        { where: { deleted_at: { _is_null: true } } },
        {
          Id: true,
          CodigoReferencia: true,
          Chip: { Id: true, Iccid: true, Item: { Id: true } },
          Equipamento: { Id: true, Identificador: true, Item: { Id: true } },
          Item: {
            Id: true,
            Produto: { Nome: true },
            Fabricante: { Nome: true },
            Modelo: { Nome: true },
            Movimentacoes: [{}, { Tipo: true, Quantidade: true }]
          }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        trackersData: trackersData?.producao_Rastreadores,
        trackersRefetch,
        trackersLoading,
        softDeleteTrackerLoading,
        softDeleteTracker
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
