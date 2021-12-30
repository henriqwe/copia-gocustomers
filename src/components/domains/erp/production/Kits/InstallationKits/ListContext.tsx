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
  installationKitsData?: {
    Id: string
    CodigoReferencia: number
    Rastreador: {
      CodigoReferencia: number
      Item: { Id: string; Produto: { Nome: string } }
    }
    KitDeInsumo: {
      CodigoReferencia: number
      Item: { Id: string; Produto: { Nome: string } }
      TiposDeKitDeInsumo: {
        Nome: string
      }
    }
    Item: { Id: string }
  }[]

  installationKitsRefetch: () => void
  installationKitsLoading: boolean
  softDeleteInstallationKitLoading: boolean
  softDeleteInstallationKit: (
    options?: MutationFunctionOptions<
      {
        update_producao_KitsDeInstalacao_by_pk?: {
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
  const [
    softDeleteInstallationKit,
    { loading: softDeleteInstallationKitLoading }
  ] = useTypedMutation({
    update_producao_KitsDeInstalacao_by_pk: [
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
            Item_Id: $`ItemRastreador_Id`,
            Valor: 0,
            Quantidade: 1,
            Tipo: 'entrada',
            Motivo_Id: 'exclusaoDeRastreador'
          },
          {
            Data: new Date(),
            Item_Id: $`ItemKitDeInsumo_Id`,
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
    data: installationKitsData,
    refetch: installationKitsRefetch,
    loading: installationKitsLoading
  } = useTypedQuery(
    {
      producao_KitsDeInstalacao: [
        { where: { deleted_at: { _is_null: true } } },
        {
          Id: true,
          CodigoReferencia: true,
          Rastreador: {
            CodigoReferencia: true,
            Item: { Id: true, Produto: { Nome: true } }
          },
          KitDeInsumo: {
            CodigoReferencia: true,
            Item: { Id: true, Produto: { Nome: true } },
            TiposDeKitDeInsumo: {
              Nome: true
            }
          },
          Item: { Id: true }
        }
      ]
    },
    { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
  )

  return (
    <ListContext.Provider
      value={{
        installationKitsData: installationKitsData?.producao_KitsDeInstalacao,
        installationKitsRefetch,
        installationKitsLoading,
        softDeleteInstallationKitLoading,
        softDeleteInstallationKit
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export const useList = () => {
  return useContext(ListContext)
}
